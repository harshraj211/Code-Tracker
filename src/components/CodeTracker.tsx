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
    id: 'javascript',
    name: 'JavaScript',
    topics: [
      { id: 'js-vars', name: 'Variables & Data Types' },
      { id: 'js-functions', name: 'Functions' },
      { id: 'js-dom', name: 'DOM Manipulation' },
      { id: 'js-es6', name: 'ES6+ Features' },
      { id: 'js-async', name: 'Async/Await' },
      { id: 'js-objects', name: 'Objects and Prototypes' },
      { id: 'js-arrays', name: 'Array Methods' },
      { id: 'js-events', name: 'Event Handling' },
    ],
  },
  {
    id: 'css',
    name: 'CSS',
    topics: [
      { id: 'css-selectors', name: 'Selectors & Specificity' },
      { id: 'css-flexbox', name: 'Flexbox' },
      { id: 'css-grid', name: 'Grid' },
      { id: 'css-responsive', name: 'Responsive Design' },
      { id: 'css-animations', name: 'Animations & Transitions' },
      { id: 'css-vars', name: 'Custom Properties' },
      { id: 'css-pre', name: 'Pre-processors (Sass/Less)' },
    ],
  },
  {
    id: 'react',
    name: 'React',
    topics: [
      { id: 'react-components', name: 'Components & Props' },
      { id: 'react-state', name: 'State & Lifecycle' },
      { id: 'react-hooks', name: 'Hooks' },
      { id: 'react-context', name: 'Context API' },
      { id: 'react-router', name: 'React Router' },
      { id: 'react-performance', name: 'Performance Optimization' },
      { id: 'react-testing', name: 'Testing with Jest & RTL' },
    ],
  },
  {
    id: 'tailwind-css',
    name: 'Tailwind CSS',
    topics: [
        {id: 'tailwind-basics', name: 'Utility-First Basics'},
        {id: 'tailwind-responsive', name: 'Responsive Design'},
        {id: 'tailwind-theme', name: 'Customizing Theme'},
        {id: 'tailwind-plugins', name: 'Using Plugins'},
        {id: 'tailwind-jit', name: 'JIT Compilation'},
    ]
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algos',
    topics: [
      {id: 'dsa-arrays', name: 'Arrays & Strings'},
      {id: 'dsa-linked-lists', name: 'Linked Lists'},
      {id: 'dsa-stacks-queues', name: 'Stacks & Queues'},
      {id: 'dsa-trees', name: 'Trees (Binary, BST)'},
      {id: 'dsa-graphs', name: 'Graphs'},
      {id: 'dsa-heaps', name: 'Heaps & Priority Queues'},
      {id: 'dsa-sorting', name: 'Sorting Algorithms'},
      {id: 'dsa-searching', name: 'Searching Algorithms'},
      {id: 'dsa-dp', name: 'Dynamic Programming'},
    ]
  },
  {
    id: 'c-plus-plus',
    name: 'C++',
    topics: [
      {id: 'cpp-basics', name: 'Basics & Syntax'},
      {id: 'cpp-pointers', name: 'Pointers & Memory'},
      {id: 'cpp-oop', name: 'Object-Oriented Programming'},
      {id: 'cpp-stl', name: 'Standard Template Library (STL)'},
      {id: 'cpp-concurrency', name: 'Concurrency'},
    ]
  },
  {
    id: 'python',
    name: 'Python',
    topics: [
      {id: 'python-basics', name: 'Data Types & Variables'},
      {id: 'python-ds', name: 'Data Structures (Lists, Dicts)'},
      {id: 'python-functions', name: 'Functions & Lambdas'},
      {id: 'python-oop', name: 'Classes & Objects'},
      {id: 'python-modules', name: 'Modules & Packages'},
      {id: 'python-django', name: 'Django Framework'},
      {id: 'python-flask', name: 'Flask Framework'},
    ]
  },
  {
    id: 'java',
    name: 'Java',
    topics: [
      {id: 'java-basics', name: 'Core Concepts & JVM'},
      {id: 'java-oop', name: 'Object-Oriented Principles'},
      {id: 'java-collections', name: 'Collections Framework'},
      {id: 'java-concurrency', name: 'Multithreading'},
      {id: 'java-spring', name: 'Spring Framework'},
    ]
  },
  {
    id: 'linux',
    name: 'Linux',
    topics: [
      {id: 'linux-cli', name: 'Command Line Interface'},
      {id: 'linux-fs', name: 'File System & Permissions'},
      {id: 'linux-shell', name: 'Shell Scripting'},
      {id: 'linux-process', name: 'Process Management'},
      {id: 'linux-networking', name: 'Networking Tools'},
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    topics: [
      {id: 'cyber-netsec', name: 'Network Security'},
      {id: 'cyber-crypto', name: 'Cryptography'},
      {id: 'cyber-websec', name: 'Web App Security (OWASP)'},
      {id: 'cyber-pentest', name: 'Penetration Testing'},
      {id: 'cyber-forensics', name: 'Digital Forensics'},
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
