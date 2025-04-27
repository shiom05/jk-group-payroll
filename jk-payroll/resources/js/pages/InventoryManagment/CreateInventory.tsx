import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { saveInventory } from '@/services/security-managment.service';

const CreateInventory = ({ types, handleBack }: { types: any, handleBack: ()=> void}) => {
    const [selectedType, setSelectedType] = useState<any>(null);
    const { data, setData, post, processing, errors } = useForm({
        inventory_type_id: '',
        size: '',
        quantity: 1,
        purchase_price: '',
        purchase_date: new Date().toISOString().split('T')[0]
    });

    const handleTypeChange = (e: any) => {
        const typeId = e.target.value;
        const type = types.find((t:any) => t.id == typeId);
        setSelectedType(type);
        setData({
            ...data,
            inventory_type_id: typeId,
            size: '',
            purchase_price: type?.standard_price || ''
        });
    };

    const handleSubmit = async(e: any) => {
        e.preventDefault();
        console.log(data);
        const result = await saveInventory(data);
        console.log(result);
        handleBack();
        // post(route('inventory.items.store'));
    };

    const generateSizes = (range: string) => {
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
        // <Layout>
            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-6">Add Inventory Item</h2>
                        
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
                                    >
                                        <option value="">Select Type</option>
                                        {types.map((type: any) => (
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
                                        >
                                            <option value="">Select Size</option>
                                            {generateSizes(selectedType.size_range).map((size: any) => (
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
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.quantity}
                                        onChange={(e: any) => setData('quantity', e.target.value)}
                                        className="w-full rounded-md border p-2 shadow-sm"
                                        required
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
                                    />
                                    {errors.purchase_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.purchase_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 shadow-md transition hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700"
                                >
                                    {processing ? 'Saving...' : 'Save Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        // </Layout>
    );
};

export default CreateInventory;