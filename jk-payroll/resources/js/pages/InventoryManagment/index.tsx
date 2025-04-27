import Layout from '@/layouts/Layout';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import CreateInventory from './CreateInventory';
import { fetchInventoryTypes, fetchSecurities, getInventoryitems } from '@/services/security-managment.service';
import { Table, Tag, Space, Button } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import EditInventory from './EditInventory';
import AllocationForm from './AllocationForm';
import Security from '@/types/jk/security';

interface InventoryItem {
    id: number;
    inventory_type_id: number;
    type: {
      name: string;
    };
    size: string | null;
    condition: 'new' | 'returned';
    quantity: number;
    purchase_price: string;
    purchase_date: string;
    last_restocked_at: string | null;
    is_available: boolean;
    created_at: string;
    updated_at: string;
    inventory_type: any;
  }

const InventoryManagement = () => {

    const [invnentoryType, setInventoryTypes] = useState<any[]>([])
    const [inventories, setInventories] = useState<any[]>([]);

    const [securities, setSecurities]= useState<Security[]>([])
    const [isCreatingNewinventory, setIsCreatingNewinventory] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    const getInventoryTypes = async()=>{
      const result =  await fetchInventoryTypes();
      setInventoryTypes(result.data)
    }

    const getInventories = async()=>{
        const result = await getInventoryitems()
        setInventories(result.data);
    }

    const getSecurities = async() =>{
        const result = await fetchSecurities();
        setSecurities(result.data)
    }
 
    useEffect(()=>{
        getInventoryTypes();
        getInventories();
        getSecurities();
    }, [isCreatingNewinventory]);


    const columns: ColumnsType<InventoryItem> = [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80,
          sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Item Type',
            key: 'type_name',
            render: (_: any, record: InventoryItem) => (
              <>
                {record.inventory_type?.name}
                {record.size && <Tag style={{ marginLeft: 8 }}>Size: {record.size}</Tag>}
              </>
            ),
          },
        {
          title: 'Condition',
          dataIndex: 'condition',
          key: 'condition',
          render: (condition: 'new' | 'returned') => (
            <Tag color={condition === 'new' ? 'green' : 'orange'}>
              {condition.charAt(0).toUpperCase() + condition.slice(1)}
            </Tag>
          ),
          filters: [
            { text: 'New', value: 'new' },
            { text: 'Returned', value: 'returned' },
          ],
          onFilter: (value: any, record: InventoryItem) => 
            record.condition === value,
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
          sorter: (a: InventoryItem, b: InventoryItem) => a.quantity - b.quantity,
        },
        {
          title: 'Purchase Price',
          dataIndex: 'purchase_price',
          key: 'purchase_price',
          render: (price: string) => `Rs ${parseFloat(price).toFixed(2)}`,
          sorter: (a: InventoryItem, b: InventoryItem) => 
            parseFloat(a.purchase_price) - parseFloat(b.purchase_price),
        },
        {
          title: 'Purchase Date',
          dataIndex: 'purchase_date',
          key: 'purchase_date',
          render: (date: string) => new Date(date).toLocaleDateString(),
          sorter: (a: InventoryItem, b: InventoryItem) => 
            new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime(),
        },
        {
          title: 'Last Restocked',
          dataIndex: 'last_restocked_at',
          key: 'last_restocked_at',
          render: (date: string | null) => date ? new Date(date).toLocaleDateString() : 'Never',
          sorter: (a: InventoryItem, b: InventoryItem) => {
            const dateA = a.last_restocked_at ? new Date(a.last_restocked_at).getTime() : 0;
            const dateB = b.last_restocked_at ? new Date(b.last_restocked_at).getTime() : 0;
            return dateA - dateB;
          },
        },
        {
          title: 'Status',
          key: 'status',
          render: (_: any, record: InventoryItem) => (
            <Tag color={record.is_available ? 'green' : 'red'}>
              {record.is_available ? 'Available' : 'Unavailable'}
            </Tag>
          ),
          filters: [
            { text: 'Available', value: true },
            { text: 'Unavailable', value: false },
          ],
          onFilter: (value: any, record: InventoryItem) => 
            record.is_available === value,
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 120,
          render: (_: any, record: InventoryItem) => (
            <Space size="small">
              <Button 
                icon={<EyeOutlined />} 
                size="small"
                onClick={() => handleView(record.id)}
              />
              <Button 
                icon={<EditOutlined />} 
                size="small" 
                onClick={() => handleEdit(record)}
              />
            </Space>
          ),
        },
      ];

    const handleView = (id: any) => {
        // Handle view action
        console.log('View item:', id);
      };
    
      const handleEdit = (item: any) => {
        // Handle edit action
        setEditingItem(item);
        console.log('Edit item:', item);
      };

    return (
        <Layout>
            {!isCreatingNewinventory && !editingItem && (
                <div className="p-6 pt-20">
                    <h1 className="mb-4 text-3xl font-bold text-gray-800">Inventory Management</h1>

                    <button
                        onClick={() => setIsCreatingNewinventory(true)}
                        className="mb-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700"
                    >
                        + Add New Inventory
                    </button>

                    <Table
                        columns={columns}
                        dataSource={inventories}
                        rowKey="id"
                        loading={false}
                        bordered
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                        }}
                        scroll={{ x: 'max-content' }}
                    />

                    {/* <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
                <table className="w-full min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Item Name</th>
                            <th className="px-4 py-3 text-left">SKU</th>
                            <th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-left">Quantity</th>
                            <th className="px-4 py-3 text-left">Reorder Level</th>
                            <th className="px-4 py-3 text-left">Unit Price</th>
                            <th className="px-4 py-3 text-left">Location</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventories.length ? (
                            inventories.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-100">
                                    <td className="px-4 py-3">{item.id}</td>
                                    <td className="px-4 py-3">{item.item_name}</td>
                                    <td className="px-4 py-3">{item.sku}</td>
                                    <td className="px-4 py-3">{item.category}</td>
                                    <td className="px-4 py-3">{item.quantity}</td>
                                    <td className="px-4 py-3">{item.reorder_level}</td>
                                    <td className="px-4 py-3">${item.unit_price.toFixed(2)}</td>
                                    <td className="px-4 py-3">{item.location}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded px-2 py-1 text-white ${
                                                item.status === 'available'
                                                    ? 'bg-green-500'
                                                    : item.status === 'low-stock'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-red-500'
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="flex justify-center gap-2 px-4 py-3">
                                        <button className="rounded bg-yellow-500 px-3 py-1 text-white shadow hover:bg-yellow-600">
                                            Edit
                                        </button>
                                        <button className="rounded bg-red-500 px-3 py-1 text-white shadow hover:bg-red-600">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="p-9 text-center font-bold">
                                    No Inventory Items...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div> */}
                </div>
            )}

            {isCreatingNewinventory && <CreateInventory types={invnentoryType} handleBack={() => setIsCreatingNewinventory(false)} />}

            {editingItem && (
                <EditInventory
                    item={editingItem}
                    types={invnentoryType}
                    handleBack={() => setEditingItem(null)}
                    onSuccess={getInventories} // Refresh inventory after edit
                />
            )}

            < AllocationForm employees={securities} inventoryItems={inventories} />
        </Layout>
    );
};

export default InventoryManagement;
