import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'client',
    company_name: '',
    industry: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await register(
        formData.email,
        formData.password,
        formData.full_name,
        formData.role,
        formData.company_name,
        formData.industry
      );
      toast.success('Registration successful!');
      
      if (user.role === 'admin' || user.role === 'bookkeeper' || user.role === 'tax_preparer') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
              <span className="text-2xl font-bold text-primary">Global CFO LLC</span>
            </Link>
            <h1 className="text-4xl tracking-tight font-bold text-primary mb-2">Create Account</h1>
            <p className="text-base text-slate-600">Start managing your accounting today</p>
          </div>

          <Card className="border border-slate-200 shadow-none rounded-md">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Fill in your details to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium mb-1.5 text-slate-700">
                    Full Name
                  </label>
                  <Input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    required
                    placeholder="John Doe"
                    data-testid="full-name-input"
                    className="h-11 rounded-sm border-slate-300 focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-slate-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    placeholder="you@company.com"
                    data-testid="email-input"
                    className="h-11 rounded-sm border-slate-300 focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-slate-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    placeholder="••••••••"
                    data-testid="password-input"
                    className="h-11 rounded-sm border-slate-300 focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-1.5 text-slate-700">
                    Account Type
                  </label>
                  <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                    <SelectTrigger data-testid="role-select" className="h-11 rounded-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="bookkeeper">Bookkeeper</SelectItem>
                      <SelectItem value="tax_preparer">Tax Preparer</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.role === 'client' && (
                  <div>
                    <label htmlFor="company_name" className="block text-sm font-medium mb-1.5 text-slate-700">
                      Company Name
                    </label>
                    <Input
                      id="company_name"
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => handleChange('company_name', e.target.value)}
                      required={formData.role === 'client'}
                      placeholder="Acme Corporation"
                      data-testid="company-name-input"
                      className="h-11 rounded-sm border-slate-300 focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium mb-1.5 text-slate-700">
                      Industry
                    </label>
                    <Input
                      id="industry"
                      type="text"
                      value={formData.industry}
                      onChange={(e) => handleChange('industry', e.target.value)}
                      required={formData.role === 'client'}
                      placeholder="Ecommerce, SaaS, etc."
                      data-testid="industry-input"
                      className="h-11 rounded-sm border-slate-300 focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  data-testid="register-submit-btn"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-none font-bold uppercase tracking-wide"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-accent hover:underline font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:block flex-1 relative">
        <div className="absolute inset-0 bg-slate-900/40 z-10"></div>
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
          alt="Business partnership"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-white max-w-md">
            <h2 className="text-4xl font-bold mb-4">Join Hundreds of Businesses</h2>
            <p className="text-lg opacity-90">
              Trusted by small and medium-sized businesses for comprehensive accounting solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
