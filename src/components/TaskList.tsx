"use client";

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import type { Subject, Task } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TaskListProps {
  activeSubject: Subject;
  selectedDate: Date;
  tasks: Task[];
  onAddTask: (text: string, subjectId: string, topicId?: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTopic: (subjectId: string, topicName: string) => void;
}

export function TaskList({ activeSubject, selectedDate, tasks, onAddTask, onToggleTask, onDeleteTask, onAddTopic }: TaskListProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(undefined);

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  const dailyTasks = useMemo(() => {
    return tasks.filter(task => task.date === dateKey && task.subjectId === activeSubject.id);
  }, [tasks, dateKey, activeSubject.id]);

  const completedTasks = useMemo(() => {
    return dailyTasks.filter(task => task.completed).length;
  }, [dailyTasks]);

  const progress = dailyTasks.length > 0 ? (completedTasks / dailyTasks.length) * 100 : 0;

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim(), activeSubject.id, selectedTopicId);
      setNewTaskText('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-start'>
            <div>
                <CardTitle>Tasks for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
                <CardDescription>{completedTasks} of {dailyTasks.length} tasks completed.</CardDescription>
            </div>
            <div className='w-24'>
                <Progress value={progress} className="w-full" />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={e => setNewTaskText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            className="flex-grow"
          />
           <Select onValueChange={setSelectedTopicId} value={selectedTopicId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent>
              {activeSubject.topics.map(topic => (
                <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddTask}><Plus className="h-4 w-4 mr-2" />Add Task</Button>
        </div>

        <div className="space-y-3">
          {dailyTasks.length > 0 ? (
            dailyTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => onToggleTask(task.id)}
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`flex-grow text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                >
                  {task.text}
                </label>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDeleteTask(task.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tasks for today.</p>
              <p className="text-sm">Add one to get started!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
