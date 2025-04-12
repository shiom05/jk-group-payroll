import Layout from '@/layouts/Layout';
import { useState } from 'react';
import { router } from '@inertiajs/react';

const InventoryManagement = () => {
    const [inventories, setInventories] = useState([
        {
            id: 'INV001',
            item_name: 'Printer Paper',
            sku: 'PP-001',
            category: 'Office Supplies',
            quantity: 120,
            reorder_level: 50,
            unit_price: 4.99,
            location: 'Storage Room A',
            status: 'available',
        },
        {
            id: 'INV002',
            item_name: 'Stapler',
            sku: 'ST-002',
            category: 'Office Supplies',
            quantity: 8,
            reorder_level: 10,
            unit_price: 10.5,
            location: 'Shelf 2B',
            status: 'low-stock',
        },
        {
            id: 'INV003',
            item_name: 'Whiteboard Marker',
            sku: 'WM-003',
            category: 'Stationery',
            quantity: 0,
            reorder_level: 20,
            unit_price: 1.99,
            location: 'Drawer C',
            status: 'out-of-stock',
        },
    ]);

    return (
        <Layout>
            <div className="p-6 pt-20">
                <h1 className="mb-4 text-3xl font-bold text-gray-800">Inventory Management</h1>

                <button
                    onClick={() => router.get('/inventory-management/create-inventory')}
                    className="mb-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700"
                >
                    + Add New Inventory
                </button>

                <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
                    <table className="w-full min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Item Name</th>
                                <th className="px-4 py-3 text-left">SKU</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Quantity</th>
                                <th className="px-4 py-3 text-left">Reorder Level</th>
                                <th className="px-4 py-3 text-left">Unit Price</th>
                                <th className="px-4 py-3 text-left">Location</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventories.length ? (
                                inventories.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-100">
                                        <td className="px-4 py-3">{item.id}</td>
                                        <td className="px-4 py-3">{item.item_name}</td>
                                        <td className="px-4 py-3">{item.sku}</td>
                                        <td className="px-4 py-3">{item.category}</td>
                                        <td className="px-4 py-3">{item.quantity}</td>
                                        <td className="px-4 py-3">{item.reorder_level}</td>
                                        <td className="px-4 py-3">${item.unit_price.toFixed(2)}</td>
                                        <td className="px-4 py-3">{item.location}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded px-2 py-1 text-white ${
                                                    item.status === 'available'
                                                        ? 'bg-green-500'
                                                        : item.status === 'low-stock'
                                                        ? 'bg-yellow-500'
                                                        : 'bg-red-500'
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="flex justify-center gap-2 px-4 py-3">
                                            <button className="rounded bg-yellow-500 px-3 py-1 text-white shadow hover:bg-yellow-600">
                                                Edit
                                            </button>
                                            <button className="rounded bg-red-500 px-3 py-1 text-white shadow hover:bg-red-600">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="p-9 text-center font-bold">
                                        No Inventory Items...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default InventoryManagement;
