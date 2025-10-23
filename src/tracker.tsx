import React, { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen } from 'lucide-react';

type Assignment = { name: string; grade: number };
type Modules = Record<string, Assignment[]>;

const initialModules: Modules = {
  'Computer Programming I CSC1003': [],
  'Computer Systems CSC1060': [],
  'IT Mathematics I': [],
  'Problem Solving CSC1012': [],
  'Web Design CSC1061': []
};

const GradeTracker: React.FC = () => {
  const [modules, setModules] = useState<Modules>(initialModules);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedModule, setSelectedModule] = useState<string>('Computer Programming I CSC1003');
  const [assignmentName, setAssignmentName] = useState<string>('');
  const [assignmentGrade, setAssignmentGrade] = useState<string>('');

  const moduleColors: Record<string, string> = {
    'Computer Programming I CSC1003': 'bg-yellow-50 border-yellow-300',
    'Computer Systems CSC1060': 'bg-blue-50 border-blue-300',
    'IT Mathematics I': 'bg-indigo-50 border-indigo-300',
    'Problem Solving CSC1012': 'bg-rose-50 border-rose-300',
    'Web Design CSC1061': 'bg-cyan-50 border-cyan-300'
  };

  const moduleAccents: Record<string, string> = {
    'Computer Programming I CSC1003': 'bg-yellow-500',
    'Computer Systems CSC1060': 'bg-blue-500',
    'IT Mathematics I': 'bg-indigo-500',
    'Problem Solving CSC1012': 'bg-rose-500',
    'Web Design CSC1061': 'bg-cyan-500'
  };

  useEffect(() => {
    // Use localStorage for persistency in the browser
    const loadData = () => {
      try {
        const saved = localStorage.getItem('grade-tracker-modules');
        if (saved) {
          setModules(JSON.parse(saved));
        }
      } catch (error) {
        console.log('No saved data found, starting fresh');
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('grade-tracker-modules', JSON.stringify(modules));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  }, [modules, isLoading]);

  const addAssignment = () => {
    if (assignmentName && assignmentGrade) {
      const grade = parseFloat(assignmentGrade);
      if (Number.isFinite(grade) && grade >= 0 && grade <= 100) {
        setModules(prev => ({
          ...prev,
          [selectedModule]: [...(prev[selectedModule] || []), { name: assignmentName, grade }]
        }));
        setAssignmentName('');
        setAssignmentGrade('');
      } else {
        alert('Please enter a grade between 0 and 100');
      }
    }
  };

  const deleteAssignment = (moduleName: string, index: number) => {
    setModules(prev => ({
      ...prev,
      [moduleName]: (prev[moduleName] || []).filter((_, i) => i !== index)
    }));
  };

  const calculateAverage = (assignments: Assignment[]): string => {
    if (!assignments || assignments.length === 0) return '0';
    const sum = assignments.reduce((acc, curr) => acc + curr.grade, 0);
    return (sum / assignments.length).toFixed(2);
  };

  const calculateOverallAverage = (): string => {
    const averages = Object.values(modules)
      .filter(assignments => assignments.length > 0)
      .map(assignments => parseFloat(calculateAverage(assignments)));

    if (averages.length === 0) return '0';
    const sum = averages.reduce((acc, curr) => acc + curr, 0);
    return (sum / averages.length).toFixed(2);
  };

  const getGradeColor = (grade: number): string => {
    if (grade >= 90) return 'text-green-600 font-bold';
    if (grade >= 80) return 'text-green-500 font-semibold';
    if (grade >= 70) return 'text-blue-500 font-semibold';
    if (grade >= 60) return 'text-orange-500 font-semibold';
    return 'text-red-500 font-semibold';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your grades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BookOpen className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-slate-800">University Grade Tracker</h1>
          </div>
          <p className="text-slate-600">Track your assignments and monitor your academic progress</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Add New Assignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            >
              {Object.keys(modules).map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Assignment name"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              className="px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            />
            <input
              type="number"
              placeholder="Grade (0-100)"
              value={assignmentGrade}
              onChange={(e) => setAssignmentGrade(e.target.value)}
              min="0"
              max="100"
              step="0.01"
              className="px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              onClick={addAssignment}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add Assignment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          {Object.entries(modules).map(([moduleName, assignments]) => (
            <div
              key={moduleName}
              className={`${moduleColors[moduleName]} border-2 rounded-xl shadow-lg overflow-hidden`}
            >
              <div className={`${moduleAccents[moduleName]} text-white p-3 text-center`}>
                <h3 className="text-sm font-bold">{moduleName}</h3>
              </div>
              
              <div className="p-3">
                {assignments.length === 0 ? (
                  <p className="text-slate-500 text-center py-4 italic text-xs">No assignments yet</p>
                ) : (
                  <div className="space-y-2">
                    {assignments.map((assignment: Assignment, index: number) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-2 shadow-sm border border-slate-200"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 text-xs truncate">{assignment.name}</p>
                            <p className={`text-sm ${getGradeColor(assignment.grade)}`}>
                              {assignment.grade.toFixed(2)}%
                            </p>
                          </div>
                          <button
                            onClick={() => deleteAssignment(moduleName, index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition flex-shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t-2 border-slate-300">
                  <div className="text-center">
                    <span className="block font-bold text-slate-700 text-xs mb-1">Average</span>
                    <span className={`text-xl ${getGradeColor(parseFloat(calculateAverage(assignments)))}`}>
                      {calculateAverage(assignments)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Overall Average</h2>
              <p className="text-indigo-100">Across all modules</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold">{calculateOverallAverage()}%</div>
              <p className="text-sm text-indigo-100 mt-2">
                {Object.values(modules).filter(a => a.length > 0).length} of {Object.keys(modules).length} modules
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeTracker;
