"use client";

import React, { useState } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Subject } from '@/lib/types';
import { PlusCircle, Code } from 'lucide-react';

interface TrackerSidebarProps {
  subjects: Subject[];
  activeSubjectId: string | null;
  setActiveSubjectId: (id: string | null) => void;
  addSubject: (name: string) => void;
}

export function TrackerSidebar({ subjects, activeSubjectId, setActiveSubjectId, addSubject }: TrackerSidebarProps) {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      addSubject(newSubjectName.trim());
      setNewSubjectName('');
      setIsDialogOpen(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-primary"
            >
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z" />
                <path d="M15 2v20" />
                <path d="M8 7h4" />
                <path d="M8 12h4" />
                <path d="M8 17h4" />
            </svg>
          <h1 className="text-xl font-semibold">CodeTracker</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
          <SidebarMenu>
            {subjects.map((subject, index) =>
              subject.isCategory ? (
                <React.Fragment key={subject.id}>
                  {index > 0 && <SidebarSeparator className="my-2" />}
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                    {subject.name}
                  </div>
                </React.Fragment>
              ) : (
                <SidebarMenuItem key={subject.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSubjectId(subject.id)}
                    isActive={activeSubjectId === subject.id}
                    className="justify-start"
                  >
                    <Code className="w-4 h-4" />
                    <span>{subject.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. System Design"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddSubject}>Create Subject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
