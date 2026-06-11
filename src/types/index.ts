export type UserRole = 'nurse' | 'warehouse' | 'manager';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  created_at: string;
}

export type ShiftType = 'morning' | 'afternoon' | 'night';
export type ScheduleStatus = 'active' | 'leave' | 'adjusted';

export interface Scheduling {
  id: string;
  user_id: string;
  date: string;
  shift: ShiftType;
  status: ScheduleStatus;
  created_at: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'normal' | 'high';

export interface Task {
  id: string;
  user_id: string;
  name: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  completed_at?: string;
}

export interface Inventory {
  id: string;
  name: string;
  code: string;
  quantity: number;
  min_stock: number;
  batch_no: string;
  expire_date: string;
  unit: string;
  price: number;
  created_at: string;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'issued';

export interface Request {
  id: string;
  user_id: string;
  inventory_id: string;
  quantity: number;
  status: RequestStatus;
  reason: string;
  created_at: string;
  approved_at?: string;
}

export interface Consumption {
  id: string;
  task_id: string;
  inventory_id: string;
  quantity: number;
  created_at: string;
}

export type ExceptionStatus = 'pending' | 'handled';

export interface Exception {
  id: string;
  user_id: string;
  type: string;
  description: string;
  status: ExceptionStatus;
  created_at: string;
  handled_at?: string;
}

export interface WorkloadStats {
  user_id: string;
  user_name: string;
  task_count: number;
  total_hours: number;
}

export interface CostStats {
  inventory_id: string;
  inventory_name: string;
  total_quantity: number;
  total_cost: number;
}

export interface MonthlyStats {
  month: string;
  total_tasks: number;
  total_cost: number;
  total_consumption: number;
}
