"use client";

import React from 'react';
import type { Subject, Task } from '@/lib/types';
import { CalendarView } from './CalendarView';
import { TaskList } from './TaskList';
import { StreakCounter } from './StreakCounter';
import { ThemeToggle } from './ThemeToggle';
import { ProgressChart } from './ProgressChart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SidebarInset } from './ui/sidebar';

interface DashboardProps {
  subjects: Subject[];
  activeSubject: Subject | undefined;
  tasks: Task[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onAddTask: (text: string, subjectId: string, topicId?: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTopic: (subjectId: string, topicName: string) => void;
}

export function Dashboard({
  subjects,
  activeSubject,
  tasks,
  selectedDate,
  setSelectedDate,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddTopic
}: DashboardProps) {
  if (!activeSubject) {
    return (
      <SidebarInset className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Welcome to CodeTracker</h2>
          <p className="text-muted-foreground">Select a subject from the sidebar to start, or add a new one.</p>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset className="flex-1 p-4 md:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{activeSubject.name}</h1>
        <div className="flex items-center gap-4">
          <StreakCounter tasks={tasks} />
          <ThemeToggle />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <TaskList
                key={`${activeSubject.id}-${selectedDate.toISOString()}`}
                activeSubject={activeSubject}
                selectedDate={selectedDate}
                tasks={tasks}
                onAddTask={onAddTask}
                onToggleTask={onToggleTask}
                onDeleteTask={onDeleteTask}
                onAddTopic={onAddTopic}
              />
        </div>

        <div className="space-y-6 lg:col-start-3">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarView
                tasks={tasks}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                subjectId={activeSubject.id}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressChart tasks={tasks} subjectId={activeSubject.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
