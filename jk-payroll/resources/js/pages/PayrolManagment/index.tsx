import Layout from '@/layouts/Layout';
import { getCurrentMonthShiftsForSecurity } from '@/services/logshift.service';
import { getAllocatedInventoriesForSecuriyCurrentMonth, getAllSecurities, getSecurityCurrentMonthExpenses, getSecurityCurrentMonthPayrollLoans } from '@/services/security-managment.service';
import Security from '@/types/jk/security';
import { PayCircleOutlined } from '@ant-design/icons';
import { Button, DatePicker, Drawer, Form, Image, Typography } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import PayslipComponent from './PaySlip';
import { fetchDeductibleBlackMarks, SecurityBlackMark } from '@/services/blackmark.service';
import dayjs from 'dayjs';
import { getCurrentMonthCompensations, SecurityCompensation } from '@/services/compensation.service';

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
    const [finesData, setFinesData] = useState<SecurityBlackMark[]>([]);
    const [compensationData, setCompensationData] = useState<SecurityCompensation[]>([]);

    const [form] = Form.useForm();
    const [selectedDate, setSelectedDate] = useState<any>(null); // State variable for selected date


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
        const result = await getCurrentMonthShiftsForSecurity(security.securityId, selectedDate);
        setShiftData(result.data);
        setLoading(false);
    };
    const getCurrentMonthExpenses = async (security:Security) => {
        
        setLoading(true);
        const result = await getSecurityCurrentMonthExpenses(security.securityId, selectedDate);
        setExpenseData(result.data); 
        setLoading(false);
    };
    const getCurrentMonthInventory = async (security:Security) => {
        setLoading(true);
        const result = await getAllocatedInventoriesForSecuriyCurrentMonth(security.securityId, selectedDate);
        setInventoryData(result.data.total_allocated_value);    
        setLoading(false); 
    };
    const getCurrentMonthLoan = async (security:Security) => {
        setLoading(true);
        const result = await getSecurityCurrentMonthPayrollLoans(security.securityId, selectedDate);
        setLoanData(result.data);    
        setLoading(false); 
    };

    const getCurrentMonthFines = async (security:Security) => {
        setLoading(true);
        const result = await fetchDeductibleBlackMarks(security.securityId, selectedDate);
        setFinesData(result);    
        setLoading(false); 
    };

       const getCurrentMonthCompenstions = async (security:Security) => {
        setLoading(true);
        const result = await getCurrentMonthCompensations(security.securityId, selectedDate);
        setCompensationData(result);    
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
        getCurrentMonthFines(Security);
        getCurrentMonthCompenstions(Security);
        

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };
    const formatDate = (date: any) => {
        return new Intl.DateTimeFormat('en-GB').format(date); // dd/mm/yyyy
    };

    const onFinish = (values: any) => {
    const formattedDate = values.date ? dayjs(values.date).format('YYYY-MM-DD') : null;
    console.log('Selected Date:', formattedDate);
    setSelectedDate(formattedDate);
  };


    return (
        <Layout>
            <div className="p-10 pt-10">
                <Title level={2}>
                    {' '}
                    <PayCircleOutlined /> PAYROLL MANAGMENT
                </Title>

                  <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Select a Date"
        name="date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker className="w-full" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Date
        </Button>
      </Form.Item>
 </Form>
      {selectedDate && (
        <>
        <div>
          <strong>Selected Date for API:</strong> {selectedDate}
        </div>
                <Table
                    columns={columns}
                    dataSource={securities}
                    rowKey="securityId"
                    pagination={false}
                    className="rounded-lg shadow-lg"
                    scroll={{ x: true }}
                    locale={{ emptyText: 'No Securities .....' }}
                />
</>
      )}
   


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
                    <p><PayslipComponent totalShifts={shiftData} expenses={expenseData} security={selectedSecurity? selectedSecurity: null} inventoryExpenses={inventoryData} loanInstallment={loanData} finesData={finesData} compensationData={compensationData} /></p>
                </Drawer>
            </div>
        </Layout>
    );
};

export default PayrolManagment;
