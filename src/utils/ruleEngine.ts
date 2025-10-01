import { Rule, Task } from '../types';

export class RuleEngine {
  private rules: Rule[];

  constructor(rules: Rule[] = []) {
    this.rules = rules.filter(rule => rule.enabled);
  }

  public processTask(task: Task): Task {
    const processedTask = { ...task };
    processedTask.appliedProperties = { ...task.originalProperties };
    processedTask.appliedRules = [];

    for (const rule of this.rules) {
      if (this.evaluateCondition(rule.if, processedTask)) {
        // Apply the rule's "then" properties
        Object.assign(processedTask.appliedProperties, rule.then);
        processedTask.appliedRules.push(rule.id);
      }
    }

    return processedTask;
  }

  private evaluateCondition(condition: string, task: Task): boolean {
    const lowerCondition = condition.toLowerCase();
    const taskTitle = task.title.toLowerCase();
    const taskDescription = (task.description || '').toLowerCase();
    const taskAssignee = (task.assignedTo || '').toLowerCase();
    const taskCategory = (task.category || '').toLowerCase();
    const taskTags = (task.tags || []).map(tag => tag.toLowerCase());
    
    // Handle different condition patterns
    if (lowerCondition.includes('contains')) {
      const match = condition.match(/contains\s+['"]([^'"]+)['"]/i);
      if (match) {
        const searchTerm = match[1].toLowerCase();
        return taskTitle.includes(searchTerm) || 
               taskDescription.includes(searchTerm) ||
               taskAssignee.includes(searchTerm) ||
               taskCategory.includes(searchTerm) ||
               taskTags.some(tag => tag.includes(searchTerm));
      }
    }

    if (lowerCondition.includes('time is')) {
      const match = condition.match(/time is\s+['"]([^'"]+)['"]/i);
      if (match) {
        const timePattern = match[1].toLowerCase();
        return taskTitle.includes(timePattern) || taskDescription.includes(timePattern);
      }
    }

    if (lowerCondition.includes('scheduled for saturday or sunday')) {
      const dateToCheck = task.dueDate || task.scheduledFor;
      if (dateToCheck) {
        const date = new Date(dateToCheck);
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
      }
    }

    // Enhanced condition matching with priority and status
    if (lowerCondition.includes('priority is')) {
      const match = condition.match(/priority is\s+['"]([^'"]+)['"]/i);
      if (match) {
        const priorityPattern = match[1].toLowerCase();
        return (task.priority || '').toLowerCase() === priorityPattern;
      }
    }

    if (lowerCondition.includes('status is')) {
      const match = condition.match(/status is\s+['"]([^'"]+)['"]/i);
      if (match) {
        const statusPattern = match[1].toLowerCase();
        return (task.status || '').toLowerCase() === statusPattern;
      }
    }

    if (lowerCondition.includes('assigned to')) {
      const match = condition.match(/assigned to\s+['"]([^'"]+)['"]/i);
      if (match) {
        const assigneePattern = match[1].toLowerCase();
        return taskAssignee.includes(assigneePattern);
      }
    }

    if (lowerCondition.includes('due today')) {
      if (task.dueDate) {
        const today = new Date().toISOString().split('T')[0];
        return task.dueDate === today;
      }
    }

    if (lowerCondition.includes('overdue')) {
      if (task.dueDate) {
        const today = new Date().toISOString().split('T')[0];
        return task.dueDate < today && task.status !== 'Completed';
      }
    }

    if (lowerCondition.includes('involves calls, communication, or errands')) {
      const keywords = ['call', 'phone', 'email', 'message', 'text', 'communicate', 'errand', 'pickup', 'drop off'];
      return keywords.some(keyword => 
        taskTitle.includes(keyword) || taskDescription.includes(keyword)
      );
    }

    if (lowerCondition.includes('quick or under 15 minutes')) {
      const quickKeywords = ['quick', 'fast', 'brief', '5 min', '10 min', '15 min', 'short'];
      return quickKeywords.some(keyword => 
        taskTitle.includes(keyword) || taskDescription.includes(keyword)
      );
    }

    if (lowerCondition.includes('admin work, paperwork or coordination')) {
      const adminKeywords = ['admin', 'paperwork', 'coordinate', 'schedule', 'organize', 'plan', 'document', 'form'];
      return adminKeywords.some(keyword => 
        taskTitle.includes(keyword) || taskDescription.includes(keyword)
      );
    }

    if (lowerCondition.includes('grooming, meals, health or reflection')) {
      const healthKeywords = ['shower', 'brush', 'eat', 'meal', 'breakfast', 'lunch', 'dinner', 'exercise', 'workout', 'meditate', 'reflect'];
      return healthKeywords.some(keyword => 
        taskTitle.includes(keyword) || taskDescription.includes(keyword)
      );
    }

    if (lowerCondition.includes('learning, university, academia, research')) {
      const academicKeywords = ['study', 'learn', 'research', 'read', 'university', 'course', 'assignment', 'homework', 'exam'];
      return academicKeywords.some(keyword => 
        taskTitle.includes(keyword) || taskDescription.includes(keyword)
      );
    }

    if (lowerCondition.includes('team instructions or maintenance requests')) {
      const teamKeywords = ['team', 'instruct', 'delegate', 'assign', 'maintain', 'fix', 'repair', 'update'];
      return teamKeywords.some(keyword => 
        taskTitle.includes(keyword) || taskDescription.includes(keyword)
      );
    }

    return false;
  }

  public getTasksByAssignee(assignee: string): Task[] {
    return this.getAllTasks().filter(task => 
      task.assignedTo?.toLowerCase() === assignee.toLowerCase()
    );
  }

  public getTasksByPriority(priority: string): Task[] {
    return this.getAllTasks().filter(task => 
      task.priority?.toLowerCase() === priority.toLowerCase()
    );
  }

  public getTasksByStatus(status: string): Task[] {
    return this.getAllTasks().filter(task => 
      task.status?.toLowerCase() === status.toLowerCase()
    );
  }

  public getOverdueTasks(): Task[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getAllTasks().filter(task => 
      task.dueDate && task.dueDate < today && task.status !== 'Completed'
    );
  }

  private getAllTasks(): Task[] {
    // This would need to be injected or managed differently in a real implementation
    return [];
  }

  public addRule(rule: Rule): void {
    this.rules.push(rule);
  }

  public updateRule(ruleId: string, updatedRule: Partial<Rule>): void {
    const index = this.rules.findIndex(rule => rule.id === ruleId);
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updatedRule };
    }
  }

  public removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
  }

  public getRules(): Rule[] {
    return this.rules;
  }
}