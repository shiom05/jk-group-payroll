import Layout from '@/layouts/Layout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { Alert } from '@/components/ui/alert';
import Security from '@/types/jk/security';
import { getBankDetails } from '@/services/security-managment.service';

interface editProps{
    securityData: Security,
    back: () => void;
}

const EditSecurity = ({securityData, back}:editProps) => {
    const { securityId } = securityData; // Assuming you have a route parameter for securityId
    const [showAlert, setShowAlert] = useState<boolean>(false);
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

    const saveBankDetails = async () => {
        const data = new FormData();
        for (const key in bankDetails) {
            if (bankDetails[key] !== null) {
                data.append(key, bankDetails[key]);
            }
        }
        data.append('security_id', securityId);

        try {
            let response = await axios.put(`/api/bank-details/${securityId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            setTimeout(() => {
                router.get('/security-management');
            }, 5000);
        } catch (error) {
            console.error('Error saving bank details:', error);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        const editData = new FormData()
        for (const key in formData) {
            if (key === 'securityPhoto' && formData[key]) {
                editData.append(key, formData[key]);

            } 

            else if(key === 'securityStatus'){
                if(formData['securityNicUploaded']==="true" && formData['securityPoliceReportUploaded'] && formData['securityBirthCertificateUploaded'] && formData['securityGramasewakaLetterUploaded']){
                    editData.append(key, '200');
                }
            }

            else if (formData[key] !== null) {
                editData.append(key, formData[key]);
            }
        }
        
        try {
            console.log(editData);
            let response = await axios.put(`/api/securities/${securityId}`, editData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            saveBankDetails(); // Save bank details after updating personal info
        } catch (error) {
            console.error('Error saving security:', error);
        }
    };

    useEffect(() => {
        const fetchSecurityData = async () => {
            try {
                setFormData({
                    securityName: securityData.securityName,
                    securityDob: securityData.securityDob,
                    securityNicNumber: securityData.securityNicNumber,
                    securityAddress: securityData.securityAddress,
                    securityPrimaryContact: securityData.securityPrimaryContact,
                    securitySecondaryContact: securityData.securitySecondaryContact,
                    securityPhoto: securityData.securityPhoto,
                    securityNicUploaded: securityData.securityNicUploaded,
                    securityPoliceReportUploaded: securityData.securityPoliceReportUploaded,
                    securityBirthCertificateUploaded: securityData.securityBirthCertificateUploaded,
                    securityGramasewakaLetterUploaded: securityData.securityGramasewakaLetterUploaded,
                    securityStatus: securityData.securityStatus,
                    securityDateOfJoin: securityData.securityDateOfJoin,
                });

                const bankRes = await getBankDetails(securityId);
                const bankData = bankRes.data;

                setBankDetails({
                    bank_name: bankData.bank_name,
                    bank_branch: bankData.bank_branch,
                    account_number: bankData.account_number,
                    bank_code: bankData.bank_code,
                    branch_code: bankData.branch_code,
                });
            } catch (error) {
                console.error('Error fetching security data:', error);
            }
        };

        fetchSecurityData();
    }, [securityId]);

    return (
        <>
            {showAlert && <Alert variant={'default'} />}
            <div className='pt-20 pb-20'>
                <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4 rounded-lg bg-white p-6 py-10 shadow-lg">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-700">Edit Security Personnel</h2>

                    {/* Personal Details Section */}
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

                    {/* Document Uploads Section */}
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

                    {/* Date of Join Section */}
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

                    {/* Bank Details Section */}
                    <fieldset className="mt-4 rounded-md border p-4">
                        <legend className="text-sm font-semibold text-gray-700">Bank Details</legend>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bank Name:</label>
                                <input
                                    type="text"
                                    name="bank_name"
                                    value={bankDetails.bank_name}
                                    onChange={handleBankDetailChange}
                                    required
                                    className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bank Branch:</label>
                                <input
                                    type="text"
                                    name="bank_branch"
                                    value={bankDetails.bank_branch}
                                    onChange={handleBankDetailChange}
                                    required
                                    className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Account Number:</label>
                                <input
                                    type="text"
                                    name="account_number"
                                    value={bankDetails.account_number}
                                    onChange={handleBankDetailChange}
                                    required
                                    className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bank Code:</label>
                                <input
                                    type="text"
                                    name="bank_code"
                                    value={bankDetails.bank_code}
                                    onChange={handleBankDetailChange}
                                    required
                                    className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Branch Code:</label>
                                <input
                                    type="text"
                                    name="branch_code"
                                    value={bankDetails.branch_code}
                                    onChange={handleBankDetailChange}
                                    required
                                    className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="mt-4 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </form>
           
                <button onClick={back} className="rounded bg-yellow-500 px-3 py-1 text-white shadow hover:bg-yellow-600">
                Back
                </button> 

            </div>
        </>
    );

     
};

export default EditSecurity;
