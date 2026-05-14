import { useState } from "react";
import { Camera, Mic, Clock, AlertTriangle, ChevronLeft, ChevronRight, Flag, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";

export default function ExamInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining] = useState(3600);

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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <Camera className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500">Recording</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <Mic className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500">Listening</span>
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
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium mb-1">Anti-Cheat Active</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Webcam monitoring</li>
                    <li>• Audio detection</li>
                    <li>• Tab switching tracked</li>
                    <li>• Screen recording</li>
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
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <p className="text-lg mb-6">{questions[currentQuestion].question}</p>

                    {questions[currentQuestion].type === "mcq" && (
                      <RadioGroup>
                        {questions[currentQuestion].options?.map((option, i) => (
                          <div key={i} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                            <RadioGroupItem value={option} id={`option-${i}`} />
                            <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer">
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
                            className="font-mono min-h-[300px] bg-muted/50"
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
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              {currentQuestion < questions.length - 1 ? (
                <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  Submit Exam
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </main>

        <aside className="w-80 border-l bg-card/50 p-4">
          <div className="mb-4">
            <div className="text-sm font-medium mb-3">Proctoring Feed</div>
            <div className="aspect-video bg-muted rounded-lg border overflow-hidden mb-2">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Camera className="h-8 w-8" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Webcam monitoring active
            </div>
          </div>

          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-3">Exam Rules</div>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li>✓ Keep your face visible at all times</li>
                <li>✓ No external resources allowed</li>
                <li>✓ Stay in fullscreen mode</li>
                <li>✓ No communication with others</li>
                <li>✓ Submit before time expires</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-2">Exam Info</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Questions:</span>
                  <span className="font-medium">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Answered:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flagged:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Passing Score:</span>
                  <span className="font-medium">70%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
