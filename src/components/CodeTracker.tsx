"use client";

import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { TrackerSidebarContent } from '@/components/TrackerSidebar';
import { Dashboard } from '@/components/Dashboard';
import type { Subject, Task } from '@/lib/types';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from './ui/button';
import { PanelLeft } from 'lucide-react';

interface CodeTrackerProps {
  subjects: Subject[];
  activeSubject: Subject | undefined;
  tasks: Task[];
  selectedDate: Date;
  activeSubjectId: string | null;
  setSelectedDate: (date: Date) => void;
  setActiveSubjectId: (id: string | null) => void;
  addSubject: (name: string) => void;
  addTask: (text: string, subjectId: string, topicId?: string) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  addTopic: (subjectId: string, topicName: string) => void;
}

export function CodeTracker({
  subjects,
  activeSubject,
  tasks,
  selectedDate,
  activeSubjectId,
  setSelectedDate,
  setActiveSubjectId,
  addSubject,
  addTask,
  toggleTask,
  deleteTask,
  addTopic,
}: CodeTrackerProps) {
  
  return (
      <div className="flex min-h-screen bg-background">
          <Sidebar className="hidden md:flex md:flex-col">
            <TrackerSidebarContent
              subjects={subjects}
              activeSubjectId={activeSubjectId}
              setActiveSubjectId={setActiveSubjectId}
              addSubject={addSubject}
            />
          </Sidebar>
          
          <Sheet>
            <Dashboard
              subjects={subjects}
              activeSubject={activeSubject}
              tasks={tasks}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onAddTopic={addTopic}
            />
            <SheetContent side="left" className="w-72 p-0 md:hidden">
              <TrackerSidebarContent
                  subjects={subjects}
                  activeSubjectId={activeSubjectId}
                  setActiveSubjectId={setActiveSubjectId}
                  addSubject={addSubject}
                />
            </SheetContent>
          </Sheet>
      </div>
  );
}
