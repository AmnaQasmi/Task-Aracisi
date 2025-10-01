import React, { useState } from 'react';
import { Plus, User, Mail, Building, Clock, Edit3, Trash2, X, Save } from 'lucide-react';
import { Person } from '../types';

interface PeopleManagerProps {
  people: Person[];
  onAddPerson: (person: Omit<Person, 'id'>) => void;
  onUpdatePerson: (personId: string, updates: Partial<Person>) => void;
  onDeletePerson: (personId: string) => void;
}

export const PeopleManager: React.FC<PeopleManagerProps> = ({
  people,
  onAddPerson,
  onUpdatePerson,
  onDeletePerson,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState<string | null>(null);
  const [newPerson, setNewPerson] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    availability: [] as string[],
  });

  const handleAddPerson = () => {
    if (newPerson.name.trim()) {
      onAddPerson(newPerson);
      setNewPerson({
        name: '',
        email: '',
        role: '',
        department: '',
        availability: [],
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateAvailability = (personId: string, availability: string[]) => {
    onUpdatePerson(personId, { availability });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">People Management</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </button>
      </div>

      {showAddForm && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter full name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newPerson.email}
                  onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter email address..."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={newPerson.role}
                  onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Developer, Manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newPerson.department}
                  onChange={(e) => setNewPerson({ ...newPerson, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Engineering, Sales"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability (comma-separated)
              </label>
              <input
                type="text"
                value={newPerson.availability.join(', ')}
                onChange={(e) => setNewPerson({ 
                  ...newPerson, 
                  availability: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Mon-Fri 9-5, Weekends"
              />
            </div>
            
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleAddPerson}
                className="px-3 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700"
              >
                <Save className="h-4 w-4 mr-1" />
                Add Person
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {people.map((person) => (
          <div
            key={person.id}
            className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {editingPerson === person.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={person.name}
                        onChange={(e) => onUpdatePerson(person.id, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        value={person.email || ''}
                        onChange={(e) => onUpdatePerson(person.id, { email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Email"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={person.role || ''}
                        onChange={(e) => onUpdatePerson(person.id, { role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Role"
                      />
                      <input
                        type="text"
                        value={person.department || ''}
                        onChange={(e) => onUpdatePerson(person.id, { department: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Department"
                      />
                    </div>
                    <input
                      type="text"
                      value={person.availability?.join(', ') || ''}
                      onChange={(e) => handleUpdateAvailability(
                        person.id, 
                        e.target.value.split(',').map(t => t.trim()).filter(t => t)
                      )}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Availability"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-5 w-5 text-purple-600" />
                      <h4 className="text-lg font-semibold text-gray-900">{person.name}</h4>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      {person.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{person.email}</span>
                        </div>
                      )}
                      {person.role && (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <span>{person.role}</span>
                          {person.department && <span>• {person.department}</span>}
                        </div>
                      )}
                      {person.availability && person.availability.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <Clock className="h-4 w-4 mt-0.5" />
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
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {editingPerson === person.id ? (
                  <button
                    onClick={() => setEditingPerson(null)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingPerson(person.id)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => onDeletePerson(person.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {people.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No people defined yet. Add team members to assign tasks!</p>
          </div>
        )}
      </div>
    </div>
  );
};