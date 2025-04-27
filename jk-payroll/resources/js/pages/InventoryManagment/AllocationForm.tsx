import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Table, Tag, Select, Button, DatePicker, Form, InputNumber, Space, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UserOutlined, ShoppingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Security from '@/types/jk/security';
import { allocateInventory } from '@/services/security-managment.service';

interface InventoryType {
  id: number;
  name: string;
}

interface InventoryItem {
    id: number;
    inventory_type_id: number;
    inventory_type: InventoryType;
    size: string | null;
    condition: 'new' | 'returned';
    quantity: number;
    purchase_price: number;
    purchase_date: string;
    last_restocked_at: string | null;
    is_available: boolean;
}

interface AllocationItem {
  id: number;
  quantity: number;
}

interface FormData {
  securityId: string;
  items: AllocationItem[];
  transaction_date: string;
}

interface AllocationFormProps {
  employees: Security[];
  inventoryItems: InventoryItem[];
  onSuccess?: () => void;
}

const AllocationForm: React.FC<AllocationFormProps> = ({ employees, inventoryItems, onSuccess }) => {
  const [selectedItems, setSelectedItems] = useState<AllocationItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  
  const { data, setData, post, processing } = useForm<any>({
    security_id: '',
    items: [],
    transaction_date: new Date().toISOString().split('T')[0] 
  });

  const handleSubmit = async () => {
    console.log(data);
    const result = await allocateInventory(data);
    console.log(result.data);
    // post('/api/inventory/allocate', {
    //   onSuccess: () => {
    //     setSelectedItems([]);
    //     onSuccess?.();
    //   }
    // });
  };

  const addItem = () => {
    if (!selectedItemId) return;
    
    const newItem = { id: selectedItemId, quantity: selectedQuantity };
    setSelectedItems(prev => [...prev, newItem]);
    setData('items', [...data.items, newItem]);
    setSelectedItemId(null);
    setSelectedQuantity(1);
  };

  const removeItem = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
    setData('items', newItems);
  };

  const columns: ColumnsType<AllocationItem> = [
    {
      title: 'Item',
      dataIndex: 'id',
      render: (id) => {
        const item = inventoryItems.find(i => i.id === id);
        return `${item?.inventory_type.name}${item?.size ? ` (${item.size})` : ''}`;
      }
    },
    {
      title: 'Condition',
      dataIndex: 'id',
      render: (id) => {
        const item = inventoryItems.find(i => i.id === id);
        return (
          <Tag color={item?.condition === 'new' ? 'green' : 'orange'}>
            {item?.condition.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity'
    },
    {
      title: 'Unit Price',
      dataIndex: 'id',
      render: (id) => {
        const item = inventoryItems.find(i => i.id === id);
        return `$${item?.purchase_price}`;
      }
    },
    {
      title: 'Action',
      render: (_, __, index) => (
        <Button danger onClick={() => removeItem(index)}>Remove</Button>
      )
    }
  ];

  return (
    <Card title={<><ShoppingOutlined /> Allocate Inventory</>}>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Security Officer" required>
          <Select
            value={data.security_id}
            onChange={value => setData('security_id', value)}
            options={employees.map((e: Security) => ({ value: e.securityId, label: e.securityName }))}
            placeholder="Select security officer"
          />
        </Form.Item>

        <Form.Item label="Allocation Date" required>
          <DatePicker
            value={data.transaction_date ? dayjs(data.transaction_date) : null}
            onChange={date => setData('transaction_date', date?.format('YYYY-MM-DD') || '')}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Add Items">
          <Space.Compact style={{ width: '100%' }}>
            <Select
              style={{ width: '60%' }}
              placeholder="Select item"
              options={inventoryItems
                .filter(i => i.quantity > 0)
                .map(i => ({
                  value: i.id,
                  label: `${i.inventory_type.name}${i.size ? ` (${i.size})` : ''} - $${i.purchase_price}`
                }))}
              value={selectedItemId}
              onChange={value => setSelectedItemId(value)}
            />
            <InputNumber 
              style={{ width: '20%' }} 
              min={1} 
              placeholder="Qty"
              value={selectedQuantity}
              onChange={value => setSelectedQuantity(value || 1)}
            />
            <Button 
              type="primary" 
              icon={<UserOutlined />}
              onClick={addItem}
              disabled={!selectedItemId}
            >
              Add
            </Button>
          </Space.Compact>
        </Form.Item>

        {selectedItems.length > 0 && (
          <>
            <Table
              columns={columns}
              dataSource={selectedItems}
              rowKey="id"
              pagination={false}
              size="small"
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <span style={{ marginRight: 16 }}>
                <strong>Total Items:</strong> {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
              <span>
                <strong>Total Value:</strong> $
                {selectedItems.reduce((sum, item) => {
                  const inventoryItem = inventoryItems.find(i => i.id === item.id);
                  return sum + (inventoryItem?.purchase_price || 0) * item.quantity;
                }, 0)}
              </span>
            </div>
          </>
        )}

        <Form.Item style={{ marginTop: 24 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={processing}
            disabled={!data.security_id || selectedItems.length === 0}
          >
            Allocate Inventory
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AllocationForm;