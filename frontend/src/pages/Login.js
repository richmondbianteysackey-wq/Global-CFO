import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      toast.success('Login successful!');
      
      // Navigate based on role
      if (user.role === 'admin' || user.role === 'bookkeeper' || user.role === 'tax_preparer') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
              <span className="text-2xl font-bold text-primary">Global CFO LLC</span>
            </Link>
            <h1 className="text-4xl tracking-tight font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-base text-slate-600">Sign in to access your accounting dashboard</p>
          </div>

          <Card className="border border-slate-200 shadow-none rounded-md">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-slate-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    data-testid="password-input"
                    className="h-11 rounded-sm border-slate-300 focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  data-testid="login-submit-btn"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-none font-bold uppercase tracking-wide"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-accent hover:underline font-semibold">
                    Create Account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block flex-1 relative">
        <div className="absolute inset-0 bg-slate-900/40 z-10"></div>
        <img
          src="https://images.pexels.com/photos/7172774/pexels-photo-7172774.jpeg"
          alt="Financial growth"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-white max-w-md">
            <h2 className="text-4xl font-bold mb-4">Professional Accounting Made Simple</h2>
            <p className="text-lg opacity-90">
              Secure access to your financial records with enterprise-grade security and compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
