import { deleteExpenseSecurity, deleteLoanSecurity, fetchSecurities, getAllExpenses, getAllLoans } from '@/services/security-managment.service';
import { PlusCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import EditExpenseForm from './EditExpenseForm';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import ViewExpense from './ViewExpense';
import LoansTable from './LoanTable';


export default function SecurityExpenses() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loans, setLoans] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loanEditingId, setLoanEditingId] = useState<number | null>(null);
    const [securities, setSecurities] = useState([]);
    const [isCreateNewExpense, setIsCreateNewExpense] = useState<boolean>(false);

    const [loanToEdit, setLoantoEdit]= useState<any>(null);
    const [expenseToEdit, setExpensetoEdit]= useState<any>(null);

    useEffect(() => {
        fetchSecurities()
            .then((res) => {
                setSecurities(res.data);
            })
            .catch((error) => console.log(error));

            fetchAllSecurityExpesnes();
            fetchAllSecurityLoans();
    }, [isCreateNewExpense]);


    const fetchAllSecurityExpesnes = async()=>{
     const result = await getAllExpenses();
     setExpenses(result.data)
    }
    const fetchAllSecurityLoans= async()=>{
     const result = await getAllLoans();
     setLoans(result.data);
     console.log(result.data)
    }


    const handleEditExpense = (expense: any) => {
        setEditingId(expense.id);
    };
    const handleEditLoan = (loan: any) => {
        setLoanEditingId(loan.id);
    };

    const handleDeleteExpense = async(expenseId: any) => {
        console.log('...deleting', expenseId)
        const resut = await deleteExpenseSecurity(expenseId);
        console.log(resut.data);
        fetchAllSecurityExpesnes();
    };

    const handleDeleteLoan = async(loanId: any) => {
        const resut = await deleteLoanSecurity(loanId);
        console.log(resut);
        fetchAllSecurityLoans();
    };

    useEffect(()=>{

        if(editingId){
          const editExpense =  expenses.find((exp) => exp.id === editingId);
          setExpensetoEdit(editExpense)
        }

        if(loanEditingId){
            const editLoan =  loans.find((loan) => loan.id === loanEditingId);
            setLoantoEdit(editLoan)
        }

    },[editingId, loanEditingId]);

    return (
        <>
            <div className="mx-auto max-w-6xl pt-10 pb-20">
                <Button
                    className="mb-10!"
                    onClick={() => setIsCreateNewExpense(true)}
                    icon={<PlusCircleFilled />}
                    type={isCreateNewExpense ? 'primary' : 'dashed'}
                    size="large"
                    disabled={editingId !== null}
                >
                    Add New Security Expense
                </Button>
                {(editingId || loanEditingId) && !isCreateNewExpense && (
                    <EditExpenseForm
                        initialData={editingId?expenseToEdit: loanToEdit}
                        onCancelUpdate={() =>{
                            setEditingId(null);
                            fetchAllSecurityExpesnes();
                        }}
                        onCancelLoanUpdate={() =>{
                            setLoanEditingId(null);
                            fetchAllSecurityLoans();
                        }}
                        isLoanEdit= {loanEditingId? true: false}
                    />
                )}

                {isCreateNewExpense && (!editingId && !loanEditingId) && (
                    <ExpenseForm  onCancel={()=>setIsCreateNewExpense(false)}  securityList={securities} />
                )}

                {(editingId || loanEditingId) && (loanToEdit || expenseToEdit) && <ViewExpense isLoan={loanEditingId? true: false} expenses={[editingId?expenseToEdit: loanToEdit]} isEdit={true} />}

                {(!editingId && !loanEditingId) && !isCreateNewExpense && <ExpenseTable expenses={expenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />}
                {(!editingId && !loanEditingId) && !isCreateNewExpense && <LoansTable loans={loans} onEdit={handleEditLoan} onDelete={handleDeleteLoan} />}
            </div>
        </>
    );
}
