import { Pencil, Trash2 } from 'lucide-react';

interface ExpenseTableProps {
  expenses: any[];
  onEdit: (expense: any) => void;
  onDelete: (id: number) => void;
}

export default function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Expense List</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Type</th>
            <th className="border border-gray-300 px-4 py-2">Item/Description</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Amount (LKR)</th>
            <th className="border border-gray-300 px-4 py-2">Installments</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{exp.type}</td>
              <td className="border border-gray-300 px-4 py-2">{exp.item || exp.description}</td>
              <td className="border border-gray-300 px-4 py-2">{exp.date}</td>
              <td className="border border-gray-300 px-4 py-2">{exp.amount}</td>
              <td className="border border-gray-300 px-4 py-2">{exp.installments || '-'}</td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex justify-center space-x-2">
                  <button onClick={() => onEdit(exp)} className="text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onDelete(exp.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
