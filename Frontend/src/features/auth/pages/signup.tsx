import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { GraduationCap, ArrowRight, Loader2, Code, Building, User } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Label } from '../../../components/ui/label';
import { useAuthStore } from '../../../store/useAuthStore';

export default function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);
  
  const [role, setRole] = useState<'student' | 'client'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/onboarding', { state: { role, email, name, password } });
    }, 500);
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
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Join the incubation ecosystem today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              
              <div className="space-y-3">
                <Label>I want to join as a:</Label>
                <RadioGroup 
                  defaultValue="student" 
                  value={role} 
                  onValueChange={(val) => setRole(val as 'student' | 'client')}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className={`border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${role === 'student' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-muted/50'}`} onClick={() => setRole('student')}>
                    <RadioGroupItem value="student" id="r-student" className="sr-only" />
                    <User className={`h-6 w-6 ${role === 'student' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Label htmlFor="r-student" className="cursor-pointer font-medium">Student</Label>
                  </div>
                  <div className={`border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${role === 'client' ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-muted/50'}`} onClick={() => setRole('client')}>
                    <RadioGroupItem value="client" id="r-client" className="sr-only" />
                    <Building className={`h-6 w-6 ${role === 'client' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Label htmlFor="r-client" className="cursor-pointer font-medium">Company</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 transition-all" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-border/50 pt-4 mt-2">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account? <a href="/login" className="text-primary font-medium hover:underline">Sign in</a>
            </div>
            <div className="text-xs text-center text-muted-foreground">
              By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
