"use client";

import React, { useMemo } from 'react';
import type { Task } from '@/lib/types';
import { format, subDays, differenceInCalendarDays } from 'date-fns';
import { Flame } from 'lucide-react';
import { Badge } from './ui/badge';

interface StreakCounterProps {
  tasks: Task[];
}

export function StreakCounter({ tasks }: StreakCounterProps) {
  const streak = useMemo(() => {
    if (tasks.length === 0) return 0;

    const completedDates = new Set<string>();
    tasks.forEach(task => {
      if (task.completed) {
        completedDates.add(task.date);
      }
    });

    if (completedDates.size === 0) return 0;
    
    let currentStreak = 0;
    let today = new Date();

    if(completedDates.has(format(today, 'yyyy-MM-dd'))) {
        currentStreak = 1;
    } else if (completedDates.has(format(subDays(today, 1), 'yyyy-MM-dd'))) {
        currentStreak = 1;
        today = subDays(today, 1)
    } else {
        return 0;
    }
    
    let currentDate = subDays(today, 1);
    while (completedDates.has(format(currentDate, 'yyyy-MM-dd'))) {
      currentStreak++;
      currentDate = subDays(currentDate, 1);
    }
    
    return currentStreak;
  }, [tasks]);

  return (
    <Badge variant={streak > 0 ? "default" : "secondary"} className="py-2 px-3">
      <Flame className={`h-5 w-5 mr-2 ${streak > 0 ? 'text-orange-400' : 'text-muted-foreground'}`} />
      <span className="font-bold text-lg">{streak}</span>
      <span className="ml-1 text-sm">day streak</span>
    </Badge>
  );
}
