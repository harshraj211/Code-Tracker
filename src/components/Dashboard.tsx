"use client";

import React from 'react';
import type { Subject, Task } from '@/lib/types';
import { CalendarView } from './CalendarView';
import { TaskList } from './TaskList';
import { StreakCounter } from './StreakCounter';
import { ThemeToggle } from './ThemeToggle';
import { ProgressChart } from './ProgressChart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SidebarInset, SidebarTrigger } from './ui/sidebar';

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

  return (
    <SidebarInset className="flex-1 p-4 md:p-6 lg:p-8 bg-secondary/40">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{activeSubject?.name || 'CodeTracker'}</h1>
        </div>
        <div className="flex items-center gap-4">
          {activeSubject && <StreakCounter tasks={tasks} subjectId={activeSubject.id} />}
          <ThemeToggle />
        </div>
      </header>
      
      {!activeSubject ? (
         <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
            <div className="text-center bg-background p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-2">Welcome to CodeTracker</h2>
                <p className="text-muted-foreground">Select a subject from the sidebar to start tracking your progress.</p>
            </div>
         </div>
      ) : (
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            <aside className="space-y-6 lg:col-span-1">
            <Card className="shadow-sm">
                <CardHeader>
                <CardTitle className="text-xl">Calendar</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                <CalendarView
                    tasks={tasks}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    subjectId={activeSubject.id}
                />
                </CardContent>
            </Card>
            
            <Card className="shadow-sm">
                <CardHeader>
                <CardTitle className="text-xl">Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                <ProgressChart tasks={tasks} subjectId={activeSubject.id} />
                </CardContent>
            </Card>
            </aside>
        </main>
      )}

    </SidebarInset>
  );
}
