import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, FileText, DollarSign, LogOut } from 'lucide-react';
import { toast } from 'sonner';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.getCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-primary">Global CFO LLC - Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.email} ({user?.role})</span>
            <Button
              variant="outline"
              onClick={handleLogout}
              data-testid="logout-btn"
              className="h-10 px-4 rounded-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 py-2">
            {[
              { name: 'Dashboard', path: '/admin' },
              { name: 'All Documents', path: '/documents' },
              { name: 'All Transactions', path: '/transactions' },
              { name: 'Audit Logs', path: '/audit-logs' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-primary hover:border-b-2 hover:border-primary transition-all"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl tracking-tight font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-base text-slate-600">Manage all clients and companies</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading companies...</p>
          </div>
        ) : (
          <div>
            <Card className="border border-slate-200 shadow-none rounded-md">
              <CardHeader>
                <CardTitle>Active Companies</CardTitle>
                <CardDescription>All registered companies in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companies.length === 0 ? (
                    <p className="text-center py-8 text-slate-600">No companies found</p>
                  ) : (
                    companies.map((company) => (
                      <div
                        key={company.id}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-sm hover:border-accent transition-colors"
                        data-testid={`company-card-${company.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-sm bg-slate-100 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-slate-600" strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-slate-900">{company.company_name}</p>
                            <p className="text-sm text-slate-600">{company.ein || 'No EIN'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/documents?company_id=${company.id}`)}
                            data-testid={`view-documents-${company.id}`}
                            className="h-9 rounded-sm"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Documents
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/transactions?company_id=${company.id}`)}
                            data-testid={`view-transactions-${company.id}`}
                            className="h-9 rounded-sm"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Transactions
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
