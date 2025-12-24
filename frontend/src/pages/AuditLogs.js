import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Activity, LogOut } from 'lucide-react';
import { toast } from 'sonner';

function AuditLogs() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await api.getAuditLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin' && user?.role !== 'bookkeeper') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Access denied. Admin or Bookkeeper role required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-primary">Global CFO LLC</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin')} className="h-10 px-4 rounded-sm">
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => { logout(); navigate('/login'); }} data-testid="logout-btn" className="h-10 px-4 rounded-sm">
              <LogOut className="h-4 w-4 mr-2" />Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl tracking-tight font-bold text-primary mb-8">Audit Logs</h1>

        <Card className="border border-slate-200 shadow-none rounded-md">
          <CardHeader>
            <CardTitle>System Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-slate-600">Loading audit logs...</p>
            ) : logs.length === 0 ? (
              <p className="text-center py-8 text-slate-600">No audit logs found</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-sm"
                    data-testid={`audit-log-${log.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-sm bg-slate-100 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-slate-600" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {log.action} on {log.resource}
                        </p>
                        <p className="text-xs text-slate-600">
                          User: {log.user_id} • {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600">
                      Resource ID: {log.resource_id}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default AuditLogs;
