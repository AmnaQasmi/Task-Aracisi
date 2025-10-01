import React, { useState, useEffect } from 'react';
import { Brain, Settings, Zap, FileText, Users } from 'lucide-react';
import { Rule, Task, Person } from './types';
import { RuleEngine } from './utils/ruleEngine';
import { FileUpload } from './components/FileUpload';
import { RuleEditor } from './components/RuleEditor';
import { TaskProcessor } from './components/TaskProcessor';
import { PeopleManager } from './components/PeopleManager';

function App() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [ruleEngine, setRuleEngine] = useState<RuleEngine>(new RuleEngine());
  const [activeTab, setActiveTab] = useState<'upload' | 'rules' | 'tasks' | 'people'>('upload');

  // Default rules from your example
  const defaultRules: Rule[] = [
    {
      id: 'rule-1',
      if: "task contains 'Adil'",
      then: { project: 'Delegated', assignee: 'Adil' },
      enabled: true,
    },
    {
      id: 'rule-2',
      if: "task time is 'morning'",
      then: { time: '07:00 - 11:00' },
      enabled: true,
    },
    {
      id: 'rule-3',
      if: "task time is 'afternoon'",
      then: { time: '13:00 - 17:00' },
      enabled: true,
    },
    {
      id: 'rule-4',
      if: "task time is 'evening'",
      then: { time: '17:00 - 20:00' },
      enabled: true,
    },
    {
      id: 'rule-5',
      if: "task time is 'night'",
      then: { time: '21:00 - 00:00' },
      enabled: true,
    },
    {
      id: 'rule-6',
      if: 'task scheduled for Saturday or Sunday',
      then: { priority: 'Low', project: 'Personal' },
      enabled: true,
    },
    {
      id: 'rule-7',
      if: 'task involves calls, communication, or errands',
      then: { label: '@Commute' },
      enabled: true,
    },
    {
      id: 'rule-8',
      if: 'task is quick or under 15 minutes',
      then: { label: '@Quick' },
      enabled: true,
    },
    {
      id: 'rule-9',
      if: 'task involves admin work, paperwork or coordination',
      then: { project: 'Professional', label: '@Admin' },
      enabled: true,
    },
    {
      id: 'rule-10',
      if: 'task includes grooming, meals, health or reflection',
      then: { project: 'Personal', label: '/Health' },
      enabled: true,
    },
    {
      id: 'rule-11',
      if: 'task includes learning, university, academia, research',
      then: { project: 'Personal', label: '/Academia' },
      enabled: true,
    },
    {
      id: 'rule-12',
      if: 'task includes team instructions or maintenance requests',
      then: { project: 'Delegated' },
      enabled: true,
    },
  ];

  useEffect(() => {
    // Initialize with default rules
    setRules(defaultRules);
    const engine = new RuleEngine(defaultRules);
    setRuleEngine(engine);
  }, []);

  useEffect(() => {
    const engine = new RuleEngine(rules);
    setRuleEngine(engine);
    
    // Reprocess all tasks when rules change
    setTasks(currentTasks => 
      currentTasks.map(task => engine.processTask({
        ...task,
        appliedProperties: { ...task.originalProperties },
        appliedRules: [],
      }))
    );
  }, [rules]);

  const handleRulesUploaded = (uploadedRules: Rule[]) => {
    setRules(prev => [...prev, ...uploadedRules]);
  };

  const handleTasksUploaded = (uploadedTasks: Task[]) => {
    const processedTasks = uploadedTasks.map(task => ruleEngine.processTask(task));
    setTasks(prev => [...prev, ...processedTasks]);
  };

  const handlePeopleUploaded = (uploadedPeople: Person[]) => {
    setPeople(prev => [...prev, ...uploadedPeople]);
  };

  const handleAddRule = (newRule: Omit<Rule, 'id'>) => {
    const rule: Rule = {
      ...newRule,
      id: `rule-${Date.now()}`,
    };
    setRules(prev => [...prev, rule]);
  };

  const handleUpdateRule = (ruleId: string, updatedRule: Partial<Rule>) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, ...updatedRule } : rule
    ));
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'appliedProperties' | 'appliedRules'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      appliedProperties: { ...newTask.originalProperties },
      appliedRules: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const processedTask = ruleEngine.processTask(task);
    setTasks(prev => [...prev, processedTask]);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleAddPerson = (newPerson: Omit<Person, 'id'>) => {
    const person: Person = {
      ...newPerson,
      id: `person-${Date.now()}`,
    };
    setPeople(prev => [...prev, person]);
  };

  const handleUpdatePerson = (personId: string, updates: Partial<Person>) => {
    setPeople(prev => prev.map(person => 
      person.id === personId ? { ...person, ...updates } : person
    ));
  };

  const handleDeletePerson = (personId: string) => {
    setPeople(prev => prev.filter(person => person.id !== personId));
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'upload': return <FileText className="h-4 w-4" />;
      case 'rules': return <Settings className="h-4 w-4" />;
      case 'tasks': return <Zap className="h-4 w-4" />;
      case 'people': return <Users className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-10 w-10 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Task AI Agent</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Intelligent task management with customizable rules. Upload rule files or create rules manually to automatically organize and categorize your tasks.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              {[
                { id: 'upload', label: 'Upload Rules' },
                { id: 'rules', label: 'Manage Rules' },
                { id: 'tasks', label: 'Process Tasks' },
                { id: 'people', label: 'Manage People' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {getTabIcon(tab.id)}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Settings className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Rules</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rules.filter(r => r.enabled).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Processed Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rules Applied</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.reduce((sum, task) => sum + task.appliedRules.length, 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900">{people.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {activeTab === 'upload' && (
              <FileUpload 
                onRulesUploaded={handleRulesUploaded}
                onTasksUploaded={handleTasksUploaded}
                onPeopleUploaded={handlePeopleUploaded}
              />
            )}
            
            {activeTab === 'rules' && (
              <RuleEditor
                rules={rules}
                onAddRule={handleAddRule}
                onUpdateRule={handleUpdateRule}
                onDeleteRule={handleDeleteRule}
              />
            )}
            
            {activeTab === 'tasks' && (
              <TaskProcessor
                tasks={tasks}
                people={people}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
            
            {activeTab === 'people' && (
              <PeopleManager
                people={people}
                onAddPerson={handleAddPerson}
                onUpdatePerson={handleUpdatePerson}
                onDeletePerson={handleDeletePerson}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;