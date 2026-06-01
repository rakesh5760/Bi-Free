import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { GraduationCap, ArrowRight, Loader2, Code, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { useAuthStore } from '../../../store/useAuthStore';
import { api } from '../../../services/api.client';

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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Get access token via OAuth2 password flow
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const tokenResponse = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const token = tokenResponse.data.access_token;

      // 2. Fetch user profile
      const userResponse = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = userResponse.data.data;
      
      const mappedRole = userData.role?.role_name?.toLowerCase() || 'student';
      const mappedUser = {
        id: userData.user_id.toString(),
        name: `${userData.first_name} ${userData.last_name}`,
        email: userData.email,
        role: mappedRole,
        studentLevel: userData.student_profile?.level?.name?.replace('Level ', '') || null,
        domain: userData.student_profile?.domain?.name || null
      };

      // 3. Authenticate in Zustand store
      login(mappedUser as any, token);
      
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
        navigate(dashboardRoutes[mappedRole] || '/', { replace: true });
      }
    } catch (err) {
      console.error(err);
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
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
              Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup'); }} className="text-primary font-medium hover:underline">Sign up</a>
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
