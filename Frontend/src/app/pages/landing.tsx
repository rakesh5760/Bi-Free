import { ArrowRight, BookOpen, Briefcase, GraduationCap, Shield, TrendingUp, Users, Award, Target, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-semibold text-lg">SkillForge</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">How It Works</a>
            <a href="#benefits" className="text-sm hover:text-primary transition-colors">Benefits</a>
            <a href="#testimonials" className="text-sm hover:text-primary transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="/student">Student</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="/mentor">Mentor</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="/client">Client</a>
              </Button>
            </div>
            <Button>Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0">
              Industry-Oriented Learning Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Transform Students Into Industry-Ready Professionals
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive platform connecting students, mentors, faculty, and clients for guided skill development and real-world freelancing experience.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Start Learning <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">View Demo</Button>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Students", value: "12,000+", icon: Users },
              { label: "Expert Mentors", value: "500+", icon: Award },
              { label: "Projects Completed", value: "8,500+", icon: Briefcase },
              { label: "Success Rate", value: "94%", icon: TrendingUp }
            ].map((stat, i) => (
              <Card key={i} className="p-6 text-center hover:shadow-lg transition-all border-border/50 bg-card/50 backdrop-blur-sm">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">A structured pathway from learning to earning</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Enroll & Learn", desc: "Choose your domain and access curated learning resources", icon: BookOpen },
              { step: "02", title: "Get Certified", desc: "Take monitored exams to prove your skills and level up", icon: Shield },
              { step: "03", title: "Get Mentored", desc: "Work with industry experts on real projects", icon: Users },
              { step: "04", title: "Build Portfolio", desc: "Complete client projects and build your reputation", icon: Target }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-muted/20 mb-4">{item.step}</div>
                <div className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                  <item.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Benefits for Everyone</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <GraduationCap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">For Students</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Structured skill development with industry standards</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Real-world project experience while learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Earn while you learn through client projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Build professional portfolio and reputation</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
              <Award className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-2xl font-bold mb-4">For Mentors</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Shape the next generation of professionals</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Flexible engagement with talented students</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Build your personal brand and network</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Earn through mentorship and supervision</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all border-accent/20 bg-gradient-to-br from-card to-accent/5">
              <Briefcase className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-2xl font-bold mb-4">For Clients</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Access verified and skilled talent pool</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Quality-assured project delivery with mentor oversight</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Cost-effective solutions from emerging talent</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Transparent progress tracking and communication</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", role: "Student → Full Stack Developer", quote: "Started as a beginner, now working on enterprise projects. The mentorship was invaluable!", rating: 5 },
              { name: "Rajesh Kumar", role: "Mentor & Tech Lead", quote: "Helping students while earning extra income has been incredibly rewarding.", rating: 5 },
              { name: "Sarah Tech Solutions", role: "Client Company", quote: "Found amazing talent here. Projects delivered on time with great quality.", rating: 5 }
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-all bg-card/50 backdrop-blur-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <div key={i} className="h-4 w-4 text-yellow-400">★</div>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of students, mentors, and companies already on the platform</p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" variant="secondary">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold">SkillForge</span>
              </div>
              <p className="text-sm text-muted-foreground">Empowering the next generation of industry professionals</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">For Students</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For Mentors</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For Companies</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For Faculty</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © 2026 SkillForge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
