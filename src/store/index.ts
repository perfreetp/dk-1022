import { create } from 'zustand';
import type { User, Scheduling, Task, Inventory, Request, Exception, WorkloadStats, CostStats, MonthlyStats, EndoscopeCostStats } from '../types';
import { mockUsers, mockSchedulings, mockTasks, mockInventory, mockRequests, mockExceptions, mockWorkloadStats, mockCostStats, mockMonthlyStats } from '../data/mockData';

export interface HandoverRecord {
  id: string;
  user_id: string;
  user_name: string;
  handover_time: string;
  pending_tasks: number;
  confirmed: boolean;
}

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
  endoscopeCostStats: EndoscopeCostStats[];
  monthlyStats: MonthlyStats[];
  handover: HandoverRecord | null;

  setCurrentUser: (user: User) => void;
  
  addScheduling: (scheduling: Omit<Scheduling, 'id' | 'created_at'>) => void;
  updateScheduling: (id: string, updates: Partial<Scheduling>) => void;
  generateSchedulings: (date: string, patientCount: number) => void;
  
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (taskId: string) => boolean;
  
  addInventory: (item: Omit<Inventory, 'id' | 'created_at'>) => void;
  updateInventory: (id: string, updates: Partial<Inventory>) => void;
  deleteInventory: (id: string) => void;
  deductInventory: (inventoryId: string, quantity: number) => boolean;
  
  addRequest: (request: Omit<Request, 'id' | 'created_at'>) => void;
  updateRequest: (id: string, updates: Partial<Request>) => void;
  issueRequest: (requestId: string) => boolean;
  
  addException: (exception: Omit<Exception, 'id' | 'created_at'>) => void;
  updateException: (id: string, updates: Partial<Exception>) => void;
  
  confirmHandover: () => void;
  resetHandover: () => void;
}

const ENDOSCOPE_CONSUMPTION: Record<string, { name: string; quantity: number }[]> = {
  '胃镜': [
    { name: '内镜清洗液', quantity: 1 },
    { name: '消毒湿巾', quantity: 2 },
    { name: '一次性手套', quantity: 1 },
    { name: '内镜润滑剂', quantity: 1 },
  ],
  '肠镜': [
    { name: '内镜清洗液', quantity: 2 },
    { name: '消毒湿巾', quantity: 3 },
    { name: '一次性手套', quantity: 2 },
    { name: '内镜润滑剂', quantity: 1 },
  ],
  '支气管镜': [
    { name: '内镜清洗液', quantity: 1 },
    { name: '消毒湿巾', quantity: 2 },
    { name: '一次性手套', quantity: 1 },
    { name: '内镜润滑剂', quantity: 1 },
  ],
};

const loadHandover = (): HandoverRecord | null => {
  try {
    const saved = localStorage.getItem('endoscope_handover');
    if (saved) {
      const handover = JSON.parse(saved);
      const today = new Date().toDateString();
      const handoverDate = new Date(handover.handover_time).toDateString();
      if (handoverDate === today) {
        return handover;
      }
    }
  } catch (e) {
    console.error('Failed to load handover:', e);
  }
  return null;
};

export const useStore = create<Store>((set, get) => ({
  users: mockUsers,
  currentUser: mockUsers[0],
  schedulings: mockSchedulings,
  tasks: mockTasks,
  inventory: mockInventory,
  requests: mockRequests,
  exceptions: mockExceptions,
  workloadStats: mockWorkloadStats,
  costStats: mockCostStats,
  endoscopeCostStats: [
    {
      endoscope_type: '胃镜',
      total_cost: 0,
      consumptions: [],
    },
    {
      endoscope_type: '肠镜',
      total_cost: 0,
      consumptions: [],
    },
    {
      endoscope_type: '支气管镜',
      total_cost: 0,
      consumptions: [],
    },
  ],
  monthlyStats: mockMonthlyStats,
  handover: loadHandover(),

  setCurrentUser: (user) => set({ currentUser: user }),

  addScheduling: (scheduling) => set((state) => ({
    schedulings: [...state.schedulings, { ...scheduling, id: Date.now().toString(), created_at: new Date().toISOString().split('T')[0] }]
  })),
  
  updateScheduling: (id, updates) => set((state) => ({
    schedulings: state.schedulings.map(s => s.id === id ? { ...s, ...updates } : s)
  })),

  generateSchedulings: (date, patientCount) => set((state) => {
    const nurses = state.users.filter(u => u.role === 'nurse');
    const positions: ('cleaning' | 'disinfection' | 'registration' | 'patrol')[] = ['cleaning', 'disinfection', 'registration', 'patrol'];
    const shifts: Scheduling[] = [];
    
    const morningNurses = Math.max(1, Math.ceil(patientCount * 0.4 / 10));
    const afternoonNurses = Math.max(1, Math.ceil(patientCount * 0.4 / 10));
    const nightNurses = Math.max(1, Math.ceil(patientCount * 0.2 / 10));
    
    const getNurseLastPosition = (nurseId: string): string | null => {
      const recentSchedulings = state.schedulings
        .filter(s => s.user_id === nurseId && s.date < date)
        .sort((a, b) => b.date.localeCompare(a.date));
      return recentSchedulings.length > 0 ? recentSchedulings[0].position : null;
    };
    
    const getNextPosition = (lastPosition: string | null): 'cleaning' | 'disinfection' | 'registration' | 'patrol' => {
      if (!lastPosition) return positions[0];
      const currentIndex = positions.indexOf(lastPosition as any);
      return positions[(currentIndex + 1) % positions.length];
    };
    
    let nurseIndex = 0;
    let positionIndex = 0;
    
    for (let i = 0; i < morningNurses; i++) {
      const nurse = nurseIndex < nurses.length ? nurses[nurseIndex] : null;
      const lastPosition = nurse ? getNurseLastPosition(nurse.id) : null;
      const position = nurse ? getNextPosition(lastPosition) : positions[positionIndex % positions.length];
      
      shifts.push({
        id: Date.now().toString() + '-m-' + i,
        user_id: nurse?.id || '',
        date,
        shift: 'morning',
        position,
        status: nurse ? 'active' : 'adjusted',
        created_at: new Date().toISOString().split('T')[0],
      });
      if (nurse) nurseIndex++;
      positionIndex++;
    }
    
    for (let i = 0; i < afternoonNurses; i++) {
      const nurse = nurseIndex < nurses.length ? nurses[nurseIndex] : null;
      const lastPosition = nurse ? getNurseLastPosition(nurse.id) : null;
      const position = nurse ? getNextPosition(lastPosition) : positions[positionIndex % positions.length];
      
      shifts.push({
        id: Date.now().toString() + '-a-' + i,
        user_id: nurse?.id || '',
        date,
        shift: 'afternoon',
        position,
        status: nurse ? 'active' : 'adjusted',
        created_at: new Date().toISOString().split('T')[0],
      });
      if (nurse) nurseIndex++;
      positionIndex++;
    }
    
    for (let i = 0; i < nightNurses; i++) {
      const nurse = nurseIndex < nurses.length ? nurses[nurseIndex] : null;
      const lastPosition = nurse ? getNurseLastPosition(nurse.id) : null;
      const position = nurse ? getNextPosition(lastPosition) : positions[positionIndex % positions.length];
      
      shifts.push({
        id: Date.now().toString() + '-n-' + i,
        user_id: nurse?.id || '',
        date,
        shift: 'night',
        position,
        status: nurse ? 'active' : 'adjusted',
        created_at: new Date().toISOString().split('T')[0],
      });
      if (nurse) nurseIndex++;
      positionIndex++;
    }
    
    const existingSchedulings = state.schedulings.filter(s => s.date !== date);
    return { schedulings: [...existingSchedulings, ...shifts] };
  }),

  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: Date.now().toString(), created_at: new Date().toISOString().split('T')[0] }]
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  completeTask: (taskId) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return false;

    let endoscopeType = '胃镜';
    if (task.name.includes('肠镜')) endoscopeType = '肠镜';
    if (task.name.includes('支气管镜')) endoscopeType = '支气管镜';

    const consumption = ENDOSCOPE_CONSUMPTION[endoscopeType] || ENDOSCOPE_CONSUMPTION['胃镜'];
    
    for (const item of consumption) {
      const totalStock = state.inventory
        .filter(i => i.name === item.name)
        .reduce((sum, i) => sum + i.quantity, 0);
      if (totalStock < item.quantity) {
        alert(`库存不足：${item.name} 需要 ${item.quantity}，当前库存 ${totalStock}`);
        return false;
      }
    }

    set((state) => {
      let newInventory = [...state.inventory];
      let totalCostAdded = 0;

      for (const item of consumption) {
        let remaining = item.quantity;
        const sortedBatches = newInventory
          .filter(i => i.name === item.name)
          .sort((a, b) => a.expire_date.localeCompare(b.expire_date));

        for (const batch of sortedBatches) {
          if (remaining <= 0) break;
          
          const deductAmount = Math.min(remaining, batch.quantity);
          totalCostAdded += deductAmount * batch.price;
          
          newInventory = newInventory.map(i => {
            if (i.id === batch.id) {
              const newQuantity = i.quantity - deductAmount;
              return { ...i, quantity: newQuantity };
            }
            return i;
          });
          
          remaining -= deductAmount;
        }
        
        newInventory = newInventory.filter(i => i.quantity > 0);
      }

      let newCostStats = [...state.costStats];
        
      for (const item of consumption) {
        const existingStat = newCostStats.find(cs => cs.inventory_name === item.name);
        if (existingStat) {
          newCostStats = newCostStats.map(cs => {
            if (cs.inventory_name === item.name) {
              const inventoryItem = state.inventory.find(i => i.name === item.name);
              return {
                ...cs,
                total_quantity: cs.total_quantity + item.quantity,
                total_cost: cs.total_cost + (item.quantity * (inventoryItem?.price || 0)),
              };
            }
            return cs;
          });
        } else {
          const inventoryItem = state.inventory.find(i => i.name === item.name);
          newCostStats.push({
            inventory_id: inventoryItem?.id || '',
            inventory_name: item.name,
            total_quantity: item.quantity,
            total_cost: item.quantity * (inventoryItem?.price || 0),
          });
        }
      }

      let newEndoscopeCostStats = [...state.endoscopeCostStats];
    
      newEndoscopeCostStats = newEndoscopeCostStats.map(ecs => {
        if (ecs.endoscope_type === endoscopeType) {
          const updatedConsumptions = [...ecs.consumptions];
          let totalCost = ecs.total_cost;
          
          for (const item of consumption) {
            const existingConsumption = updatedConsumptions.find(c => c.inventory_name === item.name);
            const inventoryItem = state.inventory.find(i => i.name === item.name);
            const itemCost = item.quantity * (inventoryItem?.price || 0);
            
            if (existingConsumption) {
              updatedConsumptions.forEach(c => {
                if (c.inventory_name === item.name) {
                  c.quantity += item.quantity;
                  c.total_cost += itemCost;
                }
              });
            } else {
              updatedConsumptions.push({
                inventory_id: inventoryItem?.id || '',
                inventory_name: item.name,
                quantity: item.quantity,
                unit_cost: inventoryItem?.price || 0,
                total_cost: itemCost,
              });
            }
            totalCost += itemCost;
          }
          
          return {
            ...ecs,
            total_cost: totalCost,
            consumptions: updatedConsumptions,
          };
        }
        return ecs;
      });

      return {
        inventory: newInventory,
        costStats: newCostStats,
        endoscopeCostStats: newEndoscopeCostStats,
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'completed' as const, completed_at: new Date().toISOString().split('T')[0] } : t),
      };
    });

    return true;
  },

  addInventory: (item) => set((state) => ({
    inventory: [...state.inventory, { ...item, id: Date.now().toString(), created_at: new Date().toISOString().split('T')[0] }]
  })),
  
  updateInventory: (id, updates) => set((state) => ({
    inventory: state.inventory.map(i => i.id === id ? { ...i, ...updates } : i)
  })),

  deleteInventory: (id) => set((state) => ({
    inventory: state.inventory.filter(i => i.id !== id)
  })),

  deductInventory: (inventoryId, quantity) => {
    const state = get();
    const item = state.inventory.find(i => i.id === inventoryId);
    if (!item || item.quantity < quantity) {
      return false;
    }
    set((state) => ({
      inventory: state.inventory.map(i => i.id === inventoryId ? { ...i, quantity: i.quantity - quantity } : i)
    }));
    return true;
  },

  addRequest: (request) => set((state) => ({
    requests: [...state.requests, { ...request, id: Date.now().toString(), created_at: new Date().toISOString().split('T')[0] }]
  })),
  
  updateRequest: (id, updates) => set((state) => ({
    requests: state.requests.map(r => r.id === id ? { ...r, ...updates } : r)
  })),

  issueRequest: (requestId) => {
    const state = get();
    const request = state.requests.find(r => r.id === requestId);
    if (!request) return false;

    const item = state.inventory.find(i => i.id === request.inventory_id);
    if (!item || item.quantity < request.quantity) {
      alert(`库存不足：${item?.name} 需要 ${request.quantity}，当前库存 ${item?.quantity || 0}`);
      return false;
    }

    set((state) => ({
      inventory: state.inventory.map(i => i.id === request.inventory_id ? { ...i, quantity: i.quantity - request.quantity } : i),
      requests: state.requests.map(r => r.id === requestId ? { ...r, status: 'issued' as const } : r),
    }));

    return true;
  },

  addException: (exception) => set((state) => ({
    exceptions: [...state.exceptions, { ...exception, id: Date.now().toString(), created_at: new Date().toISOString().split('T')[0] }]
  })),
  
  updateException: (id, updates) => set((state) => ({
    exceptions: state.exceptions.map(e => e.id === id ? { ...e, ...updates } : e)
  })),

  confirmHandover: () => {
    const state = get();
    const pendingTasks = state.tasks.filter(t => t.status === 'pending').length;
    const handoverRecord: HandoverRecord = {
      id: Date.now().toString(),
      user_id: state.currentUser?.id || '',
      user_name: state.currentUser?.name || '',
      handover_time: new Date().toLocaleString('zh-CN'),
      pending_tasks: pendingTasks,
      confirmed: true,
    };
    localStorage.setItem('endoscope_handover', JSON.stringify(handoverRecord));
    set({ handover: handoverRecord });
  },

  resetHandover: () => {
    localStorage.removeItem('endoscope_handover');
    set({ handover: null });
  },
}));
