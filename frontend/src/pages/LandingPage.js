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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 sticky top-0 bg-white/90 backdrop-blur z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              BB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">BizBooks</p>
              <h1 className="text-xl font-bold text-primary">Bookkeeping • Tax • Advisory</h1>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] mb-3">LAUNCH-READY FINANCE</p>
            <h1 className="text-5xl md:text-6xl tracking-tight leading-none font-bold text-primary mb-6">
              Secure bookkeeping, accounting, and tax support for modern teams.
            </h1>
            <p className="text-lg leading-relaxed text-slate-700 mb-8">
              BizBooks handles monthly close, payroll, and tax prep with audit-ready controls. Upload documents securely
              or connect Dropbox/Drive—your team stays focused on growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate('/intake')}
                data-testid="hero-get-started-btn"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-none font-bold uppercase tracking-wide"
              >
                Start onboarding
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/contact')}
                className="h-11 px-8 rounded-none font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Schedule consultation
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 mt-6 text-sm text-slate-700">
              <Badge variant="outline" className="rounded-none border-emerald-200 text-emerald-700">SOC2-minded controls</Badge>
              <Badge variant="outline" className="rounded-none">Document vault or Dropbox/Drive</Badge>
              <Badge variant="outline" className="rounded-none">Client messaging & tasks</Badge>
            </div>
          </div>
          <Card className="border-slate-200 shadow-sm rounded-none">
            <CardHeader>
              <CardTitle className="text-2xl">Quick intake</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleContactSubmit}>
                <Input
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  className="h-11 rounded-none"
                />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  className="h-11 rounded-none"
                />
                <Input
                  placeholder="Service interest"
                  value={contactForm.service_interest}
                  onChange={(e) => setContactForm({ ...contactForm, service_interest: e.target.value })}
                  className="h-11 rounded-none"
                />
                <Textarea
                  placeholder="Tell us what you need"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={3}
                  required
                  className="rounded-none"
                />
                <Button type="submit" disabled={submitting} className="w-full rounded-none">
                  {submitting ? 'Sending...' : 'Send securely'}
                </Button>
                <p className="text-xs text-slate-600">
                  Prefer SMS? <Link to="/contact" className="text-primary underline">Capture via text</Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-3">SERVICES</p>
            <h2 className="text-4xl md:text-5xl tracking-tight font-bold text-primary">One platform, four practice areas</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <Card key={service.title} className="border border-slate-200 shadow-none rounded-none bg-white hover:-translate-y-1 transition-transform" data-testid={`feature-card-${idx}`}>
                <CardHeader className="space-y-2">
                  <div className="text-primary">{service.icon}</div>
                  <CardTitle className="text-xl text-primary leading-tight">{service.title}</CardTitle>
                  <p className="text-sm text-slate-700">{service.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => navigate(service.link)} className="w-full rounded-none">
                    Explore {service.title}
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/intake')} className="w-full rounded-none">
                    Get started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Document management */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">DOCUMENT CONTROLS</p>
            <h2 className="text-4xl font-bold text-primary tracking-tight">Secure uploads or connect your drive</h2>
            <p className="text-lg text-slate-700">
              Upload receipts, bank statements, and tax documents directly into the BizBooks vault or share a Dropbox/Google Drive link. Every file includes audit trails and optional retention rules.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="rounded-none">10MB upload limit per file</Badge>
              <Badge variant="outline" className="rounded-none">Audit logging enabled</Badge>
              <Badge variant="outline" className="rounded-none">SOC2-aligned</Badge>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={() => navigate('/documents')} className="rounded-none">
                View document module
              </Button>
              <Button variant="outline" onClick={() => navigate('/contact')} className="rounded-none">
                Request Dropbox/Drive link
              </Button>
            </div>
          </div>
          <Card className="border-slate-200 shadow-sm rounded-none">
            <CardHeader>
              <CardTitle className="text-xl">Intake options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3 items-start">
                <UploadCloud className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-primary">Upload to BizBooks vault</p>
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
              <Button onClick={() => navigate('/intake')} className="w-full rounded-none">
                Submit intake
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/5716001/pexels-photo-5716001.jpeg"
                alt="Professional accountant"
                className="w-full h-[480px] object-cover rounded-none shadow-sm"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] mb-4">TRUSTED BY BUSINESSES</p>
              <h2 className="text-4xl md:text-5xl tracking-tight font-bold text-primary mb-6">
                Professional accounting you can trust
              </h2>
              <p className="text-lg leading-relaxed text-slate-700 mb-6">
                Our CPAs and payroll specialists deliver compliant, audit-ready books for startups, agencies, and established businesses.
              </p>
              <ul className="space-y-4">
                {[
                  'Certified Public Accountants (CPAs)',
                  'SOC 2 Type II-minded processes',
                  'GDPR & Data Privacy aware',
                  '24/7 monitoring & support SLAs',
                ].map((item, idx) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-500" strokeWidth={1.5} />
                    <span className="text-base text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Blog */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          <Card className="border-slate-200 shadow-sm rounded-none">
            <CardHeader>
              <CardTitle className="text-2xl">Testimonials</CardTitle>
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
          <Card className="border-slate-200 shadow-sm rounded-none">
            <CardHeader>
              <CardTitle className="text-2xl">Latest insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {blogHighlights.map((post) => (
                <div key={post.title} className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-primary font-semibold">{post.title}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{post.date}</p>
                  </div>
                  <Button variant="outline" onClick={() => navigate(post.link)} className="rounded-none">
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
