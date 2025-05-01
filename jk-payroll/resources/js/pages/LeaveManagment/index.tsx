import Layout from '@/layouts/Layout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateLeave from './CreateLeave';
import { formatDate, getLeaveStatus } from '@/utils/security';
import { Button, Table, Tag, Space, Popconfirm, message } from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import EditLeave from './EditLeave';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [leaveEdit, setLeaveEdit]= useState<any>(null);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get('api/security-leaves');
      setLeaves(response.data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    }
  };

  const deleteLeave = async (id: number) => {
    try {
      console.log(id)
      await axios.delete(`api/security-leaves/${id}`);
      fetchLeaves();
    } catch (error) {
      console.error('Failed to delete leave:', error);
      message.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const columns = [
    {
      title: 'Employee',
      dataIndex: ['security', 'securityName'],
      key: 'employee',
    },
    {
      title: 'Type',
      dataIndex: 'leave_type',
      key: 'type',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Start',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (text: string) => formatDate(text),
    },
    {
      title: 'End',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (text: string) => formatDate(text),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: any) => {
        const status = getLeaveStatus(record.start_date, record.end_date);
        const color = status === 'Pending' ? 'gold' : status === 'Completed' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
                  <Button icon={<EditOutlined />} type="link" onClick={() => setLeaveEdit(record)} />
                  <Button icon={<DeleteOutlined />} type="link" danger onClick={() => deleteLeave(record.leave_id)} />
                </Space>
      )
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Security Leave Management</h1>

        {(!showCreateForm && !leaveEdit) && (
          <>
            <Button
              type="primary"
              className="mb-4"
              onClick={() => setShowCreateForm(true)}
            >
              + Create Leave
            </Button>

            <Table
              columns={columns}
              dataSource={leaves}
              rowKey="id"
              bordered
            />
          </>
        )}

        {(showCreateForm && !leaveEdit) && (
          <CreateLeave onClose={() => {
            setShowCreateForm(false);
            fetchLeaves();
          }} />
        )}

        {
          (leaveEdit && !showCreateForm) && 
          <EditLeave leave={leaveEdit} onUpdate={()=>{setLeaveEdit(null);fetchLeaves()}} onClose={()=> setLeaveEdit(null)}  />
        }
      </div>
    </Layout>
  );
};

export default LeaveManagement;
