import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, User } from 'lucide-react';
import { useStore } from '../store';
import type { ShiftType, ScheduleStatus } from '../types';
import Header from '../components/Header';

export default function Scheduling() {
  const { schedulings, users, addScheduling, updateScheduling } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<typeof schedulings[0] | null>(null);
  const [formData, setFormData] = useState({
    user_id: '',
    date: selectedDate,
    shift: 'morning' as ShiftType,
    status: 'active' as ScheduleStatus,
  });

  const nurses = users.filter(u => u.role === 'nurse');
  
  const getShiftName = (shift: ShiftType) => {
    const shiftMap: Record<ShiftType, string> = { morning: '早班', afternoon: '中班', night: '晚班' };
    return shiftMap[shift];
  };

  const getStatusName = (status: ScheduleStatus) => {
    const statusMap: Record<ScheduleStatus, string> = { active: '在岗', leave: '请假', adjusted: '调班' };
    return statusMap[status];
  };

  const handleSubmit = () => {
    if (!formData.user_id) return;
    if (editingItem) {
      updateScheduling(editingItem.id, formData);
    } else {
      addScheduling(formData);
    }
    setShowModal(false);
    setEditingItem(null);
    setFormData({ user_id: '', date: selectedDate, shift: 'morning', status: 'active' });
  };

  const handleEdit = (item: typeof schedulings[0]) => {
    setEditingItem(item);
    setFormData({
      user_id: item.user_id,
      date: item.date,
      shift: item.shift,
      status: item.status,
    });
    setShowModal(true);
  };

  const filteredSchedulings = schedulings.filter(s => s.date === selectedDate);

  return (
    <div className="flex-1 flex flex-col">
      <Header title="人员排班" />
      
      <main className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-medical-blue text-white rounded-lg hover:bg-medical-blue/90 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加排班
              </button>
            </div>
            <button className="px-4 py-2 border border-medical-blue text-medical-blue rounded-lg hover:bg-medical-blue/5 transition-colors">
              按诊疗量生成班次
            </button>
          </div>
          
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">护士</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">班次</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">状态</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedulings.length > 0 ? (
                    filteredSchedulings.map(schedule => (
                      <tr key={schedule.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-medical-blue/10 flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-medical-blue" />
                            </div>
                            <span>{users.find(u => u.id === schedule.user_id)?.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{getShiftName(schedule.shift)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            schedule.status === 'active' ? 'bg-medical-green/20 text-medical-green' :
                            schedule.status === 'leave' ? 'bg-medical-red/20 text-medical-red' :
                            'bg-medical-orange/20 text-medical-orange'
                          }`}>
                            {getStatusName(schedule.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(schedule)}
                              className="p-2 text-gray-500 hover:text-medical-blue hover:bg-medical-blue/10 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-medical-red hover:bg-medical-red/10 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        该日期暂无排班安排
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold">请假调班申请</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">待审批</p>
                    <p className="text-xl font-bold text-medical-orange mt-1">2</p>
                  </div>
                  <div className="w-10 h-10 bg-medical-orange/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-medical-orange" />
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">已通过</p>
                    <p className="text-xl font-bold text-medical-green mt-1">5</p>
                  </div>
                  <div className="w-10 h-10 bg-medical-green/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-medical-green" />
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">已拒绝</p>
                    <p className="text-xl font-bold text-medical-red mt-1">1</p>
                  </div>
                  <div className="w-10 h-10 bg-medical-red/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-medical-red" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editingItem ? '编辑排班' : '添加排班'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">护士</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">班次</label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value as ShiftType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="morning">早班</option>
                  <option value="afternoon">中班</option>
                  <option value="night">晚班</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ScheduleStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="active">在岗</option>
                  <option value="leave">请假</option>
                  <option value="adjusted">调班</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-medical-blue text-white rounded-lg hover:bg-medical-blue/90"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
