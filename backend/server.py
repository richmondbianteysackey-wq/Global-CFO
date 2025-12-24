from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import base64


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Security
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Global CFO LLC Accounting Platform")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============ MODELS ============

class UserRole(str):
    CLIENT = "client"
    BOOKKEEPER = "bookkeeper"
    TAX_PREPARER = "tax_preparer"
    ADMIN = "admin"


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    role: str = UserRole.CLIENT
    company_id: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = UserRole.CLIENT
    company_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict


class Company(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    legal_name: Optional[str] = None
    ein: Optional[str] = None
    entity_type: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    fiscal_year_end: Optional[str] = None
    owner_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CompanyCreate(BaseModel):
    company_name: str
    legal_name: Optional[str] = None
    ein: Optional[str] = None
    entity_type: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    fiscal_year_end: Optional[str] = None


class Document(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    document_type: str  # receipt, bank_statement, tax_document
    description: Optional[str] = None
    file_data: Optional[str] = None  # base64 encoded
    company_id: str
    uploaded_by: str
    file_size: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DocumentUpload(BaseModel):
    document_type: str
    description: Optional[str] = None
    company_id: str


class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    description: str
    amount: float
    transaction_type: str  # income, expense, transfer
    category: Optional[str] = None
    transaction_date: datetime
    created_by: str
    status: str = "pending"  # pending, categorized, reconciled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TransactionCreate(BaseModel):
    company_id: str
    description: str
    amount: float
    transaction_type: str
    category: Optional[str] = None
    transaction_date: datetime


class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    title: str
    description: Optional[str] = None
    priority: str = "medium"  # low, medium, high
    status: str = "open"  # open, in_progress, completed
    assigned_to: Optional[str] = None
    created_by: str
    due_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TaskCreate(BaseModel):
    company_id: str
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None


class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    sender_id: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MessageCreate(BaseModel):
    company_id: str
    message: str


class AuditLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    action: str
    resource: str
    resource_id: str
    company_id: Optional[str] = None
    details: Optional[dict] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============ HELPER FUNCTIONS ============

def clean_mongo_doc(doc):
    """Remove MongoDB ObjectId and convert to serializable format"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [clean_mongo_doc(item) for item in doc]
    if isinstance(doc, dict):
        cleaned = {}
        for key, value in doc.items():
            if key == '_id':
                continue  # Skip MongoDB ObjectId
            cleaned[key] = clean_mongo_doc(value) if isinstance(value, (dict, list)) else value
        return cleaned
    return doc

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user = await db.users.find_one({"id": user_id})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")


async def log_audit(user_id: str, action: str, resource: str, resource_id: str, company_id: Optional[str] = None, details: Optional[dict] = None):
    audit_log = AuditLog(
        user_id=user_id,
        action=action,
        resource=resource,
        resource_id=resource_id,
        company_id=company_id,
        details=details
    )
    audit_dict = audit_log.model_dump()
    audit_dict['timestamp'] = audit_dict['timestamp'].isoformat()
    await db.audit_logs.insert_one(audit_dict)


# ============ AUTH ENDPOINTS ============

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        role=user_data.role
    )
    
    user_dict = user.model_dump()
    user_dict['password'] = hashed_password
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # If client role, create company
    if user_data.role == UserRole.CLIENT and user_data.company_name:
        company = Company(
            company_name=user_data.company_name,
            owner_id=user.id
        )
        company_dict = company.model_dump()
        company_dict['created_at'] = company_dict['created_at'].isoformat()
        await db.companies.insert_one(company_dict)
        
        # Update user with company_id
        await db.users.update_one(
            {"id": user.id},
            {"$set": {"company_id": company.id}}
        )
        user_dict['company_id'] = company.id
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    # Clean and prepare response
    clean_user = clean_mongo_doc(user_dict)
    if 'password' in clean_user:
        del clean_user['password']
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=clean_user
    )


@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    if not user.get('is_active', True):
        raise HTTPException(status_code=403, detail="Account is inactive")
    
    access_token = create_access_token(data={"sub": user['id']})
    
    # Clean and prepare response
    clean_user = clean_mongo_doc(user)
    if 'password' in clean_user:
        del clean_user['password']
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=clean_user
    )


@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    clean_user = clean_mongo_doc(current_user)
    if 'password' in clean_user:
        del clean_user['password']
    return clean_user


# ============ COMPANY ENDPOINTS ============

@api_router.post("/companies", response_model=Company)
async def create_company(company_data: CompanyCreate, current_user: dict = Depends(get_current_user)):
    company = Company(
        **company_data.model_dump(),
        owner_id=current_user['id']
    )
    
    company_dict = company.model_dump()
    company_dict['created_at'] = company_dict['created_at'].isoformat()
    
    await db.companies.insert_one(company_dict)
    
    # Update user with company_id
    await db.users.update_one(
        {"id": current_user['id']},
        {"$set": {"company_id": company.id}}
    )
    
    await log_audit(current_user['id'], "create", "company", company.id, company.id)
    
    return company


@api_router.get("/companies", response_model=List[Company])
async def get_companies(current_user: dict = Depends(get_current_user)):
    if current_user['role'] in [UserRole.ADMIN, UserRole.BOOKKEEPER, UserRole.TAX_PREPARER]:
        companies = await db.companies.find({}).to_list(1000)
    else:
        companies = await db.companies.find({"owner_id": current_user['id']}).to_list(1000)
    
    return [clean_mongo_doc(company) for company in companies]


@api_router.get("/companies/{company_id}", response_model=Company)
async def get_company(company_id: str, current_user: dict = Depends(get_current_user)):
    company = await db.companies.find_one({"id": company_id})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Check access
    if current_user['role'] not in [UserRole.ADMIN, UserRole.BOOKKEEPER, UserRole.TAX_PREPARER]:
        if company['owner_id'] != current_user['id']:
            raise HTTPException(status_code=403, detail="Access denied")
    
    return clean_mongo_doc(company)


@api_router.put("/companies/{company_id}", response_model=Company)
async def update_company(company_id: str, company_data: CompanyCreate, current_user: dict = Depends(get_current_user)):
    company = await db.companies.find_one({"id": company_id})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Check access
    if current_user['role'] not in [UserRole.ADMIN]:
        if company['owner_id'] != current_user['id']:
            raise HTTPException(status_code=403, detail="Access denied")
    
    update_data = company_data.model_dump(exclude_unset=True)
    await db.companies.update_one(
        {"id": company_id},
        {"$set": update_data}
    )
    
    await log_audit(current_user['id'], "update", "company", company_id, company_id)
    
    updated_company = await db.companies.find_one({"id": company_id})
    return clean_mongo_doc(updated_company)


# ============ DOCUMENT ENDPOINTS ============

@api_router.post("/documents", response_model=Document)
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    description: Optional[str] = Form(None),
    company_id: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    # Verify company access
    company = await db.companies.find_one({"id": company_id})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Read file
    file_content = await file.read()
    file_data_b64 = base64.b64encode(file_content).decode('utf-8')
    
    document = Document(
        filename=file.filename,
        document_type=document_type,
        description=description,
        file_data=file_data_b64,
        company_id=company_id,
        uploaded_by=current_user['id'],
        file_size=len(file_content)
    )
    
    document_dict = document.model_dump()
    document_dict['created_at'] = document_dict['created_at'].isoformat()
    
    await db.documents.insert_one(document_dict)
    await log_audit(current_user['id'], "upload", "document", document.id, company_id)
    
    return document


@api_router.get("/documents", response_model=List[Document])
async def get_documents(
    company_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    query = {}
    if company_id:
        query['company_id'] = company_id
    elif current_user['role'] == UserRole.CLIENT:
        if current_user.get('company_id'):
            query['company_id'] = current_user['company_id']
    
    documents = await db.documents.find(query, {"file_data": 0}).to_list(1000)
    return documents


@api_router.get("/documents/{document_id}")
async def get_document(document_id: str, current_user: dict = Depends(get_current_user)):
    document = await db.documents.find_one({"id": document_id})
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    await log_audit(current_user['id'], "view", "document", document_id, document.get('company_id'))
    
    return document


@api_router.delete("/documents/{document_id}")
async def delete_document(document_id: str, current_user: dict = Depends(get_current_user)):
    if current_user['role'] not in [UserRole.ADMIN, UserRole.BOOKKEEPER]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    document = await db.documents.find_one({"id": document_id})
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    await db.documents.delete_one({"id": document_id})
    await log_audit(current_user['id'], "delete", "document", document_id, document.get('company_id'))
    
    return {"message": "Document deleted successfully"}


# ============ TRANSACTION ENDPOINTS ============

@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction_data: TransactionCreate, current_user: dict = Depends(get_current_user)):
    transaction = Transaction(
        **transaction_data.model_dump(),
        created_by=current_user['id']
    )
    
    transaction_dict = transaction.model_dump()
    transaction_dict['created_at'] = transaction_dict['created_at'].isoformat()
    transaction_dict['transaction_date'] = transaction_dict['transaction_date'].isoformat()
    
    await db.transactions.insert_one(transaction_dict)
    await log_audit(current_user['id'], "create", "transaction", transaction.id, transaction_data.company_id)
    
    return transaction


@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(
    company_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    query = {}
    if company_id:
        query['company_id'] = company_id
    elif current_user['role'] == UserRole.CLIENT:
        if current_user.get('company_id'):
            query['company_id'] = current_user['company_id']
    
    transactions = await db.transactions.find(query).to_list(1000)
    return transactions


@api_router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(
    transaction_id: str,
    transaction_data: TransactionCreate,
    current_user: dict = Depends(get_current_user)
):
    transaction = await db.transactions.find_one({"id": transaction_id})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    update_data = transaction_data.model_dump(exclude_unset=True)
    if 'transaction_date' in update_data:
        update_data['transaction_date'] = update_data['transaction_date'].isoformat()
    
    await db.transactions.update_one(
        {"id": transaction_id},
        {"$set": update_data}
    )
    
    await log_audit(current_user['id'], "update", "transaction", transaction_id, transaction['company_id'])
    
    updated_transaction = await db.transactions.find_one({"id": transaction_id})
    return updated_transaction


# ============ TASK/MESSAGE ENDPOINTS ============

@api_router.post("/tasks", response_model=Task)
async def create_task(task_data: TaskCreate, current_user: dict = Depends(get_current_user)):
    task = Task(
        **task_data.model_dump(),
        created_by=current_user['id']
    )
    
    task_dict = task.model_dump()
    task_dict['created_at'] = task_dict['created_at'].isoformat()
    if task_dict.get('due_date'):
        task_dict['due_date'] = task_dict['due_date'].isoformat()
    
    await db.tasks.insert_one(task_dict)
    await log_audit(current_user['id'], "create", "task", task.id, task_data.company_id)
    
    return task


@api_router.get("/tasks", response_model=List[Task])
async def get_tasks(
    company_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    query = {}
    if company_id:
        query['company_id'] = company_id
    elif current_user['role'] == UserRole.CLIENT:
        if current_user.get('company_id'):
            query['company_id'] = current_user['company_id']
    
    tasks = await db.tasks.find(query).to_list(1000)
    return tasks


@api_router.post("/messages", response_model=Message)
async def create_message(message_data: MessageCreate, current_user: dict = Depends(get_current_user)):
    message = Message(
        **message_data.model_dump(),
        sender_id=current_user['id']
    )
    
    message_dict = message.model_dump()
    message_dict['created_at'] = message_dict['created_at'].isoformat()
    
    await db.messages.insert_one(message_dict)
    await log_audit(current_user['id'], "send", "message", message.id, message_data.company_id)
    
    return message


@api_router.get("/messages", response_model=List[Message])
async def get_messages(
    company_id: str,
    current_user: dict = Depends(get_current_user)
):
    messages = await db.messages.find({"company_id": company_id}).to_list(1000)
    return messages


# ============ REPORTS ENDPOINTS ============

@api_router.get("/reports/dashboard")
async def get_dashboard_stats(
    company_id: str,
    current_user: dict = Depends(get_current_user)
):
    # Count documents
    documents_count = await db.documents.count_documents({"company_id": company_id})
    
    # Count transactions
    transactions_count = await db.transactions.count_documents({"company_id": company_id})
    
    # Calculate total income and expenses
    transactions = await db.transactions.find({"company_id": company_id}).to_list(1000)
    total_income = sum(t['amount'] for t in transactions if t.get('transaction_type') == 'income')
    total_expenses = sum(t['amount'] for t in transactions if t.get('transaction_type') == 'expense')
    
    # Pending tasks
    pending_tasks = await db.tasks.count_documents({"company_id": company_id, "status": "open"})
    
    return {
        "documents_count": documents_count,
        "transactions_count": transactions_count,
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_income": total_income - total_expenses,
        "pending_tasks": pending_tasks
    }


# ============ AUDIT LOG ENDPOINTS ============

@api_router.get("/audit-logs", response_model=List[AuditLog])
async def get_audit_logs(
    company_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    if current_user['role'] not in [UserRole.ADMIN, UserRole.BOOKKEEPER]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    query = {}
    if company_id:
        query['company_id'] = company_id
    
    logs = await db.audit_logs.find(query).sort("timestamp", -1).to_list(1000)
    return logs


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
