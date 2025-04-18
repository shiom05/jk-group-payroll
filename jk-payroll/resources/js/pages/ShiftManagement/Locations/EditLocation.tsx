import { useState } from 'react';

interface Location {
    id: string;
    locationName: string;
    locationType: string;
    address: string;
    oicRate: string;
    sargentRate: string;
    costapalRate: string;
}

interface EditLocationProps {
    location: Location;
    onSave: (updatedLocation: Location) => void;
    onCancel: () => void;
}

const EditLocation = ({ location, onSave, onCancel }: EditLocationProps) => {
    const [formData, setFormData] = useState<Location>(location);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            id: '',
            locationName: '',
            locationType: '',
            address: '',
            oicRate: '',
            sargentRate: '',
            costapalRate: '',
        });
        onCancel();

    };

    return (
        <div className="mb-10">
                <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-lg">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-700">Edit Location</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location Name:</label>
                            <input
                                type="text"
                                name="locationName"
                                value={formData.locationName}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location Type:</label>
                            <input
                                type="text"
                                name="locationType"
                                value={formData.locationType}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Address:</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">OIC Hourly Rate (LKR):</label>
                            <input
                                type="number"
                                name="oicRate"
                                value={formData.oicRate}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sargent Hourly Rate (LKR):</label>
                            <input
                                type="number"
                                name="sargentRate"
                                value={formData.sargentRate}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Costapal Hourly Rate (LKR):</label>
                            <input
                                type="number"
                                name="costapalRate"
                                value={formData.costapalRate}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            
        </div>
    );
};

export default EditLocation;