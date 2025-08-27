"use client";

import React, { useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { Task } from '@/lib/types';

interface CalendarViewProps {
  tasks: Task[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  subjectId: string;
}

export function CalendarView({ tasks, selectedDate, setSelectedDate, subjectId }: CalendarViewProps) {
  const completedDays = useMemo(() => {
    const dates = new Set<string>();
    tasks.forEach(task => {
      if (task.completed && task.subjectId === subjectId) {
        dates.add(task.date);
      }
    });
    return Array.from(dates).map(dateStr => new Date(dateStr + 'T00:00:00'));
  }, [tasks, subjectId]);
  
  const handleDayClick = (day: Date | undefined) => {
    if (day) {
        setSelectedDate(day);
    }
  }

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleDayClick}
      className="rounded-md"
      modifiers={{
        completed: completedDays,
      }}
      modifiersStyles={{
        completed: {
          color: 'hsl(var(--primary-foreground))',
          backgroundColor: 'hsl(var(--primary))',
        },
        selected: {
            backgroundColor: 'hsl(var(--accent))',
            color: 'hsl(var(--accent-foreground))'
        }
      }}
    />
  );
}

    