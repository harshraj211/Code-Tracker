"use client";

import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TrackerSidebar } from '@/components/TrackerSidebar';
import { Dashboard } from '@/components/Dashboard';
import type { Subject, Task } from '@/lib/types';

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
      <div className="flex min-h-screen bg-background">
        <TrackerSidebar
          subjects={subjects}
          activeSubjectId={activeSubjectId}
          setActiveSubjectId={setActiveSubjectId}
          addSubject={addSubject}
        />
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
    </SidebarProvider>
  );
}
