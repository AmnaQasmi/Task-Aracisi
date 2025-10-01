import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, ToggleLeft as Toggle } from 'lucide-react';
import { Rule } from '../types';

interface RuleEditorProps {
  rules: Rule[];
  onAddRule: (rule: Omit<Rule, 'id'>) => void;
  onUpdateRule: (ruleId: string, updatedRule: Partial<Rule>) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const RuleEditor: React.FC<RuleEditorProps> = ({
  rules,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
}) => {
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    if: '',
    then: {},
    enabled: true,
  });

  const handleAddRule = () => {
    if (newRule.if.trim()) {
      onAddRule(newRule);
      setNewRule({ if: '', then: {}, enabled: true });
      setShowAddForm(false);
    }
  };

  const handleUpdateThenProperty = (ruleId: string, key: string, value: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      const updatedThen = { ...rule.then };
      if (value.trim()) {
        updatedThen[key] = value;
      } else {
        delete updatedThen[key];
      }
      onUpdateRule(ruleId, { then: updatedThen });
    }
  };

  const renderThenProperties = (rule: Rule) => {
    const commonProperties = ['project', 'assignee', 'time', 'priority', 'label'];
    const existingKeys = Object.keys(rule.then);
    const allKeys = [...new Set([...commonProperties, ...existingKeys])];

    return (
      <div className="grid grid-cols-2 gap-3 mt-3">
        {allKeys.map(key => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
              {key}
            </label>
            {key === 'priority' ? (
              <select
                value={rule.then[key] || ''}
                onChange={(e) => handleUpdateThenProperty(rule.id, key, e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            ) : (
              <input
                type="text"
                value={rule.then[key] || ''}
                onChange={(e) => handleUpdateThenProperty(rule.id, key, e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${key}...`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Rules Management</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </button>
      </div>

      {showAddForm && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition (If)
              </label>
              <input
                type="text"
                value={newRule.if}
                onChange={(e) => setNewRule({ ...newRule, if: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., task contains 'meeting'"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Then Properties (JSON format)
              </label>
              <textarea
                value={JSON.stringify(newRule.then, null, 2)}
                onChange={(e) => {
                  try {
                    setNewRule({ ...newRule, then: JSON.parse(e.target.value) });
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                rows={3}
                placeholder='{"project": "Work", "priority": "High"}'
              />
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleAddRule}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save className="h-4 w-4 mr-1" />
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`border rounded-lg p-4 transition-all duration-200 ${
              rule.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <button
                    onClick={() => onUpdateRule(rule.id, { enabled: !rule.enabled })}
                    className={`p-1 rounded-md transition-colors ${
                      rule.enabled
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Toggle className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {rule.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                
                {editingRule === rule.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={rule.if}
                      onChange={(e) => onUpdateRule(rule.id, { if: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {renderThenProperties(rule)}
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      <span className="text-blue-600">If:</span> {rule.if}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(rule.then).map(([key, value]) => (
                        <span
                          key={key}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {editingRule === rule.id ? (
                  <button
                    onClick={() => setEditingRule(null)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingRule(rule.id)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => onDeleteRule(rule.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {rules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No rules defined yet. Add your first rule to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};