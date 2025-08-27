"use client";

import React, { useMemo } from 'react';
import type { Task } from '@/lib/types';
import { differenceInCalendarDays, parseISO, startOfToday } from 'date-fns';
import { Flame } from 'lucide-react';
import { Badge } from './ui/badge';

interface StreakCounterProps {
  tasks: Task[];
  subjectId: string;
}

export function StreakCounter({ tasks, subjectId }: StreakCounterProps) {
  const streak = useMemo(() => {
    if (!tasks || tasks.length === 0) return 0;

    const subjectTasks = tasks.filter(task => task.subjectId === subjectId);

    const completedDates = [...new Set(
      subjectTasks.filter(task => task.completed).map(task => task.date)
    )].map(dateStr => parseISO(dateStr)).sort((a, b) => b.getTime() - a.getTime());

    if (completedDates.length === 0) return 0;

    const today = startOfToday();
    const mostRecentDate = completedDates[0];
    
    // If the last completed day is not today or yesterday, streak is 0
    if (differenceInCalendarDays(today, mostRecentDate) > 1) {
      return 0;
    }

    let currentStreak = 1;
    if (completedDates.length > 1) {
        for (let i = 0; i < completedDates.length - 1; i++) {
            const day = completedDates[i];
            const prevDay = completedDates[i+1];
            if (differenceInCalendarDays(day, prevDay) === 1) {
                currentStreak++;
            } else {
                break; // Found a gap in the streak
            }
        }
    }
    
    // If the most recent completion was yesterday, but also today, the streak is still valid.
    // If the most recent completion was yesterday, and not today, it's still valid.
    // The only time we need to add 1 is if it started yesterday and continues today.
    // The logic above already handles this.

    // A special case: if the only entry is yesterday, the streak is 1. The loop doesn't run. That is correct.
    // if the entries are today and yesterday, loop runs once, diff is 1, streak becomes 2. Correct.
    
    return currentStreak;
  }, [tasks, subjectId]);

  return (
    <Badge variant={streak > 0 ? "default" : "secondary"} className="py-2 px-3">
      <Flame className={`h-5 w-5 mr-2 ${streak > 0 ? 'text-orange-400' : 'text-muted-foreground'}`} />
      <span className="font-bold text-lg">{streak}</span>
      <span className="ml-1 text-sm">day streak</span>
    </Badge>
  );
}
