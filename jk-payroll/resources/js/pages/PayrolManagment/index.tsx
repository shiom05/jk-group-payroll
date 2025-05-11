import Layout from '@/layouts/Layout';
import { getCurrentMonthShiftsForSecurity } from '@/services/logshift.service';
import { getAllocatedInventoriesForSecuriyCurrentMonth, getAllSecurities, getSecurityCurrentMonthExpenses, getSecurityCurrentMonthPayrollLoans } from '@/services/security-managment.service';
import Security from '@/types/jk/security';
import { PayCircleOutlined } from '@ant-design/icons';
import { Button, Drawer, Image, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import PayslipComponent from './PaySlip';

const { Title } = Typography;

const PayrolManagment = () => {
    const [securities, setSecurites] = useState<Security[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSecurity, setSelectedSecurity] = useState<Security | null>(null);

    const [shiftData, setShiftData]= useState<any>([])
    const [expenseData, setExpenseData]= useState<any>([])
    const [inventoryData, setInventoryData]= useState<number>(0);
    const [loanData, setLoanData]= useState<any>([]);

    const columns: ColumnsType<Security> = [
        {
            title: 'Photo',
            dataIndex: 'securityPhoto',
            key: 'securityPhoto',
            width: 100,
            render: (photo) => (
                <Image src={`/storage/${photo}`} alt="Security Photo" width={50} height={50} className="rounded-full object-cover" preview={false} />
            ),
        },

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
            title: 'Contact',
            dataIndex: 'securityPrimaryContact',
            key: 'securityPrimaryContact',
        },
        {
            title: 'Role',
            dataIndex: 'securityType',
            key: 'securityType',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div className="">
                    <Button icon={<PayCircleOutlined />} title="View Payroll" onClick={() => showLoading(record)} size="middle">
                        View Payroll
                    </Button>
                    {/* onClick={() => showLoading(record)} */}
                </div>
            ),
        },
    ];

    const fetchSecurites = async () => {
        const result = await getAllSecurities();
        setSecurites(result.data);
    };

    const getCurrentMonthShift = async (security:Security) => {
        setLoading(true);
        const result = await getCurrentMonthShiftsForSecurity(security.securityId);
        setShiftData(result.data);
        setLoading(false);
    };
    const getCurrentMonthExpenses = async (security:Security) => {
        
        setLoading(true);
        const result = await getSecurityCurrentMonthExpenses(security.securityId);
        setExpenseData(result.data); 
        setLoading(false);
    };
    const getCurrentMonthInventory = async (security:Security) => {
        setLoading(true);
        const result = await getAllocatedInventoriesForSecuriyCurrentMonth(security.securityId);
        setInventoryData(result.data.total_allocated_value);    
        setLoading(false); 
    };
    const getCurrentMonthLoan = async (security:Security) => {
        setLoading(true);
        const result = await getSecurityCurrentMonthPayrollLoans(security.securityId);
        setLoanData(result.data);    
        setLoading(false); 
    };

    useEffect(() => {
        fetchSecurites();
    }, []);

    const showLoading = (Security: Security) => {
        setOpen(true);
        setSelectedSecurity(Security);
        getCurrentMonthShift(Security);
        getCurrentMonthExpenses(Security);
        getCurrentMonthInventory(Security);
        getCurrentMonthLoan(Security);
        

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };
    const formatDate = (date: any) => {
        return new Intl.DateTimeFormat('en-GB').format(date); // dd/mm/yyyy
    };
    return (
        <Layout>
            <div className="p-10 pt-10">
                <Title level={2}>
                    {' '}
                    <PayCircleOutlined /> PAYROLL MANAGMENT
                </Title>

                <Table
                    columns={columns}
                    dataSource={securities}
                    rowKey="securityId"
                    pagination={false}
                    className="rounded-lg shadow-lg"
                    scroll={{ x: true }}
                    locale={{ emptyText: 'No Securities .....' }}
                />

                <Drawer
                    closable
                    title={<Title className='mb-0!' level={2}>{selectedSecurity?.securityName} | Payroll | {formatDate(new Date())}</Title>}
                    placement="right"
                    open={open}
                    loading={loading}
                    onClose={() => setOpen(false)}
                    size="large"
                    width={1000}
                >
                    <p><PayslipComponent totalShifts={shiftData} expenses={expenseData} security={selectedSecurity? selectedSecurity: null} inventoryExpenses={inventoryData} loanInstallment={loanData} /></p>
                </Drawer>
            </div>
        </Layout>
    );
};

export default PayrolManagment;
