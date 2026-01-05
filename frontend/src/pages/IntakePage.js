import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { Upload, Shield, CalendarCheck, Link as LinkIcon } from 'lucide-react';

const industries = ['Ecommerce', 'Professional Services', 'Real Estate', 'SaaS', 'Healthcare', 'Nonprofit'];
const services = ['Tax Preparation', 'Monthly Bookkeeping', 'Financial Advisory', 'Payroll & Compliance'];

function IntakePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    business_name: '',
    industry: '',
    service_interest: '',
    consultation_requested: false,
    preferred_time: '',
    notes: '',
    storage_preference: '',
    document_links: '',
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files || []);
    const tooLarge = selected.some((file) => file.size > 10 * 1024 * 1024);
    if (tooLarge) {
      toast.error('Each file must be under 10MB');
      return;
    }
    setFiles(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'consultation_requested') {
          payload.append(key, value ? 'true' : 'false');
        } else {
          payload.append(key, value);
        }
      });
      if (formData.document_links) {
        const links = formData.document_links.split(',').map((item) => item.trim()).filter(Boolean);
        payload.set('document_links', JSON.stringify(links));
      }
      files.forEach((file) => payload.append('files', file));

      await api.submitIntake(payload);
      toast.success('Intake submitted securely');
      setFormData({
        full_name: '',
        email: '',
        business_name: '',
        industry: '',
        service_interest: '',
        consultation_requested: false,
        preferred_time: '',
        notes: '',
        storage_preference: '',
        document_links: '',
      });
      setFiles([]);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Unable to submit intake');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Secure onboarding</p>
            <h1 className="text-2xl font-bold text-primary">Client Intake</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/')} className="rounded-none">
              Home
            </Button>
            <Button onClick={() => navigate('/register')} className="rounded-none">
              Create account
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-none">
            <CardHeader>
              <CardTitle className="text-2xl">Tell us about your business</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Full name</label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                      className="rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Business name</label>
                    <Input
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      className="rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Industry</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full h-11 border border-slate-300 px-3 rounded-none"
                    >
                      <option value="">Select industry</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Service interest</label>
                    <select
                      value={formData.service_interest}
                      onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
                      className="w-full h-11 border border-slate-300 px-3 rounded-none"
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Preferred consultation time</label>
                    <Input
                      placeholder="e.g. Tuesdays after 2pm PT"
                      value={formData.preferred_time}
                      onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                      className="rounded-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="consultation"
                      checked={formData.consultation_requested}
                      onChange={(e) => setFormData({ ...formData, consultation_requested: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <label htmlFor="consultation" className="text-sm text-slate-700">
                      Request a live consultation
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Storage preference</label>
                    <Input
                      placeholder="Dropbox, Google Drive, or BizBooks vault"
                      value={formData.storage_preference}
                      onChange={(e) => setFormData({ ...formData, storage_preference: e.target.value })}
                      className="rounded-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Document links (comma-separated)</label>
                  <Input
                    placeholder="https://drive.google.com/..."
                    value={formData.document_links}
                    onChange={(e) => setFormData({ ...formData, document_links: e.target.value })}
                    className="rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Upload initial documents</label>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="rounded-none"
                  />
                  {files.length > 0 && (
                    <p className="text-sm text-emerald-600 mt-2">{files.length} file(s) ready for upload.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Notes</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="rounded-none"
                    placeholder="Share timelines, current tools, or priorities"
                  />
                </div>

                <Button type="submit" disabled={submitting} className="rounded-none">
                  <Upload className="h-4 w-4 mr-2" />
                  {submitting ? 'Submitting...' : 'Submit securely'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-none bg-white">
            <CardHeader>
              <CardTitle className="text-xl">What happens next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-primary shrink-0" />
                <p>We store uploads in our encrypted vault. If you prefer Dropbox or Drive, share links above.</p>
              </div>
              <div className="flex gap-3">
                <CalendarCheck className="h-5 w-5 text-primary shrink-0" />
                <p>We will confirm a consultation window within one business day.</p>
              </div>
              <div className="flex gap-3">
                <LinkIcon className="h-5 w-5 text-primary shrink-0" />
                <p>Need a custom upload link? Tell us your preference and we will send a dedicated folder.</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="rounded-none">SOC2-aligned processes</Badge>
                <Badge variant="outline" className="rounded-none">Audit-ready document logs</Badge>
                <Badge variant="outline" className="rounded-none">Portal messaging & tasks</Badge>
              </div>
              <Button variant="outline" onClick={() => navigate('/client-portal')} className="w-full rounded-none">
                View client portal roadmap
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default IntakePage;
