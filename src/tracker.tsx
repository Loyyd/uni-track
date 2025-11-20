import React, { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, Download, Upload, ChevronUp, ChevronDown } from 'lucide-react';

type Assignment = { name: string; grade: number | null; weight: number; status?: 'graded' | 'submitted' | 'na' };
type Modules = Record<string, Assignment[]>;

const initialModules: Modules = {
  'Computer Programming I CSC1003': [
    { name: 'Programming Test 1', grade: 75, weight: 30, status: 'graded' },
    { name: 'Programming Test 2', grade: 40, weight: 30, status: 'na' },
    { name: 'Final Test', grade: 40, weight: 40, status: 'na' }
  ],
  'Computer Systems CSC1060': [
    { name: 'Assignment 1', grade: 60, weight: 10, status: 'graded' },
    { name: 'Binary Quiz', grade: 100, weight: 15, status: 'graded' },
    { name: 'Bool Quiz', grade: 100, weight: 15, status: 'graded' },
    { name: 'Assignment 2', grade: 40, weight: 15, status: 'submitted' },
    { name: 'Data Communication Quiz', grade: 100, weight: 15, status: 'graded' },
    { name: 'Data representation', grade: 40, weight: 15, status: 'na' },
    { name: 'Computer storage', grade: 40, weight: 15, status: 'na' }
  ],
  'IT Mathematics I': [
    { name: 'Online Quiz', grade: 100, weight: 10, status: 'graded' },
    { name: 'Online Quiz 2', grade: 40, weight: 10, status: 'na' },
    { name: 'Big Exam', grade: 40, weight: 80, status: 'na' }
  ],
  'Problem Solving CSC1012': [
    { name: 'Friend Finding', grade: 100, weight: 5, status: 'graded' },
    { name: 'Group Quiz', grade: 80, weight: 5, status: 'graded' },
    { name: 'Looking Back I', grade: 70, weight: 5, status: 'graded' },
    { name: 'looking back II', grade: 80, weight: 5, status: 'graded' },
    { name: ' Individual Q I', grade: 40, weight: 5, status: 'graded' },
    { name: ' Individual Q II', grade: 45, weight: 5, status: 'graded' },
    { name: ' Individual Q III', grade: 50, weight: 5, status: 'graded' },
    { name: 'Standup', grade: 40, weight: 8, status: 'submitted' },
    { name: 'Group Project', grade: 40, weight: 32, status: 'na' },
    { name: 'Learning Portfolio', grade: 40, weight: 30, status: 'na' }
  ],
  'Web Design CSC1061': [
    { name: 'HTML Quiz', grade: 100, weight: 10, status: 'graded' },
    { name: 'CSS Quiz', grade: 100, weight: 15, status: 'graded' },
    { name: 'Individual Project', grade: 40, weight: 25, status: 'submitted' },
    { name: 'Group Project', grade: 40, weight: 50, status: 'na' }
  ]
};

const GradeTracker: React.FC = () => {
  const [modules, setModules] = useState<Modules>(initialModules);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedModule, setSelectedModule] = useState<string>('Computer Programming I CSC1003');
  const [assignmentName, setAssignmentName] = useState<string>('');
  const [assignmentGrade, setAssignmentGrade] = useState<string>('');
  const [assignmentWeight, setAssignmentWeight] = useState<string>('');
  const [editingGrade, setEditingGrade] = useState<{ module: string; index: number } | null>(null);
  const [editGradeValue, setEditGradeValue] = useState<string>('');

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
    if (assignmentName && assignmentGrade && assignmentWeight) {
      const grade = parseFloat(assignmentGrade);
      const weight = parseFloat(assignmentWeight);
      if (Number.isFinite(grade) && grade >= 0 && grade <= 100) {
        if (Number.isFinite(weight) && weight > 0 && weight <= 100) {
          setModules(prev => ({
            ...prev,
            [selectedModule]: [...(prev[selectedModule] || []), { name: assignmentName, grade, weight }]
          }));
          setAssignmentName('');
          setAssignmentGrade('');
          setAssignmentWeight('');
        } else {
          alert('Please enter a weight between 0 and 100');
        }
      } else {
        alert('Please enter a grade between 0 and 100');
      }
    } else {
      alert('Please fill in all fields (name, grade, and weight)');
    }
  };

  const deleteAssignment = (moduleName: string, index: number) => {
    setModules(prev => ({
      ...prev,
      [moduleName]: (prev[moduleName] || []).filter((_, i) => i !== index)
    }));
  };

  const moveAssignmentUp = (moduleName: string, index: number) => {
    if (index === 0) return;
    setModules(prev => {
      const newAssignments = [...(prev[moduleName] || [])];
      [newAssignments[index - 1], newAssignments[index]] = [newAssignments[index], newAssignments[index - 1]];
      return {
        ...prev,
        [moduleName]: newAssignments
      };
    });
  };

  const moveAssignmentDown = (moduleName: string, index: number) => {
    setModules(prev => {
      const assignments = prev[moduleName] || [];
      if (index >= assignments.length - 1) return prev;
      const newAssignments = [...assignments];
      [newAssignments[index], newAssignments[index + 1]] = [newAssignments[index + 1], newAssignments[index]];
      return {
        ...prev,
        [moduleName]: newAssignments
      };
    });
  };

  const startEditingGrade = (moduleName: string, index: number, currentGrade: number | null) => {
    setEditingGrade({ module: moduleName, index });
    setEditGradeValue(currentGrade?.toString() ?? '');
  };

  const saveEditedGrade = (moduleName: string, index: number) => {
    const newGrade = parseFloat(editGradeValue);
    if (Number.isFinite(newGrade) && newGrade >= 0 && newGrade <= 100) {
      setModules(prev => {
        const newAssignments = [...(prev[moduleName] || [])];
        newAssignments[index] = { ...newAssignments[index], grade: newGrade, status: 'graded' };
        return {
          ...prev,
          [moduleName]: newAssignments
        };
      });
      setEditingGrade(null);
      setEditGradeValue('');
    } else {
      alert('Please enter a valid grade between 0 and 100');
    }
  };

  const cancelEditingGrade = () => {
    setEditingGrade(null);
    setEditGradeValue('');
  };

  const updateAssignmentStatus = (moduleName: string, index: number, status: 'graded' | 'submitted' | 'na') => {
    setModules(prev => {
      const newAssignments = [...(prev[moduleName] || [])];
      newAssignments[index] = { ...newAssignments[index], status };
      return {
        ...prev,
        [moduleName]: newAssignments
      };
    });
  };

  const calculateAverage = (assignments: Assignment[]): string => {
    if (!assignments || assignments.length === 0) return '0';
    // Only include graded assignments
    const gradedAssignments = assignments.filter(a => a.status === 'graded' || !a.status);
    if (gradedAssignments.length === 0) return '0';
    
    const totalWeight = gradedAssignments.reduce((acc, curr) => acc + curr.weight, 0);
    if (totalWeight === 0) return '0';
    const weightedSum = gradedAssignments.reduce((acc, curr) => acc + ((curr.grade ?? 0) * curr.weight), 0);
    return (weightedSum / totalWeight).toFixed(2);
  };

  const calculateOverallAverage = (): string => {
    const averages = Object.values(modules)
      .filter(assignments => assignments.length > 0)
      .map(assignments => parseFloat(calculateAverage(assignments)));

    if (averages.length === 0) return '0';
    const sum = averages.reduce((acc, curr) => acc + curr, 0);
    return (sum / averages.length).toFixed(2);
  };

  const getGradeColor = (grade: number | null): string => {
    if (grade === null) return 'text-slate-500';
    if (grade >= 60) return 'text-green-600 font-bold';
    if (grade >= 40) return 'text-yellow-500 font-semibold';
    return 'text-red-500 font-semibold';
  };

  const exportData = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      modules: modules
    };
    
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    const dateString = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `grade-tracker-export-${dateString}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Validate structure
        if (!importedData.modules || typeof importedData.modules !== 'object') {
          throw new Error('Invalid file format: missing or invalid modules data');
        }

        // Check if all expected modules are present in imported data
        const importedModuleKeys = Object.keys(importedData.modules);
        const expectedModuleKeys = Object.keys(initialModules);
        
        // Ask user if they want to merge or replace
        const shouldMerge = window.confirm(
          'Do you want to merge this data with existing grades?\n\nClick OK to merge, Cancel to replace all data.'
        );

        if (shouldMerge) {
          // Merge: keep existing data and add/update from import
          const mergedModules = { ...modules };
          importedModuleKeys.forEach(moduleName => {
            if (importedData.modules[moduleName] && Array.isArray(importedData.modules[moduleName])) {
              mergedModules[moduleName] = [
                ...(mergedModules[moduleName] || []),
                ...importedData.modules[moduleName]
              ];
            }
          });
          setModules(mergedModules);
        } else {
          // Replace: only use data from import, but keep module structure
          const replacedModules: Modules = {};
          expectedModuleKeys.forEach(moduleName => {
            replacedModules[moduleName] = importedData.modules[moduleName] || [];
          });
          setModules(replacedModules);
        }

        alert('Data imported successfully!');
      } catch (error) {
        alert(`Error importing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    reader.onerror = () => {
      alert('Error reading file');
    };

    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
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
          
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={exportData}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition transform hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Export Data
            </button>
            
            <label className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition transform hover:scale-105 cursor-pointer">
              <Upload className="w-5 h-5" />
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
                aria-label="Import data file"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Add New Assignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <input
              type="number"
              placeholder="Weight (%)"
              value={assignmentWeight}
              onChange={(e) => setAssignmentWeight(e.target.value)}
              min="0.1"
              max="100"
              step="0.1"
              className="px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              onClick={addAssignment}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8 auto-rows-max">
          {Object.entries(modules).map(([moduleName, assignments]) => (
            <div
              key={moduleName}
              className={`${moduleColors[moduleName]} border-2 rounded-xl shadow-lg flex flex-col relative`}
              style={{ minHeight: '400px' }}
            >
              <div className={`${moduleAccents[moduleName]} text-white p-3 text-center flex-shrink-0`}>
                <h3 className="text-sm font-bold">{moduleName}</h3>
              </div>
              
              <div className="flex-1 flex flex-col overflow-hidden p-3 relative">
                {assignments.length === 0 ? (
                  <p className="text-slate-500 text-center py-4 italic text-xs">No assignments yet</p>
                ) : (
                  <div className="flex flex-col gap-0 flex-1 relative">
                    {assignments.map((assignment: Assignment, index: number) => {
                      // Height proportional to weight
                      const totalWeight = assignments.reduce((sum, a) => sum + a.weight, 0);
                      const isEditing = editingGrade?.module === moduleName && editingGrade?.index === index;
                      return (
                        <div
                          key={index}
                          style={{ flex: assignment.weight * 0.7 }}
                          className="bg-white rounded-lg m-1 shadow-sm border border-slate-200 flex flex-col justify-between relative group hover:bg-slate-50 p-2"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-800 text-xs truncate">{assignment.name}</p>
                              {isEditing ? (
                                <div className="flex gap-1 mt-1">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={editGradeValue}
                                    onChange={(e) => setEditGradeValue(e.target.value)}
                                    autoFocus
                                    className="w-16 px-2 py-1 border border-indigo-300 rounded text-sm focus:outline-none focus:border-indigo-500"
                                  />
                                  <button
                                    onClick={() => saveEditedGrade(moduleName, index)}
                                    className="text-green-600 hover:text-green-700 font-semibold text-xs"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEditingGrade}
                                    className="text-red-600 hover:text-red-700 font-semibold text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <p
                                    onClick={() => startEditingGrade(moduleName, index, assignment.grade)}
                                    className={`text-sm ${getGradeColor(assignment.grade)} cursor-pointer hover:opacity-70 transition`}
                                    title="Click to edit grade"
                                  >
                                    {assignment.status === 'submitted' ? 'Submitted' : assignment.status === 'na' ? 'N/A' : (assignment.grade?.toFixed(2) ?? '—')} {(assignment.status === 'graded' || !assignment.status) && assignment.grade !== null ? '%' : ''}
                                  </p>
                                  <div className="flex gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => updateAssignmentStatus(moduleName, index, 'graded')}
                                      className={`px-1.5 py-0.5 rounded transition ${assignment.status === 'graded' || !assignment.status ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                      title="Mark as graded"
                                    >
                                      Grade
                                    </button>
                                    <button
                                      onClick={() => updateAssignmentStatus(moduleName, index, 'submitted')}
                                      className={`px-1.5 py-0.5 rounded transition ${assignment.status === 'submitted' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                      title="Mark as submitted"
                                    >
                                      Submitted
                                    </button>
                                    <button
                                      onClick={() => updateAssignmentStatus(moduleName, index, 'na')}
                                      className={`px-1.5 py-0.5 rounded transition ${assignment.status === 'na' ? 'bg-gray-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                      title="Mark as N/A"
                                    >
                                      N/A
                                    </button>
                                  </div>
                                </div>
                              )}
                              <p className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Weight: {assignment.weight.toFixed(1)}%</p>
                            </div>
                            <div className="flex flex-col gap-0.5 flex-shrink-0">
                              <button
                                onClick={() => moveAssignmentUp(moduleName, index)}
                                disabled={index === 0}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1 rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => moveAssignmentDown(moduleName, index)}
                                disabled={index >= assignments.length - 1}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1 rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteAssignment(moduleName, index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
                
              <div className="mt-3 pt-3 border-t-2 border-slate-300 px-3 pb-3 flex-shrink-0">
                <div className="text-center">
                  <span className="block font-bold text-slate-700 text-xs mb-1">Average</span>
                  <span className={`text-xl ${getGradeColor(parseFloat(calculateAverage(assignments)))}`}>
                    {calculateAverage(assignments)}%
                  </span>
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
