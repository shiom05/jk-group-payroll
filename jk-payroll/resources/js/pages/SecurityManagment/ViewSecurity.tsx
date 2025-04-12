import { getBankDetails, leaveDetails } from '@/services/security-managment.service';
import Security from '@/types/jk/security';
import { formatDate, getLeaveStatus, getStatusText } from '@/utils/security';
import { useEffect, useState } from 'react';

interface ViewSecurityProps {
    security: Security;
    back: () => void;
}

const ViewSecurity = ({ security, back }: ViewSecurityProps) => {
    const [bankDetails, setBankDetials] = useState<any>(null);
    const [leaves, setLeaves] = useState<any>([]);

    const fetchBankDetails = async () => {
        try {
            const response = await getBankDetails(security.securityId);
            console.log(response.data);
            setBankDetials(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    const fetchLeaveDetails = async ()=>{
        try {
            const response = await leaveDetails(security.securityId);
            console.log(response.data);
            setLeaves(response.data);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBankDetails();
        fetchLeaveDetails();
    }, []);

    return (
        <>
            <div className="p-20">
                <div className="flex flex-row">
                    <div>
                        <img src={`/storage/${security.securityPhoto}`} alt={security.securityName} className="h-32 w-32 rounded-full object-cover" />
                    </div>

                    <div className="flex flex-col">
                        <h2 className="text-4xl"> {security.securityName}</h2>
                        <p className="text-xl">{security.securityId}</p>
                        <p className={`${getStatusText(parseInt(security.securityStatus)) === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                            {getStatusText(parseInt(security.securityStatus))}
                        </p>
                    </div>
                </div>

                <div className="mt-10 rounded-xl border border-gray-200 bg-gray-100 p-8 shadow-lg">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                        {/* Personal Details */}
                        <div>
                            <h2 className="mb-4 border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800">Personal Details</h2>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex">
                                    <span className="w-1/2 font-medium">Primary Contact Number:</span>
                                    <span className="w-1/2">{security.securityPrimaryContact}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-1/2 font-medium">Secondary Contact Number:</span>
                                    <span className="w-1/2">{security.securitySecondaryContact}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-1/2 font-medium">NIC Number:</span>
                                    <span className="w-1/2">{security.securityNicNumber}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-1/2 font-medium">Date of Birth:</span>
                                    <span className="w-1/2">{formatDate(security.securityDob)}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-1/2 font-medium">Date of Join:</span>
                                    <span className="w-1/2">{formatDate(security.securityDateOfJoin)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bank Details */}
                        {bankDetails && (
                            <div>
                                <h2 className="mb-4 border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800">Bank Details</h2>
                                <div className="space-y-3 text-gray-700">
                                    <div className="flex">
                                        <span className="w-1/2 font-medium">Bank Name:</span>
                                        <span className="w-1/2">{bankDetails.bank_name}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-1/2 font-medium">Bank Branch:</span>
                                        <span className="w-1/2">{bankDetails.bank_branch}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-1/2 font-medium">Bank Account Number:</span>
                                        <span className="w-1/2">{bankDetails.account_number}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 rounded-xl border border-gray-200 bg-gray-100 p-8 shadow-lg">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                        <div>
                            <h2 className="mb-4 border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800">Document Checklist</h2>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex">
                                    <span className="w-1/2 font-medium">NIC Copy:</span>
                                    <span className={`w-1/2 ${security.securityNicUploaded ? 'text-green-600' : 'text-red-600'}`}>
                                        {security.securityNicUploaded ? 'Provided' : 'Not Provided'}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-1/2 font-medium">Birth Certificate Copy:</span>
                                    <span className={`w-1/2 ${security.securityBirthCertificateUploaded ? 'text-green-600' : 'text-red-600'}`}>
                                        {security.securityBirthCertificateUploaded ? 'Provided' : 'Not Provided'}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-1/2 font-medium">Police Report Copy:</span>
                                    <span className={`w-1/2 ${security.securityPoliceReportUploaded ? 'text-green-600' : 'text-red-600'}`}>
                                        {security.securityPoliceReportUploaded ? 'Provided' : 'Not Provided'}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-1/2 font-medium">Gramasewaka Certificate Copy:</span>
                                    <span className={`w-1/2 ${security.securityGramasewakaLetterUploaded ? 'text-green-600' : 'text-red-600'}`}>
                                        {security.securityGramasewakaLetterUploaded ? 'Provided' : 'Not Provided'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                    {/* Leave Details */}
                        {leaves.length && (
                              <div className="mt-10 rounded-xl border border-gray-200 bg-gray-100 p-8 shadow-lg">
                              <div className="grid grid-cols-1 gap-12">
                                  <div>
                                      <h2 className="mb-4 border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800">Leave Details</h2>
                                      <div className="space-y-3 text-gray-700">
                                          <table className="w-full border-collapse">
                                                    <thead className="bg-gray-200 text-gray-700">
                                                      <tr>
                                                        <th className="px-4 py-3 text-left">#</th>
                                                        <th className="px-4 py-3 text-left">Type</th>
                                                        <th className="px-4 py-3 text-left">Reason</th>
                                                        <th className="px-4 py-3 text-left">Description</th>
                                                        <th className="px-4 py-3 text-left">Start</th>
                                                        <th className="px-4 py-3 text-left">End</th>
                                                        <th className="px-4 py-3 text-left">Status</th>
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {leaves.length ? leaves.map((leave:any, index: number) => (
                                                        <tr key={index} className="border-b hover:bg-gray-100">
                                                          <td className="px-4 py-3">{index+1}</td>
                                                          <td className="px-4 py-3">{leave.leave_type}</td>
                                                          <td className="px-4 py-3">{leave.reason}</td>
                                                          <td className="px-4 py-3">{leave.description}</td>
                                                          <td className="px-4 py-3">{formatDate(leave.start_date)}</td>
                                                          <td className="px-4 py-3">{formatDate(leave.end_date)}</td>
                                                          <td className="px-4 py-3">
                                                            <span className={`rounded px-2 py-1 text-white ${getLeaveStatus(leave.start_date, leave.end_date) === 'Pending' ? 'bg-yellow-500' : getLeaveStatus(leave.start_date, leave.end_date) === 'Completed'? 'bg-green-500' : 'bg-red-500'}`}>
                                                              {getLeaveStatus(leave.start_date, leave.end_date)}
                                                            </span>
                                                          </td>
                                                        </tr>
                                                      )) : <tr><td colSpan={7} className="px-4 py-6 text-center font-bold">No Leaves Found</td></tr>}
                                                    </tbody>
                                                  </table>
                                      </div>
                                  </div>
                              </div>
                          </div>
                        )}

              

                {/* <button onClick={back} className="rounded bg-yellow-500 px-3 py-1 text-white shadow hover:bg-yellow-600">
                Back
        </button> */}
            </div>
        </>
    );
};

export default ViewSecurity;
