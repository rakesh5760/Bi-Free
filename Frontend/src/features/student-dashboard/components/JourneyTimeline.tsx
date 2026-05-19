import { Trophy, CheckCircle, Code, Briefcase, Lock } from "lucide-react";
import { StudentLevel } from "../../../store/useAuthStore";
import { Card, CardContent } from "../../../components/ui/card";

interface JourneyTimelineProps {
  currentLevel: StudentLevel;
}

export function JourneyTimeline({ currentLevel }: JourneyTimelineProps) {
  // Map levels to numeric indices for easier progression comparison
  const levelOrder: Record<NonNullable<StudentLevel>, number> = { D: 0, C: 1, B: 2, A: 3 };
  const currentIndex = currentLevel ? levelOrder[currentLevel] : 0;

  const steps = [
    {
      level: "D",
      title: "Foundation",
      description: "Basic skill acquisition",
      icon: Code,
    },
    {
      level: "C",
      title: "Incubation",
      description: "Domain specialization",
      icon: BookOpenIcon,
    },
    {
      level: "B",
      title: "Qualification",
      description: "Proctored assessment",
      icon: Trophy,
    },
    {
      level: "A",
      title: "Industry Ready",
      description: "Client project eligible",
      icon: Briefcase,
    },
  ];

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-r from-card to-muted/20 overflow-hidden mb-6">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Your SkillForge Journey
        </h3>
        
        <div className="relative">
          {/* Connecting Line Background */}
          <div className="absolute top-6 h-1 bg-muted rounded-full -z-10 hidden md:block" style={{ left: '12.5%', width: '75%' }} />
          
          {/* Active Connecting Line */}
          <div 
            className="absolute top-6 h-1 bg-primary rounded-full transition-all duration-1000 -z-10 hidden md:block" 
            style={{ left: '12.5%', width: `${(currentIndex / 3) * 75}%` }} 
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isActive = index === currentIndex;
              const isLocked = index > currentIndex;

              return (
                <div key={step.level} className="flex flex-col items-center text-center">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 transition-all duration-500 shadow-sm ${
                    isCompleted ? 'bg-primary text-primary-foreground' : 
                    isActive ? 'bg-primary/20 text-primary border-2 border-primary' : 
                    'bg-muted text-muted-foreground border-2 border-dashed border-muted-foreground/30'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-6 w-6" /> : 
                     isLocked ? <Lock className="h-5 w-5 opacity-50" /> : 
                     <step.icon className="h-5 w-5" />}
                  </div>
                  
                  <div className={`font-semibold ${isActive ? 'text-primary' : isLocked ? 'text-muted-foreground' : ''}`}>
                    Level {step.level}: {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 max-w-[150px]">
                    {step.description}
                  </div>
                  
                  {isActive && (
                    <div className="mt-2 text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-1 rounded-full animate-pulse">
                      Current Phase
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Inline BookOpen icon since we missed it in imports
function BookOpenIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
