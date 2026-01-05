import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ChevronRight, Phone, Mail } from 'lucide-react';

const serviceContent = {
  tax: {
    title: 'Tax Preparation & Compliance',
    description:
      'Year-round guidance, clean books, and proactive tax planning so you avoid surprises and file with confidence.',
    heroImage:
      'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg',
    deliverables: [
      'Federal, state, and local business filings',
      'Quarterly estimates and safe-harbor monitoring',
      'IRS and state notice response handling',
      'Sales and use tax prep with nexus tracking',
    ],
    steps: ['Discovery & data intake', 'Entity & deduction review', 'File & confirm acceptance', 'Year-round advisory'],
    ctaLabel: 'Book a tax consult',
  },
  bookkeeping: {
    title: 'Monthly Bookkeeping',
    description:
      'Clean, reconciled financials every month with controller-level oversight and airtight document controls.',
    heroImage:
      'https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg',
    deliverables: [
      'Monthly close and reconciliations',
      'Expense policy enforcement & approvals',
      'Monthly performance dashboard',
      'Prepared P&L, Balance Sheet, Cash Flow',
    ],
    steps: ['Kickoff & tech stack setup', 'Weekly categorizations', 'Month-end close', 'Performance review'],
    ctaLabel: 'Start monthly close',
  },
  advisory: {
    title: 'Financial Advisory & Forecasting',
    description:
      'CFO-level insights, scenario planning, and investor-ready reporting tailored to your growth plans.',
    heroImage:
      'https://images.pexels.com/photos/617069/pexels-photo-617069.jpeg',
    deliverables: [
      '12-month rolling forecasts',
      'Cash runway and burn analysis',
      'Board and investor reporting packs',
      'KPI design with weekly scorecards',
    ],
    steps: ['Goal setting workshop', 'Model build & calibration', 'Review cadence setup', 'Quarterly strategy syncs'],
    ctaLabel: 'Schedule an advisory call',
  },
  payroll: {
    title: 'Payroll & Compliance',
    description:
      'On-time payroll, filings, and benefits coordination with proactive compliance monitoring for every jurisdiction.',
    heroImage:
      'https://images.pexels.com/photos/4475923/pexels-photo-4475923.jpeg',
    deliverables: [
      'Multi-state payroll and onboarding',
      'Time tracking and PTO policy setup',
      'Payroll tax filings and W-2/1099 delivery',
      'Benefits deductions and reconciliations',
    ],
    steps: ['Employer setup & compliance review', 'System configuration', 'Parallel payroll run', 'Live payroll & support'],
    ctaLabel: 'Talk to payroll specialist',
  },
};

function ServiceDetail({ serviceKey }) {
  const navigate = useNavigate();
  const service = serviceContent[serviceKey];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-slate-700">Service not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">BB</span>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">BizBooks</p>
              <h1 className="text-xl font-bold text-primary">Client Services</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/contact')} className="rounded-none">
              Contact
            </Button>
            <Button onClick={() => navigate('/register')} className="rounded-none">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={service.heroImage} alt={service.title} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge className="mb-4 bg-primary text-primary-foreground rounded-none">Core Service</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-4">{service.title}</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">{service.description}</p>
            <div className="flex flex-wrap gap-3 mb-8">
              {service.deliverables.slice(0, 3).map((item) => (
                <Badge key={item} variant="outline" className="rounded-none border-slate-300 text-slate-700">
                  {item}
                </Badge>
              ))}
            </div>
            <div className="flex gap-4 flex-wrap">
              <Button onClick={() => navigate('/intake')} className="rounded-none px-8">
                {service.ctaLabel}
              </Button>
              <Button variant="outline" onClick={() => navigate('/contact')} className="rounded-none px-8">
                Talk to an expert
              </Button>
            </div>
          </div>
          <Card className="border-slate-200 shadow-sm rounded-none">
            <CardHeader>
              <CardTitle className="text-2xl">What you get</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {service.deliverables.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-slate-200 shadow-none rounded-none">
            <CardHeader>
              <CardTitle className="text-xl">How we work together</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
              {service.steps.map((step, idx) => (
                <div key={step} className="p-4 border border-slate-200 rounded-none bg-white">
                  <p className="text-sm uppercase tracking-wide text-slate-500 mb-1">Step {idx + 1}</p>
                  <p className="text-lg font-semibold text-primary mb-2">{step}</p>
                  <p className="text-sm text-slate-600">
                    We provide clear owners, timelines, and documentation so every milestone is traceable.
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-none rounded-none">
            <CardHeader>
              <CardTitle className="text-xl">Need to talk now?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="h-4 w-4" /> <span>+1 (415) 555-0110</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="h-4 w-4" /> <span>hello@bizbooks.co</span>
              </div>
              <p className="text-sm text-slate-600">
                We respond within one business day and can share a secure upload link for your files.
              </p>
              <Button onClick={() => navigate('/intake')} className="w-full rounded-none">
                Submit intake
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 bg-primary text-primary-foreground p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/80 mb-2">Ready to go</p>
            <h3 className="text-3xl font-bold tracking-tight">Launch your engagement with BizBooks</h3>
            <p className="text-primary-foreground/90 mt-2">
              Register for portal access or book a consultation to see the workflow in action.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="secondary" onClick={() => navigate('/register')} className="rounded-none">
              Create account
            </Button>
            <Button variant="outline" onClick={() => navigate('/contact')} className="rounded-none bg-white text-primary">
              Schedule time <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServiceDetail;
