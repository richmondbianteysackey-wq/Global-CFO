import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Building2, Save, LogOut } from 'lucide-react';
import { toast } from 'sonner';

function CompanyProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    legal_name: '',
    ein: '',
    entity_type: '',
    address: '',
    phone: '',
    fiscal_year_end: '',
  });

  useEffect(() => {
    if (user?.company_id) {
      fetchCompany();
    }
  }, [user]);

  const fetchCompany = async () => {
    try {
      const response = await api.getCompany(user.company_id);
      setFormData(response.data);
    } catch (error) {
      console.error('Failed to fetch company:', error);
      toast.error('Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateCompany(user.company_id, formData);
      toast.success('Company profile updated');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
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
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="h-10 px-4 rounded-sm">
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => { logout(); navigate('/login'); }} data-testid="logout-btn" className="h-10 px-4 rounded-sm">
              <LogOut className="h-4 w-4 mr-2" />Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl tracking-tight font-bold text-primary mb-8">Company Profile</h1>

        <Card className="border border-slate-200 shadow-none rounded-md">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-slate-600">Loading company profile...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Company Name</label>
                    <Input
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      required
                      className="h-11 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Legal Name</label>
                    <Input
                      value={formData.legal_name || ''}
                      onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                      className="h-11 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">EIN</label>
                    <Input
                      value={formData.ein || ''}
                      onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                      placeholder="XX-XXXXXXX"
                      className="h-11 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Entity Type</label>
                    <Input
                      value={formData.entity_type || ''}
                      onChange={(e) => setFormData({ ...formData, entity_type: e.target.value })}
                      placeholder="LLC, Corporation, etc."
                      className="h-11 rounded-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Address</label>
                    <Input
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="h-11 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone</label>
                    <Input
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-11 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Fiscal Year End</label>
                    <Input
                      value={formData.fiscal_year_end || ''}
                      onChange={(e) => setFormData({ ...formData, fiscal_year_end: e.target.value })}
                      placeholder="MM-DD"
                      className="h-11 rounded-sm"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  data-testid="save-profile-btn"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-none font-bold uppercase tracking-wide"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default CompanyProfile;
