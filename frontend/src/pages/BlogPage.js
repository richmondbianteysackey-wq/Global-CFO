import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const articles = [
  {
    title: 'Year-end tax checklist for growing businesses',
    excerpt: 'Close your books confidently with reconciliations, 1099 prep, and cash flow planning.',
    category: 'Tax',
    tags: ['1099', 'Year-end', 'Compliance'],
    date: 'Jan 8, 2025',
  },
  {
    title: 'How to choose the right accounting stack',
    excerpt: 'The essential tools we set up for clients: GL, payroll, bill pay, and document workflows.',
    category: 'Operations',
    tags: ['Tech stack', 'Automation', 'Security'],
    date: 'Dec 19, 2024',
  },
  {
    title: 'Monthly close framework for founders',
    excerpt: 'A four-step cadence to deliver investor-ready reports on time every month.',
    category: 'Bookkeeping',
    tags: ['Close', 'KPIs', 'Reporting'],
    date: 'Nov 30, 2024',
  },
];

const categories = ['Tax', 'Bookkeeping', 'Advisory', 'Payroll', 'Operations'];

function BlogPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Insights</p>
            <h1 className="text-2xl font-bold text-primary">BizBooks Blog</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/')} className="rounded-none">
              Home
            </Button>
            <Button onClick={() => navigate('/contact')} className="rounded-none">
              Talk to us
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="rounded-none">
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.title} className="rounded-none border-slate-200 shadow-sm">
              <CardHeader>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">{article.date}</p>
                <CardTitle className="text-lg text-primary leading-snug">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-700">{article.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-none">{article.category}</Badge>
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-none">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="bg-primary text-primary-foreground p-6 rounded-none flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/80">Stay updated</p>
            <p className="text-2xl font-semibold">Get new articles and compliance alerts in your inbox</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/contact')} className="rounded-none">
            Subscribe & connect
          </Button>
        </section>
      </main>
    </div>
  );
}

export default BlogPage;
