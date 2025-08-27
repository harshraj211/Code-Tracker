"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TrackerSidebar } from '@/components/TrackerSidebar';
import { Dashboard } from '@/components/Dashboard';
import type { Subject, Task } from '@/lib/types';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocalStorage } from '@/hooks/use-local-storage';

const initialSubjects: Subject[] = [
  // Web Development
  { id: 'web-dev-category', name: 'Web Development', topics: [], isCategory: true },
  {
    id: 'html',
    name: 'HTML',
    topics: [
      { id: 'html-basics', name: 'Basics & Structure' },
      { id: 'html-forms', name: 'Forms & Inputs' },
      { id: 'html-media', name: 'Media Elements' },
      { id: 'html-apis', name: 'HTML5 APIs' },
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
    ],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    topics: [
      { id: 'js-vars', name: 'Variables & Data Types' },
      { id: 'js-functions', name: 'Functions' },
      { id: 'js-dom', name: 'DOM Manipulation' },
      { id: 'js-async', name: 'Async/Await' },
    ],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    topics: [
        {id: 'ts-types', name: 'Basic Types'},
        {id: 'ts-interfaces', name: 'Interfaces'},
        {id: 'ts-generics', name: 'Generics'},
        {id: 'ts-decorators', name: 'Decorators'},
    ]
  },
  {
    id: 'php',
    name: 'PHP',
    topics: [
        {id: 'php-syntax', name: 'Basic Syntax'},
        {id: 'php-forms', name: 'Form Handling'},
        {id: 'php-sessions', name: 'Sessions & Cookies'},
        {id: 'php-mysql', name: 'MySQL Integration'},
    ]
  },
  {
    id: 'node-js',
    name: 'Node.js',
    topics: [
        {id: 'node-event-loop', name: 'Event Loop'},
        {id: 'node-fs', name: 'File System API'},
        {id: 'node-express', name: 'Express.js'},
        {id: 'node-modules', name: 'Modules'},
    ]
  },
  { id: 'asp-net', name: 'ASP.NET', topics: [] },
  { id: 'jsp', name: 'JSP', topics: [] },

  // Mobile Development
  { id: 'mobile-dev-category', name: 'Mobile Development', topics: [], isCategory: true },
  {
    id: 'java-android',
    name: 'Java (Android)',
    topics: [
      { id: 'java-android-activities', name: 'Activities & Lifecycles' },
      { id: 'java-android-ui', name: 'UI & Layouts' },
      { id: 'java-android-data', name: 'Data Storage' },
      { id: 'java-android-networking', name: 'Networking' },
    ]
  },
  {
    id: 'kotlin',
    name: 'Kotlin (Android)',
    topics: [
      { id: 'kotlin-coroutines', name: 'Coroutines' },
      { id: 'kotlin-jetpack', name: 'Jetpack Compose' },
      { id: 'kotlin-null', name: 'Null Safety' },
      { id: 'kotlin-delegation', name: 'Delegation' },
    ]
  },
  {
    id: 'swift',
    name: 'Swift (iOS)',
    topics: [
      { id: 'swift-uikit', name: 'UIKit Basics' },
      { id: 'swift-swiftui', name: 'SwiftUI' },
      { id: 'swift-data', name: 'Core Data' },
      { id: 'swift-concurrency', name: 'Concurrency' },
    ]
  },
  { id: 'objective-c', name: 'Objective-C (iOS)', topics: [] },
  {
    id: 'dart',
    name: 'Dart (Flutter)',
    topics: [
      { id: 'dart-widgets', name: 'Widgets' },
      { id: 'dart-state', name: 'State Management' },
      { id: 'dart-async', name: 'Futures & Streams' },
      { id: 'dart-ffi', name: 'FFI' },
    ]
  },
  {
    id: 'react-native',
    name: 'React Native',
    topics: [
      { id: 'rn-components', name: 'Core Components' },
      { id: 'rn-styling', name: 'Styling' },
      { id: 'rn-navigation', name: 'Navigation' },
      { id: 'rn-native-modules', name: 'Native Modules' },
    ]
  },

  // Systems Programming
  { id: 'systems-prog-category', name: 'Systems Programming', topics: [], isCategory: true },
  {
    id: 'c',
    name: 'C',
    topics: [
        {id: 'c-pointers', name: 'Pointers & Memory'},
        {id: 'c-structs', name: 'Structs & Unions'},
        {id: 'c-file-io', name: 'File I/O'},
        {id: 'c-preprocessor', name: 'Preprocessor'},
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
    ]
  },
  {
    id: 'rust',
    name: 'Rust',
    topics: [
        {id: 'rust-ownership', name: 'Ownership'},
        {id: 'rust-borrowing', name: 'Borrowing & Lifetimes'},
        {id: 'rust-concurrency', name: 'Concurrency'},
        {id: 'rust-macros', name: 'Macros'},
    ]
  },
  { id: 'zig', name: 'Zig', topics: [] },
  { id: 'd', name: 'D', topics: [] },
  { id: 'assembly', name: 'Assembly', topics: [] },

  // AI & Data Science
  { id: 'ai-ds-category', name: 'AI & Data Science', topics: [], isCategory: true },
  {
    id: 'python',
    name: 'Python',
    topics: [
      { id: 'python-ds', name: 'Data Structures' },
      { id: 'python-pandas', name: 'Pandas' },
      { id: 'python-numpy', name: 'NumPy' },
      { id: 'python-scikit', name: 'Scikit-learn' },
    ]
  },
  {
    id: 'r',
    name: 'R',
    topics: [
        {id: 'r-data-frames', name: 'Data Frames'},
        {id: 'r-ggplot2', name: 'ggplot2'},
        {id: 'r-dplyr', name: 'dplyr'},
        {id: 'r-shiny', name: 'Shiny'},
    ]
  },
  {
    id: 'julia',
    name: 'Julia',
    topics: [
        {id: 'julia-types', name: 'Types'},
        {id: 'julia-metaprogramming', name: 'Metaprogramming'},
        {id: 'julia-performance', name: 'Performance Tips'},
        {id: 'julia-parallel', name: 'Parallel Computing'},
    ]
  },
  { id: 'matlab', name: 'MATLAB', topics: [] },
  { id: 'sas', name: 'SAS', topics: [] },
  { id: 'spss', name: 'SPSS', topics: [] },
  { id: 'mojo-ai', name: 'Mojo', topics: [] },

   // Game Development
   { id: 'game-dev-category', name: 'Game Development', topics: [], isCategory: true },
   {
    id: 'c-sharp-unity',
    name: 'C# (Unity)',
    topics: [
      { id: 'csharp-unity-scripts', name: 'Scripting Basics' },
      { id: 'csharp-unity-physics', name: 'Physics' },
      { id: 'csharp-unity-ui', name: 'UI Development' },
      { id: 'csharp-unity-shaders', name: 'Shaders' },
    ]
  },
  { id: 'cpp-unreal', name: 'C++ (Unreal Engine)', topics: [] },
  {
    id: 'lua',
    name: 'Lua',
    topics: [
        {id: 'lua-tables', name: 'Tables'},
        {id: 'lua-coroutines', name: 'Coroutines'},
        {id: 'lua-embedding', name: 'Embedding with C'},
        {id: 'lua-metatables', name: 'Metatables'},
    ]
  },
  { id: 'js-games', name: 'JavaScript (Web games)', topics: [] },
  { id: 'gdscript', name: 'GDScript (Godot)', topics: [] },

  // Functional Programming
  { id: 'functional-prog-category', name: 'Functional Programming', topics: [], isCategory: true },
  { id: 'haskell', name: 'Haskell', topics: [] },
  { id: 'erlang', name: 'Erlang', topics: [] },
  { id: 'elixir', name: 'Elixir', topics: [] },
  { id: 'f-sharp', name: 'F#', topics: [] },
  { id: 'ocaml', name: 'OCaml', topics: [] },
  { id: 'scheme', name: 'Scheme', topics: [] },
  { id: 'racket', name: 'Racket', topics: [] },

  // Scripting & Automation
  { id: 'scripting-auto-category', name: 'Scripting & Automation', topics: [], isCategory: true },
  { id: 'python-script', name: 'Python', topics: [] },
  { id: 'perl', name: 'Perl', topics: [] },
  { id: 'ruby-script', name: 'Ruby', topics: [] },
  { id: 'lua-script', name: 'Lua', topics: [] },
  { id: 'shell', name: 'Shell (Bash, Zsh)', topics: [] },
  { id: 'tcl', name: 'Tcl', topics: [] },

  // Database Languages
  { id: 'db-lang-category', name: 'Database Languages', topics: [], isCategory: true },
  {
    id: 'sql',
    name: 'SQL',
    topics: [
        {id: 'sql-joins', name: 'JOINs'},
        {id: 'sql-subqueries', name: 'Subqueries'},
        {id: 'sql-aggregation', name: 'Aggregation Functions'},
        {id: 'sql-indexing', name: 'Indexing'},
    ]
  },
  { id: 'pl-sql', name: 'PL/SQL', topics: [] },
  { id: 't-sql', name: 'T-SQL', topics: [] },
  {
    id: 'graphql',
    name: 'GraphQL',
    topics: [
        {id: 'graphql-schema', name: 'Schema & Types'},
        {id: 'graphql-queries', name: 'Queries'},
        {id: 'graphql-mutations', name: 'Mutations'},
        {id: 'graphql-resolvers', name: 'Resolvers'},
    ]
  },
  
  // Statistical & Mathematical
  { id: 'stat-math-category', name: 'Statistical & Mathematical', topics: [], isCategory: true },
  { id: 'r-stat', name: 'R', topics: [] },
  { id: 'matlab-stat', name: 'MATLAB', topics: [] },
  { id: 'octave', name: 'Octave', topics: [] },

  // Hardware Description
  { id: 'hardware-desc-category', name: 'Hardware Description', topics: [], isCategory: true },
  { id: 'vhdl', name: 'VHDL', topics: [] },
  { id: 'verilog', name: 'Verilog', topics: [] },
  { id: 'systemverilog', name: 'SystemVerilog', topics: [] },

  // Cloud & Infrastructure
  { id: 'cloud-infra-category', name: 'Cloud & Infrastructure', topics: [], isCategory: true },
  {
    id: 'go',
    name: 'Go',
    topics: [
        {id: 'go-goroutines', name: 'Goroutines'},
        {id: 'go-channels', name: 'Channels'},
        {id: 'go-interfaces', name: 'Interfaces'},
        {id: 'go-http', name: 'net/http'},
    ]
  },
  { id: 'python-cloud', name: 'Python', topics: [] },
  { id: 'ruby-cloud', name: 'Ruby', topics: [] },
  {
    id: 'hcl',
    name: 'HCL (Terraform)',
    topics: [
        {id: 'hcl-providers', name: 'Providers'},
        {id: 'hcl-modules', name: 'Modules'},
        {id: 'hcl-state', name: 'State Management'},
        {id: 'hcl-functions', name: 'Functions'},
    ]
  },
  { id: 'yaml', name: 'YAML', topics: [] },

  // Legacy / Historical
  { id: 'legacy-hist-category', name: 'Legacy / Historical', topics: [], isCategory: true },
  { id: 'fortran', name: 'Fortran', topics: [] },
  { id: 'lisp', name: 'Lisp', topics: [] },
  { id: 'cobol', name: 'COBOL', topics: [] },
  { id: 'algol', name: 'ALGOL', topics: [] },
  { id: 'basic', name: 'BASIC', topics: [] },
  { id: 'pascal', name: 'Pascal', topics: [] },
  { id: 'ada', name: 'Ada', topics: [] },

  // Modern / Experimental
  { id: 'modern-exp-category', name: 'Modern / Experimental', topics: [], isCategory: true },
  { id: 'crystal', name: 'Crystal', topics: [] },
  { id: 'nim', name: 'Nim', topics: [] },
  { id: 'pony', name: 'Pony', topics: [] },
  { id: 'carbon', name: 'Carbon', topics: [] },
  { id: 'mojo-exp', name: 'Mojo', topics: [] },

  // Esoteric (Fun / Joke)
  { id: 'esoteric-category', name: 'Esoteric (Fun / Joke)', topics: [], isCategory: true },
  { id: 'brainfuck', name: 'Brainfuck', topics: [] },
  { id: 'whitespace', name: 'Whitespace', topics: [] },
  { id: 'lolcode', name: 'LOLCODE', topics: [] },
  { id: 'piet', name: 'Piet', topics: [] },
  { id: 'malbolge', name: 'Malbolge', topics: [] },

  // Other
  { id: 'other-category', name: 'Other', topics: [], isCategory: true },
  {
    id: 'dsa',
    name: 'Data Structures & Algos',
    topics: [
      {id: 'dsa-arrays', name: 'Arrays & Strings'},
      {id: 'dsa-linked-lists', name: 'Linked Lists'},
      {id: 'dsa-trees', name: 'Trees (Binary, BST)'},
      {id: 'dsa-graphs', name: 'Graphs'},
      {id: 'dsa-dp', name: 'Dynamic Programming'},
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
    ]
  }
];

export function CodeTracker() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', initialSubjects);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // On mobile, if a subject is active, we want to set it to null so the user has to re-select
    // which also causes the sidebar to close automatically. This is a bit of a hacky way to close the sidebar.
    if (isMobile) {
      setActiveSubjectId(null);
    }
  }, [isMobile]);

  const activeSubject = useMemo(() => subjects.find(s => s.id === activeSubjectId), [subjects, activeSubjectId]);
  
  const addSubject = (name: string) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name,
      topics: [],
    };
    setSubjects(prevSubjects => [...prevSubjects, newSubject]);
    setActiveSubjectId(newSubject.id);
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
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };
  
  const addTopic = (subjectId: string, topicName: string) => {
    setSubjects(prevSubjects =>
        prevSubjects.map(subject => {
            if(subject.id === subjectId && !subject.isCategory) {
                const newTopic = { id: crypto.randomUUID(), name: topicName };
                return { ...subject, topics: [...subject.topics, newTopic]};
            }
            return subject;
        })
    );
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
