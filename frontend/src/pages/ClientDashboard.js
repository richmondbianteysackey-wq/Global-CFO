import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, FileText, DollarSign, TrendingUp, TrendingDown, CheckSquare, LogOut } from 'lucide-react';
import { toast } from 'sonner';

function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user?.company_id) {
        const response = await api.getDashboardStats(user.company_id);
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
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
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-primary">Global CFO LLC</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.email}</span>
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

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 py-2">
            {[
              { name: 'Dashboard', path: '/dashboard' },
              { name: 'Documents', path: '/documents' },
              { name: 'Transactions', path: '/transactions' },
              { name: 'Messages', path: '/messages' },
              { name: 'Company Profile', path: '/company' },
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl tracking-tight font-bold text-primary mb-2">Welcome Back, {user?.full_name}</h1>
          <p className="text-base text-slate-600">Here's an overview of your financial activity</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        ) : (
          <div>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border border-slate-200 shadow-none rounded-md" data-testid="total-income-card">
                <CardHeader className="pb-3">
                  <CardDescription>Total Income</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-sm bg-emerald-50 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-emerald-600" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary">${stats?.total_income?.toLocaleString() || 0}</p>
                      <p className="text-sm text-slate-600">This period</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-none rounded-md" data-testid="total-expenses-card">
                <CardHeader className="pb-3">
                  <CardDescription>Total Expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-sm bg-red-50 flex items-center justify-center">
                      <TrendingDown className="h-6 w-6 text-red-600" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary">${stats?.total_expenses?.toLocaleString() || 0}</p>
                      <p className="text-sm text-slate-600">This period</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-none rounded-md" data-testid="net-income-card">
                <CardHeader className="pb-3">
                  <CardDescription>Net Income</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-sm bg-blue-50 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-blue-600" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary">${stats?.net_income?.toLocaleString() || 0}</p>
                      <p className="text-sm text-slate-600">Profit/Loss</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-none rounded-md" data-testid="pending-tasks-card">
                <CardHeader className="pb-3">
                  <CardDescription>Pending Tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-sm bg-amber-50 flex items-center justify-center">
                      <CheckSquare className="h-6 w-6 text-amber-600" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary">{stats?.pending_tasks || 0}</p>
                      <p className="text-sm text-slate-600">Requires attention</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border border-slate-200 shadow-none rounded-md">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => navigate('/documents')}
                    data-testid="upload-document-btn"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-11 rounded-none justify-start"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                  <Button
                    onClick={() => navigate('/transactions')}
                    variant="outline"
                    data-testid="view-transactions-btn"
                    className="w-full h-11 rounded-none justify-start border-2"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    View Transactions
                  </Button>
                  <Button
                    onClick={() => navigate('/messages')}
                    variant="outline"
                    data-testid="contact-accountant-btn"
                    className="w-full h-11 rounded-none justify-start border-2"
                  >
                    Contact Accountant
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-none rounded-md">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest financial activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm">
                      <div className="h-10 w-10 rounded-sm bg-white border border-slate-200 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-slate-600" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{stats?.documents_count || 0} Documents</p>
                        <p className="text-xs text-slate-600">Uploaded this period</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm">
                      <div className="h-10 w-10 rounded-sm bg-white border border-slate-200 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-slate-600" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{stats?.transactions_count || 0} Transactions</p>
                        <p className="text-xs text-slate-600">Recorded this period</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ClientDashboard;
