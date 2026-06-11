import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useStore } from '../store';
import Header from '../components/Header';

export default function Statistics() {
  const { workloadStats, costStats, monthlyStats, tasks } = useStore();

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0';

  return (
    <div className="flex-1 flex flex-col">
      <Header title="成本统计" />
      
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">任务完成率</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-medical-blue/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-medical-blue" />
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-medical-blue h-2 rounded-full" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">本月任务数</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-medical-green/10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-medical-green" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">本月耗材成本</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {costStats.reduce((sum, item) => sum + item.total_cost, 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-medical-orange/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-medical-orange" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">统计护士数</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{workloadStats.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-red/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-medical-red" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold">人员工作量统计</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {workloadStats.map(stat => (
                  <div key={stat.user_id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stat.user_name}</span>
                      <span className="text-sm text-gray-500">{stat.task_count} 任务</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-medical-blue h-3 rounded-full transition-all"
                        style={{ width: `${(stat.task_count / Math.max(...workloadStats.map(s => s.task_count))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold">单镜耗材成本核算</h3>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">耗材名称</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">消耗量</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">成本</th>
                  </tr>
                </thead>
                <tbody>
                  {costStats.map(stat => (
                    <tr key={stat.inventory_id} className="border-b">
                      <td className="px-4 py-3">{stat.inventory_name}</td>
                      <td className="px-4 py-3">{stat.total_quantity}</td>
                      <td className="px-4 py-3">{stat.total_cost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">科室月度对账</h3>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              导出报表
            </button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">月度任务数</span>
                  <div className="flex-1 ml-4">
                    {monthlyStats.map((stat) => (
                      <div key={stat.month} className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 bg-medical-blue flex items-center justify-center text-white text-xs rounded"
                          style={{ height: `${stat.total_tasks / 2}px`, minHeight: '20px' }}
                        ></div>
                        <span className="text-xs text-gray-500">{stat.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">月度耗材成本</span>
                  <div className="flex-1 ml-4">
                    {monthlyStats.map((stat) => (
                      <div key={stat.month} className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 bg-medical-orange flex items-center justify-center text-white text-xs rounded"
                          style={{ height: `${stat.total_cost / 300}px`, minHeight: '20px' }}
                        ></div>
                        <span className="text-xs text-gray-500">{stat.total_cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">月度消耗量</span>
                  <div className="flex-1 ml-4">
                    {monthlyStats.map((stat) => (
                      <div key={stat.month} className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 bg-medical-green flex items-center justify-center text-white text-xs rounded"
                          style={{ height: `${stat.total_consumption / 2.5}px`, minHeight: '20px' }}
                        ></div>
                        <span className="text-xs text-gray-500">{stat.total_consumption}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
