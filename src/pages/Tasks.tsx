import { useState } from 'react';
import { Plus, Play, CheckCircle, Clock, User } from 'lucide-react';
import { useStore } from '../store';
import type { TaskStatus, TaskPriority } from '../types';
import Header from '../components/Header';

export default function Tasks() {
  const { tasks, users, addTask, updateTask } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    priority: 'normal' as TaskPriority,
  });

  const nurses = users.filter(u => u.role === 'nurse');
  
  const getStatusName = (status: TaskStatus) => {
    const statusMap: Record<TaskStatus, string> = { pending: '待处理', in_progress: '进行中', completed: '已完成' };
    return statusMap[status];
  };

  const getPriorityName = (priority: TaskPriority) => {
    const priorityMap: Record<TaskPriority, string> = { low: '低', normal: '普通', high: '紧急' };
    return priorityMap[priority];
  };

  const handleSubmit = () => {
    if (!formData.user_id || !formData.name) return;
    addTask({ ...formData, status: 'pending' });
    setShowModal(false);
    setFormData({ user_id: '', name: '', priority: 'normal' });
  };

  const handleStartTask = (taskId: string) => {
    updateTask(taskId, { status: 'in_progress' });
  };

  const handleCompleteTask = (taskId: string) => {
    updateTask(taskId, { status: 'completed', completed_at: new Date().toISOString().split('T')[0] });
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="flex-1 flex flex-col">
      <Header title="洗消任务" />
      
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-medical-blue text-white rounded-lg hover:bg-medical-blue/90 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            创建任务
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                待处理
              </h3>
              <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">{pendingTasks.length}</span>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {pendingTasks.length > 0 ? (
                pendingTasks.map(task => (
                  <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{task.name}</p>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-medical-red/20 text-medical-red' :
                        task.priority === 'normal' ? 'bg-medical-orange/20 text-medical-orange' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {getPriorityName(task.priority)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {users.find(u => u.id === task.user_id)?.name}
                      </span>
                      <button
                        onClick={() => handleStartTask(task.id)}
                        className="px-3 py-1 bg-medical-blue text-white text-sm rounded-lg hover:bg-medical-blue/90 flex items-center"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        开始
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">暂无待处理任务</p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-medical-blue/5">
              <h3 className="font-semibold flex items-center">
                <Play className="w-5 h-5 mr-2 text-medical-blue" />
                进行中
              </h3>
              <span className="px-2 py-1 bg-medical-blue/20 text-medical-blue rounded-full text-sm">{inProgressTasks.length}</span>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {inProgressTasks.length > 0 ? (
                inProgressTasks.map(task => (
                  <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{task.name}</p>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-medical-red/20 text-medical-red' :
                        task.priority === 'normal' ? 'bg-medical-orange/20 text-medical-orange' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {getPriorityName(task.priority)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {users.find(u => u.id === task.user_id)?.name}
                      </span>
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="px-3 py-1 bg-medical-green text-white text-sm rounded-lg hover:bg-medical-green/90 flex items-center"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        完成
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">暂无进行中的任务</p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-medical-green/5">
              <h3 className="font-semibold flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-medical-green" />
                已完成
              </h3>
              <span className="px-2 py-1 bg-medical-green/20 text-medical-green rounded-full text-sm">{completedTasks.length}</span>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {completedTasks.length > 0 ? (
                completedTasks.map(task => (
                  <div key={task.id} className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-500 line-through">{task.name}</p>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-medical-green/20 text-medical-green">
                        {getStatusName(task.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {users.find(u => u.id === task.user_id)?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {task.completed_at}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">暂无已完成任务</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold">忙闲状态</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {nurses.map(nurse => {
                const nurseTasks = tasks.filter(t => t.user_id === nurse.id);
                const activeTasks = nurseTasks.filter(t => t.status === 'in_progress').length;
                const isBusy = activeTasks > 0;
                
                return (
                  <div key={nurse.id} className={`p-4 border rounded-lg ${isBusy ? 'border-medical-blue bg-medical-blue/5' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          isBusy ? 'bg-medical-blue text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{nurse.name}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isBusy ? 'bg-medical-blue text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isBusy ? '忙碌' : '空闲'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      当前任务: {activeTasks} / {nurseTasks.length}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">创建洗消任务</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">任务名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：胃镜清洗消毒-患者A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">责任人</label>
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">请选择护士</option>
                  {nurses.map(nurse => (
                    <option key={nurse.id} value={nurse.id}>{nurse.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="low">低</option>
                  <option value="normal">普通</option>
                  <option value="high">紧急</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-medical-blue text-white rounded-lg hover:bg-medical-blue/90"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
