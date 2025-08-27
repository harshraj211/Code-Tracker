"use client";

import React, { useState, useMemo } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TrackerSidebar } from '@/components/TrackerSidebar';
import { Dashboard } from '@/components/Dashboard';
import type { Subject, Task } from '@/lib/types';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { format } from 'date-fns';

const initialSubjects: Subject[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algo',
    topics: [
      { id: 'dsa-arrays', name: 'Arrays' },
      { id: 'dsa-ll', name: 'Linked List' },
      { id: 'dsa-graphs', name: 'Graphs' },
    ],
  },
  {
    id: 'webdev',
    name: 'Web Development',
    topics: [
      { id: 'webdev-react', name: 'React' },
      { id: 'webdev-next', name: 'Next.js' },
      { id: 'webdev-css', name: 'CSS' },
    ],
  },
  {
    id: 'python',
    name: 'Python',
    topics: [
        {id: 'python-basics', name: 'Basics'},
        {id: 'python-django', name: 'Django'},
    ]
  }
];

export function CodeTracker() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', initialSubjects);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(initialSubjects[0]?.id || null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const activeSubject = useMemo(() => subjects.find(s => s.id === activeSubjectId), [subjects, activeSubjectId]);

  const addSubject = (name: string) => {
    const newSubject: Subject = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      topics: [],
    };
    setSubjects([...subjects, newSubject]);
    if (!activeSubjectId) {
      setActiveSubjectId(newSubject.id);
    }
  };

  const addTask = (text: string, subjectId: string, topicId?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      date: format(selectedDate, 'yyyy-MM-dd'),
      subjectId,
      topicId,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const addTopic = (subjectId: string, topicName: string) => {
    const newTopic = { id: crypto.randomUUID(), name: topicName };
    setSubjects(subjects.map(s => {
      if (s.id === subjectId) {
        return { ...s, topics: [...s.topics, newTopic] };
      }
      return s;
    }));
  };

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
