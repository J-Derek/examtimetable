// Parse date string like "MONDAY 08/12/25" to a more readable format
export function formatExamDate(dateStr: string): string {
  const parts = dateStr.split(' ');
  if (parts.length < 2) return dateStr;

  const dayName = parts[0];
  const datePart = parts[1];

  // Parse date like "08/12/25"
  const [day, month, year] = datePart.split('/');

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthIndex = parseInt(month, 10) - 1;
  const monthName = months[monthIndex] || month;

  // Get ordinal suffix
  const dayNum = parseInt(day, 10);
  const suffix = getOrdinalSuffix(dayNum);

  // Format day name
  const shortDay = dayName.charAt(0) + dayName.slice(1).toLowerCase();

  return `${shortDay.slice(0, 3)} ${dayNum}${suffix} ${monthName}`;
}

export function formatExamTime(timeStr: string): string {
  // Convert "2:00PM-4:00PM" to "2:00 PM - 4:00 PM"
  return timeStr
    .replace(/(\d+:\d+)(AM|PM)/gi, '$1 $2')
    .replace('-', ' - ');
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export function getDayOfWeek(dateStr: string): string {
  const parts = dateStr.split(' ');
  if (parts.length < 1) return '';
  return parts[0].charAt(0) + parts[0].slice(1).toLowerCase();
}

export function sortByDate(a: string, b: string): number {
  // Parse dates like "MONDAY 08/12/25"
  const getDateValue = (dateStr: string): number => {
    const parts = dateStr.split(' ');
    if (parts.length < 2) return 0;
    const [day, month, year] = parts[1].split('/');
    return parseInt(`20${year}${month}${day}`, 10);
  };

  return getDateValue(a) - getDateValue(b);
}

export function isExamPast(dateStr: string, timeStr: string): boolean {
  try {
    // Parse date: "MONDAY 08/12/25" -> 2025-12-08
    const dateParts = dateStr.split(' ');
    if (dateParts.length < 2) return false;
    const [day, month, year] = dateParts[1].split('/');

    // Parse time: "2:00PM-4:00PM" -> 14:00
    // We use the END time to determine if it's "past" (optional, or start time?)
    // Let's use Start Time for now, or maybe End Time is safer.
    // Actually, usually "past" means the exam is over. Let's use End Time.
    const timeParts = timeStr.split('-');
    const endTimeStr = timeParts.length > 1 ? timeParts[1] : timeParts[0];

    const timeMatch = endTimeStr.match(/(\d+):(\d+)(AM|PM)/i);
    if (!timeMatch) return false;

    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const isPM = timeMatch[3].toUpperCase() === 'PM';

    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    const examDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), hours, minutes);

    return new Date() > examDate;
  } catch (e) {
    return false;
  }
}
