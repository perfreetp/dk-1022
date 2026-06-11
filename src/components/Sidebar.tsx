import { LayoutDashboard, CalendarDays, ClipboardList, Package, FileText, BarChart3, AlertTriangle, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '工作台' },
  { path: '/scheduling', icon: CalendarDays, label: '人员排班' },
  { path: '/tasks', icon: ClipboardList, label: '洗消任务' },
  { path: '/inventory', icon: Package, label: '耗材库存' },
  { path: '/requests', icon: FileText, label: '领用申请' },
  { path: '/statistics', icon: BarChart3, label: '成本统计' },
  { path: '/exceptions', icon: AlertTriangle, label: '异常记录' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useStore();

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-medical-blue">内镜管理系统</h1>
        <p className="text-sm text-gray-500 mt-1">消化内镜清洗间</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-medical-blue text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">
              {currentUser?.role === 'nurse' && '护士'}
              {currentUser?.role === 'warehouse' && '库管'}
              {currentUser?.role === 'manager' && '负责人'}
            </p>
          </div>
          <button className="p-2 text-gray-400 hover:text-medical-red">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
