import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Database, Layout, Laptop, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { useAuthStore } from '../../../store/useAuthStore';
import { api } from '../../../services/api.client';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  
  // State from signup
  const { role = 'student', email = '', name = '', password = '' } = location.state || {};

  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If someone lands here directly without going through signup, redirect them.
  if (!email) {
    navigate('/signup', { replace: true });
    return null;
  }

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || 'Unknown';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';

      const registerPayload = {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
        role: role,
        domain: domain || undefined,
        company_name: companyName || undefined
      };

      const tokenResponse = await api.post('/auth/register', registerPayload);
      const token = tokenResponse.data.access_token;

      // Fetch user profile
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
        studentLevel: userData.student_profile?.level?.name?.replace('Level ', '') || null
      };
      
      login(mappedUser as any, token);
      
      navigate(role === 'student' ? '/student' : '/client', { replace: true });
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-2 w-16 rounded-full transition-all duration-300 ${step >= i ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-xl">
                <CardHeader className="text-center">
                  <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">👋</span>
                  </div>
                  <CardTitle className="text-3xl font-bold">Welcome, {name.split(' ')[0]}!</CardTitle>
                  <CardDescription className="text-lg">
                    Let's set up your profile to personalize your experience.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center pt-8">
                  <Button size="lg" className="w-full md:w-auto px-12" onClick={nextStep}>
                    Let's Go <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 2 && role === 'student' && (
            <motion.div
              key="step2-student"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Choose your domain</CardTitle>
                  <CardDescription>
                    Which technology stack do you want to master? You can change this later.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'frontend', title: 'Frontend Engineering', icon: Layout, desc: 'React, Vue, Tailwind' },
                    { id: 'backend', title: 'Backend Engineering', icon: Database, desc: 'Node.js, Python, SQL' },
                    { id: 'fullstack', title: 'Full Stack', icon: Laptop, desc: 'End-to-end development' },
                    { id: 'mobile', title: 'Mobile App Dev', icon: Code, desc: 'React Native, Flutter' },
                  ].map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setDomain(item.id)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${domain === item.id ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'hover:border-primary/50'}`}
                    >
                      <item.icon className={`h-8 w-8 mb-3 ${domain === item.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={nextStep} disabled={!domain}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 2 && role === 'client' && (
            <motion.div
              key="step2-client"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Company Details</CardTitle>
                  <CardDescription>
                    Tell us a bit about your organization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <Input 
                      placeholder="Acme Corp" 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industry</label>
                    <Input placeholder="E-commerce, SaaS, etc." />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={nextStep} disabled={!companyName}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-xl">
                <CardHeader className="text-center">
                  <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-3xl font-bold">You're all set!</CardTitle>
                  <CardDescription className="text-lg">
                    {role === 'student' 
                      ? 'Your incubation workspace is ready. Let\'s start building skills.' 
                      : 'Your client dashboard is ready. Let\'s post your first project.'}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center pt-8">
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto px-12" 
                    onClick={handleComplete}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing...</>
                    ) : (
                      <>Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
