import { SecurityBlackMark } from '@/services/blackmark.service';
import { SecurityCompensation } from '@/services/compensation.service';
import Security from '@/types/jk/security';
import { Card, Table, Typography } from 'antd';
import { useMemo } from 'react';

const { Title, Text } = Typography;

interface PayslipPorps {
    totalShifts: any[];
    expenses: any[];
    inventoryExpenses: number;
    security: Security | null;
    loanInstallment: any,
    finesData: SecurityBlackMark[],
    compensationData: SecurityCompensation[]
}

const PayslipComponent = ({ totalShifts, expenses, inventoryExpenses, security, loanInstallment, finesData,   compensationData }: PayslipPorps) => {

console.log({expenses, inventoryExpenses, security, loanInstallment, finesData, compensationData })

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const totalShiftPay = useMemo(() => {
  return totalShifts.reduce((totalPay: number, shift: any) => {
    return totalPay + shift.security_total_pay_for_shift;
  }, 0);
}, [totalShifts]); 

const totalAccomdation = useMemo(() => {
  return expenses.reduce((total: number, expense: any) => {
    if(expense.type === "Accommodation"){
      total+= expense.amount;
    }
    return total;
  }, 0);
}, [expenses]); 

const totalTravel = useMemo(() => {
  return expenses.reduce((total: number, expense: any) => {
    if(expense.type === "Travel"){
      total+= expense.amount;
    }
    return total;
  }, 0);
}, [expenses]); 

const totalFood = useMemo(() => {
  return expenses.reduce((total: number, expense: any) => {
    if(expense.type === "Food"){
      total+= expense.amount;
    }
    return total;
  }, 0);
}, [expenses]); 

const totalSalaryAdvances = useMemo(() => {
  return expenses.reduce((total: number, expense: any) => {
    if(expense.type === "SalaryAdvance"){
      total+= expense.amount;
    }
    return total;
  }, 0);
}, [expenses]); 

// const totalInventoryExpense = useMemo(() => {
//   return inventoryExpenses.reduce((total: number, inventory: any) => {
//    total += inventory.items.reduce((transactionTotal: any, item: any)=> {
//       transactionTotal+= parseInt(item.unit_price);
//       return transactionTotal;
//     }, 0)
//     return total;
//   }, 0);
// }, [inventoryExpenses]); 

const totalFines = useMemo(() => {
  return finesData.reduce((totalFineAmount: number, fine: SecurityBlackMark) => {
    if(fine.fine_amount){
       totalFineAmount += fine.fine_amount;
    }
    return totalFineAmount;
  }, 0);
}, [finesData]); 

const totalCompensation = useMemo(() => {
  return compensationData.reduce((totalAmount: number, compensation: SecurityCompensation) => {
    if(compensation.amount){
       totalAmount += parseInt(compensation.amount.toString());
    }
    return totalAmount; 
  }, 0);
}, [compensationData]); 

const totalInventoryExpense = inventoryExpenses;

const totalLoan = useMemo(() => {
  return loanInstallment.reduce((total: number, loan: any) => {
    total+= loan.installment_amount;
    return total;
  }, 0);
}, [loanInstallment]); 

const bankCharge = (security?.bank_details.is_commercial_bank === "true" || security?.bank_details.is_commercial_bank === true)? 0: 100;


console.log({totalShiftPay, totalAccomdation, totalFood, totalTravel, totalLoan, inventoryExpenses,totalSalaryAdvances, totalInventoryExpense, totalFines, totalCompensation })

    // Sample payslip data
    const payslipData = [
        { key: 'basic', label: 'Basic Salary', amount: '17,500.00' },
        { key: 'br1', label: 'BR 1 Allowance', amount: '1,000.00' },
        { key: 'br2', label: 'BR 2 Allowance', amount: '2,500.00' }, //what if they dont have a total shift> 21000??? 
        { key: 'basicEpf', label: 'BASIC SALARY FOR EPF', amount: '21, 000.00', isBold: true },
        { key: 'ot', label: 'OT', amount: formatNumber(totalShiftPay - 21000) },

        { key: 'space-1', label: '', amount: '' },

        { key: 'gross', label: 'GROSS SALARY', amount: formatNumber(totalShiftPay) },
        { key: 'space-2', label: '', amount: '' },
        { key: 'compensation', label: 'Compensation', amount: totalCompensation? formatNumber(totalCompensation) : '-'},

        { key: 'deductions', label: 'DEDUTIONS:', amount: '', isBold: true},

        { key: 'salaryadavances', label: 'Salary Advances', amount: totalSalaryAdvances >0?formatNumber(totalSalaryAdvances): '-', isDeduction: true },
        { key: 'food', label: 'Food', amount: totalFood >0?formatNumber(totalFood): '-', isDeduction: true },
        { key: 'transport', label: 'Transport', amount: totalTravel >0?formatNumber(totalTravel): '-', isDeduction: true },
        { key: 'accomadation', label: 'accomadation', amount: totalAccomdation >0?formatNumber(totalAccomdation): '-', isDeduction: true },
        { key: 'uniform', label: 'Uniform', amount: totalInventoryExpense >0?formatNumber(totalInventoryExpense): '-', isDeduction: true },

        { key: 'fines', label: 'fines', amount: totalFines? formatNumber(totalFines) : '-', isDeduction: true },

        { key: 'bankchanrges', label: 'bank charges', amount: bankCharge>0?formatNumber(bankCharge): '-', isDeduction: true },
        // { key: 'welfare', label: 'welfare', amount: '5,000.00', isDeduction: true }, //ask whayt this is?
        // { key: 'epf', label: 'epf', amount: '1,200.00', isDeduction: true }, //clarify

        { key: 'otherLoanInstl', label: 'other: Loan Instl', amount: totalLoan >0?formatNumber(totalLoan): '-', isDeduction: true },
        
        // { key: 'space-3', label: '', amount: '' },
        // { key: 'totalDeduction', label: 'Total deductions', amount: '500.00', isDeduction: true },
        
        // { key: 'space-4', label: '', amount: '' }, 
        // { key: 'netsalary', label: 'net salary', amount: '500.00', isBold: true },

    ];

    // Calculate totals
    const earnings = totalShiftPay+ totalCompensation;
    const deductions = totalAccomdation+totalFood+totalSalaryAdvances+ totalTravel + totalLoan+ inventoryExpenses+ bankCharge;
    const netSalary = earnings - deductions;

    const columns: any = [
        {
            dataIndex: 'label',
            key: 'label',
            render: (text: string, record: any) => <Text  className={`${record.isBold ? 'font-extrabold': 'font-medium'}`}>{text.toLocaleUpperCase()}</Text>,
        },
        {
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (text: string, record: any) => (
                <Text type={record.isDeduction ? 'danger' : 'success'}>
                    {record.isDeduction ? '-' : ''}
                    {text}
                </Text>
            ),
        },
    ];

    return (
        <Card
            title={<Title level={3}>Monthly Payslip - May 2025</Title>}
            style={{ maxWidth: 600, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
            {security && (
                <div style={{ marginBottom: 24 }}>
                    <Text strong>Employee: </Text>
                    <Text>{security.securityName}</Text>
                    <br />
                    <Text strong>Employee ID: </Text>
                    <Text>{security.securityId}</Text>
                    <br />
                    <Text strong>Designation: </Text>
                    <Text>{security.securityType}</Text>
                </div>
            )}

            <Table
                dataSource={payslipData}
                columns={columns}
                pagination={false}
                showHeader={false}
                bordered
                size="middle"
                style={{ marginBottom: 24 }}
            />

            <div style={{ background: '#fafafa', padding: 16, borderRadius: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong>Total Earnings:</Text>
                    <Text strong type="success">
                        {earnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text strong>Total Deductions:</Text>
                    <Text strong type="danger">
                        -{deductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                    <Text strong style={{ fontSize: 16 }}>
                        Net Salary Payable:
                    </Text>
                    <Text strong style={{ fontSize: 16 }} type="success">
                        {netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
                </div>
            </div>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Text type="secondary">This is a computer generated payslip and does not require a signature.</Text>
            </div>
        </Card>
    );
};

export default PayslipComponent;
