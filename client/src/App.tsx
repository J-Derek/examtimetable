import { useState, useEffect } from 'react';
import type { Exam } from './types';

function App() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/timetable')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(data => {
        setExams(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load timetable. Please try again later.');
        setLoading(false);
      });
  }, []);

  const filteredExams = exams.filter(exam => {
    const query = search.toLowerCase();
    return (
      exam.courseCode.toLowerCase().includes(query) ||
      exam.venue.toLowerCase().includes(query)
    );
  });

  // Sort chronologically (simple string sort for now, can be improved)
  // The date format is "DAY DD/MM/YY", so string sort works roughly if year is same
  // But better to parse if needed. For now, let's just display as is.

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-900">
          Daystar Timetable
        </h1>

        {/* Search Input */}
        <div className="mb-6 sticky top-4 z-10">
          <input
            type="text"
            placeholder="Search Course Code (e.g. MAT120A)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 rounded-xl shadow-lg border-2 border-blue-100 focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>

        {/* Content */}
        {loading && <p className="text-center text-gray-500">Loading timetable...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="space-y-4">
            {filteredExams.length === 0 ? (
              <p className="text-center text-gray-500">No exams found.</p>
            ) : (
              filteredExams.map((exam, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {exam.date}
                    </span>
                    <span className="text-sm text-gray-500">{exam.time}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {exam.courseCode}
                  </h2>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {exam.venue}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
