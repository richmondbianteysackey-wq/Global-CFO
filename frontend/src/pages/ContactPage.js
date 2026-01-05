import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { Phone, Mail, MessageSquare, ShieldCheck } from 'lucide-react';

function ContactPage() {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    service_interest: '',
    message: '',
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [smsLead, setSmsLead] = useState({ name: '', phone_number: '', interest: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitContact(contactForm);
      toast.success('Message sent. Our team will respond shortly.');
      setContactForm({ name: '', email: '', phone: '', service_interest: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Unable to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await api.subscribeNewsletter({ email: newsletterEmail });
      toast.success('Subscribed!');
      setNewsletterEmail('');
    } catch (err) {
      toast.error('Unable to subscribe right now');
    }
  };

  const handleSmsLead = async (e) => {
    e.preventDefault();
    try {
      await api.submitSmsLead(smsLead);
      toast.success('Thanks! We will text you soon.');
      setSmsLead({ name: '', phone_number: '', interest: '' });
    } catch (err) {
      toast.error('Unable to submit SMS lead');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              BB
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">BizBooks</p>
              <h1 className="text-xl font-bold text-primary">Talk to our team</h1>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/')} className="rounded-none">
            Back to site
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-none">
            <CardHeader>
              <CardTitle className="text-2xl">Send a secure message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Name</label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      className="rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      className="rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Phone (optional)</label>
                    <Input
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="rounded-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">Service of interest</label>
                    <Input
                      value={contactForm.service_interest}
                      onChange={(e) => setContactForm({ ...contactForm, service_interest: e.target.value })}
                      className="rounded-none"
                      placeholder="Bookkeeping, Tax, Advisory..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">How can we help?</label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                    required
                    className="rounded-none"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={submitting} className="rounded-none">
                    {submitting ? 'Sending...' : 'Send message'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/intake')} className="rounded-none">
                    Upload documents securely
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-none">
            <CardHeader>
              <CardTitle className="text-xl">Reach us directly</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> <span>+1 (415) 555-0110</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> <span>hello@bizbooks.co</span>
              </div>
              <p className="text-sm text-slate-600">
                SOC2-aligned processes, encrypted document links, and a response within one business day.
              </p>
              <Badge variant="outline" className="rounded-none border-emerald-200 text-emerald-700">
                <ShieldCheck className="h-4 w-4 mr-1" />
                Bank-level encryption in transit and at rest
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="border-slate-200 shadow-sm rounded-none">
            <CardHeader>
              <CardTitle className="text-lg">Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-3">Monthly tax deadlines, payroll alerts, and finance tips.</p>
              <form className="space-y-3" onSubmit={handleNewsletter}>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="rounded-none"
                />
                <Button type="submit" className="w-full rounded-none">
                  Subscribe
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-none">
            <CardHeader>
              <CardTitle className="text-lg">SMS updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-3">Get a text with next steps and a secure upload link.</p>
              <form className="space-y-3" onSubmit={handleSmsLead}>
                <Input
                  placeholder="Name"
                  value={smsLead.name}
                  onChange={(e) => setSmsLead({ ...smsLead, name: e.target.value })}
                  className="rounded-none"
                />
                <Input
                  placeholder="Mobile number"
                  value={smsLead.phone_number}
                  onChange={(e) => setSmsLead({ ...smsLead, phone_number: e.target.value })}
                  required
                  className="rounded-none"
                />
                <Input
                  placeholder="Service interest"
                  value={smsLead.interest}
                  onChange={(e) => setSmsLead({ ...smsLead, interest: e.target.value })}
                  className="rounded-none"
                />
                <Button type="submit" className="w-full rounded-none">
                  Text me next steps
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-none bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Already a client?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm opacity-90">
                Access your documents, messages, and tasks in the BizBooks portal.
              </p>
              <Button variant="secondary" onClick={() => navigate('/client-portal')} className="w-full rounded-none">
                Go to client portal
              </Button>
              <Button variant="outline" onClick={() => navigate('/register')} className="w-full rounded-none">
                Create account
              </Button>
            </CardContent>
          </Card>
        </div>

        <section className="bg-white border border-slate-200 p-6 rounded-none flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Prefer live chat?</p>
              <p className="text-lg font-semibold text-primary">We can integrate Tidio or Crisp on request.</p>
            </div>
          </div>
          <Button onClick={() => navigate('/intake')} className="rounded-none">
            Start onboarding
          </Button>
        </section>
      </main>
    </div>
  );
}

export default ContactPage;
