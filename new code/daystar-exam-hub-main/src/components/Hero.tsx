import { useEffect, useState } from 'react';

export function Hero() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="pt-8 pb-6 px-4 text-center animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-daystar-navy tracking-tight">
          {greeting}, Student
        </h2>
        <p className="text-muted-foreground text-lg">
          Ready to check your exam schedule?
        </p>
      </div>
    </div>
  );
}
