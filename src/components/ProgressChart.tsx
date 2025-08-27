"use client";

import React, { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { Task } from '@/lib/types';
import { subDays, format } from 'date-fns';

interface ProgressChartProps {
  tasks: Task[];
  subjectId: string;
}

export function ProgressChart({ tasks, subjectId }: ProgressChartProps) {
  const data = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
    
    const chartData = last7Days.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayTasks = tasks.filter(task => task.date === dateKey && task.subjectId === subjectId && task.completed);
      return {
        name: format(date, 'EEE'),
        completed: dayTasks.length,
      };
    });

    return chartData;
  }, [tasks, subjectId]);

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
          />
          <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
