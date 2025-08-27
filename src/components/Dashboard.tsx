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
import { CheckCircle, ListPlus, Flame, LogIn } from 'lucide-react';
import { useAuth } from './providers/auth-provider';
import { Button } from './ui/button';
import Link from 'next/link';

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
  const { user } = useAuth();

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
      
      {!user ? (
        <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Welcome to CodeTracker!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-8">Sign in to save your progress and track your coding journey across devices.</p>
              <Link href="/login" passHref>
                <Button className="w-full">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : !activeSubject ? (
         <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
            <Card className="w-full max-w-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">Welcome to CodeTracker!</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-8">Your personal dashboard to build a consistent coding habit.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background">
                    <ListPlus className="h-10 w-10 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Step 1: Add a Subject</h3>
                    <p className="text-sm text-muted-foreground">Use the sidebar to create a tracker for any language or topic.</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background">
                    <CheckCircle className="h-10 w-10 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Step 2: Track Daily Tasks</h3>
                    <p className="text-sm text-muted-foreground">Add and complete tasks for each day to log your progress.</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background">
                    <Flame className="h-10 w-10 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Step 3: Build a Streak</h3>
                    <p className="text-sm text-muted-foreground">Stay consistent to build a daily learning streak for each subject.</p>
                  </div>
                </div>
                <p className="mt-8 text-muted-foreground">Select a subject from the sidebar to get started!</p>
              </CardContent>
            </Card>
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
