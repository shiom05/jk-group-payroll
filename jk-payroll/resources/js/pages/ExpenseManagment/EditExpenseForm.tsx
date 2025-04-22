import { useState, useEffect } from 'react';

interface ExpenseFormProps {
    onSubmit: (data: any) => void;
    initialData?: any;
    securityList: any[];
    onCancelUpdate: () => void;
}

export default function EditExpenseForm({ onSubmit, securityList, initialData, onCancelUpdate }: ExpenseFormProps) {
  const [formData, setFormData] = useState<any>({
    type: '',
    item: '',
    description: '',
    date: '',
    amount: '',
    installments: '',
    securityId: '',
    ...initialData
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      type: '',
      item: '',
      description: '',
      date: '',
      amount: '',
      installments: '',
      securityId: '',
    });
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="mb-10 space-y-4 rounded-lg bg-white p-6 shadow-md">
         <h2 className="text-2xl font-semibold text-gray-700">{'Edit Expense'}</h2>
        {formData.securityId == '' && <div>
          <label className="block text-sm font-medium text-gray-700">Select Security</label>
          <select name="securityId" value={formData.securityId} onChange={handleChange} className="mt-1 w-full rounded-md border p-2" required>
              <option value="">Select Security</option>
              {securityList.map((security) => (
                  <option key={security.securityId} value={security.securityId}>
                      {security.securityName}
                  </option>
              ))}
          </select>
      </div>   }      
      <div className="grid grid-cols-3 gap-4">
                 <div>
                     <label className="block text-sm font-medium text-gray-700">Expense Type</label>
                     <select name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full rounded-md border p-2" required>
                         <option value="">Select</option>
                         <option value="Inventory">Inventory</option>
                         <option value="Food">Food</option>
                         <option value="Travel">Travel</option>
                         <option value="Accommodation">Accommodation</option>
                         <option value="Loan">Loan</option>
                     </select>
                 </div>

                 {formData.type === 'Inventory' && (
                     <div>
                         <label className="block text-sm font-medium text-gray-700">Item</label>
                         <input
                             type="text"
                             name="item"
                             value={formData.item}
                             onChange={handleChange}
                             className="mt-1 w-full rounded-md border p-2"
                         />
                     </div>
                 )}

                 {['Food', 'Travel', 'Accommodation', 'Loan'].includes(formData.type) && (
                     <div>
                         <label className="block text-sm font-medium text-gray-700">Description</label>
                         <input
                             type="text"
                             name="description"
                             value={formData.description}
                             onChange={handleChange}
                             className="mt-1 w-full rounded-md border p-2"
                         />
                     </div>
                 )}

                 <div>
                     <label className="block text-sm font-medium text-gray-700">Date</label>
                     <input
                         type="date"
                         name="date"
                         value={formData.date}
                         onChange={handleChange}
                         className="mt-1 w-full rounded-md border p-2"
                         required
                     />
                 </div>

                 <div>
                     <label className="block text-sm font-medium text-gray-700">Amount (LKR)</label>
                     <input
                         type="number"
                         name="amount"
                         value={formData.amount}
                         onChange={handleChange}
                         className="mt-1 w-full rounded-md border p-2"
                         required
                     />
                 </div>

                 {formData.type === 'Loan' && (
                     <div>
                         <label className="block text-sm font-medium text-gray-700">Installments</label>
                         <input
                             type="number"
                             name="installments"
                             value={formData.installments}
                             onChange={handleChange}
                             className="mt-1 w-full rounded-md border p-2"
                         />
                     </div>
                 )}
      </div>

      <div className='flex flex-row gap-x-5'>
      <button type='button' onClick={()=>{onCancelUpdate()}} className="rounded-md bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700">
             Cancel Expense
      </button>

      <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">
             Update Expense
      </button>
      </div>
    </form>

      
    
    </>
     
  );
}
