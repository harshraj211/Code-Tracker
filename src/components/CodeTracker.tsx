"use client";

import React from 'react';
import { SidebarProvider, Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { TrackerSidebarContent } from '@/components/TrackerSidebar';
import { Dashboard } from '@/components/Dashboard';
import type { Subject, Task } from '@/lib/types';
import { Sheet, SheetContent } from '@/components/ui/sheet';

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
    <SidebarProvider>
       <Sheet>
        <div className="flex min-h-screen bg-background">
          <Sidebar>
            <SheetContent className="w-72 p-0">
              <TrackerSidebarContent
                subjects={subjects}
                activeSubjectId={activeSubjectId}
                setActiveSubjectId={setActiveSubjectId}
                addSubject={addSubject}
                isMobile={true}
              />
            </SheetContent>
            <div className="hidden md:flex">
              <TrackerSidebarContent
                subjects={subjects}
                activeSubjectId={activeSubjectId}
                setActiveSubjectId={setActiveSubjectId}
                addSubject={addSubject}
                isMobile={false}
              />
            </div>
          </Sidebar>
          <Dashboard
            key={activeSubjectId}
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
        </div>
      </Sheet>
    </SidebarProvider>
  );
}
