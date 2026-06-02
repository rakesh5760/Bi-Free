import { Check, History } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { PROJECT_STAGES, getStageIndex } from "../lib/ProjectProgressTracking";

interface ProjectTimelineProps {
  currentLevel: string;
  history: any[];
  layout?: "horizontal" | "vertical";
}

export function ProjectTimeline({ currentLevel, history, layout = "horizontal" }: ProjectTimelineProps) {
  const currentIdx = getStageIndex(currentLevel || "P0");

  const renderHorizontal = () => (
    <div className="relative pt-8 pb-4 overflow-x-auto custom-scrollbar">
      <div className="flex items-center min-w-max px-4">
        {PROJECT_STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={stage.code} className="flex flex-col items-center relative min-w-[140px]">
              {/* Connecting Line */}
              {idx > 0 && (
                <div className={`absolute left-[-50%] right-[50%] top-4 h-1 -z-10 transition-colors duration-500 ${isCompleted ? 'bg-indigo-500' : 'bg-border/50'}`} />
              )}
              
              {/* Node */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-300 ${
                isCurrent ? 'bg-indigo-600 border-indigo-200 ring-4 ring-indigo-500/20 scale-110' :
                isCompleted ? 'bg-indigo-500 border-transparent text-white' : 'bg-background border-border text-muted-foreground'
              }`}>
                {isCompleted && !isCurrent ? <Check className="w-4 h-4 font-bold" /> : <span className="text-[10px] font-bold">{stage.code}</span>}
              </div>
              
              <div className="mt-4 text-center">
                <div className={`text-xs font-bold leading-tight ${isCurrent ? 'text-indigo-500' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{stage.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderVertical = () => (
    <div className="relative py-2 pr-2 overflow-y-auto max-h-[300px] custom-scrollbar">
      <div className="flex flex-col space-y-0">
        {PROJECT_STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const isLast = idx === PROJECT_STAGES.length - 1;

          return (
            <div key={stage.code} className="flex items-start relative pb-6">
              {/* Connecting Vertical Line */}
              {!isLast && (
                <div className={`absolute left-[15px] top-8 bottom-[-8px] w-0.5 -z-10 transition-colors duration-500 ${idx < currentIdx ? 'bg-indigo-500' : 'bg-border/50'}`} />
              )}
              
              {/* Node */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border-2 z-10 transition-all duration-300 bg-background ${
                isCurrent ? 'bg-indigo-600 border-indigo-200 ring-4 ring-indigo-500/20 text-white' :
                isCompleted ? 'bg-indigo-500 border-transparent text-white' : 'border-border text-muted-foreground'
              }`}>
                {isCompleted && !isCurrent ? <Check className="w-4 h-4 font-bold" /> : <span className="text-[10px] font-bold">{stage.code}</span>}
              </div>
              
              <div className="ml-4 pt-1.5 flex flex-col justify-center">
                <div className={`text-sm font-bold ${isCurrent ? 'text-indigo-500' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{stage.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {layout === "horizontal" ? renderHorizontal() : renderVertical()}

      {history && history.length > 0 && (
        <div className="mt-6 border-t border-border/50 pt-6">
          <h4 className="text-sm font-bold flex items-center gap-2 mb-4 text-muted-foreground uppercase tracking-wider"><History className="w-4 h-4" /> Latest Updates</h4>
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {[...history].map((item: any) => (
              <div key={item.id} className="bg-muted/30 border border-border/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 font-bold">{item.progress_code}</Badge>
                    <span className="font-semibold">{item.progress_title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{new Date(item.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{item.mentor_note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
