import type { User, Scheduling, Task, Inventory, Request, Exception, WorkloadStats, CostStats, MonthlyStats } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: '张护士', role: 'nurse', email: 'zhang@hospital.com', created_at: '2024-01-01' },
  { id: '2', name: '李护士', role: 'nurse', email: 'li@hospital.com', created_at: '2024-01-01' },
  { id: '3', name: '王库管', role: 'warehouse', email: 'wang@hospital.com', created_at: '2024-01-01' },
  { id: '4', name: '陈主任', role: 'manager', email: 'chen@hospital.com', created_at: '2024-01-01' },
];

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const mockSchedulings: Scheduling[] = [
  { id: '1', user_id: '1', date: today, shift: 'morning', status: 'active', created_at: today },
  { id: '2', user_id: '2', date: today, shift: 'afternoon', status: 'active', created_at: today },
  { id: '3', user_id: '1', date: tomorrow, shift: 'afternoon', status: 'active', created_at: today },
  { id: '4', user_id: '2', date: tomorrow, shift: 'morning', status: 'leave', created_at: today },
];

export const mockTasks: Task[] = [
  { id: '1', user_id: '1', name: '胃镜清洗消毒-患者A', status: 'pending', priority: 'high', created_at: today },
  { id: '2', user_id: '1', name: '肠镜清洗消毒-患者B', status: 'in_progress', priority: 'normal', created_at: today },
  { id: '3', user_id: '2', name: '胃镜清洗消毒-患者C', status: 'completed', priority: 'normal', created_at: today, completed_at: today },
  { id: '4', user_id: '2', name: '支气管镜清洗消毒-患者D', status: 'pending', priority: 'low', created_at: today },
  { id: '5', user_id: '1', name: '肠镜清洗消毒-患者E', status: 'pending', priority: 'high', created_at: today },
];

export const mockInventory: Inventory[] = [
  { id: '1', name: '内镜清洗液', code: 'CL-001', quantity: 100, min_stock: 20, batch_no: 'B202401', expire_date: '2025-12-31', unit: '瓶', price: 50.00, created_at: today },
  { id: '2', name: '消毒湿巾', code: 'CL-002', quantity: 500, min_stock: 50, batch_no: 'B202402', expire_date: '2025-06-30', unit: '包', price: 15.00, created_at: today },
  { id: '3', name: '一次性手套', code: 'CL-003', quantity: 150, min_stock: 200, batch_no: 'B202403', expire_date: '2025-09-30', unit: '盒', price: 30.00, created_at: today },
  { id: '4', name: '内镜润滑剂', code: 'CL-004', quantity: 50, min_stock: 10, batch_no: 'B202404', expire_date: '2025-03-31', unit: '支', price: 80.00, created_at: today },
];

export const mockRequests: Request[] = [
  { id: '1', user_id: '1', inventory_id: '1', quantity: 10, status: 'pending', reason: '日常消耗补充', created_at: today },
  { id: '2', user_id: '2', inventory_id: '3', quantity: 50, status: 'approved', reason: '库存不足', created_at: today, approved_at: today },
  { id: '3', user_id: '1', inventory_id: '2', quantity: 20, status: 'issued', reason: '紧急领用', created_at: today, approved_at: today },
];

export const mockExceptions: Exception[] = [
  { id: '1', user_id: '1', type: '耗材损耗', description: '一次性手套包装破损，损耗5盒', status: 'pending', created_at: today },
  { id: '2', user_id: '2', type: '设备故障', description: '清洗机故障，已报修', status: 'handled', created_at: today, handled_at: today },
];

export const mockWorkloadStats: WorkloadStats[] = [
  { user_id: '1', user_name: '张护士', task_count: 15, total_hours: 45 },
  { user_id: '2', user_name: '李护士', task_count: 12, total_hours: 38 },
];

export const mockCostStats: CostStats[] = [
  { inventory_id: '1', inventory_name: '内镜清洗液', total_quantity: 50, total_cost: 2500 },
  { inventory_id: '2', inventory_name: '消毒湿巾', total_quantity: 200, total_cost: 3000 },
  { inventory_id: '3', inventory_name: '一次性手套', total_quantity: 100, total_cost: 3000 },
  { inventory_id: '4', inventory_name: '内镜润滑剂', total_quantity: 20, total_cost: 1600 },
];

export const mockMonthlyStats: MonthlyStats[] = [
  { month: '2024-01', total_tasks: 150, total_cost: 15000, total_consumption: 500 },
  { month: '2024-02', total_tasks: 180, total_cost: 18000, total_consumption: 600 },
  { month: '2024-03', total_tasks: 200, total_cost: 20000, total_consumption: 650 },
];
