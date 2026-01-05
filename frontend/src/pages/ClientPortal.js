import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, MessageSquare, UploadCloud, ClipboardCheck } from 'lucide-react';

function ClientPortal() {
  const navigate = useNavigate();

  const roadmap = [
    { title: 'Secure login & MFA', description: 'SSO-ready auth with device-based MFA.', icon: <Lock className="h-5 w-5" /> },
    { title: 'Document vault', description: 'Upload, preview, and share with audit trails.', icon: <UploadCloud className="h-5 w-5" /> },
    { title: 'Messaging', description: 'Threaded, searchable conversations by client.', icon: <MessageSquare className="h-5 w-5" /> },
    { title: 'Tasks', description: 'Assignments with due dates and status tracking.', icon: <ClipboardCheck className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Client Portal</p>
            <h1 className="text-2xl font-bold text-primary">Secure access (Phase 2)</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/')} className="rounded-none">
            Back to site
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Card className="border-slate-200 shadow-sm rounded-none">
          <CardHeader>
            <CardTitle className="text-xl">In development</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <p>
              We are finalizing the BizBooks portal for secure document sharing, task management, and messaging. Early
              customers receive priority onboarding and migration support.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-none">SOC2-focused controls</Badge>
              <Badge variant="outline" className="rounded-none">Granular roles</Badge>
              <Badge variant="outline" className="rounded-none">Audit logging</Badge>
            </div>
            <Button onClick={() => navigate('/contact')} className="rounded-none">
              Join early access
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {roadmap.map((item) => (
            <Card key={item.title} className="rounded-none border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-none">
                  {item.icon}
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700">{item.description}</CardContent>
            </Card>
          ))}
        </div>

        <section className="bg-primary text-primary-foreground p-6 rounded-none flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/80">Already registered?</p>
            <p className="text-2xl font-semibold">Sign in to your BizBooks workspace</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="secondary" onClick={() => navigate('/login')} className="rounded-none">
              Login
            </Button>
            <Button variant="outline" onClick={() => navigate('/register')} className="rounded-none bg-white text-primary">
              Create account
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ClientPortal;
