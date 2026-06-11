import { ClipboardList, AlertCircle, Calendar, CheckCircle, RefreshCw } from 'lucide-react';
import { useStore } from '../store';
import Header from '../components/Header';

const positionMap: Record<string, string> = {
  cleaning: '清洗',
  disinfection: '消毒',
  registration: '登记',
  patrol: '巡回',
};

export default function Dashboard() {
  const { tasks, schedulings, requests, exceptions, currentUser, users, handover, confirmHandover, resetHandover } = useStore();
  
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const todaySchedule = schedulings.find(s => s.date === new Date().toISOString().split('T')[0] && s.user_id === currentUser?.id);
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const pendingExceptions = exceptions.filter(e => e.status === 'pending');
  
  const getUserById = (id: string) => users.find(u => u.id === id);
  const getShiftName = (shift: string) => {
    const shiftMap: Record<string, string> = { morning: '早班', afternoon: '中班', night: '晚班' };
    return shiftMap[shift] || shift;
  };
  const getPositionName = (position: string) => positionMap[position] || position;

  const handleConfirmHandover = () => {
    confirmHandover();
  };

  const handleResetHandover = () => {
    if (confirm('确定要重置交接班状态吗？')) {
      resetHandover();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="工作台" />
      
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">待完成任务</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{pendingTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-blue/10 rounded-full flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-medical-blue" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">今日班次</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {todaySchedule ? getShiftName(todaySchedule.shift) : '无安排'}
                </p>
              </div>
              <div className="w-12 h-12 bg-medical-green/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-medical-green" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">待审批申请</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{pendingRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-orange/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-medical-orange" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">待处理异常</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{pendingExceptions.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-red/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-medical-red" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">待完成任务</h3>
              <span className="text-sm text-gray-500">{pendingTasks.length} 项</span>
            </div>
            <div className="p-4">
              {pendingTasks.length > 0 ? (
                <div className="space-y-3">
                  {pendingTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{task.name}</p>
                        <p className="text-xs text-gray-500">
                          责任人: {getUserById(task.user_id)?.name}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-medical-red/20 text-medical-red' :
                        task.priority === 'normal' ? 'bg-medical-orange/20 text-medical-orange' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {task.priority === 'high' ? '紧急' : task.priority === 'normal' ? '普通' : '低'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">暂无待完成任务</p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">今日排班</h3>
              <span className="text-sm text-gray-500">{new Date().toLocaleDateString('zh-CN')}</span>
            </div>
            <div className="p-4">
              {schedulings.filter(s => s.date === new Date().toISOString().split('T')[0]).length > 0 ? (
                <div className="space-y-3">
                  {schedulings.filter(s => s.date === new Date().toISOString().split('T')[0]).map(schedule => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{getUserById(schedule.user_id)?.name || '待分配'}</p>
                        <p className="text-xs text-gray-500">
                          {getShiftName(schedule.shift)} · {getPositionName(schedule.position)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        schedule.status === 'active' ? 'bg-medical-green/20 text-medical-green' :
                        schedule.status === 'leave' ? 'bg-medical-red/20 text-medical-red' :
                        'bg-medical-orange/20 text-medical-orange'
                      }`}>
                        {schedule.status === 'active' ? '在岗' : schedule.status === 'leave' ? '请假' : '调班'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">今日暂无排班</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">交接班确认</h3>
            {handover ? (
              <button
                onClick={handleResetHandover}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重置状态
              </button>
            ) : (
              <button
                onClick={handleConfirmHandover}
                className="px-4 py-2 bg-medical-blue text-white rounded-lg hover:bg-medical-blue/90 transition-colors flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                确认交接
              </button>
            )}
          </div>
          <div className="p-4">
            {handover ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg bg-medical-green/5 border-medical-green/20">
                  <p className="text-sm text-gray-500">交接状态</p>
                  <p className="font-medium mt-1 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-medical-green" />
                    已确认
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">交接人</p>
                  <p className="font-medium mt-1">{handover.user_name}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">交接时间</p>
                  <p className="font-medium mt-1">{handover.handover_time}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">待办事项</p>
                  <p className="font-medium mt-1">{handover.pending_tasks} 项</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">交接人</p>
                  <p className="font-medium mt-1">{currentUser?.name}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">交接时间</p>
                  <p className="font-medium mt-1">{new Date().toLocaleString('zh-CN')}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">待办事项</p>
                  <p className="font-medium mt-1">{pendingTasks.length} 项</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
