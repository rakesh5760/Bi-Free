import { ArrowRight, BookOpen, Briefcase, GraduationCap, Shield, TrendingUp, Users, Award, Target, Zap, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/theme-toggle";
import { useNavigate } from "react-router";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-violet-500/30 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">SkillForge</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">How It Works</a>
            <a href="#benefits" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Benefits</a>
            <a href="#testimonials" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden lg:flex items-center gap-2 border-l pl-4 border-border/50">
              <Button variant="ghost" className="text-foreground/80 hover:text-primary" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
            <Button onClick={() => navigate('/signup')} className="shadow-md shadow-primary/20">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 relative">
        <motion.div 
          className="container mx-auto max-w-6xl"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center space-y-8 relative z-10">
            <motion.div variants={fadeIn}>
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-sm py-1.5 px-5 rounded-full backdrop-blur-md">
                Industry-Oriented Incubation Ecosystem
              </Badge>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-foreground leading-[1.1]">
              Transform Students Into <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent pb-2 block">
                Industry-Ready
              </span> 
              Professionals
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A premium, guided ecosystem connecting students with industry mentors and real-world clients. Level up your skills, build your reputation, and execute real projects.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary/25 rounded-full" onClick={() => navigate('/signup')}>
                Start Learning <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-border/50 shadow-sm backdrop-blur-sm rounded-full group">
                <PlayCircle className="mr-2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" /> View Demo
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-muted/30 -skew-y-2 origin-top-left -z-10" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { label: "Active Students", value: "12,000+", icon: Users },
              { label: "Expert Mentors", value: "500+", icon: Award },
              { label: "Projects Completed", value: "8,500+", icon: Briefcase },
              { label: "Success Rate", value: "94%", icon: TrendingUp }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeIn}>
                <Card className="p-8 text-center hover:-translate-y-2 transition-transform duration-500 border-border/40 bg-card/60 backdrop-blur-xl shadow-lg shadow-black/5 group">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">The Incubation Pathway</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">A structured, progression-gated journey from fundamental learning to earning through supervised freelancing.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-border via-primary/50 to-border -z-10" />
            
            {[
              { step: "Level D", title: "Enroll & Learn", desc: "Select domain and clear fundamental tests.", icon: BookOpen },
              { step: "Level C", title: "Get Certified", desc: "Pass monitored exams to prove baseline competency.", icon: Shield },
              { step: "Level B", title: "Get Mentored", desc: "Collaborate with experts on mock assignments.", icon: Users },
              { step: "Level A", title: "Build Portfolio", desc: "Execute real client projects under supervision.", icon: Target }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center group"
              >
                <div className="mx-auto h-16 w-16 rounded-full bg-background border-4 border-card flex items-center justify-center mb-6 shadow-xl shadow-primary/10 relative z-10 group-hover:border-primary/50 transition-colors duration-300">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-primary font-bold tracking-widest text-sm uppercase mb-3">{item.step}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/30 skew-y-2 origin-bottom-right -z-10" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ecosystem Roles</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">SkillForge is a multi-sided marketplace designed to provide extreme value to every participant.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Card */}
            <motion.div
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-8 transition-all border-primary/20 bg-gradient-to-b from-card to-primary/5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <GraduationCap className="h-32 w-32" />
                </div>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-6">For Students</h3>
                <ul className="space-y-4 text-muted-foreground relative z-10">
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Structured skill development aligned with industry standards</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Real-world project experience under expert guidance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Earn income while building a verified professional portfolio</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            {/* Mentor Card */}
            <motion.div
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full p-8 transition-all border-violet-500/20 bg-gradient-to-b from-card to-violet-500/5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Award className="h-32 w-32" />
                </div>
                <div className="h-14 w-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6">
                  <Award className="h-7 w-7 text-violet-500" />
                </div>
                <h3 className="text-2xl font-bold mb-6">For Mentors</h3>
                <ul className="space-y-4 text-muted-foreground relative z-10">
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Shape the next generation of engineers and professionals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Flexible, remote engagement managing talented students</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Earn reliable income through project supervision and QA</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            {/* Client Card */}
            <motion.div
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full p-8 transition-all border-blue-500/20 bg-gradient-to-b from-card to-blue-500/5 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Briefcase className="h-32 w-32" />
                </div>
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Briefcase className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-6">For Clients</h3>
                <ul className="space-y-4 text-muted-foreground relative z-10">
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Access a highly vetted, Faculty-approved talent pool</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Quality-assured delivery with Senior Mentor oversight</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Cost-effective solutions without compromising on code quality</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Success Stories</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", role: "Student → Full Stack Developer", quote: "I started as a Level D beginner. Six months later, I am executing enterprise React projects under mentor supervision.", rating: 5 },
              { name: "Rajesh Kumar", role: "Mentor & Tech Lead", quote: "The platform's project queue makes it incredibly easy to supervise students and ensure clients get production-ready code.", rating: 5 },
              { name: "Sarah Tech Solutions", role: "Client Company", quote: "Having a Senior Mentor review the student's work before it reaches us gives us total confidence in the deliverables.", rating: 5 }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full p-8 hover:shadow-xl transition-all bg-card/60 backdrop-blur-md border-border/50">
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <div key={j} className="text-yellow-500">★</div>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed italic">&quot;{testimonial.quote}&quot;</p>
                  <div className="mt-auto">
                    <div className="font-bold text-foreground">{testimonial.name}</div>
                    <div className="text-sm font-medium text-primary mt-1">{testimonial.role}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary -z-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent -z-10" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-white">Ready to Start Your Journey?</h2>
            <p className="text-xl md:text-2xl mb-12 text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
              Join the ecosystem that bridges the gap between academic learning and industry execution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-10 text-lg shadow-2xl rounded-full" onClick={() => navigate('/signup')}>
                Create Free Account
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 h-14 px-10 text-lg backdrop-blur-sm rounded-full">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl">SkillForge</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Empowering the next generation of software engineers through guided execution.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">For Students</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For Mentors</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For Companies</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For Faculty</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Engineering Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-sm font-medium text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
            <span>© 2026 SkillForge Inc. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
