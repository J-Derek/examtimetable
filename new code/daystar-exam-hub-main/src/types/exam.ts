export interface Exam {
  courseCode: string;
  venue: string;
  date: string;
  time: string;
  campus?: string;
}

export interface GroupedExams {
  date: string;
  formattedDate: string;
  exams: Exam[];
}
