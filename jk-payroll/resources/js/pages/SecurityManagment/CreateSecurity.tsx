import Layout from '@/layouts/Layout';
import { useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { Alert } from '@/components/ui/alert';

const CreateSecurity = () => {
    const [showAlert, setShowAlert]= useState<boolean>();
    const [formData, setFormData] = useState<any>({
        securityName: '',
        securityDob: '',
        securityNicNumber: '',
        securityAddress: '',
        securityPrimaryContact: '',
        securitySecondaryContact: '',
        securityPhoto: null,
        securityNicUploaded: false,
        securityPoliceReportUploaded: false,
        securityBirthCertificateUploaded: false,
        securityGramasewakaLetterUploaded: false,
        securityStatus: 300,
        securityDateOfJoin: '',
    });

    const [bankDetails, setBankDetails] = useState<any>({
        bank_name: '',
        bank_branch: '',
        account_number: '',
        bank_code: '',
        branch_code: ''
    });

    const handleBankDetailChange = (e: any) => {
        const { name, value } = e.target;
        setBankDetails({
            ...bankDetails,
            [name]: value
        });
    };

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e: any) => {
        setFormData({
            ...formData,
            securityPhoto: e.target.files[0],
        });
    };

    const saveBankDetials= async(id: any)=>{
        const data = new FormData();
        for (const key in bankDetails) {
            if (bankDetails[key] !== null) {
                data.append(key, bankDetails[key]);
            }

        }
        data.append('security_id', id);

        try {
            let response = await axios.post('/api/bank-details', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            console.log(response.data);
            setShowAlert(true)
            setTimeout(()=>{
                setShowAlert(false)
                router.get("/security-management");
            },5000)

        } catch (error) {
            console.error('Error saving bank details:', error);
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        const data = new FormData();
        for (const key in formData) {
            if (key === 'securityPhoto' && formData[key]) {
                data.append(key, formData[key]);

            } else if(key === 'securityStatus'){
                if(formData['securityNicUploaded'] && formData['securityPoliceReportUploaded'] && formData['securityBirthCertificateUploaded'] && formData['securityGramasewakaLetterUploaded']){
                    data.append(key, '200');
                }
            }
            else if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        }

        try {
            let response = await axios.post('/api/securities', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            console.log(response.data);
            saveBankDetials(response.data.securityId)
          
        } catch (error) {
            console.error('Error saving security:', error);
        }
    };

    return (
        <Layout>
           { showAlert && <Alert variant={'default'} />}
            <div className='pt-20 pb-20'>
                <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4 rounded-lg bg-white p-6 py-10 shadow-lg">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-700">Security Personnel Form</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name:</label>
                            <input
                                type="text"
                                name="securityName"
                                value={formData.securityName}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Birth:</label>
                            <input
                                type="date"
                                name="securityDob"
                                value={formData.securityDob}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">NIC Number:</label>
                            <input
                                type="text"
                                name="securityNicNumber"
                                value={formData.securityNicNumber}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Address:</label>
                            <textarea
                                name="securityAddress"
                                value={formData.securityAddress}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Primary Contact:</label>
                            <input
                                type="text"
                                name="securityPrimaryContact"
                                value={formData.securityPrimaryContact}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Secondary Contact:</label>
                            <input
                                type="text"
                                name="securitySecondaryContact"
                                value={formData.securitySecondaryContact}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Photo:</label>
                            <input
                                type="file"
                                name="securityPhoto"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border file:border-gray-300 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-gray-200"
                            />
                        </div>
                    </div>

                    <fieldset className="rounded-md border p-4">
                        <legend className="text-sm font-semibold text-gray-700">Uploads</legend>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="securityNicUploaded"
                                    checked={formData.securityNicUploaded}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-300"
                                />
                                <span>NIC Uploaded</span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="securityPoliceReportUploaded"
                                    checked={formData.securityPoliceReportUploaded}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-300"
                                />
                                <span>Police Report Uploaded</span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="securityBirthCertificateUploaded"
                                    checked={formData.securityBirthCertificateUploaded}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-300"
                                />
                                <span>Birth Certificate Uploaded</span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="securityGramasewakaLetterUploaded"
                                    checked={formData.securityGramasewakaLetterUploaded}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-300"
                                />
                                <span>Gramasewaka Letter Uploaded</span>
                            </label>
                        </div>
                    </fieldset>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Join:</label>
                            <input
                                type="date"
                                name="securityDateOfJoin"
                                value={formData.securityDateOfJoin}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>
                    </div>

                    <h2 className="mb-4 text-2xl font-semibold text-gray-700 mt-10">Security Bank Detials Form</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bank Name: </label>
                            <input
                                type="text"
                                name="bank_name"
                                value={bankDetails.bank_name}
                                onChange={handleBankDetailChange}
                                placeholder="Bank Name"
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bank Name: </label>
                            <input
                                type="text"
                                name="bank_code"
                                value={bankDetails.bank_code}
                                onChange={handleBankDetailChange}
                                placeholder="Bank Code"
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bank Name: </label>
                            <input
                                type="text"
                                name="bank_branch"
                                value={bankDetails.bank_branch}
                                onChange={handleBankDetailChange}
                                placeholder="Bank Branch"
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bank Name: </label>
                            <input
                                type="text"
                                name="branch_code"
                                value={bankDetails.branch_code}
                                onChange={handleBankDetailChange}
                                placeholder="Branch Code"
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bank Name: </label>
                            <input
                                type="text"
                                name="account_number"
                                value={bankDetails.account_number}
                                onChange={handleBankDetailChange}
                                placeholder="Account Number"
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>
                    </div>


                   <div className='grid grid-cols-2 gap-4'>
                   <button type="button" onClick={()=>{router.get("/security-management")}} className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white shadow-md transition hover:bg-red-700 cursor-pointer!">
                        cancel
                    </button>
                    <button type="submit" className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700 cursor-pointer!">
                        Save
                    </button>
                   </div>
                </form>
            </div>

        </Layout>
    );
};

export default CreateSecurity;
