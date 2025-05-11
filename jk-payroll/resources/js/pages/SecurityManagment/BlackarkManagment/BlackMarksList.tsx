import { fetchBlackMarks, SecurityBlackMark } from '@/services/blackmark.service';
import Security from '@/types/jk/security';
import { EyeOutlined, PlusCircleFilled, EditOutlined } from '@ant-design/icons';
import { Button, Card, Select, Space, Spin, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import BlackMarkForm from './BlackMarkForm';

const { Option } = Select;

interface BlackMarksListProps {
    security: Security;
}

const BlackMarksList = ({ security }: BlackMarksListProps) => {
    const [blackMarks, setBlackMarks] = useState<SecurityBlackMark[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');

    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [isView, setView] = useState<SecurityBlackMark | null>(null);
    const [toEdit, setToEdit] = useState<SecurityBlackMark | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                if (statusFilter === '') {
                    const data = await fetchBlackMarks({security_id: security.securityId});
                    setBlackMarks(data);
                } else {
                    const data = await fetchBlackMarks({ status: statusFilter, security_id: security.securityId });
                    setBlackMarks(data);
                }
            } catch (error) {
                console.error('Error loading black marks:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [statusFilter]);

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Incident Date',
            dataIndex: 'incident_date',
            key: 'incident_date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <Tag color={status === 'completed' ? 'green' : 'orange'}>{status.toUpperCase()}</Tag>,
        },
        {
            title: 'Fine',
            dataIndex: 'fine_amount',
            key: 'fine_amount',
            render: (amount: number | null) => (amount ? `$${amount}` : '-'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: SecurityBlackMark) => (
               <>
                <Button icon={<EyeOutlined />} size="small" onClick={() => setView(record)}>
                    View
                </Button>
                <Button icon={<EditOutlined />} size="small" onClick={() => setToEdit(record)}>
                    Edit
                </Button>
               </>
            ),
        },
    ];

    return (
        <>
            {!isView && (
                <div style={{ padding: 24 }} className="mt-20">
                    <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Typography.Title level={2} style={{ margin: 0 }}>
                            Security Black Mark Managment
                        </Typography.Title>
                        <Button type="primary" icon={<PlusCircleFilled />} onClick={() => setIsAdd(true)} size="large">
                            Add Black Mark
                        </Button>
                    </Space>

                    <Space style={{ marginBottom: 16 }}>
                        <Select
                            placeholder="Filter by status"
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value)}
                            style={{ width: 200 }}
                            allowClear
                        >
                            <Option value="">All</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="completed">Completed</Option>
                        </Select>
                    </Space>

                    <Card>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <Table rowKey="id" dataSource={blackMarks} columns={columns} pagination={{ pageSize: 10 }} />
                        )}
                    </Card>
                </div>
            )}

            {(isAdd || toEdit) && <BlackMarkForm idEditing={!toEdit? false: true} BlackMark={toEdit? toEdit: null} security={security} onCancel={() =>{ setIsAdd(false); setToEdit(null)}} />}
        </>
    );
};

export default BlackMarksList;
