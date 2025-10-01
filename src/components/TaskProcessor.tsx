import React, { useState } from 'react';
import { Plus, Calendar, Clock, User, Tag, Folder, Zap, AlertCircle, CheckCircle, XCircle, Edit3, Trash2 } from 'lucide-react';
import { Task, Person } from '../types';

interface TaskProcessorProps {
  tasks: Task[];
  people: Person[];
  onAddTask: (task: Omit<Task, 'id' | 'appliedProperties' | 'appliedRules'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskProcessor: React.FC<TaskProcessorProps> = ({ 
  tasks, 
  people,
  onAddTask, 
  onUpdateTask, 
  onDeleteTask 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    dueTime: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    status: 'Pending' as 'Pending' | 'In Progress' | 'Completed' | 'Cancelled',
    estimatedDuration: '',
    category: '',
    tags: [] as string[],
    scheduledFor: '',
    originalProperties: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      onAddTask(newTask);
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        dueTime: '',
        priority: 'Medium',
        status: 'Pending',
        estimatedDuration: '',
        category: '',
        tags: [],
        scheduledFor: '',
        originalProperties: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateTask = (taskId: string, field: string, value: any) => {
    onUpdateTask(taskId, { 
      [field]: value,
      updatedAt: new Date().toISOString()
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-200 text-red-900 border-red-300';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'in progress': return <Clock className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      case 'pending': return <AlertCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getPropertyIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'project': return <Folder className="h-3 w-3" />;
      case 'assignee': return <User className="h-3 w-3" />;
      case 'time': return <Clock className="h-3 w-3" />;
      case 'priority': return <Zap className="h-3 w-3" />;
      case 'label': return <Tag className="h-3 w-3" />;
      default: return <Tag className="h-3 w-3" />;
    }
  };

  const formatDateTime = (date?: string, time?: string) => {
    if (!date) return null;
    
    try {
      const dateObj = new Date(date);
      const dateStr = dateObj.toLocaleDateString();
      return time ? `${dateStr} at ${time}` : dateStr;
    } catch {
      return date;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Management Section */}
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Task Processing</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </button>
        </div>

        {showAddForm && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter task title..."
                />
              </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={2}
                placeholder="Enter task description..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select person...</option>
                  {people.map(person => (
                    <option key={person.id} value={person.name}>
                      {person.name} {person.role && `(${person.role})`}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Time
                </label>
                <input
                  type="time"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Development, Marketing"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={newTask.estimatedDuration}
                  onChange={(e) => setNewTask({ ...newTask, estimatedDuration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 2 hours, 30 minutes"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={newTask.tags.join(', ')}
                onChange={(e) => setNewTask({ ...newTask, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., urgent, client-work, review"
              />
            </div>
            
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
              >
                Add Task
              </button>
            </div>
            </div>
          </div>
        )}

          <div className="space-y-4">
          {tasks.map((task) => (
              <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{task.title}</h4>
                      {task.priority && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          <Zap className="h-3 w-3 mr-1" />
                          {task.priority}
                        </span>
                      )}
                      {task.status && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1">{task.status}</span>
                        </span>
                      )}
                    </div>
                    
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  )}
                    
                    <div className="space-y-1">
                      {task.assignedTo && (
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>Assigned to: <strong>{task.assignedTo}</strong></span>
                        </div>
                      )}
                      
                      {(task.dueDate || task.dueTime) && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Due: <strong>{formatDateTime(task.dueDate, task.dueTime)}</strong></span>
                        </div>
                      )}
                      
                      {task.estimatedDuration && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Duration: <strong>{task.estimatedDuration}</strong></span>
                        </div>
                      )}
                      
                      {task.category && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Folder className="h-4 w-4 mr-2" />
                          <span>Category: <strong>{task.category}</strong></span>
                        </div>
                      )}
                    </div>
                    
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingTask(editingTask === task.id ? null : task.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit task"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {editingTask === task.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={task.status || 'Pending'}
                          onChange={(e) => handleUpdateTask(task.id, 'status', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          value={task.priority || 'Medium'}
                          onChange={(e) => handleUpdateTask(task.id, 'priority', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Assigned To</label>
                      <select
                        value={task.assignedTo || ''}
                        onChange={(e) => handleUpdateTask(task.id, 'assignedTo', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Unassigned</option>
                        {people.map(person => (
                          <option key={person.id} value={person.name}>
                            {person.name} {person.role && `(${person.role})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {task.appliedRules.length > 0 && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {task.appliedRules.length} rule{task.appliedRules.length !== 1 ? 's' : ''} applied
                    </span>
                  </div>
                )}

                {Object.keys(task.appliedProperties).length > 0 && (
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Applied Properties:</h5>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(task.appliedProperties).map(([key, value]) => (
                        <span
                          key={key}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            key === 'priority' ? getPriorityColor(String(value)) : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {getPropertyIcon(key)}
                          <span className="ml-1">{key}: {String(value)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No tasks yet. Add your first task to see the AI agent in action!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* People Management Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <span className="text-sm text-gray-500">{people.length} people</span>
          </div>
          
          <div className="space-y-3">
            {people.map((person) => (
              <div key={person.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{person.name}</h4>
                    {person.role && (
                      <p className="text-sm text-gray-600">{person.role}</p>
                    )}
                    {person.department && (
                      <p className="text-xs text-gray-500">{person.department}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {person.email && (
                      <p className="text-sm text-blue-600">{person.email}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {tasks.filter(task => task.assignedTo === person.name).length} tasks assigned
                    </p>
                  </div>
                </div>
                
                {person.availability && person.availability.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">Availability:</p>
                    <div className="flex flex-wrap gap-1">
                      {person.availability.map((time, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {people.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No team members yet. Upload a file with people data to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Task Analytics */}
      {tasks.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => t.status === 'Completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {tasks.filter(t => t.status === 'In Progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {tasks.filter(t => t.status === 'Pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {tasks.filter(t => t.priority === 'Critical' || t.priority === 'High').length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};