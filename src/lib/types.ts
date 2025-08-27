import { z } from 'zod';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
  subjectId: string;
  topicId?: string;
}

export interface Topic {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
  isCategory?: boolean;
}

export const AuthFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

export type AuthFormValues = z.infer<typeof AuthFormSchema>;
