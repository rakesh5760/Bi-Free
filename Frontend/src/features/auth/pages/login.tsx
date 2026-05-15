import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { GraduationCap, ArrowRight, Loader2, Code } from 'lucide-react';
import { Button } from '../../../app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../app/components/ui/card';
import { useAuthStore } from '../../../store/useAuthStore';
import { api } from '../../../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  
  const from = location.state?.from?.pathname || '/student';
  const defaultEmail = from.includes('mentor') 
    ? 'mentor@skillforge.edu' 
    : from.includes('client') 
      ? 'client@skillforge.edu' 
      : 'alex@student.edu';

  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Calls MSW mock handler
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      login(user, token);
      
      // Navigate to intended route or default role dashboard
      if (location.state?.from?.pathname) {
        navigate(from, { replace: true });
      } else {
        const dashboardRoutes: Record<string, string> = {
          student: '/student',
          mentor: '/mentor',
          faculty: '/faculty',
          client: '/client',
          admin: '/admin',
        };
        navigate(dashboardRoutes[user.role] || '/', { replace: true });
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Code className="h-7 w-7 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">SkillForge</span>
          </div>
        </div>

        <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-card/60 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  required
                />
              </div>
              
              {error && (
                <div className="text-sm text-destructive font-medium p-2 bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 transition-all" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-border/50 pt-4 mt-2">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account? <a href="#" className="text-primary font-medium hover:underline">Sign up</a>
            </div>
            
            <div className="text-xs text-center text-muted-foreground bg-muted/50 p-2 rounded">
              <strong>Demo Note:</strong> Any password works. Emails: <code>alex@student.edu</code> (Student), <code>mentor@skillforge.edu</code> (Mentor), <code>client@skillforge.edu</code> (Client)
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
