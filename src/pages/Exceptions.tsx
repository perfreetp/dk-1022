import { useState } from 'react';
import { Plus, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { useStore } from '../store';
import type { ExceptionStatus } from '../types';
import Header from '../components/Header';

export default function Exceptions() {
  const { exceptions, users, addException, updateException } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
  });

  const exceptionTypes = ['耗材损耗', '设备故障', '操作失误', '其他'];

  const getStatusName = (status: ExceptionStatus) => {
    const statusMap: Record<ExceptionStatus, string> = {
      pending: '待处理',
      handled: '已处理',
    };
    return statusMap[status];
  };

  const handleSubmit = () => {
    if (!formData.type || !formData.description) return;
    addException({
      user_id: users[0].id,
      type: formData.type,
      description: formData.description,
      status: 'pending',
    });
    setShowModal(false);
    setFormData({ type: '', description: '' });
  };

  const handleHandle = (exceptionId: string) => {
    updateException(exceptionId, { status: 'handled', handled_at: new Date().toISOString().split('T')[0] });
  };

  const pendingExceptions = exceptions.filter(e => e.status === 'pending');
  const handledExceptions = exceptions.filter(e => e.status === 'handled');

  return (
    <div className="flex-1 flex flex-col">
      <Header title="异常记录" />
      
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">待处理异常</p>
                <p className="text-2xl font-bold text-medical-orange mt-2">{pendingExceptions.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-orange/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-medical-orange" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">已处理异常</p>
                <p className="text-2xl font-bold text-medical-green mt-2">{handledExceptions.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-green/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-medical-green" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-medical-red text-white rounded-lg hover:bg-medical-red/90 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            登记异常
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold">异常记录列表</h3>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {exceptions.map(exception => {
                const user = users.find(u => u.id === exception.user_id);
                
                return (
                  <div key={exception.id} className={`p-4 border rounded-lg ${
                    exception.status === 'pending' ? 'border-medical-orange/30 bg-medical-orange/5' :
                    'border-medical-green/30 bg-medical-green/5'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            exception.status === 'pending' ? 'bg-medical-orange/20 text-medical-orange' :
                            'bg-medical-green/20 text-medical-green'
                          }`}>
                            {exception.status === 'pending' ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{exception.type}</span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                exception.status === 'pending' ? 'bg-medical-orange/20 text-medical-orange' :
                                'bg-medical-green/20 text-medical-green'
                              }`}>
                                {getStatusName(exception.status)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{exception.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {user?.name}
                          </span>
                          <span>{exception.created_at}</span>
                          {exception.handled_at && (
                            <span>处理时间: {exception.handled_at}</span>
                          )}
                        </div>
                      </div>
                      {exception.status === 'pending' && (
                        <button
                          onClick={() => handleHandle(exception.id)}
                          className="ml-4 px-4 py-2 bg-medical-green text-white rounded-lg hover:bg-medical-green/90 flex items-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          处理
                        </button>
                      )}
                    </div>
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
            <h3 className="text-lg font-semibold mb-4">登记异常</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">异常类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">请选择类型</option>
                  {exceptionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
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
                className="px-4 py-2 bg-medical-red text-white rounded-lg hover:bg-medical-red/90"
              >
                确认登记
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
