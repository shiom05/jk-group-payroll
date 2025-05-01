import Layout from '@/layouts/Layout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { Alert } from '@/components/ui/alert';
import Security from '@/types/jk/security';
import { getBankDetails } from '@/services/security-managment.service';
import { formatDateForInput } from '@/utils/security';

interface editProps {
    securityData: Security,
    back: () => void;
}

const EditSecurity = ({ securityData, back }: editProps) => {
    const { securityId } = securityData;
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({
        securityName: '',
        securityDob: '',
        securityNicNumber: '',
        securityPrimaryContact: '',
        securitySecondaryContact: '',
        securityPhoto: null,
        securityNicUploaded: false,
        securityPoliceReportUploaded: false,
        securityBirthCertificateUploaded: false,
        securityGramasewakaLetterUploaded: false,
        securityStatus: 300,
        securityDateOfJoin: '',
        // New fields
        securityGender: 'male',
        securityDistrict: '',
        securityPoliceDivision: '',
        securityGramaNiladariDivision: '',
        securityEducationalInfo: '',
        securityMaritalStatus: false,
        securityPreviousWorkplace: '',
        securityExperience: '',
        securityEmergencyContactName: '',
        securityEmergencyContactAddress: '',
        securityEmergencyContactNumber: '',
        securityAdditionalInfo: '',
        securityEpfNumber: '', // Only editable in edit mode
    });

    const [bankDetails, setBankDetails] = useState<any>({
        bank_name: '',
        bank_branch: '',
        account_number: '',
        // New bank fields
        bank_account_holder_name: '',
        is_commercial_bank: false,
    });

    const handleBankDetailChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setBankDetails({
            ...bankDetails,
            [name]: type === 'checkbox' ? checked : value,
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
            await axios.put(`/api/bank-details/${securityId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setTimeout(() => {
                router.get('/security-management');
            }, 5000);
        } catch (error) {
            console.error('Error saving bank details:', error);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        const editData = new FormData();
        for (const key in formData) {
            if (key === 'securityPhoto' && formData[key]) {
                editData.append(key, formData[key]);
            } else if (key === 'securityStatus') {
                if (formData['securityNicUploaded'] && formData['securityPoliceReportUploaded'] && 
                    formData['securityBirthCertificateUploaded'] && formData['securityGramasewakaLetterUploaded']) {
                    editData.append(key, '200');
                }
            } else if (formData[key] !== null) {
                editData.append(key, formData[key]);
            }
        }
        
        try {
            await axios.put(`/api/securities/${securityId}`, editData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            saveBankDetails();
        } catch (error) {
            console.error('Error saving security:', error);
        }
    };

    useEffect(() => {
        const fetchSecurityData = async () => {
            try {
                setFormData({
                    ...formData,
                    securityName: securityData.securityName,
                    securityDob: formatDateForInput(securityData.securityDob),
                    securityNicNumber: securityData.securityNicNumber,
                    securityPrimaryContact: securityData.securityPrimaryContact,
                    securitySecondaryContact: securityData.securitySecondaryContact,
                    securityPhoto: securityData.securityPhoto,
                    securityNicUploaded: securityData.securityNicUploaded,
                    securityPoliceReportUploaded: securityData.securityPoliceReportUploaded,
                    securityBirthCertificateUploaded: securityData.securityBirthCertificateUploaded,
                    securityGramasewakaLetterUploaded: securityData.securityGramasewakaLetterUploaded,
                    securityStatus: securityData.securityStatus,
                    securityDateOfJoin: formatDateForInput(securityData.securityDateOfJoin),
                    
                    securityCurrentAddress: securityData.securityCurrentAddress,
                    securityPermanentAddress:  securityData.securityPermanentAddress,
                    // New fields
                    securityType: securityData.securityType,
                    securityGender: securityData.securityGender || 'male',
                    securityDistrict: securityData.securityDistrict || '',
                    securityPoliceDivision: securityData.securityPoliceDivision || '',
                    securityGramaNiladariDivision: securityData.securityGramaNiladariDivision || '',
                    securityEducationalInfo: securityData.securityEducationalInfo || '',
                    securityMaritalStatus: securityData.securityMaritalStatus || false,
                    securityPreviousWorkplace: securityData.securityPreviousWorkplace || '',
                    securityExperience: securityData.securityExperience || '',
                    securityEmergencyContactName: securityData.securityEmergencyContactName || '',
                    securityEmergencyContactAddress: securityData.securityEmergencyContactAddress || '',
                    securityEmergencyContactNumber: securityData.securityEmergencyContactNumber || '',
                    securityAdditionalInfo: securityData.securityAdditionalInfo || '',
                    securityEpfNumber: securityData.securityEpfNumber || '', // EPF number from existing data
                });

                const bankRes = await getBankDetails(securityId);
                const bankData = bankRes.data;

                setBankDetails({
                    bank_name: bankData.bank_name || '',
                    bank_branch: bankData.bank_branch || '',
                    account_number: bankData.account_number || '',
                    bank_account_holder_name: bankData.bank_account_holder_name || '',
                    is_commercial_bank: bankData.is_commercial_bank || false,
                });
            } catch (error) {
                console.error('Error fetching security data:', error);
            }
        };

        fetchSecurityData();
    }, [securityId]);

    return (
        
         <>
            {/* {showAlert && <Alert variant={'default'} />} */}
            <div className='pt-20 pb-20'>
                <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4 rounded-lg p-10 bg-white shadow-lg">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-700">Edit Security Personnel</h2>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Existing fields */}
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
                            <label className="block text-sm font-medium text-gray-700">Security Type:</label>
                            <select
                                name="securityType"
                                value={formData.securityType}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            >
                                <option value="LSO">LSO</option>
                                <option value="OIC">OIC</option>
                                <option value="JSO">JSO</option>
                                <option value="SSO">SSO</option>
                                <option value="CSO">CSO</option>
                            </select>
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
                            <label className="block text-sm font-medium text-gray-700">Current Address:</label>
                            <textarea
                                name="securityCurrentAddress"
                                value={formData.securityCurrentAddress}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Permanent Address:</label>
                            <textarea
                                name="securityPermanentAddress"
                                value={formData.securityPermanentAddress}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">EPF Number:</label>
                            <input
                                type="text"
                                name="securityEpfNumber"
                                value={formData.securityEpfNumber}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        {/* New fields section */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Gender:</label>
                            <div className="mt-2 flex gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="securityGender"
                                        value="male"
                                        checked={formData.securityGender === 'male'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-300"
                                    />
                                    <span className="ml-2">Male</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="securityGender"
                                        value="female"
                                        checked={formData.securityGender === 'female'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-300"
                                    />
                                    <span className="ml-2">Female</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">District:</label>
                            <input
                                type="text"
                                name="securityDistrict"
                                value={formData.securityDistrict}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Police Division:</label>
                            <input
                                type="text"
                                name="securityPoliceDivision"
                                value={formData.securityPoliceDivision}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Grama Niladari Division:</label>
                            <input
                                type="text"
                                name="securityGramaNiladariDivision"
                                value={formData.securityGramaNiladariDivision}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Educational Info:</label>
                            <input
                                type="text"
                                name="securityEducationalInfo"
                                value={formData.securityEducationalInfo}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="securityMaritalStatus"
                                    checked={formData.securityMaritalStatus}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-300"
                                />
                                <span>Married</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Previous Workplace:</label>
                            <input
                                type="text"
                                name="securityPreviousWorkplace"
                                value={formData.securityPreviousWorkplace}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Experience:</label>
                            <textarea
                                name="securityExperience"
                                value={formData.securityExperience}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Emergency Contact Name:</label>
                            <input
                                type="text"
                                name="securityEmergencyContactName"
                                value={formData.securityEmergencyContactName}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Emergency Contact Number:</label>
                            <input
                                type="text"
                                name="securityEmergencyContactNumber"
                                value={formData.securityEmergencyContactNumber}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Emergency Contact Address:</label>
                            <textarea
                                name="securityEmergencyContactAddress"
                                value={formData.securityEmergencyContactAddress}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Additional Info:</label>
                            <textarea
                                name="securityAdditionalInfo"
                                value={formData.securityAdditionalInfo}
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
                                <label className="block text-sm font-medium text-gray-700">Account Holder Name:</label>
                                <input
                                    type="text"
                                    name="bank_account_holder_name"
                                    value={bankDetails.bank_account_holder_name}
                                    onChange={handleBankDetailChange}
                                    required
                                    className="mt-1 w-full rounded-md border p-2 shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="is_commercial_bank"
                                        checked={bankDetails.is_commercial_bank}
                                        onChange={handleBankDetailChange}
                                        className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-300"
                                    />
                                    <span>Is Commercial Bank</span>
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={back}
                            className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white shadow-md transition hover:bg-red-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
            </>
    );
};

export default EditSecurity;