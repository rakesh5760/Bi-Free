import { useState, useEffect } from "react";
import { Camera, Mic, Clock, AlertTriangle, ChevronLeft, ChevronRight, Flag, Send, Maximize, Play } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { usePageVisibility } from "../../features/monitoring/hooks/usePageVisibility";
import { useFullscreen } from "../../features/monitoring/hooks/useFullscreen";
import { useMediaDevices } from "../../features/monitoring/hooks/useMediaDevices";

export default function ExamInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [examStarted, setExamStarted] = useState(false);

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
      ],
      answer: null
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
      ],
      answer: null
    },
    {
      id: 3,
      type: "code",
      question: "Write a function that reverses a string without using built-in reverse methods.",
      code: "",
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
      ],
      answer: null
    },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
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
    await enterFullscreen();
    setExamStarted(true);
  };

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-xl">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Pre-Exam Check</h2>
              <p className="text-muted-foreground text-sm">
                This is a proctored exam. You must grant camera and microphone access, and the exam will run in fullscreen mode.
              </p>
            </div>
            
            <div className="space-y-3 bg-muted p-4 rounded-lg text-sm">
              <div className="flex items-center justify-between">
                <span>Webcam Access</span>
                {mediaError ? <span className="text-destructive">Blocked</span> : <span>Required</span>}
              </div>
              <div className="flex items-center justify-between">
                <span>Microphone Access</span>
                <span>Required</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fullscreen Mode</span>
                <span>Required</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tab Switching</span>
                <span className="text-destructive">Prohibited</span>
              </div>
            </div>

            {mediaError && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded border border-destructive/20">
                {mediaError}
              </div>
            )}

            <Button onClick={handleStartExam} className="w-full" size="lg">
              <Play className="mr-2 h-4 w-4" />
              Start Exam & Enable Monitoring
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isFullscreen && (
        <div className="bg-destructive text-destructive-foreground px-4 py-2 flex items-center justify-center gap-2 font-medium z-[60]">
          <AlertTriangle className="h-5 w-5" />
          You have exited fullscreen! This is a violation. Please return to fullscreen.
          <Button size="sm" variant="outline" className="ml-4 text-destructive bg-white hover:bg-gray-100" onClick={() => enterFullscreen()}>
            <Maximize className="mr-2 h-4 w-4" />
            Return to Fullscreen
          </Button>
        </div>
      )}
      
      {!isVisible && (
         <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md p-6 bg-card rounded-xl border shadow-2xl">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-xl font-bold text-destructive">Focus Lost</h2>
              <p>You have switched tabs or minimized the browser. This action has been recorded.</p>
              <p className="text-sm text-muted-foreground">Violation count: {visibilityViolations}</p>
            </div>
         </div>
      )}

      <header className="h-16 border-b bg-card/80 backdrop-blur-lg flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="font-semibold text-lg">Advanced JavaScript Exam</div>
          <Badge variant="outline">Level B Certification</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20">
            <Clock className="h-4 w-4 text-destructive" />
            <span className="font-mono font-semibold text-destructive">{formatTime(timeRemaining)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${isRecording ? 'bg-green-500/10 border-green-500/20' : 'bg-destructive/10 border-destructive/20'}`}>
              <Camera className={`h-4 w-4 ${isRecording ? 'text-green-500' : 'text-destructive'}`} />
              <span className={`text-xs ${isRecording ? 'text-green-500' : 'text-destructive'}`}>Camera</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${isRecording ? 'bg-green-500/10 border-green-500/20' : 'bg-destructive/10 border-destructive/20'}`}>
              <Mic className={`h-4 w-4 ${isRecording ? 'text-green-500' : 'text-destructive'}`} />
              <span className={`text-xs ${isRecording ? 'text-green-500' : 'text-destructive'}`}>Mic</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-card/50 p-4">
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Question Progress</div>
            <Progress value={(currentQuestion + 1) / questions.length * 100} className="h-2 mb-1" />
            <div className="text-xs text-muted-foreground">{currentQuestion + 1} of {questions.length}</div>
          </div>
          <div className="mb-4">
            <div className="text-sm font-medium mb-3">Question Navigator</div>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`
                    h-10 w-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-all
                    ${i === currentQuestion ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}
                  `}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          <Card className={`${(visibilityViolations > 0 || fullscreenViolations > 0) ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/50 border-border/50'}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${(visibilityViolations > 0 || fullscreenViolations > 0) ? 'text-destructive' : 'text-muted-foreground'}`} />
                <div>
                  <div className="text-sm font-medium mb-1">Monitoring Status</div>
                  <ul className="text-xs space-y-1">
                    <li className="text-muted-foreground">• Tab switches: <span className={visibilityViolations > 0 ? "text-destructive font-bold" : ""}>{visibilityViolations}</span></li>
                    <li className="text-muted-foreground">• Fullscreen exits: <span className={fullscreenViolations > 0 ? "text-destructive font-bold" : ""}>{fullscreenViolations}</span></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Question {currentQuestion + 1}</h2>
                <Button variant="ghost" size="sm">
                  <Flag className="mr-2 h-4 w-4" />
                  Flag for Review
                </Button>
              </div>
              <Card className="shadow-sm">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <p className="text-lg mb-8 font-medium">{questions[currentQuestion].question}</p>

                    {questions[currentQuestion].type === "mcq" && (
                      <RadioGroup className="space-y-3">
                        {questions[currentQuestion].options?.map((option, i) => (
                          <div key={i} className="flex items-center space-x-3 p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value={option} id={`option-${i}`} />
                            <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer text-base">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {questions[currentQuestion].type === "code" && (
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-2 block">Your Code:</Label>
                          <Textarea
                            placeholder="// Write your code here..."
                            className="font-mono min-h-[300px] bg-muted/50 text-sm"
                            defaultValue={questions[currentQuestion].code}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Code will be syntax-checked before submission</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                size="lg"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm font-medium text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              {currentQuestion < questions.length - 1 ? (
                <Button onClick={() => setCurrentQuestion(currentQuestion + 1)} size="lg">
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="bg-primary hover:bg-primary/90" size="lg">
                  Submit Exam
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </main>

        <aside className="w-80 border-l bg-card/50 p-4">
          <div className="mb-6">
            <div className="text-sm font-medium mb-3 flex items-center justify-between">
              Proctoring Feed
              {isRecording && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
            </div>
            <div className="aspect-video bg-black rounded-lg border overflow-hidden mb-2 relative shadow-inner">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
              {!isRecording && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/80 backdrop-blur-sm">
                  <Camera className="h-8 w-8 mb-2" />
                  <span className="text-xs font-medium">Camera off</span>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
              <Badge variant={isRecording ? "default" : "destructive"} className="text-[10px] h-4">
                {isRecording ? "ACTIVE" : "INACTIVE"}
              </Badge>
              Face detection and audio monitoring running
            </div>
          </div>

          <Card className="mb-4 bg-muted/30">
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-3">Exam Rules</div>
              <ul className="text-xs text-muted-foreground space-y-2.5">
                <li className="flex gap-2"><div className="text-primary">•</div> Keep your face visible at all times</li>
                <li className="flex gap-2"><div className="text-primary">•</div> No external resources allowed</li>
                <li className="flex gap-2"><div className="text-primary">•</div> Stay in fullscreen mode</li>
                <li className="flex gap-2"><div className="text-primary">•</div> Do not switch tabs</li>
                <li className="flex gap-2"><div className="text-primary">•</div> Submit before time expires</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-3">Exam Info</div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-primary/10 pb-2">
                  <span className="text-muted-foreground">Total Questions:</span>
                  <span className="font-semibold">{questions.length}</span>
                </div>
                <div className="flex justify-between border-b border-primary/10 pb-2">
                  <span className="text-muted-foreground">Answered:</span>
                  <span className="font-semibold text-primary">0</span>
                </div>
                <div className="flex justify-between border-b border-primary/10 pb-2">
                  <span className="text-muted-foreground">Flagged:</span>
                  <span className="font-semibold text-amber-500">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Passing Score:</span>
                  <span className="font-semibold">70%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
