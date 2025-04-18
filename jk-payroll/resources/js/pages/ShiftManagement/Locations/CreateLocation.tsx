import { useState } from 'react';

const CreateLocation = () => {
    const [showCreate, setShowCreate] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        locationName: '',
        locationType: '',
        address: '',
        oicRate: '',
        sargentRate: '',
        costapalRate: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        // setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setFormData({
            locationName: '',
            locationType: '',
            address: '',
            oicRate: '',
            sargentRate: '',
            costapalRate: '',
        });
        setShowCreate(false)
    };

    return (
        <>
            <button
                onClick={() => setShowCreate(true)}
                className="mb-10 cursor-pointer! rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
                + Add New Location
            </button>

            {showCreate && (
                <form onSubmit={handleSubmit} className="max-w mb-10 space-y-4 rounded-lg bg-white p-6 py-10 shadow-lg">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-700">Location Form</h2>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location Name:</label>
                            <input
                                type="text"
                                name="locationName"
                                value={formData.locationName}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
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
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">OIC Hourly Rate (LKR):</label>
                            <input
                                type="number"
                                name="oicRate"
                                value={formData.oicRate}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sargent Hourly Rate (LKR):</label>
                            <input
                                type="number"
                                name="sargentRate"
                                value={formData.sargentRate}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Costapal Hourly Rate (LKR):</label>
                            <input
                                type="number"
                                name="costapalRate"
                                value={formData.costapalRate}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div className="col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Address:</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row gap-x-4">
                        <button
                            type="button"
                            onClick={() => setShowCreate(false)}
                            className="mt-4 w-1/4 cursor-pointer rounded-md bg-red-600 px-4 py-2 text-white shadow-md transition hover:bg-red-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="mt-4 w-1/4 cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            )}
        </>
    );
};

export default CreateLocation;
