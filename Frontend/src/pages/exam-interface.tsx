import { useState, useEffect } from "react";
import { Camera, Mic, Clock, AlertTriangle, ChevronLeft, ChevronRight, Flag, Send, Maximize, Play, CheckCircle2, ShieldAlert, Terminal, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { usePageVisibility } from "../hooks/usePageVisibility";
import { useFullscreen } from "../hooks/useFullscreen";
import { useMediaDevices } from "../hooks/useMediaDevices";
import { api } from "../services/api.client";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function ExamInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [examStarted, setExamStarted] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // State Management
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<number[]>([]);

  const { isVisible, violationCount: visibilityViolations } = usePageVisibility();
  const { isFullscreen, violationCount: fullscreenViolations, enterFullscreen } = useFullscreen();
  const { isRecording, videoRef, requestAccess, error: mediaError } = useMediaDevices();

  const questions = [
    {
      id: 1,
      type: "mcq",
      question: "What is the primary purpose of React's virtual DOM?",
      options: [
        "To store application state",
        "To optimize rendering performance by minimizing direct DOM manipulation",
        "To handle routing in single-page applications",
        "To manage API calls"
      ]
    },
    {
      id: 2,
      type: "mcq",
      question: "Which hook is used for side effects in React functional components?",
      options: [
        "useState",
        "useContext",
        "useEffect",
        "useReducer"
      ]
    },
    {
      id: 3,
      type: "code",
      question: "Write a function that reverses a string without using built-in reverse methods.",
      code: "function reverseString(str) {\n  // Your code here\n  \n}",
    },
    {
      id: 4,
      type: "mcq",
      question: "What does REST stand for in API design?",
      options: [
        "Representational State Transfer",
        "Remote Execution State Transfer",
        "Rendered State Transition",
        "Resource Execution System Transfer"
      ]
    },
  ];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (examStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = async () => {
    await requestAccess();
    if (!mediaError) {
      await enterFullscreen();
      try {
        // Use a default exam ID (e.g., 1) or parse from URL if available
        const res = await api.post('/exams/1/start');
        if (res.data.success) {
          setAttemptId(res.data.data.attempt_id);
          setExamStarted(true);
        }
      } catch (err) {
        toast.error("Failed to start exam. Make sure you are a student and have an active domain.");
        console.error("Failed to start exam attempt", err);
      }
    }
  };

  const handleSubmitExam = async () => {
    if (!attemptId) return;
    setIsSubmitting(true);
    try {
      const formattedSubmissions = Object.entries(answers).map(([qIdx, answer]) => ({
        question_id: questions[Number(qIdx)].id,
        answer: { choice: answer }
      }));
      await api.post(`/exams/attempts/${attemptId}/submit`, formattedSubmissions);
      toast.success("Exam submitted successfully!");
      // Briefly wait to let toast display before navigation
      setTimeout(() => navigate('/student/dashboard'), 1500);
    } catch (err) {
      toast.error("Failed to submit exam");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const toggleFlag = () => {
    if (flagged.includes(currentQuestion)) {
      setFlagged(flagged.filter(q => q !== currentQuestion));
    } else {
      setFlagged([...flagged, currentQuestion]);
    }
  };

  const handleAnswerChange = (val: string) => {
    setAnswers({ ...answers, [currentQuestion]: val });
  };

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
          <Card className="border-border/50 shadow-2xl shadow-primary/5 bg-card/80 backdrop-blur-xl overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-primary to-indigo-600" />
            <CardContent className="pt-8 pb-8 px-8 space-y-8">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                  <ShieldAlert className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Secure Environment</h2>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  You are about to enter a highly secure, monitored proctoring session. Please review the mandatory requirements below.
                </p>
              </div>
              
              <div className="space-y-4 bg-muted/30 p-6 rounded-xl border border-border/50">
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold text-sm">Webcam Verification</span>
                  </div>
                  {mediaError ? (
                    <Badge variant="destructive" className="uppercase tracking-wider text-[10px]">Failed</Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-500 border-amber-500/30 uppercase tracking-wider text-[10px] bg-amber-500/10">Pending</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Mic className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold text-sm">Microphone Access</span>
                  </div>
                  <Badge variant="outline" className="text-amber-500 border-amber-500/30 uppercase tracking-wider text-[10px] bg-amber-500/10">Pending</Badge>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Maximize className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold text-sm">Fullscreen Lock</span>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/30 uppercase tracking-wider text-[10px] bg-primary/10">Required</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold text-sm">Tab Switching</span>
                  </div>
                  <Badge variant="destructive" className="uppercase tracking-wider text-[10px]">Strictly Prohibited</Badge>
                </div>
              </div>

              {mediaError && (
                <div className="flex items-start gap-3 text-sm text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/20 font-medium">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <p>{mediaError}</p>
                </div>
              )}

              <Button onClick={handleStartExam} className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" size="lg">
                <Play className="mr-2 h-5 w-5 fill-current" />
                Initialize Proctoring
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Fullscreen Violation Alert */}
      <AnimatePresence>
        {!isFullscreen && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-destructive text-destructive-foreground px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 font-semibold z-[60] shadow-lg"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              <span>SECURITY WARNING: You have exited fullscreen mode. Your session is at risk of termination.</span>
            </div>
            <Button size="sm" variant="outline" className="text-destructive border-transparent bg-white/90 hover:bg-white shadow-sm flex-shrink-0" onClick={() => enterFullscreen()}>
              <Maximize className="mr-2 h-4 w-4" />
              Restore Fullscreen
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Visibility Violation Alert */}
      <AnimatePresence>
        {!isVisible && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <Card className="max-w-md w-full border-destructive/50 shadow-2xl shadow-destructive/20 bg-card overflow-hidden">
              <div className="h-2 w-full bg-destructive" />
              <CardContent className="pt-8 pb-8 px-8 text-center space-y-6">
                <div className="mx-auto h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center">
                  <ShieldAlert className="h-10 w-10 text-destructive" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-destructive tracking-tight mb-2">Focus Lost Detected</h2>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    You have switched tabs or minimized the assessment window. This action has been silently recorded and flagged for mentor review.
                  </p>
                </div>
                <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg">
                  <div className="text-sm font-semibold uppercase tracking-wider text-destructive mb-1">Violation Count</div>
                  <div className="text-3xl font-black text-destructive">{visibilityViolations}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-lg flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
            <Lock className="h-4 w-4 text-primary" />
          </div>
          <div className="font-bold text-lg tracking-tight">Advanced JavaScript Exam</div>
          <Badge variant="outline" className="hidden sm:inline-flex bg-primary/5 text-primary border-primary/20">Level B Certification</Badge>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border ${timeRemaining < 300 ? 'bg-destructive/10 border-destructive/20 text-destructive animate-pulse' : 'bg-muted/50 border-border/50 text-foreground'}`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold text-lg">{formatTime(timeRemaining)}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isRecording ? 'bg-green-500/10 border-green-500/20' : 'bg-destructive/10 border-destructive/20'}`}>
              <Camera className={`h-4 w-4 ${isRecording ? 'text-green-500' : 'text-destructive'}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${isRecording ? 'text-green-500' : 'text-destructive'}`}>Cam</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isRecording ? 'bg-green-500/10 border-green-500/20' : 'bg-destructive/10 border-destructive/20'}`}>
              <Mic className={`h-4 w-4 ${isRecording ? 'text-green-500' : 'text-destructive'}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${isRecording ? 'text-green-500' : 'text-destructive'}`}>Mic</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Navigation */}
        <aside className="w-20 lg:w-72 border-r border-border/50 bg-card/30 p-4 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="hidden lg:block mb-8">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Overall Progress</div>
              <Progress value={(Object.keys(answers).length / questions.length) * 100} className="h-2 mb-2" />
              <div className="text-xs font-medium text-right text-muted-foreground">{Object.keys(answers).length} of {questions.length} Answered</div>
            </div>
            <div className="mb-4">
              <div className="hidden lg:block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Question Navigator</div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {questions.map((q, i) => {
                  const isAnswered = answers[i] !== undefined && answers[i] !== '';
                  const isFlagged = flagged.includes(i);
                  const isCurrent = i === currentQuestion;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentQuestion(i)}
                      className={`
                        h-12 w-full lg:h-12 lg:w-12 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all relative
                        ${isCurrent ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20' : 
                          isAnswered ? 'bg-card border-primary/40 text-foreground hover:bg-muted' : 
                          'bg-card border-border/50 text-muted-foreground hover:bg-muted/50'}
                      `}
                    >
                      {i + 1}
                      {isFlagged && (
                        <div className={`absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full flex items-center justify-center ${isCurrent ? 'bg-amber-400 border-2 border-primary text-primary-foreground' : 'bg-amber-500 border-2 border-background text-white'}`}>
                          <Flag className="h-2 w-2" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block mt-auto">
            <Card className={`border ${visibilityViolations > 0 ? 'bg-destructive/5 border-destructive/20' : 'bg-card/50 border-border/50'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className={`h-5 w-5 flex-shrink-0 mt-0.5 ${visibilityViolations > 0 ? 'text-destructive' : 'text-primary'}`} />
                  <div>
                    <div className="text-sm font-bold mb-1">Session Integrity</div>
                    <ul className="text-xs space-y-1.5 font-medium">
                      <li className="text-muted-foreground flex justify-between">Tab switches: <span className={visibilityViolations > 0 ? "text-destructive font-bold" : "text-foreground"}>{visibilityViolations}</span></li>
                      <li className="text-muted-foreground flex justify-between">Focus lost: <span className={visibilityViolations > 0 ? "text-destructive font-bold" : "text-foreground"}>{visibilityViolations}</span></li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-muted/20 relative">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight">Question {currentQuestion + 1}</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFlag}
                className={`font-semibold ${flagged.includes(currentQuestion) ? 'border-amber-500 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 hover:text-amber-600' : ''}`}
              >
                <Flag className={`mr-2 h-4 w-4 ${flagged.includes(currentQuestion) ? 'fill-current' : ''}`} />
                {flagged.includes(currentQuestion) ? 'Flagged for Review' : 'Flag for Review'}
              </Button>
            </div>

            <Card className="shadow-lg border-border/50 mb-8 flex-1">
              <CardContent className="p-8">
                <div className="mb-8">
                  <p className="text-xl font-semibold leading-relaxed text-foreground">
                    {questions[currentQuestion].question}
                  </p>
                </div>

                {questions[currentQuestion].type === "mcq" && (
                  <RadioGroup 
                    className="space-y-4" 
                    value={answers[currentQuestion] || ""} 
                    onValueChange={handleAnswerChange}
                  >
                    {questions[currentQuestion].options?.map((option, i) => {
                      const isSelected = answers[currentQuestion] === option;
                      return (
                        <div 
                          key={i} 
                          className={`flex items-center space-x-4 p-5 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 bg-background hover:bg-muted/50 hover:border-border'}`}
                          onClick={() => handleAnswerChange(option)}
                        >
                          <RadioGroupItem value={option} id={`option-${i}`} className={isSelected ? 'border-primary text-primary' : ''} />
                          <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer text-base font-medium leading-relaxed">
                            {option}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}

                {questions[currentQuestion].type === "code" && (
                  <div className="space-y-4 rounded-xl border border-border/50 overflow-hidden shadow-inner">
                    <div className="bg-[#1e1e1e] border-b border-[#333] px-4 py-3 flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="flex items-center gap-2 text-[#858585] text-xs font-mono font-medium">
                        <Terminal className="h-3.5 w-3.5" />
                        main.js
                      </div>
                      <div className="w-12" /> {/* Spacer for centering */}
                    </div>
                    <Textarea
                      value={answers[currentQuestion] || questions[currentQuestion].code}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="font-mono min-h-[300px] bg-[#1e1e1e] text-[#d4d4d4] text-sm border-0 focus-visible:ring-0 rounded-none resize-none p-6 selection:bg-[#264F78]"
                      spellCheck={false}
                    />
                    <div className="bg-[#1e1e1e] border-t border-[#333] px-4 py-2 flex items-center justify-between">
                      <div className="text-xs text-[#858585] font-mono">JavaScript (Node.js 18)</div>
                      <Button size="sm" variant="outline" className="h-7 text-xs bg-[#2d2d2d] border-[#333] text-white hover:bg-[#3d3d3d] hover:text-white">Run Code</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between mt-auto">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                size="lg"
                className="font-bold border-border/50"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentQuestion < questions.length - 1 ? (
                <Button onClick={() => setCurrentQuestion(currentQuestion + 1)} size="lg" className="font-bold shadow-md shadow-primary/20">
                  Next Question
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmitExam} 
                  disabled={isSubmitting}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20" 
                  size="lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit Exam"}
                  {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar: Proctoring Feed */}
        <aside className="hidden xl:flex w-80 border-l border-border/50 bg-card/30 p-4 flex-col overflow-y-auto">
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
              Proctoring Feed
              {isRecording && (
                <div className="flex items-center gap-1.5 text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> REC
                </div>
              )}
            </div>
            <div className="aspect-video bg-black rounded-xl border border-border/50 overflow-hidden mb-3 relative shadow-lg">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
              {/* Subtle Scanning Overlay */}
              {isRecording && (
                <div className="absolute inset-0 pointer-events-none border-2 border-primary/20 rounded-xl">
                  <div className="w-full h-1 bg-primary/30 blur-[2px] animate-[scan_3s_ease-in-out_infinite]" />
                </div>
              )}
              {!isRecording && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/80 backdrop-blur-md">
                  <Camera className="h-8 w-8 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Feed Offline</span>
                </div>
              )}
            </div>
            <div className="text-xs font-medium text-muted-foreground flex items-start gap-2 bg-muted/30 p-3 rounded-lg border border-border/50">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              Face detection and continuous audio monitoring are actively enforcing session integrity.
            </div>
          </div>

          <Card className="bg-primary/5 border-primary/20 mb-6 shadow-sm">
            <CardContent className="p-5">
              <div className="text-sm font-bold mb-4 text-foreground">Exam Summary</div>
              <div className="space-y-3.5 text-sm font-medium">
                <div className="flex justify-between items-center border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Total Questions</span>
                  <span>{questions.length}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Answered</span>
                  <span className="text-primary">{Object.keys(answers).length}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Flagged</span>
                  <span className="text-amber-500">{flagged.length}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-muted-foreground">Target Passing Score</span>
                  <span className="text-emerald-500 font-bold">75%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Integrity Rules</div>
            <ul className="text-xs text-muted-foreground space-y-3 font-medium">
              <li className="flex gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" /> Stay in fullscreen mode at all times</li>
              <li className="flex gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" /> Do not switch tabs or open other apps</li>
              <li className="flex gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" /> Ensure your face remains visible</li>
              <li className="flex gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" /> Submit your test before the timer expires</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
