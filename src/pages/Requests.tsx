import { useState } from 'react';
import { Plus, CheckCircle, XCircle, FileText, User } from 'lucide-react';
import { useStore } from '../store';
import type { RequestStatus } from '../types';
import Header from '../components/Header';

export default function Requests() {
  const { requests, users, inventory, addRequest, updateRequest } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    inventory_id: '',
    quantity: 0,
    reason: '',
    isUrgent: false,
  });

  const getStatusName = (status: RequestStatus) => {
    const statusMap: Record<RequestStatus, string> = {
      pending: '待审批',
      approved: '已通过',
      rejected: '已拒绝',
      issued: '已发放',
    };
    return statusMap[status];
  };

  const handleSubmit = () => {
    if (!formData.inventory_id || formData.quantity <= 0) return;
    addRequest({
      user_id: users[0].id,
      inventory_id: formData.inventory_id,
      quantity: formData.quantity,
      reason: formData.reason,
      status: 'pending',
    });
    setShowModal(false);
    setFormData({ inventory_id: '', quantity: 0, reason: '', isUrgent: false });
  };

  const handleApprove = (requestId: string) => {
    updateRequest(requestId, { status: 'approved', approved_at: new Date().toISOString().split('T')[0] });
  };

  const handleReject = (requestId: string) => {
    updateRequest(requestId, { status: 'rejected', approved_at: new Date().toISOString().split('T')[0] });
  };

  const handleIssue = (requestId: string) => {
    updateRequest(requestId, { status: 'issued' });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const issuedRequests = requests.filter(r => r.status === 'issued');

  return (
    <div className="flex-1 flex flex-col">
      <Header title="领用申请" />
      
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-medical-blue text-white rounded-lg hover:bg-medical-blue/90 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            提交申请
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">待审批</p>
                <p className="text-2xl font-bold text-medical-orange mt-2">{pendingRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-orange/10 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-medical-orange" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">已通过</p>
                <p className="text-2xl font-bold text-medical-green mt-2">{approvedRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-green/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-medical-green" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">已发放</p>
                <p className="text-2xl font-bold text-medical-blue mt-2">{issuedRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-blue/10 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-medical-blue" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold">申请列表</h3>
          </div>
          
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">申请人</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">耗材</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">数量</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">原因</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">状态</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(request => {
                    const item = inventory.find(i => i.id === request.inventory_id);
                    const user = users.find(u => u.id === request.user_id);
                    
                    return (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-medical-blue/10 flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-medical-blue" />
                            </div>
                            <span>{user?.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{item?.name} ({item?.code})</td>
                        <td className="px-4 py-3">{request.quantity} {item?.unit}</td>
                        <td className="px-4 py-3">{request.reason}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.status === 'pending' ? 'bg-medical-orange/20 text-medical-orange' :
                            request.status === 'approved' ? 'bg-medical-green/20 text-medical-green' :
                            request.status === 'rejected' ? 'bg-medical-red/20 text-medical-red' :
                            'bg-medical-blue/20 text-medical-blue'
                          }`}>
                            {getStatusName(request.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {request.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(request.id)}
                                  className="p-2 text-medical-green hover:bg-medical-green/10 rounded-lg"
                                  title="通过"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(request.id)}
                                  className="p-2 text-medical-red hover:bg-medical-red/10 rounded-lg"
                                  title="拒绝"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {request.status === 'approved' && (
                              <button
                                onClick={() => handleIssue(request.id)}
                                className="px-3 py-1 bg-medical-blue text-white text-sm rounded-lg hover:bg-medical-blue/90"
                              >
                                发放
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">提交领用申请</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择耗材</label>
                <select
                  value={formData.inventory_id}
                  onChange={(e) => setFormData({ ...formData, inventory_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">请选择耗材</option>
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>{item.name} ({item.code}) - 库存: {item.quantity}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">领用数量</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">领用原因</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={formData.isUrgent}
                  onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="urgent" className="text-sm text-gray-700">紧急领用</label>
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
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
