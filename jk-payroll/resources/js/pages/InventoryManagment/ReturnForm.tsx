// import React, { useState } from 'react';
// import { useForm } from '@inertiajs/react';
// import { Table, Tag, Select, Button, DatePicker, Form, InputNumber, Space, Card } from 'antd';
// import type { ColumnsType } from 'antd/es/table';
// import { UserOutlined, UndoOutlined } from '@ant-design/icons';
// interface InventoryType {
//     id: number;
//     name: string;
//   }
  

// interface InventoryItem {
//     id: number;
//     inventory_type_id: number;
//     inventory_type: InventoryType;
//     size: string | null;
//     condition: 'new' | 'returned';
//     quantity: number;
//     purchase_price: number;
//     purchase_date: string;
//     last_restocked_at: string | null;
//     is_available: boolean;
// }

// interface ReturnFormProps {
//   employees: { id: number; name: string }[];
//   inventoryItems: InventoryItem[];
//   transactions: any[];
//   onSuccess?: () => void;
// }

// const ReturnForm: React.FC<ReturnFormProps> = ({ employees, inventoryItems, transactions, onSuccess }) => {
//   const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
//   const [selectedItems, setSelectedItems] = useState<{id: number; quantity: number}[]>([]);
//   const { data, setData, post, processing } = useForm({
//     employee_id: '',
//     items: [],
//     transaction_date: new Date().toISOString().split('T')[0],
//     original_transaction_id: null
//   });

//   const handleSubmit = async () => {
//     post('/api/inventory/transactions/return', {
//       onSuccess: () => {
//         setSelectedItems([]);
//         setSelectedTransaction(null);
//         onSuccess?.();
//       }
//     });
//   };

//   const columns: ColumnsType<any> = [
//     {
//       title: 'Item',
//       dataIndex: 'id',
//       render: (id) => {
//         const item = inventoryItems.find(i => i.id === id);
//         return `${item?.inventory_type.name}${item?.size ? ` (${item.size})` : ''}`;
//       }
//     },
//     {
//       title: 'Condition',
//       dataIndex: 'condition',
//       render: (condition) => (
//         <Tag color={condition === 'new' ? 'green' : 'orange'}>
//           {condition.toUpperCase()}
//         </Tag>
//       )
//     },
//     {
//       title: 'Quantity',
//       dataIndex: 'quantity'
//     },
//     {
//       title: 'Action',
//       render: (_, record, index) => (
//         <Button danger onClick={() => {
//           const newItems = [...selectedItems];
//           newItems.splice(index, 1);
//           setSelectedItems(newItems);
//           setData('items', newItems);
//         }}>
//           Remove
//         </Button>
//       )
//     }
//   ];

//   return (
//     <Card title={<><UndoOutlined /> Return Inventory</>}>
//       <Form layout="vertical" onFinish={handleSubmit}>
//         <Form.Item label="Original Allocation (Optional)">
//           <Select
//             placeholder="Select original transaction"
//             options={transactions.map(t => ({
//               value: t.id,
//               label: `#${t.id} - ${t.employee.name} - ${new Date(t.created_at).toLocaleDateString()}`
//             }))}
//             onChange={value => {
//               const transaction = transactions.find(t => t.id === value);
//               setSelectedTransaction(transaction);
//               setData('original_transaction_id', value);
//               setData('employee_id', transaction.employee_id);
//             }}
//             allowClear
//           />
//         </Form.Item>

//         <Form.Item label="Security Officer" required>
//           <Select
//             value={data.employee_id}
//             onChange={value => setData('employee_id', value)}
//             options={employees.map(e => ({ value: e.id, label: e.name }))}
//             placeholder="Select security officer"
//             disabled={!!selectedTransaction}
//           />
//         </Form.Item>

//         <Form.Item label="Return Date" required>
//           <DatePicker
//             value={data.transaction_date ? dayjs(data.transaction_date) : null}
//             onChange={date => setData('transaction_date', date?.format('YYYY-MM-DD'))}
//             style={{ width: '100%' }}
//           />
//         </Form.Item>

//         {selectedTransaction && (
//           <Form.Item label="Items to Return">
//             <Table
//               columns={[
//                 { title: 'Item', dataIndex: ['inventory_item', 'type', 'name'] },
//                 { title: 'Size', dataIndex: ['inventory_item', 'size'] },
//                 { 
//                   title: 'Condition', 
//                   dataIndex: 'condition',
//                   render: (condition) => (
//                     <Tag color={condition === 'new' ? 'green' : 'orange'}>
//                       {condition.toUpperCase()}
//                     </Tag>
//                   )
//                 },
//                 { title: 'Allocated Qty', dataIndex: 'quantity' },
//                 {
//                   title: 'Return Qty',
//                   render: (_, record, index) => (
//                     <InputNumber 
//                       min={1} 
//                       max={record.quantity} 
//                       defaultValue={record.quantity}
//                       onChange={value => {
//                         const items = [...selectedItems];
//                         const existingIndex = items.findIndex(i => i.id === record.inventory_item_id);
                        
//                         if (existingIndex >= 0) {
//                           items[existingIndex].quantity = value || 1;
//                         } else {
//                           items.push({
//                             id: record.inventory_item_id,
//                             quantity: value || 1
//                           });
//                         }
                        
//                         setSelectedItems(items);
//                         setData('items', items);
//                       }}
//                     />
//                   )
//                 }
//               ]}
//               dataSource={selectedTransaction.items}
//               rowKey="id"
//               pagination={false}
//             />
//           </Form.Item>
//         )}

//         {!selectedTransaction && (
//           <Form.Item label="Add Returned Items">
//             <Space.Compact style={{ width: '100%' }}>
//               <Select
//                 style={{ width: '60%' }}
//                 placeholder="Select item"
//                 options={inventoryItems.map(i => ({
//                   value: i.id,
//                   label: `${i.type.name}${i.size ? ` (${i.size})` : ''}`
//                 }))}
//               />
//               <InputNumber 
//                 style={{ width: '20%' }} 
//                 min={1} 
//                 placeholder="Qty" 
//               />
//               <Button 
//                 type="primary" 
//                 icon={<UserOutlined />}
//                 onClick={() => {
//                   // Implement add logic
//                 }}
//               >
//                 Add
//               </Button>
//             </Space.Compact>
//           </Form.Item>
//         )}

//         {selectedItems.length > 0 && (
//           <>
//             <Table
//               columns={columns}
//               dataSource={selectedItems.map(item => {
//                 const inventoryItem = inventoryItems.find(i => i.id === item.id);
//                 return {
//                   ...item,
//                   condition: inventoryItem?.condition
//                 };
//               })}
//               rowKey="id"
//               pagination={false}
//               size="small"
//             />
//             <div style={{ marginTop: 16, textAlign: 'right' }}>
//               <span style={{ marginRight: 16 }}>
//                 <strong>Total Items:</strong> {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
//               </span>
//             </div>
//           </>
//         )}

//         <Form.Item style={{ marginTop: 24 }}>
//           <Button 
//             type="primary" 
//             htmlType="submit" 
//             loading={processing}
//             disabled={!data.employee_id || selectedItems.length === 0}
//           >
//             Process Return
//           </Button>
//         </Form.Item>
//       </Form>
//     </Card>
//   );
// };

// export default ReturnForm;