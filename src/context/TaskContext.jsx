import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  filter: 'all',
  searchTerm: '',
  sortBy: 'created'
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    
    case 'ADD_TASK':
      const newTask = {
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description,
        priority: action.payload.priority,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: action.payload.dueDate
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload, updatedAt: new Date().toISOString() }
            : task
        )
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks');
    if (savedTasks) {
      dispatch({ type: 'SET_TASKS', payload: JSON.parse(savedTasks) });
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  const addTask = (task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const updateTask = (id, updates) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, ...updates } });
  };

  const deleteTask = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const setSearch = (searchTerm) => {
    dispatch({ type: 'SET_SEARCH', payload: searchTerm });
  };

  const setSort = (sortBy) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  };

  const getFilteredTasks = () => {
    let filtered = state.tasks;

    // Apply status filter
    if (state.filter !== 'all') {
      filtered = filtered.filter(task => task.status === state.filter);
    }

    // Apply search filter
    if (state.searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'created':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  };

  const getTaskStats = () => {
    const total = state.tasks.length;
    const completed = state.tasks.filter(task => task.status === 'completed').length;
    const pending = state.tasks.filter(task => task.status === 'pending').length;
    const inProgress = state.tasks.filter(task => task.status === 'in-progress').length;

    return { total, completed, pending, inProgress };
  };

  const value = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    setFilter,
    setSearch,
    setSort,
    getFilteredTasks,
    getTaskStats
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}