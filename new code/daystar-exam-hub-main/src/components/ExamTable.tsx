import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Exam } from "@/types/exam";
import { formatExamDate, formatExamTime, isExamPast } from "@/lib/dateUtils";
import { Star, Clock, AlertCircle, MapPin } from "lucide-react";

interface ExamTableProps {
    exams: Exam[];
    onToggleFavorite: (exam: Exam) => void;
    isFavorite: (exam: Exam) => boolean;
    conflicts?: Map<string, Set<string>> | Set<string>;
}

export function ExamTable({ exams, onToggleFavorite, isFavorite, conflicts }: ExamTableProps) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden animate-fade-in">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead>Course Code</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden md:table-cell">Time</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {exams.map((exam, index) => {
                        const isPast = isExamPast(exam.date, exam.time);
                        const isFav = isFavorite(exam);

                        // Handle both Set (old/simple) and Map (new/detailed) conflict types
                        let hasConflict = false;
                        let conflictingCourses: string[] = [];

                        if (conflicts instanceof Map) {
                            hasConflict = conflicts.has(exam.courseCode);
                            if (hasConflict) {
                                conflictingCourses = Array.from(conflicts.get(exam.courseCode) || []);
                            }
                        } else if (conflicts instanceof Set) {
                            hasConflict = conflicts.has(exam.courseCode);
                        }

                        return (
                            <TableRow
                                key={`${exam.courseCode}-${exam.date}-${exam.time}-${index}`}
                                className={`${isPast ? "opacity-60 bg-muted/20" : ""} ${hasConflict ? "bg-destructive/10 hover:bg-destructive/20" : ""}`}
                            >
                                <TableCell>
                                    {hasConflict ? (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold border border-destructive/20 animate-pulse cursor-help">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Conflict
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Conflicts with: {conflictingCourses.join(", ") || "Unknown"}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ) : isPast ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold border">
                                            <AlertCircle className="w-3 h-3" />
                                            Done
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                                            <Clock className="w-3 h-3" />
                                            Upcoming
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span className="text-base">{exam.courseCode}</span>
                                        {exam.campus && (
                                            <span className="text-[10px] text-muted-foreground uppercase">{exam.campus}</span>
                                        )}
                                        {/* Mobile only date/time */}
                                        <div className="md:hidden text-xs text-muted-foreground mt-1">
                                            {formatExamDate(exam.date)} • {formatExamTime(exam.time)}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-muted-foreground">
                                    {formatExamDate(exam.date)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-muted-foreground">
                                    {formatExamTime(exam.time)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="text-sm">{exam.venue}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <button
                                        onClick={() => onToggleFavorite(exam)}
                                        className={`p-2 rounded-lg transition-colors ${isFav
                                            ? "text-warning bg-warning/10"
                                            : "text-muted-foreground hover:bg-muted"
                                            }`}
                                    >
                                        <Star className={`w-4 h-4 ${isFav ? "fill-warning" : ""}`} />
                                    </button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
