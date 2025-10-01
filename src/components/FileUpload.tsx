import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Users, Calendar } from 'lucide-react';
import { Rule, Task, Person } from '../types';
import { FileParser } from '../utils/fileParser';

interface FileUploadProps {
  onRulesUploaded: (rules: Rule[]) => void;
  onTasksUploaded: (tasks: Task[]) => void;
  onPeopleUploaded: (people: Person[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onRulesUploaded, 
  onTasksUploaded, 
  onPeopleUploaded 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadResults, setUploadResults] = useState<{
    rules: number;
    tasks: number;
    people: number;
    errors: string[];
  } | null>(null);

  const processFile = useCallback(async (file: File) => {
    try {
      setUploadStatus('idle');
      setUploadMessage('Processing file...');
      
      const result = await FileParser.parseFile(file);
      
      const totalItems = result.rules.length + result.tasks.length + result.people.length;
      
      if (totalItems > 0) {
        // Upload the parsed data
        if (result.rules.length > 0) {
          onRulesUploaded(result.rules);
        }
        if (result.tasks.length > 0) {
          onTasksUploaded(result.tasks);
        }
        if (result.people.length > 0) {
          onPeopleUploaded(result.people);
        }
        
        setUploadResults({
          rules: result.rules.length,
          tasks: result.tasks.length,
          people: result.people.length,
          errors: result.errors,
        });

        setUploadStatus('success');
        setUploadMessage(`Successfully imported ${totalItems} items`);
      } else {
        setUploadStatus('error');
        setUploadMessage('No valid data found in file');
        setUploadResults({
          rules: 0,
          tasks: 0,
          people: 0,
          errors: result.errors,
        });
      }
    } catch (error) {
      console.error('File processing error:', error);
      setUploadStatus('error');
      setUploadMessage('Failed to process file. Please check the format.');
      setUploadResults(null);
    }

    setTimeout(() => {
      setUploadStatus('idle');
      setUploadMessage('');
      setUploadResults(null);
    }, 3000);
  }, [onRulesUploaded, onTasksUploaded, onPeopleUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (file && (file.name.endsWith('.json') || file.name.endsWith('.csv') || file.name.endsWith('.pdf'))) {
      processFile(file);
    } else {
      setUploadStatus('error');
      setUploadMessage('Please upload a JSON, CSV, or PDF file');
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadMessage('');
      }, 5000);
    }
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : uploadStatus === 'success'
            ? 'border-green-400 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <div className="flex flex-col items-center space-y-4">
          {uploadStatus === 'success' ? (
            <CheckCircle className="h-12 w-12 text-green-500" />
          ) : uploadStatus === 'error' ? (
            <XCircle className="h-12 w-12 text-red-500" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {uploadStatus === 'idle' ? 'Upload Rules File' : uploadMessage}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop your JSON or CSV file here, or click to browse
            </p>
          </div>

          <input
            type="file"
            accept=".json,.csv,.pdf"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            <FileText className="h-4 w-4 mr-2" />
            Choose File
          </label>
        </div>
      </div>

      {uploadResults && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Upload Results:</h4>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">{uploadResults.rules} Rules</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">{uploadResults.tasks} Tasks</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-600">{uploadResults.people} People</span>
            </div>
          </div>
          {uploadResults.errors.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-red-600 mb-1">Warnings:</p>
              <ul className="text-xs text-red-500 space-y-1">
                {uploadResults.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>JSON format:</strong> Upload files with "rules", "tasks", and/or "people\" arrays</p>
        <p><strong>CSV format:</strong> Upload rules (if, then columns), tasks (title, assigned_to, due_date columns), or people (name, email, role columns)</p>
        <p><strong>PDF format:</strong> Upload documents with structured task assignments and rule definitions</p>
      </div>
    </div>
  );
};