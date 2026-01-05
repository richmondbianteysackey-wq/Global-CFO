import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const sections = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: [
      'We collect the minimum data required to deliver bookkeeping, advisory, payroll, and tax services.',
      'Documents are stored in our encrypted vault. Customers may opt for approved third-party storage such as Dropbox or Google Drive.',
      'Access is role-based; only authorized team members can view or download documents.',
      'We never sell your data. Analytics are anonymized and used to improve the experience.',
    ],
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    content: [
      'Services are provided under a Master Services Agreement and associated Statements of Work.',
      'Clients remain responsible for timely and accurate data submission.',
      'All deliverables include reasonable revisions to align with GAAP and applicable regulations.',
      'Payment terms are Net 15 unless otherwise stated.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookie Notice',
    content: [
      'Essential cookies maintain session security.',
      'Analytics cookies (e.g., GA4) measure page performance; you can opt out through your browser settings.',
      'No marketing third-party trackers are loaded without consent.',
    ],
  },
];

function LegalPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Compliance</p>
            <h1 className="text-2xl font-bold text-primary">Legal Center</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/')} className="rounded-none">
            Back to site
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {sections.map((section) => (
          <Card key={section.id} id={section.id} className="border-slate-200 shadow-sm rounded-none">
            <CardHeader>
              <CardTitle className="text-xl text-primary">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                {section.content.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        <section className="bg-white border border-slate-200 p-6 rounded-none">
          <h2 className="text-lg font-semibold text-primary mb-2">Questions?</h2>
          <p className="text-slate-700 mb-4">
            Contact our compliance team for SOC2 controls, data processing agreements, or sub-processor list.
          </p>
          <Button onClick={() => navigate('/contact')} className="rounded-none">
            Contact Compliance
          </Button>
        </section>
      </main>
    </div>
  );
}

export default LegalPage;
