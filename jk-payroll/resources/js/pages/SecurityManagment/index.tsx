import Layout from '@/layouts/Layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Security from '@/types/jk/security';
import ViewSecurity from './ViewSecurity';
import { getStatusText } from '@/utils/security';
import EditSecurity from './EditSecurity';

const SecurityManagment = () => {
    const [securities, setSecurities] = useState<any>([]);
    const [toViewSecuritySelected, setToViewSecuritySelected] = useState<Security | null>(null)
    const [toEditSecuritySelected, setToEditSecuritySelected] = useState<Security | null>(null)

    const fetchSecurities = async () => {
        try {
            const response = await axios.get('/api/securities');
            setSecurities(response.data);
        } catch (error) {
            console.error('Error fetching securities:', error);
        }
    };


    useEffect(() => {
        fetchSecurities();
    }, []);

    return (
        <Layout>
            {(!toViewSecuritySelected && !toEditSecuritySelected) && <div className="  p-6">
                <h1 className="mb-4 text-3xl font-bold text-gray-800">Security Managment</h1>


                <button onClick={() => {router.get("/security-management/create-security")}} className="mb-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700 cursor-pointer!">
                    + Add New Security
                </button>


                {/* Security Table */}
                <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
                    <table className="w-full min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">NIC</th>
                                <th className="px-4 py-3 text-left">Contact</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {securities.length?securities.map((security: any) => (
                                <tr key={security.securityId} className="border-b hover:bg-gray-100">
                                    <td className="px-4 py-3">{security.securityId}</td>
                                    <td className="px-4 py-3">{security.securityName}</td>
                                    <td className="px-4 py-3">{security.securityNicNumber}</td>
                                    <td className="px-4 py-3">{security.securityPrimaryContact}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded px-2 py-1 text-white ${
                                                getStatusText(security.securityStatus) === 'Active' ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                        >
                                            {security.securityStatus}
                                        </span>
                                    </td>
                                    <td className="flex justify-center gap-2 px-4 py-3">
                                        <button
                                            onClick={() => setToEditSecuritySelected(security)}
                                            className="rounded bg-yellow-500 px-3 py-1 text-white shadow hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => (setToViewSecuritySelected(security))}
                                            className="rounded bg-red-500 px-3 py-1 text-white shadow hover:bg-red-600"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            )): <tr><td className='flex items-center w-full p-9 font-bold' ><p>No Securities .....</p> </td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>}

            {
              toViewSecuritySelected && <ViewSecurity security={toViewSecuritySelected} back={()=>setToViewSecuritySelected(null)} />  
            }
            {
              toEditSecuritySelected && <EditSecurity securityData={toEditSecuritySelected} back={()=>setToEditSecuritySelected(null)} />  
            }
        </Layout>
    );
};

export default SecurityManagment;
