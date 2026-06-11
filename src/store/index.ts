import { create } from 'zustand';
import type { User, Scheduling, Task, Inventory, Request, Exception, WorkloadStats, CostStats, MonthlyStats } from '../types';
import { mockUsers, mockSchedulings, mockTasks, mockInventory, mockRequests, mockExceptions, mockWorkloadStats, mockCostStats, mockMonthlyStats } from '../data/mockData';

interface Store {
  users: User[];
  currentUser: User | null;
  schedulings: Scheduling[];
  tasks: Task[];
  inventory: Inventory[];
  requests: Request[];
  exceptions: Exception[];
  workloadStats: WorkloadStats[];
  costStats: CostStats[];
  monthlyStats: MonthlyStats[];

  setCurrentUser: (user: User) => void;
  
  addScheduling: (scheduling: Omit<Scheduling, 'id' | 'created_at'>) => void;
  updateScheduling: (id: string, updates: Partial<Scheduling>) => void;
  
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  
  addInventory: (item: Omit<Inventory, 'id' | 'created_at'>) => void;
  updateInventory: (id: string, updates: Partial<Inventory>) => void;
  
  addRequest: (request: Omit<Request, 'id' | 'created_at'>) => void;
  updateRequest: (id: string, updates: Partial<Request>) => void;
  
  addException: (exception: Omit<Exception, 'id' | 'created_at'>) => void;
  updateException: (id: string, updates: Partial<Exception>) => void;
}

export const useStore = create<Store>((set) => ({
  users: mockUsers,
  currentUser: mockUsers[0],
  schedulings: mockSchedulings,
  tasks: mockTasks,
  inventory: mockInventory,
  requests: mockRequests,
  exceptions: mockExceptions,
  workloadStats: mockWorkloadStats,
  costStats: mockCostStats,
  monthlyStats: mockMonthlyStats,

  setCurrentUser: (user) => set({ currentUser: user }),

  addScheduling: (scheduling) => set((state) => ({
    schedulings: [...state.schedulings, { ...scheduling, id: Date.now().toString(), created_at: new Date().toISOString().split('T')[0] }]
  })),
  
  updateScheduling: (id, updates) => set((state) => ({
    schedulings: state.schedulings.map(s => s.id === id ? { ...s, ...updates } : s)
  })),

  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: Date.now().toString(), created_at: new Date().toISOString().split('T')[0] }]
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  addInventory: (item) => set((state) => ({
    inventory: [...state.inventory, { ...item, id: Date.now().toString(), created_at: new Date().toISOString().split('T')[0] }]
  })),
  
  updateInventory: (id, updates) => set((state) => ({
    inventory: state.inventory.map(i => i.id === id ? { ...i, ...updates } : i)
  })),

  addRequest: (request) => set((state) => ({
    requests: [...state.requests, { ...request, id: Date.now().toString(), created_at: new Date().toISOString().split('T')[0] }]
  })),
  
  updateRequest: (id, updates) => set((state) => ({
    requests: state.requests.map(r => r.id === id ? { ...r, ...updates } : r)
  })),

  addException: (exception) => set((state) => ({
    exceptions: [...state.exceptions, { ...exception, id: Date.now().toString(), created_at: new Date().toISOString().split('T')[0] }]
  })),
  
  updateException: (id, updates) => set((state) => ({
    exceptions: state.exceptions.map(e => e.id === id ? { ...e, ...updates } : e)
  })),
}));
