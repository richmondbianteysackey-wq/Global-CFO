import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Upload, FileText, LogOut, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

function Documents() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('receipt');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const companyId = user?.company_id;
      const response = await api.getDocuments(companyId);
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('document_type', documentType);
      formData.append('description', description);
      formData.append('company_id', user?.company_id);

      await api.uploadDocument(formData);
      toast.success('Document uploaded successfully');
      setSelectedFile(null);
      setDescription('');
      fetchDocuments();
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await api.deleteDocument(documentId);
      toast.success('Document deleted');
      fetchDocuments();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-primary">Global CFO LLC</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(user?.role === 'client' ? '/dashboard' : '/admin')} className="h-10 px-4 rounded-sm">
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => { logout(); navigate('/login'); }} data-testid="logout-btn" className="h-10 px-4 rounded-sm">
              <LogOut className="h-4 w-4 mr-2" />Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl tracking-tight font-bold text-primary mb-8">Document Management</h1>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1 border border-slate-200 shadow-none rounded-md">
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Document Type</label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger data-testid="document-type-select" className="h-11 rounded-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="bank_statement">Bank Statement</SelectItem>
                      <SelectItem value="tax_document">Tax Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description"
                    className="h-11 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Select File</label>
                  <Input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png"
                    data-testid="file-input"
                    className="h-11 rounded-sm"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2">Selected: {selectedFile.name}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  data-testid="upload-btn"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-none font-bold uppercase tracking-wide"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border border-slate-200 shadow-none rounded-md">
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-8 text-slate-600">Loading documents...</p>
              ) : documents.length === 0 ? (
                <p className="text-center py-8 text-slate-600">No documents found</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-sm hover:border-accent transition-colors"
                      data-testid={`document-item-${doc.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-sm bg-slate-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-slate-600" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{doc.filename}</p>
                          <p className="text-xs text-slate-600">{doc.document_type} • {new Date(doc.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {(user?.role === 'admin' || user?.role === 'bookkeeper') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                          data-testid={`delete-btn-${doc.id}`}
                          className="h-9 rounded-sm text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Documents;
