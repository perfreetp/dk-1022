import { useState } from 'react';
import { Plus, Edit, Trash2, Download, AlertTriangle, Package } from 'lucide-react';
import { useStore } from '../store';
import Header from '../components/Header';

export default function Inventory() {
  const { inventory, addInventory, updateInventory, deleteInventory } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<typeof inventory[0] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    quantity: 0,
    min_stock: 10,
    batch_no: '',
    expire_date: '',
    unit: '',
    price: 0,
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.code) return;
    if (editingItem) {
      updateInventory(editingItem.id, formData);
    } else {
      addInventory(formData);
    }
    setShowModal(false);
    setEditingItem(null);
    setFormData({ name: '', code: '', quantity: 0, min_stock: 10, batch_no: '', expire_date: '', unit: '', price: 0 });
  };

  const handleEdit = (item: typeof inventory[0]) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      code: item.code,
      quantity: item.quantity,
      min_stock: item.min_stock,
      batch_no: item.batch_no,
      expire_date: item.expire_date,
      unit: item.unit,
      price: item.price,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条库存记录吗？')) {
      deleteInventory(id);
    }
  };

  const handleExport = () => {
    const headers = ['名称', '编码', '数量', '批号', '效期', '库存预警状态'];
    const rows = inventory.map(item => {
      const isLowStock = item.quantity <= item.min_stock;
      const isExpiring = new Date(item.expire_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      let status = '正常';
      if (isLowStock && isExpiring) status = '低库存+即将过期';
      else if (isLowStock) status = '低库存';
      else if (isExpiring) status = '即将过期';
      return [item.name, item.code, `${item.quantity} ${item.unit}`, item.batch_no, item.expire_date, status];
    });

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `库存盘点表_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLowStock = (item: typeof inventory[0]) => item.quantity <= item.min_stock;
  const isExpiring = (item: typeof inventory[0]) => {
    const expireDate = new Date(item.expire_date);
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    return expireDate <= thirtyDaysLater;
  };

  const lowStockItems = inventory.filter(isLowStock);
  const expiringItems = inventory.filter(isExpiring);

  return (
    <div className="flex-1 flex flex-col">
      <Header title="耗材库存" />
      
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">耗材种类</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{inventory.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-blue/10 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-medical-blue" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">低库存预警</p>
                <p className="text-2xl font-bold text-medical-orange mt-2">{lowStockItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-orange/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-medical-orange" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">效期预警</p>
                <p className="text-2xl font-bold text-medical-red mt-2">{expiringItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-red/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-medical-red" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">库存总价值</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {inventory.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-medical-green/10 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-medical-green" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">库存列表</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                导出盘点表
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-medical-blue text-white rounded-lg hover:bg-medical-blue/90 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                入库
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">名称</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">编码</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">库存</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">最低库存</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">批号</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">效期</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">单价</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">{item.code}</td>
                      <td className={`px-4 py-3 ${isLowStock(item) ? 'text-medical-orange font-semibold' : ''}`}>
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-3">{item.min_stock} {item.unit}</td>
                      <td className="px-4 py-3">{item.batch_no}</td>
                      <td className={`px-4 py-3 ${isExpiring(item) ? 'text-medical-red font-semibold' : ''}`}>
                        {item.expire_date}
                      </td>
                      <td className="px-4 py-3">{item.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-gray-500 hover:text-medical-blue hover:bg-medical-blue/10 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-500 hover:text-medical-red hover:bg-medical-red/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {lowStockItems.length > 0 && (
          <div className="mt-6 bg-medical-orange/5 rounded-xl border border-medical-orange/20 overflow-hidden">
            <div className="p-4 border-b bg-medical-orange/10">
              <h3 className="font-semibold text-medical-orange flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                低库存预警
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {lowStockItems.map(item => (
                  <div key={item.id} className="p-3 bg-white rounded-lg border border-medical-orange/20">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">当前库存: {item.quantity} {item.unit}</p>
                    <p className="text-sm text-medical-orange">最低库存: {item.min_stock} {item.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {expiringItems.length > 0 && (
          <div className="mt-6 bg-medical-red/5 rounded-xl border border-medical-red/20 overflow-hidden">
            <div className="p-4 border-b bg-medical-red/10">
              <h3 className="font-semibold text-medical-red flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                效期预警
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {expiringItems.map(item => (
                  <div key={item.id} className="p-3 bg-white rounded-lg border border-medical-red/20">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">批号: {item.batch_no}</p>
                    <p className="text-sm text-medical-red">有效期至: {item.expire_date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">{editingItem ? '编辑库存' : '入库'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">编码</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">单位</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最低库存</label>
                  <input
                    type="number"
                    value={formData.min_stock}
                    onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">单价</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">批号</label>
                  <input
                    type="text"
                    value={formData.batch_no}
                    onChange={(e) => setFormData({ ...formData, batch_no: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">有效期</label>
                  <input
                    type="date"
                    value={formData.expire_date}
                    onChange={(e) => setFormData({ ...formData, expire_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
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
                {editingItem ? '保存' : '入库'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
