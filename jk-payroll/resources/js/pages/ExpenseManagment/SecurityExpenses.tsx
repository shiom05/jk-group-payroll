import { fetchSecurities } from '@/services/security-managment.service';
import { useEffect, useState } from 'react';
import EditExpenseForm from './EditExpenseForm';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import ViewExpense from './ViewExpense';

const mockExpenses = [
    {
        id: 1,
        type: 'Inventory',
        item: 'Uniform',
        date: '2025-04-01',
        amount: 5000,
        securityId: 1,
    },
    {
        id: 2,
        type: 'Food',
        description: 'Lunch',
        date: '2025-04-10',
        amount: 1500,
        securityId: 2,
    },
    {
        id: 3,
        type: 'Loan',
        description: 'Advance Payment',
        date: '2025-04-05',
        amount: 10000,
        installments: 5,
        securityId: 1,
    },
];

export default function SecurityExpenses() {
    const [expenses, setExpenses] = useState<any[]>(mockExpenses);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [securities, setSecurities] = useState([]);

    useEffect(() => {
        fetchSecurities()
            .then((res) => {
                setSecurities(res.data);
            })
            .catch((error) => console.log(error));
    });

    const handleAddExpense = (newExpense: any) => {
        setExpenses((prev) => [...prev, { ...newExpense, id: Date.now() }]);
    };

    const handleEditExpense = (expense: any) => {
        setEditingId(expense.id);
    };

    const handleUpdateExpense = (updatedExpense: any) => {
        setExpenses((prev) => prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp)));
        setEditingId(null);
    };

    const handleDeleteExpense = (id: number) => {
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    };

    const expenseToEdit = expenses.find((exp) => exp.id === editingId);

    return (
        <>
            <div className="mx-auto max-w-6xl pt-10 pb-20">
              


                {!editingId ? (
                    <ExpenseForm onSubmit={handleAddExpense} initialData={expenseToEdit} securityList={securities} />
                ) : (
                    <EditExpenseForm
                        onSubmit={handleUpdateExpense}
                        initialData={expenseToEdit}
                        securityList={securities}
                        onCancelUpdate={() => setEditingId(null)}
                    />
                )}
                {!editingId? <ExpenseTable expenses={expenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />: <ViewExpense expenses={[expenseToEdit]} isEdit={true} /> }
                
            </div>
        </>
    ); 
}
