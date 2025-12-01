import { Exam } from "@/types/exam";
import { formatExamDate, formatExamTime, isExamPast } from "@/lib/dateUtils";
import { MapPin, Clock, Calendar, AlertCircle, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExamCardProps {
  exam: Exam;
  isFavorite: boolean;
  onToggleFavorite: (exam: Exam) => void;
  conflict?: string[]; // List of conflicting course codes
  isSoftConflict?: boolean;
}

export function ExamCard({ exam, isFavorite, onToggleFavorite, conflict, isSoftConflict }: ExamCardProps) {
  const isPast = isExamPast(exam.date, exam.time);
  const isToday = new Date(exam.date).toDateString() === new Date().toDateString();

  // Determine card status color
  let statusColor = "bg-daystar-navy"; // Default
  if (conflict && conflict.length > 0) statusColor = "bg-daystar-red";
  else if (isToday) statusColor = "bg-daystar-red";
  else if (isPast) statusColor = "bg-muted-foreground";

  return (
    <div
      className={`group relative flex flex-col sm:flex-row bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-border/50 ${isPast ? 'opacity-75 grayscale-[0.5]' : ''}`}
    >
      {/* Left Strip */}
      <div className={`h-2 sm:h-auto sm:w-3 ${statusColor} transition-colors duration-300`} />

      <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        {/* Course Info */}
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-daystar-navy tracking-tight">{exam.courseCode}</h3>
            {conflict && conflict.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="w-5 h-5 text-daystar-red animate-pulse" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Conflicts with: {conflict.join(", ")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {isSoftConflict && (
              <span className="text-xs bg-warning/20 text-warning-foreground px-2 py-0.5 rounded-full font-medium">
                Section?
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-daystar-blue" />
            <span className="font-medium text-foreground/80">{exam.venue}</span>
            {exam.campus && <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase">{exam.campus}</span>}
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex flex-row sm:flex-col gap-4 sm:gap-1 sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
          <div className="flex items-center sm:justify-end gap-2 text-daystar-navy font-medium">
            <Calendar className="w-4 h-4 text-daystar-blue sm:hidden" />
            {formatExamDate(exam.date)}
          </div>
          <div className="flex items-center sm:justify-end gap-2 text-muted-foreground text-sm">
            <Clock className="w-4 h-4 text-daystar-blue sm:hidden" />
            {formatExamTime(exam.time)}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onToggleFavorite(exam)}
          className={`absolute top-4 right-4 sm:static p-2 rounded-full transition-colors ${isFavorite
              ? "bg-yellow-100 text-yellow-500 hover:bg-yellow-200"
              : "bg-gray-100 text-gray-400 hover:bg-daystar-blue/10 hover:text-daystar-blue"
            }`}
        >
          <Star className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>
    </div>
  );
}
