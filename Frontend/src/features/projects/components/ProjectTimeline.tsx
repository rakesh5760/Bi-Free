import { Check, History } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { PROJECT_STAGES, getStageIndex } from "../lib/ProjectProgressTracking";

interface ProjectTimelineProps {
  currentLevel: string;
  history: any[];
}

export function ProjectTimeline({ currentLevel, history }: ProjectTimelineProps) {
  const currentIdx = getStageIndex(currentLevel || "P0");

  return (
    <div className="w-full">
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

      {history && history.length > 0 && (
        <div className="mt-8 border-t border-border/50 pt-6">
          <h4 className="text-sm font-bold flex items-center gap-2 mb-4 text-muted-foreground uppercase tracking-wider"><History className="w-4 h-4" /> Latest Updates</h4>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
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
