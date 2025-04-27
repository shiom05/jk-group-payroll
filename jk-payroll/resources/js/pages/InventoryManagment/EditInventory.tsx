import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { editInventoryitems, saveInventory } from '@/services/security-managment.service';
// import { updateInventory, restockInventory } from '@/services/security-management.service';

interface InventoryType {
  id: number;
  name: string;
  track_size: boolean;
  size_range: string | null;
  standard_price: number;
}

interface InventoryItem {
  id: number;
  inventory_type_id: number;
  inventory_type: InventoryType;
  size: string | null;
  condition: 'new' | 'returned';
  quantity: number;
  purchase_price: string;
  purchase_date: string;
  last_restocked_at: string | null;
  is_available: boolean;
}

interface EditInventoryProps {
  item: InventoryItem;
  types: InventoryType[];
  handleBack: () => void;
  onSuccess?: () => void;
}

const EditInventory: React.FC<EditInventoryProps> = ({ item, types, handleBack, onSuccess }) => {
  const [mode, setMode] = useState<'edit' | 'restock'>('edit');
  const [selectedType, setSelectedType] = useState<InventoryType | null>(item.inventory_type || null);
  
  const { data, setData, put, processing, errors } = useForm({
    inventory_type_id: item.inventory_type_id.toString(),
    size: item.size || '',
    condition: item.condition,
    quantity: item.quantity,
    purchase_price: item.purchase_price,
    purchase_date: item.purchase_date.split('T')[0],
    last_restocked_at: item.last_restocked_at?.split('T')[0]
  });

  const restockForm = useForm({
    restock_quantity: 1,
    restock_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    setSelectedType(types.find(t => t.id === item.inventory_type_id) || null);
  }, [item, types]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeId = e.target.value;
    const type = types.find((t: any) => t.id == typeId) || null;
    setSelectedType(type);
    setData('inventory_type_id', typeId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editInventoryitems(item.id, {
        ...item,
        ...data
      });
      onSuccess?.();
      handleBack();
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
     const {data: {restock_date, restock_quantity }} = restockForm;

      await saveInventory({
        ...item,
        last_restocked_at: restock_date,
        quantity: restock_quantity
      });
      onSuccess?.();
      handleBack();
    } catch (error) {
      console.error('Error restocking inventory:', error);
    }
  };

  const generateSizes = (range: string | null) => {
    if (!range) return [];
    const [start, end] = range.split('-').map(Number);
    if (isNaN(start) || isNaN(end)) return [];
    const sizes = [];
    for (let i = start; i <= end; i++) {
      sizes.push(i.toString());
    }
    return sizes;
  };

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {mode === 'edit' ? 'Edit Inventory Item' : 'Restock Inventory Item'}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setMode('edit')}
                className={`px-4 py-2 rounded-md ${mode === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Edit
              </button>
              <button
                onClick={() => setMode('restock')}
                className={`px-4 py-2 rounded-md ${mode === 'restock' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                Restock
              </button>
            </div>
          </div>

          {mode === 'edit' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Type
                  </label>
                  <select
                    value={data.inventory_type_id}
                    onChange={handleTypeChange}
                    className="w-full rounded-md border p-2 shadow-sm"
                    required
                    disabled={processing}
                  >
                    <option value="">Select Type</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {errors.inventory_type_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.inventory_type_id}</p>
                  )}
                </div>

                {selectedType?.track_size && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <select
                      value={data.size}
                      onChange={(e) => setData('size', e.target.value)}
                      className="w-full rounded-md border p-2 shadow-sm"
                      required
                      disabled={processing}
                    >
                      <option value="">Select Size</option>
                      {generateSizes(selectedType.size_range).map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    {errors.size && (
                      <p className="mt-1 text-sm text-red-600">{errors.size}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={data.condition}
                    onChange={(e) => setData('condition', e.target.value as 'new' | 'returned')}
                    className="w-full rounded-md border p-2 shadow-sm"
                    required
                    disabled={processing}
                  >
                    <option value="new">New</option>
                    <option value="returned">Returned</option>
                  </select>
                  {errors.condition && (
                    <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Quantity
                  </label>
                  <input
                    type="number"
                    value={data.quantity}
                    min="0"
                    onChange={(e) => setData('quantity', parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border p-2 shadow-sm"
                    required
                    disabled={processing}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.purchase_price}
                    onChange={(e) => setData('purchase_price', e.target.value)}
                    className="w-full rounded-md border p-2 shadow-sm"
                    required
                    disabled={processing}
                  />
                  {errors.purchase_price && (
                    <p className="mt-1 text-sm text-red-600">{errors.purchase_price}</p>
                  )}
                </div>
              
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={data.purchase_date}
                    onChange={(e) => setData('purchase_date', e.target.value)}
                    className="w-full rounded-md border p-2 shadow-sm"
                    required
                    disabled={processing}
                  />
                  {errors.purchase_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.purchase_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Restock Date
                  </label>
                  <input
                    type="date"
                    value={data.last_restocked_at}
                    onChange={(e) => setData('last_restocked_at', e.target.value)}
                    className="w-full rounded-md border p-2 shadow-sm"
                    required
                    disabled={processing}
                  />
                  {errors.last_restocked_at && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_restocked_at}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 shadow-md transition hover:bg-gray-300"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700"
                >
                  {processing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRestockSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Quantity
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    className="w-full rounded-md border p-2 shadow-sm bg-gray-100"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity to Add
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={restockForm.data.restock_quantity}
                    onChange={(e) => restockForm.setData('restock_quantity', parseInt(e.target.value) || 1)}
                    className="w-full rounded-md border p-2 shadow-sm"
                    required
                    disabled={restockForm.processing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restock Date
                  </label>
                  <input
                    type="date"
                    value={restockForm.data.restock_date}
                    onChange={(e) => restockForm.setData('restock_date', e.target.value)}
                    className="w-full rounded-md border p-2 shadow-sm"
                    required
                    disabled={restockForm.processing}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 shadow-md transition hover:bg-gray-300"
                  disabled={restockForm.processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={restockForm.processing}
                  className="rounded-md bg-green-600 px-4 py-2 text-white shadow-md transition hover:bg-green-700"
                >
                  {restockForm.processing ? 'Restocking...' : 'Restock Item'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditInventory;