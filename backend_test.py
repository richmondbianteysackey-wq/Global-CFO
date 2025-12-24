import requests
import sys
import json
import base64
from datetime import datetime
from io import BytesIO

class GlobalCFOAPITester:
    def __init__(self, base_url="https://bizbooks-36.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.client_token = None
        self.admin_token = None
        self.bookkeeper_token = None
        self.client_user = None
        self.admin_user = None
        self.bookkeeper_user = None
        self.company_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        if headers:
            default_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers)
            elif method == 'POST':
                if files:
                    # Remove Content-Type for multipart/form-data
                    if 'Content-Type' in default_headers:
                        del default_headers['Content-Type']
                    response = requests.post(url, data=data, files=files, headers=default_headers)
                else:
                    response = requests.post(url, json=data, headers=default_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=default_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False, {}

    def get_auth_headers(self, token):
        """Get authorization headers"""
        return {'Authorization': f'Bearer {token}'}

    def test_user_registration(self):
        """Test user registration for different roles"""
        print("\n=== Testing User Registration ===")
        
        # Test client registration
        timestamp = datetime.now().strftime('%H%M%S')
        client_data = {
            "email": f"client_{timestamp}@test.com",
            "password": "TestPass123!",
            "full_name": "Test Client",
            "role": "client",
            "company_name": "Test Company LLC"
        }
        
        success, response = self.run_test(
            "Client Registration",
            "POST",
            "auth/register",
            200,
            data=client_data
        )
        
        if success and 'access_token' in response:
            self.client_token = response['access_token']
            self.client_user = response['user']
            self.company_id = response['user'].get('company_id')
            print(f"Client registered with company_id: {self.company_id}")
        
        # Test admin registration
        admin_data = {
            "email": f"admin_{timestamp}@test.com",
            "password": "TestPass123!",
            "full_name": "Test Admin",
            "role": "admin"
        }
        
        success, response = self.run_test(
            "Admin Registration",
            "POST",
            "auth/register",
            200,
            data=admin_data
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            self.admin_user = response['user']
        
        # Test bookkeeper registration
        bookkeeper_data = {
            "email": f"bookkeeper_{timestamp}@test.com",
            "password": "TestPass123!",
            "full_name": "Test Bookkeeper",
            "role": "bookkeeper"
        }
        
        success, response = self.run_test(
            "Bookkeeper Registration",
            "POST",
            "auth/register",
            200,
            data=bookkeeper_data
        )
        
        if success and 'access_token' in response:
            self.bookkeeper_token = response['access_token']
            self.bookkeeper_user = response['user']

    def test_user_login(self):
        """Test user login"""
        print("\n=== Testing User Login ===")
        
        if self.client_user:
            login_data = {
                "email": self.client_user['email'],
                "password": "TestPass123!"
            }
            
            success, response = self.run_test(
                "Client Login",
                "POST",
                "auth/login",
                200,
                data=login_data
            )

    def test_auth_me(self):
        """Test getting current user info"""
        print("\n=== Testing Auth Me Endpoint ===")
        
        if self.client_token:
            success, response = self.run_test(
                "Get Current User (Client)",
                "GET",
                "auth/me",
                200,
                headers=self.get_auth_headers(self.client_token)
            )

    def test_company_endpoints(self):
        """Test company management endpoints"""
        print("\n=== Testing Company Endpoints ===")
        
        if not self.client_token:
            print("❌ Skipping company tests - no client token")
            return
        
        # Test get companies
        success, response = self.run_test(
            "Get Companies (Client)",
            "GET",
            "companies",
            200,
            headers=self.get_auth_headers(self.client_token)
        )
        
        # Test get specific company
        if self.company_id:
            success, response = self.run_test(
                "Get Company by ID",
                "GET",
                f"companies/{self.company_id}",
                200,
                headers=self.get_auth_headers(self.client_token)
            )
            
            # Test update company
            update_data = {
                "company_name": "Updated Test Company LLC",
                "legal_name": "Updated Test Company Legal Name",
                "ein": "12-3456789",
                "entity_type": "LLC"
            }
            
            success, response = self.run_test(
                "Update Company",
                "PUT",
                f"companies/{self.company_id}",
                200,
                data=update_data,
                headers=self.get_auth_headers(self.client_token)
            )

    def test_document_endpoints(self):
        """Test document management endpoints"""
        print("\n=== Testing Document Endpoints ===")
        
        if not self.client_token or not self.company_id:
            print("❌ Skipping document tests - missing client token or company_id")
            return
        
        # Create a test file
        test_file_content = b"This is a test document content"
        test_file = BytesIO(test_file_content)
        test_file.name = "test_receipt.txt"
        
        # Test document upload
        files = {'file': ('test_receipt.txt', test_file_content, 'text/plain')}
        data = {
            'document_type': 'receipt',
            'description': 'Test receipt upload',
            'company_id': self.company_id
        }
        
        success, response = self.run_test(
            "Upload Document",
            "POST",
            "documents",
            200,
            data=data,
            files=files,
            headers=self.get_auth_headers(self.client_token)
        )
        
        document_id = None
        if success and 'id' in response:
            document_id = response['id']
        
        # Test get documents
        success, response = self.run_test(
            "Get Documents",
            "GET",
            f"documents?company_id={self.company_id}",
            200,
            headers=self.get_auth_headers(self.client_token)
        )
        
        # Test get specific document
        if document_id:
            success, response = self.run_test(
                "Get Document by ID",
                "GET",
                f"documents/{document_id}",
                200,
                headers=self.get_auth_headers(self.client_token)
            )

    def test_transaction_endpoints(self):
        """Test transaction management endpoints"""
        print("\n=== Testing Transaction Endpoints ===")
        
        if not self.client_token or not self.company_id:
            print("❌ Skipping transaction tests - missing client token or company_id")
            return
        
        # Test create transaction
        transaction_data = {
            "company_id": self.company_id,
            "description": "Test Income Transaction",
            "amount": 1000.50,
            "transaction_type": "income",
            "category": "Sales",
            "transaction_date": datetime.now().isoformat()
        }
        
        success, response = self.run_test(
            "Create Transaction",
            "POST",
            "transactions",
            200,
            data=transaction_data,
            headers=self.get_auth_headers(self.client_token)
        )
        
        transaction_id = None
        if success and 'id' in response:
            transaction_id = response['id']
        
        # Test get transactions
        success, response = self.run_test(
            "Get Transactions",
            "GET",
            f"transactions?company_id={self.company_id}",
            200,
            headers=self.get_auth_headers(self.client_token)
        )
        
        # Test update transaction
        if transaction_id:
            update_data = {
                "company_id": self.company_id,
                "description": "Updated Test Transaction",
                "amount": 1500.75,
                "transaction_type": "income",
                "category": "Updated Sales",
                "transaction_date": datetime.now().isoformat()
            }
            
            success, response = self.run_test(
                "Update Transaction",
                "PUT",
                f"transactions/{transaction_id}",
                200,
                data=update_data,
                headers=self.get_auth_headers(self.client_token)
            )

    def test_task_endpoints(self):
        """Test task management endpoints"""
        print("\n=== Testing Task Endpoints ===")
        
        if not self.client_token or not self.company_id:
            print("❌ Skipping task tests - missing client token or company_id")
            return
        
        # Test create task
        task_data = {
            "company_id": self.company_id,
            "title": "Test Task",
            "description": "This is a test task",
            "priority": "high"
        }
        
        success, response = self.run_test(
            "Create Task",
            "POST",
            "tasks",
            200,
            data=task_data,
            headers=self.get_auth_headers(self.client_token)
        )
        
        # Test get tasks
        success, response = self.run_test(
            "Get Tasks",
            "GET",
            f"tasks?company_id={self.company_id}",
            200,
            headers=self.get_auth_headers(self.client_token)
        )

    def test_message_endpoints(self):
        """Test message endpoints"""
        print("\n=== Testing Message Endpoints ===")
        
        if not self.client_token or not self.company_id:
            print("❌ Skipping message tests - missing client token or company_id")
            return
        
        # Test send message
        message_data = {
            "company_id": self.company_id,
            "message": "This is a test message from the client"
        }
        
        success, response = self.run_test(
            "Send Message",
            "POST",
            "messages",
            200,
            data=message_data,
            headers=self.get_auth_headers(self.client_token)
        )
        
        # Test get messages
        success, response = self.run_test(
            "Get Messages",
            "GET",
            f"messages?company_id={self.company_id}",
            200,
            headers=self.get_auth_headers(self.client_token)
        )

    def test_dashboard_stats(self):
        """Test dashboard statistics endpoint"""
        print("\n=== Testing Dashboard Stats ===")
        
        if not self.client_token or not self.company_id:
            print("❌ Skipping dashboard tests - missing client token or company_id")
            return
        
        success, response = self.run_test(
            "Get Dashboard Stats",
            "GET",
            f"reports/dashboard?company_id={self.company_id}",
            200,
            headers=self.get_auth_headers(self.client_token)
        )

    def test_audit_logs(self):
        """Test audit log endpoints (admin/bookkeeper only)"""
        print("\n=== Testing Audit Logs ===")
        
        if self.admin_token:
            success, response = self.run_test(
                "Get Audit Logs (Admin)",
                "GET",
                "audit-logs",
                200,
                headers=self.get_auth_headers(self.admin_token)
            )
        
        if self.bookkeeper_token:
            success, response = self.run_test(
                "Get Audit Logs (Bookkeeper)",
                "GET",
                "audit-logs",
                200,
                headers=self.get_auth_headers(self.bookkeeper_token)
            )
        
        # Test access denied for client
        if self.client_token:
            success, response = self.run_test(
                "Get Audit Logs (Client - Should Fail)",
                "GET",
                "audit-logs",
                403,
                headers=self.get_auth_headers(self.client_token)
            )

    def test_admin_company_access(self):
        """Test admin access to all companies"""
        print("\n=== Testing Admin Company Access ===")
        
        if not self.admin_token:
            print("❌ Skipping admin tests - no admin token")
            return
        
        success, response = self.run_test(
            "Get All Companies (Admin)",
            "GET",
            "companies",
            200,
            headers=self.get_auth_headers(self.admin_token)
        )

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Global CFO LLC API Tests")
        print(f"Testing against: {self.base_url}")
        
        # Test authentication
        self.test_user_registration()
        self.test_user_login()
        self.test_auth_me()
        
        # Test core functionality
        self.test_company_endpoints()
        self.test_document_endpoints()
        self.test_transaction_endpoints()
        self.test_task_endpoints()
        self.test_message_endpoints()
        self.test_dashboard_stats()
        
        # Test admin functionality
        self.test_audit_logs()
        self.test_admin_company_access()
        
        # Print results
        print(f"\n📊 Test Results:")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = GlobalCFOAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())