import React from "react";
interface ExpenseTableProps {
  expenses: any[];
  isEdit: boolean
}

export default function ViewExpense({ expenses, isEdit }: ExpenseTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{isEdit? 'Editing Expense' : 'Expense List'}</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Type</th>
            <th className="border border-gray-300 px-4 py-2">Item/Description</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Amount (LKR)</th>
            <th className="border border-gray-300 px-4 py-2">Installments</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
