import Layout from '@/layouts/Layout';
import { useState } from 'react';
import { router } from '@inertiajs/react';

const CreateInventory = () => {
    const [formData, setFormData] = useState({
        id: '',
        item_name: '',
        sku: '',
        category: '',
        description: '',
        quantity: '',
        reorder_level: '',
        unit_price: '',
        location: '',
        status: 'available',
        created_at: '',
        updated_at: ''
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(formData);
        // Add your axios post here later
    };

    return (
        <Layout>
            <div className='pt-20 pb-20'>
                <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4 rounded-lg bg-white p-6 py-10 shadow-lg">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-700">Inventory Management Form</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Inventory ID</label>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Item Name</label>
                            <input
                                type="text"
                                name="item_name"
                                value={formData.item_name}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">SKU</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Reorder Level</label>
                            <input
                                type="number"
                                name="reorder_level"
                                value={formData.reorder_level}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                            <input
                                type="number"
                                step="0.01"
                                name="unit_price"
                                value={formData.unit_price}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm"
                            >
                                <option value="available">Available</option>
                                <option value="low-stock">Low Stock</option>
                                <option value="out-of-stock">Out of Stock</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Created At</label>
                            <input
                                type="datetime-local"
                                name="created_at"
                                value={formData.created_at}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Updated At</label>
                            <input
                                type="datetime-local"
                                name="updated_at"
                                value={formData.updated_at}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => router.get('/inventory-management')}
                            className="rounded-md bg-red-600 px-4 py-2 text-white shadow-md transition hover:bg-red-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CreateInventory;
