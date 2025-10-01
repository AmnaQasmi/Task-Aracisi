export interface Rule {
  id: string;
  if: string;
  then: {
    project?: string;
    assignee?: string;
    time?: string;
    priority?: 'Low' | 'Medium' | 'High';
    label?: string;
    [key: string]: any;
  };
  enabled: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
  dueTime?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  status?: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  estimatedDuration?: string;
  category?: string;
  tags?: string[];
  scheduledFor?: string;
  originalProperties: Record<string, any>;
  appliedProperties: Record<string, any>;
  appliedRules: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RuleSet {
  rules: Rule[];
}

export interface Person {
  id: string;
  name: string;
  email?: string;
  role?: string;
  department?: string;
  availability?: string[];
}

export interface TaskAssignment {
  taskId: string;
  personId: string;
  assignedAt: string;
  assignedBy: string;
  notes?: string;
}