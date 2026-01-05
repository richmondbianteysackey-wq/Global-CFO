import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Building2,
  Shield,
  FileText,
  MessageSquare,
  BarChart3,
  CheckCircle,
  UploadCloud,
  Phone,
  Mail,
  Users,
} from 'lucide-react';
import { api } from '../utils/api';

const services = [
  {
    title: 'Tax Preparation Services',
    description: 'File-ready books, estimated taxes, and notice response with proactive planning.',
    link: '/services/tax',
    icon: <FileText className="h-10 w-10" strokeWidth={1.5} />,
  },
  {
    title: 'Monthly Bookkeeping',
    description: 'Monthly close, reconciliations, and controller oversight for every transaction.',
    link: '/services/bookkeeping',
    icon: <BarChart3 className="h-10 w-10" strokeWidth={1.5} />,
  },
  {
    title: 'Financial Advisory',
    description: 'Board-ready forecasts, KPI scorecards, and strategic guidance for growth.',
    link: '/services/advisory',
    icon: <Building2 className="h-10 w-10" strokeWidth={1.5} />,
  },
  {
    title: 'Payroll Services',
    description: 'Multi-state payroll, filings, benefits, and compliance monitoring.',
    link: '/services/payroll',
    icon: <Users className="h-10 w-10" strokeWidth={1.5} />,
  },
];

const testimonials = [
  {
    quote: 'BizBooks gave us clean books in 30 days and a monthly close that investors trust.',
    name: 'S. Patel, CEO',
    role: 'SaaS Founder',
  },
  {
    quote: 'The team handled multi-state payroll and kept us compliant through rapid growth.',
    name: 'J. Nguyen, COO',
    role: 'Professional Services',
  },
  {
    quote: 'Their advisory team built our cash runway model and board reporting in weeks.',
    name: 'L. Ramirez, CFO',
    role: 'Ecommerce',
  },
];

const blogHighlights = [
  { title: 'Year-end tax checklist for founders', date: 'Jan 2025', link: '/blog' },
  { title: 'Monthly close playbook', date: 'Dec 2024', link: '/blog' },
  { title: 'Payroll compliance across states', date: 'Nov 2024', link: '/blog' },
];

function LandingPage() {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    service_interest: '',
    message: '',
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitContact({ ...contactForm, phone: '' });
      toast.success('Request received. We will reach out shortly.');
      setContactForm({ name: '', email: '', service_interest: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Unable to send request');
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
    } catch {
      toast.error('Unable to subscribe right now');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 border border-slate-200 bg-slate-100 text-primary flex items-center justify-center font-extrabold tracking-tight">
              BB
            </div>
            <div className="space-y-0.5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Global CFO</p>
              <h1 className="text-xl font-extrabold text-primary">Bookkeeping • Tax • Advisory</h1>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link to="/services/bookkeeping" className="hover:text-primary">Services</Link>
            <Link to="/contact" className="hover:text-primary">Contact</Link>
            <Link to="/blog" className="hover:text-primary">Insights</Link>
            <Link to="/legal" className="hover:text-primary">Legal</Link>
          </nav>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              data-testid="login-btn"
              className="h-11 px-6 rounded-none font-bold uppercase tracking-wide"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/register')}
              data-testid="register-btn"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-none font-bold uppercase tracking-wide"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-900 text-slate-50">
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.12), transparent 35%), radial-gradient(circle at 80% 0%, rgba(15, 23, 42, 0.7), transparent 40%)' }} />
        <div className="absolute inset-y-8 right-0 hidden lg:block lg:w-1/2">
          <div
            className="absolute inset-0 mx-auto rounded-md border border-slate-700/60 bg-slate-800/70"
            style={{ backgroundImage: 'url(https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-slate-900/35" />
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-[1.05fr,0.95fr] gap-10">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="rounded-none bg-white/10 border-slate-500 text-slate-50">LAUNCH-READY FINANCE</Badge>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">SOC2-minded • Multi-entity</p>
            </div>
            <h1 className="text-5xl md:text-6xl leading-[1.05] tracking-tight font-extrabold">
              Secure bookkeeping, accounting, and tax support built for modern teams.
            </h1>
            <p className="text-lg leading-relaxed text-slate-200 max-w-2xl">
              Global CFO pairs controller oversight with audit-ready workflows. Upload to the vault, sync your own drive, and keep CFOs, founders, and auditors aligned.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate('/intake')}
                data-testid="hero-get-started-btn"
                className="bg-accent text-white hover:bg-accent/90 h-11 px-8 rounded-none font-bold uppercase tracking-wide"
              >
                Start onboarding
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/contact')}
                data-testid="hero-consult-btn"
                className="h-11 px-8 rounded-none font-semibold border-2 border-white text-white hover:bg-white hover:text-primary"
              >
                Schedule consultation
              </Button>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[{
                label: 'Audit controls',
                detail: 'Role-based, log everything',
              }, {
                label: 'Close cadence',
                detail: 'Day-5 monthly close',
              }, {
                label: 'Response time',
                detail: '<2h during business hours',
              }].map((item) => (
                <div key={item.label} className="border border-slate-700 bg-slate-800/70 px-4 py-5 flex flex-col gap-1">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-300">{item.label}</p>
                  <p className="text-lg font-semibold text-white">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <Card className="border-slate-200 bg-white shadow-none">
              <CardHeader className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Fast response</p>
                <CardTitle className="text-2xl text-primary leading-tight">Quick intake</CardTitle>
                <p className="text-sm text-slate-600">Share what you need and we will route you to the right specialist within one business day.</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={handleContactSubmit}>
                  <Input
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="h-11 rounded-none"
                    data-testid="contact-name"
                  />
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="h-11 rounded-none"
                    data-testid="contact-email"
                  />
                  <Input
                    placeholder="Service interest"
                    value={contactForm.service_interest}
                    onChange={(e) => setContactForm({ ...contactForm, service_interest: e.target.value })}
                    className="h-11 rounded-none"
                    data-testid="contact-service"
                  />
                  <Textarea
                    placeholder="Tell us what you need"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={3}
                    required
                    className="rounded-none"
                    data-testid="contact-message"
                  />
                  <Button type="submit" disabled={submitting} className="w-full rounded-none" data-testid="contact-submit">
                    {submitting ? 'Sending...' : 'Send securely'}
                  </Button>
                  <p className="text-xs text-slate-600">
                    Prefer SMS? <Link to="/contact" className="text-primary underline">Capture via text</Link>
                  </p>
                </form>
              </CardContent>
            </Card>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 bg-white px-4 py-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Security</p>
                <p className="text-lg font-semibold text-primary">SOC 2 Type II-minded guardrails</p>
                <p className="text-sm text-slate-600 mt-1">Audit logging, least-privilege roles, and reviewer sign-offs.</p>
              </div>
              <div className="border border-slate-200 bg-white px-4 py-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Delivery</p>
                <p className="text-lg font-semibold text-primary">Controller-led close & filings</p>
                <p className="text-sm text-slate-600 mt-1">Forecasts, payroll, and tax filings managed in one cadence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">SERVICES</p>
            <h2 className="text-4xl md:text-5xl tracking-tight font-extrabold text-primary">One platform, four practice areas</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">Controller-led delivery that keeps your books investor-ready, your payroll compliant, and your tax strategy proactive.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <Card
                key={service.title}
                className="border border-slate-200 shadow-none rounded-none bg-white hover:-translate-y-1 transition-transform"
                data-testid={`feature-card-${idx}`}
              >
                <CardHeader className="space-y-3">
                  <div className="h-12 w-12 border border-slate-200 bg-slate-50 text-primary flex items-center justify-center">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl text-primary leading-tight">{service.title}</CardTitle>
                  <p className="text-sm text-slate-700 leading-relaxed">{service.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => navigate(service.link)} className="w-full rounded-none" data-testid={`feature-primary-${idx}`}>
                    Explore {service.title}
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/intake')} className="w-full rounded-none" data-testid={`feature-secondary-${idx}`}>
                    Get started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Document management */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">DOCUMENT CONTROLS</p>
            <h2 className="text-4xl font-extrabold text-primary tracking-tight">Secure uploads or connect your drive</h2>
            <p className="text-lg text-slate-700">
              Upload receipts, bank statements, and tax documents directly into the Global CFO vault or share a Dropbox/Google Drive link. Every file includes audit trails and optional retention rules.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                '10MB upload limit per file',
                'Audit logging enabled',
                'SOC2-aligned controls',
              ].map((item) => (
                <Badge key={item} variant="outline" className="rounded-none text-slate-700 justify-center" data-testid={`doc-pill-${item}`}>
                  {item}
                </Badge>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={() => navigate('/documents')} className="rounded-none" data-testid="doc-module-btn">
                View document module
              </Button>
              <Button variant="outline" onClick={() => navigate('/contact')} className="rounded-none" data-testid="doc-request-btn">
                Request Dropbox/Drive link
              </Button>
            </div>
          </div>
          <Card className="border-slate-200 shadow-sm rounded-none">
            <CardHeader className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Intake options</p>
              <CardTitle className="text-xl">Choose how you deliver files</CardTitle>
              <p className="text-sm text-slate-600">Pick the workflow that matches your compliance posture and team preferences.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-start">
                <UploadCloud className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-primary">Upload to Global CFO vault</p>
                  <p className="text-sm text-slate-700">Encrypted uploads with audit trails and reviewer assignments.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Shield className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-primary">Use your storage</p>
                  <p className="text-sm text-slate-700">Secure Dropbox or Google Drive links with controlled access.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <MessageSquare className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-primary">Live chat optional</p>
                  <p className="text-sm text-slate-700">We can enable Tidio or Crisp for live support upon request.</p>
                </div>
              </div>
              <Button onClick={() => navigate('/intake')} className="w-full rounded-none" data-testid="doc-submit-btn">
                Submit intake
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 border border-slate-200" />
            <img
              src="https://images.pexels.com/photos/5716001/pexels-photo-5716001.jpeg"
              alt="Professional accountant"
              className="relative w-full h-[480px] object-cover rounded-none border border-slate-200"
            />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">TRUSTED BY BUSINESSES</p>
              <h2 className="text-4xl md:text-5xl tracking-tight font-extrabold text-primary">
                Professional accounting you can trust
              </h2>
              <p className="text-lg leading-relaxed text-slate-700">
                Our CPAs and payroll specialists deliver compliant, audit-ready books for startups, agencies, and established businesses.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'Certified Public Accountants (CPAs)',
                'SOC 2 Type II-minded processes',
                'GDPR & data privacy aware',
                '24/7 monitoring & support SLAs',
              ].map((item) => (
                <div key={item} className="border border-slate-200 bg-slate-50 px-4 py-4 flex gap-3 items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" strokeWidth={1.5} />
                  <p className="text-sm text-slate-800 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={() => navigate('/intake')} className="rounded-none" data-testid="trust-intake-btn">
                Talk to an expert
              </Button>
              <Button variant="outline" onClick={() => navigate('/services/bookkeeping')} className="rounded-none" data-testid="trust-services-btn">
                View approach
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Blog */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr,0.95fr] gap-8">
          <Card className="border-slate-200 shadow-none rounded-none">
            <CardHeader className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Proof</p>
              <CardTitle className="text-2xl text-primary">Testimonials</CardTitle>
              <p className="text-sm text-slate-600">How finance leaders and founders describe working with Global CFO.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {testimonials.map((item) => (
                <div key={item.name} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                  <p className="text-lg text-primary font-semibold leading-snug">“{item.quote}”</p>
                  <p className="text-sm text-slate-600 mt-2">{item.name} • {item.role}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-none rounded-none">
            <CardHeader className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Insights</p>
              <CardTitle className="text-2xl text-primary">Latest insights</CardTitle>
              <p className="text-sm text-slate-600">Audit-ready checklists, monthly close playbooks, and compliance watchouts.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {blogHighlights.map((post) => (
                <div key={post.title} className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-primary font-semibold">{post.title}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{post.date}</p>
                  </div>
                  <Button variant="outline" onClick={() => navigate(post.link)} className="rounded-none" data-testid={`insight-${post.title}`}>
                    Read
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact strip */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em]">Call</p>
              <p className="text-lg font-semibold">+1 (415) 555-0110</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em]">Email</p>
              <p className="text-lg font-semibold">hello@bizbooks.co</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em]">Live chat</p>
              <p className="text-lg font-semibold">Tidio or Crisp on request</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">NEWSLETTER</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Stay ahead of filings and deadlines</h2>
          <p className="text-slate-700">Get monthly tax deadlines, payroll alerts, and finance tips.</p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center" onSubmit={handleNewsletter}>
            <Input
              type="email"
              placeholder="you@company.com"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="h-11 rounded-none max-w-md"
            />
            <Button type="submit" className="h-11 px-8 rounded-none">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">CLIENT PORTAL</p>
            <h2 className="text-4xl font-bold text-primary tracking-tight">Access documents, messages, and tasks</h2>
            <p className="text-lg text-slate-700">
              Existing clients can sign in to view documents, chat with accountants, and review assigned tasks.
              New customers can create an account and start onboarding now.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={() => navigate('/client-portal')} className="rounded-none">
                View portal roadmap
              </Button>
              <Button variant="outline" onClick={() => navigate('/register')} className="rounded-none">
                Create account
              </Button>
            </div>
          </div>
          <Card className="border-slate-200 shadow-sm rounded-none">
            <CardHeader>
              <CardTitle className="text-xl">Compliance-first platform</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-primary mt-1" />
                <p>Role-based access, audit logs, and encrypted storage.</p>
              </div>
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-primary mt-1" />
                <p>Organized folders for tax prep, payroll, and advisory documents.</p>
              </div>
              <div className="flex gap-3">
                <MessageSquare className="h-5 w-5 text-primary mt-1" />
                <p>Messaging and tasks keep finance workflows traceable.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © 2025 BizBooks. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-primary font-semibold">
            <Link to="/legal">Privacy</Link>
            <Link to="/legal#terms">Terms</Link>
            <Link to="/legal#cookies">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
