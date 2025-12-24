import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, Shield, FileText, MessageSquare, BarChart3, CheckCircle } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-primary">Global CFO LLC</h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              data-testid="login-btn"
              className="h-11 px-8 rounded-none font-bold uppercase tracking-wide"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/register')}
              data-testid="register-btn"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-none font-bold uppercase tracking-wide"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">PROFESSIONAL ACCOUNTING SERVICES</p>
              <h1 className="text-5xl md:text-6xl tracking-tight leading-none font-bold text-primary mb-6">
                Secure Accounting for Growing Businesses
              </h1>
              <p className="text-lg leading-relaxed text-slate-600 mb-8">
                Grant Global CFO LLC authorized access to your financial records. We handle bookkeeping, maintain accounting records, and prepare tax-ready financial statements with precision and security.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate('/register')}
                  data-testid="hero-get-started-btn"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-none font-bold uppercase tracking-wide"
                >
                  Start Your Free Trial
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/register')}
                  className="h-11 px-8 rounded-none font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg"
                alt="Professional finance team"
                className="w-full h-[500px] object-cover rounded-md shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">COMPREHENSIVE PLATFORM</p>
            <h2 className="text-4xl md:text-5xl tracking-tight font-bold text-primary mb-4">
              Everything You Need for Financial Excellence
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Building2 className="h-10 w-10" strokeWidth={1.5} />,
                title: 'Multi-Company Management',
                description: 'Manage multiple business entities from a single secure platform with role-based access control.'
              },
              {
                icon: <FileText className="h-10 w-10" strokeWidth={1.5} />,
                title: 'Document Management',
                description: 'Securely upload and store receipts, bank statements, and tax documents with full audit trails.'
              },
              {
                icon: <BarChart3 className="h-10 w-10" strokeWidth={1.5} />,
                title: 'Financial Reporting',
                description: 'Generate comprehensive financial reports including P&L, balance sheets, and tax summaries.'
              },
              {
                icon: <MessageSquare className="h-10 w-10" strokeWidth={1.5} />,
                title: 'Team Communication',
                description: 'Collaborate seamlessly with your accountants through integrated messaging and task management.'
              },
              {
                icon: <Shield className="h-10 w-10" strokeWidth={1.5} />,
                title: 'Bank-Level Security',
                description: 'Enterprise-grade encryption and security controls protect your sensitive financial data.'
              },
              {
                icon: <CheckCircle className="h-10 w-10" strokeWidth={1.5} />,
                title: 'Compliance & Audit',
                description: 'Complete audit logs and compliance controls ensure regulatory adherence at all times.'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-6 rounded-md hover:border-accent transition-colors"
                data-testid={`feature-card-${idx}`}
              >
                <div className="text-accent mb-4">{feature.icon}</div>
                <h3 className="text-2xl tracking-tight font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-base leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/5716001/pexels-photo-5716001.jpeg"
                alt="Professional accountant"
                className="w-full h-[500px] object-cover rounded-md shadow-sm"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">TRUSTED BY BUSINESSES</p>
              <h2 className="text-4xl md:text-5xl tracking-tight font-bold text-primary mb-6">
                Professional Accounting You Can Trust
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 mb-6">
                Our team of certified professionals brings decades of experience in bookkeeping, tax preparation, and financial management. We understand the challenges small and medium-sized businesses face.
              </p>
              <ul className="space-y-4">
                {[
                  'Certified Public Accountants (CPAs)',
                  'SOC 2 Type II Compliant',
                  'GDPR & Data Privacy Certified',
                  '24/7 Support & Monitoring'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-500" strokeWidth={1.5} />
                    <span className="text-base text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl tracking-tight font-bold mb-6">
            Ready to Transform Your Accounting?
          </h2>
          <p className="text-lg leading-relaxed mb-8 opacity-90">
            Join hundreds of businesses that trust Global CFO LLC for their financial management.
          </p>
          <Button
            onClick={() => navigate('/register')}
            data-testid="cta-get-started-btn"
            className="bg-white text-primary hover:bg-slate-100 h-11 px-8 rounded-none font-bold uppercase tracking-wide"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-600">
            © 2025 Global CFO LLC. All rights reserved. Professional accounting services.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
