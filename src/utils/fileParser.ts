import { Rule, Task, Person } from '../types';

// Note: PDF parsing would require a server-side implementation in a real application
// For this demo, we'll simulate PDF text extraction
const simulatePDFExtraction = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // In a real implementation, you would use pdf-parse or similar library on the server
    setTimeout(() => {
      resolve(`
        Task Management Rules and Assignments
        
        Rule 1: If task contains "urgent" then priority = "High"
        Rule 2: If task assigned to "John" then department = "Engineering"
        Rule 3: If task due on weekend then priority = "Low"
        
        Tasks:
        - Review code changes (Assigned: Alice, Due: 2024-01-15, Time: 14:00)
        - Update documentation (Assigned: Bob, Due: 2024-01-16, Time: 10:00)
        - Client meeting preparation (Assigned: Carol, Due: 2024-01-17, Time: 09:00)
        
        People:
        - Alice Johnson (alice@company.com, Engineering)
        - Bob Smith (bob@company.com, Documentation)
        - Carol Davis (carol@company.com, Sales)
      `);
    }, 1000);
  });
};

export class FileParser {
  static async parseFile(file: File): Promise<{
    rules: Rule[];
    tasks: Task[];
    people: Person[];
    errors: string[];
  }> {
    const result = {
      rules: [] as Rule[],
      tasks: [] as Task[],
      people: [] as Person[],
      errors: [] as string[]
    };

    try {
      let content = '';
      
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        content = await file.text();
        return this.parseJSON(content, result);
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        content = await file.text();
        return this.parseCSV(content, result);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        content = await simulatePDFExtraction(file);
        return this.parsePDF(content, result);
      } else {
        result.errors.push('Unsupported file format. Please upload JSON, CSV, or PDF files.');
      }
    } catch (error) {
      result.errors.push(`Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  private static parseJSON(content: string, result: any) {
    try {
      const data = JSON.parse(content);
      
      // Parse rules
      if (data.rules && Array.isArray(data.rules)) {
        data.rules.forEach((rule: any, index: number) => {
          if (this.validateRule(rule)) {
            result.rules.push({
              id: rule.id || `rule-${Date.now()}-${index}`,
              if: rule.if,
              then: rule.then,
              enabled: rule.enabled !== false,
            });
          } else {
            result.errors.push(`Invalid rule at index ${index}`);
          }
        });
      }

      // Parse tasks
      if (data.tasks && Array.isArray(data.tasks)) {
        data.tasks.forEach((task: any, index: number) => {
          if (this.validateTask(task)) {
            result.tasks.push({
              id: task.id || `task-${Date.now()}-${index}`,
              title: task.title,
              description: task.description || '',
              assignedTo: task.assignedTo || task.assigned_to,
              dueDate: task.dueDate || task.due_date,
              dueTime: task.dueTime || task.due_time,
              priority: task.priority || 'Medium',
              status: task.status || 'Pending',
              estimatedDuration: task.estimatedDuration || task.estimated_duration,
              category: task.category,
              tags: Array.isArray(task.tags) ? task.tags : [],
              scheduledFor: task.scheduledFor || task.scheduled_for,
              originalProperties: task.originalProperties || {},
              appliedProperties: task.appliedProperties || {},
              appliedRules: task.appliedRules || [],
              createdAt: task.createdAt || new Date().toISOString(),
              updatedAt: task.updatedAt || new Date().toISOString(),
            });
          } else {
            result.errors.push(`Invalid task at index ${index}: missing required title`);
          }
        });
      }

      // Parse people
      if (data.people && Array.isArray(data.people)) {
        data.people.forEach((person: any, index: number) => {
          if (this.validatePerson(person)) {
            result.people.push({
              id: person.id || `person-${Date.now()}-${index}`,
              name: person.name,
              email: person.email,
              role: person.role,
              department: person.department,
              availability: Array.isArray(person.availability) ? person.availability : [],
            });
          } else {
            result.errors.push(`Invalid person at index ${index}: missing required name`);
          }
        });
      }

    } catch (error) {
      result.errors.push(`JSON parsing error: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
    }

    return result;
  }

  private static parseCSV(content: string, result: any) {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      result.errors.push('CSV file must have at least a header row and one data row');
      return result;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Detect CSV type based on headers
    if (headers.includes('if') && headers.includes('then')) {
      // Rules CSV
      this.parseRulesCSV(lines, headers, result);
    } else if (headers.includes('title') || headers.includes('task')) {
      // Tasks CSV
      this.parseTasksCSV(lines, headers, result);
    } else if (headers.includes('name') || headers.includes('person')) {
      // People CSV
      this.parsePeopleCSV(lines, headers, result);
    } else {
      result.errors.push('CSV format not recognized. Expected columns for rules (if, then), tasks (title, assigned_to, due_date), or people (name, email, role)');
    }

    return result;
  }

  private static parseRulesCSV(lines: string[], headers: string[], result: any) {
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length >= 2) {
        const rule: any = {
          id: `csv-rule-${Date.now()}-${i}`,
          if: values[0].replace(/['"]/g, ''),
          then: {},
          enabled: true,
        };

        // Parse the "then" part from remaining columns
        for (let j = 1; j < values.length && j < headers.length; j++) {
          const header = headers[j];
          const value = values[j].replace(/['"]/g, '');
          if (value && header !== 'if') {
            if (header === 'then' && value.startsWith('{')) {
              try {
                rule.then = JSON.parse(value);
              } catch {
                rule.then[header] = value;
              }
            } else {
              rule.then[header] = value;
            }
          }
        }

        result.rules.push(rule);
      }
    }
  }

  private static parseTasksCSV(lines: string[], headers: string[], result: any) {
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const task: any = {
        id: `csv-task-${Date.now()}-${i}`,
        title: '',
        originalProperties: {},
        appliedProperties: {},
        appliedRules: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      headers.forEach((header, index) => {
        if (index < values.length) {
          const value = values[index].replace(/['"]/g, '');
          switch (header) {
            case 'title':
            case 'task':
              task.title = value;
              break;
            case 'description':
              task.description = value;
              break;
            case 'assigned_to':
            case 'assignedto':
            case 'assignee':
              task.assignedTo = value;
              break;
            case 'due_date':
            case 'duedate':
              task.dueDate = value;
              break;
            case 'due_time':
            case 'duetime':
              task.dueTime = value;
              break;
            case 'priority':
              task.priority = value;
              break;
            case 'status':
              task.status = value;
              break;
            case 'category':
              task.category = value;
              break;
            case 'tags':
              task.tags = value.split(';').map((t: string) => t.trim());
              break;
            default:
              task.originalProperties[header] = value;
          }
        }
      });

      if (task.title) {
        result.tasks.push(task);
      }
    }
  }

  private static parsePeopleCSV(lines: string[], headers: string[], result: any) {
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const person: any = {
        id: `csv-person-${Date.now()}-${i}`,
        name: '',
      };

      headers.forEach((header, index) => {
        if (index < values.length) {
          const value = values[index].replace(/['"]/g, '');
          switch (header) {
            case 'name':
            case 'person':
              person.name = value;
              break;
            case 'email':
              person.email = value;
              break;
            case 'role':
              person.role = value;
              break;
            case 'department':
              person.department = value;
              break;
            case 'availability':
              person.availability = value.split(';').map((a: string) => a.trim());
              break;
          }
        }
      });

      if (person.name) {
        result.people.push(person);
      }
    }
  }

  private static parsePDF(content: string, result: any) {
    const lines = content.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Parse rules from PDF
      if (trimmedLine.startsWith('Rule') && trimmedLine.includes(':')) {
        const ruleMatch = trimmedLine.match(/Rule \d+: If (.+) then (.+)/i);
        if (ruleMatch) {
          const rule = {
            id: `pdf-rule-${Date.now()}-${Math.random()}`,
            if: ruleMatch[1],
            then: this.parseThenClause(ruleMatch[2]),
            enabled: true,
          };
          result.rules.push(rule);
        }
      }
      
      // Parse tasks from PDF
      if (trimmedLine.includes('Assigned:') && trimmedLine.includes('Due:')) {
        const taskMatch = trimmedLine.match(/^-?\s*(.+?)\s*\(Assigned:\s*(.+?),\s*Due:\s*(.+?),\s*Time:\s*(.+?)\)/);
        if (taskMatch) {
          const task = {
            id: `pdf-task-${Date.now()}-${Math.random()}`,
            title: taskMatch[1].trim(),
            assignedTo: taskMatch[2].trim(),
            dueDate: taskMatch[3].trim(),
            dueTime: taskMatch[4].trim(),
            originalProperties: {},
            appliedProperties: {},
            appliedRules: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          result.tasks.push(task);
        }
      }
      
      // Parse people from PDF
      if (trimmedLine.includes('@') && trimmedLine.includes('(')) {
        const personMatch = trimmedLine.match(/^-?\s*(.+?)\s*\((.+?),\s*(.+?)\)/);
        if (personMatch) {
          const person = {
            id: `pdf-person-${Date.now()}-${Math.random()}`,
            name: personMatch[1].trim(),
            email: personMatch[2].trim(),
            department: personMatch[3].trim(),
          };
          result.people.push(person);
        }
      }
    }

    return result;
  }

  private static parseThenClause(thenStr: string): Record<string, any> {
    const result: Record<string, any> = {};
    
    // Try to parse as key=value pairs
    const pairs = thenStr.split(',').map(p => p.trim());
    for (const pair of pairs) {
      const [key, value] = pair.split('=').map(p => p.trim().replace(/['"]/g, ''));
      if (key && value) {
        result[key] = value;
      }
    }
    
    // If no pairs found, treat as a single property
    if (Object.keys(result).length === 0) {
      result.property = thenStr;
    }
    
    return result;
  }

  private static parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  private static validateRule(rule: any): boolean {
    return rule && typeof rule.if === 'string' && rule.then && typeof rule.then === 'object';
  }

  private static validateTask(task: any): boolean {
    return task && typeof task.title === 'string' && task.title.trim().length > 0;
  }

  private static validatePerson(person: any): boolean {
    return person && typeof person.name === 'string' && person.name.trim().length > 0;
  }
}