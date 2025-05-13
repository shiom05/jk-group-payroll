import Layout from '@/layouts/Layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Security from '@/types/jk/security';
import ViewSecurity from './ViewSecurity';
import { getStatusText } from '@/utils/security';
import EditSecurity from './EditSecurity';
import { Table, Button, Tag, Popconfirm, Drawer, Divider } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { EyeOutlined, EditOutlined  } from '@ant-design/icons';
import BlackMarksList from './BlackarkManagment/BlackMarksList';
import SecurityTerminationForm from './ResignationManagment';
import Title from 'antd/es/typography/Title';
import { rehireSecurity } from '@/services/security-managment.service';


const SecurityManagment = () => {
    const [securities, setSecurities] = useState<any>([]);

    const [securitiesPending, setSecuritiesPending] = useState<any>([]); //who have not provided all data
    const [securitiesInactive, setSecuritiesInactive] = useState<any>([]); //to be terminated need to return all assets
    const [securitiesTerminated, setSecuritiesTerminated] = useState<any>([]); //terminated
 

    const [toViewSecuritySelected, setToViewSecuritySelected] = useState<Security | null>(null)
    const [toEditSecuritySelected, setToEditSecuritySelected] = useState<Security | null>(null)
    const [open, setOpen] = useState(false);
    const [toTerminateSecuritySelected, setToTerminateSecuritySelected] = useState<Security | null>(null)
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        setToTerminateSecuritySelected(null);
    };


    const fetchSecurities = async () => {
        try {
            const response = await axios.get('/api/all/securities');
            const data = response.data;
            const active = data.filter((sec:Security)=> sec.securityStatus === 200);
            const pending = data.filter((sec:Security)=> sec.securityStatus === 300);
            const inactive = data.filter((sec:Security)=> sec.securityStatus === 400);
            const terminated = data.filter((sec:Security)=> sec.securityStatus === 500);
            setSecurities(active);
            setSecuritiesPending(pending);
            setSecuritiesInactive(inactive);
            setSecuritiesTerminated(terminated);
        } catch (error) {
            console.error('Error fetching securities:', error);
        }
    };

    function getStatusText(code: number) {
        switch (code){
            case 200:
                return 'Active';
            case 300:
                return 'Pending';
            case 400:
                return 'Inactive';
            case 500:
                return 'Terminated';
        }
      }

    const columns: ColumnsType<Security> = [
        {
            title: 'ID',
            dataIndex: 'securityId',
            key: 'securityId',
            sorter: (a: any, b: any) => a.securityId - b.securityId,
        },
        {
            title: 'Name',
            dataIndex: 'securityName',
            key: 'securityName',
            sorter: (a: any, b: any) => a.securityName.localeCompare(b.securityName),
        },
        {
            title: 'NIC',
            dataIndex: 'securityNicNumber',
            key: 'securityNicNumber',
            sorter: (a: any, b: any) => a.securityNicNumber.localeCompare(b.securityNicNumber),
        },
        {
            title: 'Contact',
            dataIndex: 'securityPrimaryContact',
            key: 'securityPrimaryContact',
        },
        {
            title: 'Status',
            dataIndex: 'securityStatus',
            key: 'securityStatus',
            render: (status: number) => (
              <Tag color={getStatusText(status) === 'Active' ? 'green' : 'red'}>
                {getStatusText(status)}
              </Tag>
            ),
            filters: [
              { text: 'Active', value: 200 },
              { text: 'Pending', value: 300 },
              { text: 'Inactive', value: 400 },
              { text: 'Terminated', value: 500 },
            ],
            onFilter: (value: any, record: Security) => record.securityStatus === value,
          
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="flex justify-center gap-2">
                    <Button icon={<EditOutlined />} size="middle" onClick={() => setToEditSecuritySelected(record)} >Edit</Button>
                     <Button icon={<EyeOutlined />} size="middle" onClick={() => setToViewSecuritySelected(record)} >View</Button>                   

                    <Popconfirm title="Remove this Black Mark?" onConfirm={() => {showDrawer(); setToTerminateSecuritySelected(record);}} okText="Yes" cancelText="No">
                          <Button danger>Terminate</Button>
                      </Popconfirm>
                    
                </div>
            ),
        },
    ];
    const columnsPending: ColumnsType<Security> = [
        {
            title: 'ID',
            dataIndex: 'securityId',
            key: 'securityId',
            sorter: (a: any, b: any) => a.securityId - b.securityId,
        },
        {
            title: 'Name',
            dataIndex: 'securityName',
            key: 'securityName',
            sorter: (a: any, b: any) => a.securityName.localeCompare(b.securityName),
        },
        {
            title: 'NIC',
            dataIndex: 'securityNicNumber',
            key: 'securityNicNumber',
            sorter: (a: any, b: any) => a.securityNicNumber.localeCompare(b.securityNicNumber),
        },
        {
            title: 'Contact',
            dataIndex: 'securityPrimaryContact',
            key: 'securityPrimaryContact',
        },
        {
            title: 'Status',
            dataIndex: 'securityStatus',
            key: 'securityStatus',
            render: (status: number) => (
              <Tag color={getStatusText(status) === 'Active' ? 'green' : 'red'}>
                {getStatusText(status)}
              </Tag>
            ),
            filters: [
              { text: 'Active', value: 200 },
              { text: 'Pending', value: 300 },
              { text: 'Inactive', value: 400 },
              { text: 'Terminated', value: 500 },
            ],
            onFilter: (value: any, record: Security) => record.securityStatus === value,
          
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="flex justify-center gap-2">
                     <Button icon={<EditOutlined />} size="middle" onClick={() => setToEditSecuritySelected(record)} >Edit</Button>
                     <Button icon={<EyeOutlined />} size="middle" onClick={() => setToViewSecuritySelected(record)} >View</Button>                   
                </div>
            ),
        },
    ];
    const columnsInactive: ColumnsType<Security> = [
        {
            title: 'ID',
            dataIndex: 'securityId',
            key: 'securityId',
            sorter: (a: any, b: any) => a.securityId - b.securityId,
        },
        {
            title: 'Name',
            dataIndex: 'securityName',
            key: 'securityName',
            sorter: (a: any, b: any) => a.securityName.localeCompare(b.securityName),
        },
        {
            title: 'NIC',
            dataIndex: 'securityNicNumber',
            key: 'securityNicNumber',
            sorter: (a: any, b: any) => a.securityNicNumber.localeCompare(b.securityNicNumber),
        },
        {
            title: 'Contact',
            dataIndex: 'securityPrimaryContact',
            key: 'securityPrimaryContact',
        },
        {
            title: 'Status',
            dataIndex: 'securityStatus',
            key: 'securityStatus',
            render: (status: number) => (
              <Tag color={getStatusText(status) === 'Active' ? 'green' : 'red'}>
                {getStatusText(status)}
              </Tag>
            ),
            filters: [
              { text: 'Active', value: 200 },
              { text: 'Pending', value: 300 },
              { text: 'Inactive', value: 400 },
              { text: 'Terminated', value: 500 },
            ],
            onFilter: (value: any, record: Security) => record.securityStatus === value,
          
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="flex justify-center gap-2">
                    <Button icon={<EyeOutlined />} size="middle" onClick={() => setToViewSecuritySelected(record)} >View</Button>
                   
                    <Popconfirm title="Confirm Cancel Termination?" onConfirm={() => {rehireEmployee(record);}} okText="Yes" cancelText="No">
                          <Button>Cancel Termination</Button>
                      </Popconfirm>

                    <Popconfirm title="Terminate Security" onConfirm={() => {showDrawer(); setToTerminateSecuritySelected(record);}} okText="Yes" cancelText="No">
                          <Button danger>Complete Termination</Button>
                      </Popconfirm>
                    
                </div>
            ),
        },
    ];

    const rehireEmployee = async(security:Security)=>{
        const result = await rehireSecurity(security.securityId, {
             resignationEffectiveDate: null,
            resignationReason: null,
            resignationAdditionalInfo: null,
            securityIsResigned: false,
            hasReturnedAllAssets: false
        });
        fetchSecurities();
    }

    const columnsTerminated: ColumnsType<Security> = [
        {
            title: 'ID',
            dataIndex: 'securityId',
            key: 'securityId',
            sorter: (a: any, b: any) => a.securityId - b.securityId,
        },
        {
            title: 'Name',
            dataIndex: 'securityName',
            key: 'securityName',
            sorter: (a: any, b: any) => a.securityName.localeCompare(b.securityName),
        },
        {
            title: 'NIC',
            dataIndex: 'securityNicNumber',
            key: 'securityNicNumber',
            sorter: (a: any, b: any) => a.securityNicNumber.localeCompare(b.securityNicNumber),
        },
        {
            title: 'Contact',
            dataIndex: 'securityPrimaryContact',
            key: 'securityPrimaryContact',
        },
        {
            title: 'Status',
            dataIndex: 'securityStatus',
            key: 'securityStatus',
            render: (status: number) => (
              <Tag color={getStatusText(status) === 'Active' ? 'green' : 'red'}>
                {getStatusText(status)}
              </Tag>
            ),
            filters: [
              { text: 'Active', value: 200 },
              { text: 'Pending', value: 300 },
              { text: 'Inactive', value: 400 },
              { text: 'Terminated', value: 500 },
            ],
            onFilter: (value: any, record: Security) => record.securityStatus === value,
          
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="flex justify-center gap-2">
                    
                     <Button icon={<EyeOutlined />} size="middle" onClick={() => setToViewSecuritySelected(record)} > View </Button>
                   
                    <Popconfirm title="Rehire" onConfirm={() => {rehireEmployee(record)}} okText="Yes" cancelText="No">
                          <Button >Rehire</Button>
                      </Popconfirm>
                    
                </div>
            ),
        },
    ];

   
      

    useEffect(() => {
        fetchSecurities();
    }, []);

    return (
        <Layout>
            {!toViewSecuritySelected && !toEditSecuritySelected && (
                <div className="min-h-screen p-6">
                    <h1 className="mb-4 text-3xl font-bold text-gray-800">Security Managment</h1>

                    <button
                        onClick={() => {
                            router.get('/security-management/create-security');
                        }}
                        className="mb-4 cursor-pointer! rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700"
                    >
                        + Add New Security
                    </button>

                    <Divider orientation="left">
                        {' '}
                        <Title level={3}>Active Securities</Title>{' '}
                    </Divider>
                    <Table
                        columns={columns}
                        dataSource={securities}
                        rowKey="securityId"
                        pagination={false}
                        className="rounded-lg shadow-lg"
                        scroll={{ x: true }}
                        locale={{ emptyText: 'No Securities .....' }}
                    />

                    <div className="mt-14">
                        <Divider orientation="left">
                            {' '}
                            <Title level={3}>Pending Securities</Title>{' '}
                        </Divider>
                        <Table
                            columns={columnsPending}
                            dataSource={securitiesPending}
                            rowKey="securityId"
                            pagination={false}
                            className="rounded-lg shadow-lg"
                            scroll={{ x: true }}
                            locale={{ emptyText: 'No Securities .....' }}
                        />
                    </div>

                    <div className="mt-14">
                        <Divider orientation="left">
                            {' '}
                            <Title level={3}>Inactive Securities</Title>{' '}
                        </Divider>
                        <Table
                            columns={columnsInactive}
                            dataSource={securitiesInactive}
                            rowKey="securityId"
                            pagination={false}
                            className="rounded-lg shadow-lg"
                            scroll={{ x: true }}
                            locale={{ emptyText: 'No Securities .....' }}
                        />
                    </div>
                    <div className="mt-14">
                        <Divider orientation="left">
                            {' '}
                            <Title level={3}>Terminated Securities</Title>{' '}
                        </Divider>
                        <Table
                            columns={columnsTerminated}
                            dataSource={securitiesTerminated}
                            rowKey="securityId"
                            pagination={false}
                            className="rounded-lg shadow-lg"
                            scroll={{ x: true }}
                            locale={{ emptyText: 'No Securities .....' }}
                        />
                    </div>
                </div>
            )}

            {toViewSecuritySelected && <ViewSecurity security={toViewSecuritySelected} back={() => setToViewSecuritySelected(null)} />}
            {toEditSecuritySelected && <EditSecurity securityData={toEditSecuritySelected} back={() => setToEditSecuritySelected(null)} />}

            {toTerminateSecuritySelected && (
                <Drawer title="Terminating Employee" closable={{ 'aria-label': 'Close Button' }} onClose={onClose} open={open} width={900}  maskClosable={false} >
                    <SecurityTerminationForm
                        security={toTerminateSecuritySelected}
                        onCancel={() => {
                             onClose();
                        }}
                    />
                </Drawer>
            )}
        </Layout>
    );
};

export default SecurityManagment;
