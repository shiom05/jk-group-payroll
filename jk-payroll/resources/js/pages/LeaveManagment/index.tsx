import Layout from '@/layouts/Layout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateLeave from './CreateLeave';
import { formatDate, getLeaveStatus } from '@/utils/security';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchLeaves = async () => {
    // setLeaves([
    //     {
    //       leaveId: 1,
    //       employeeName: "John Doe",
    //       leaveType: "Annual",
    //       reason: "Vacation",
    //       description: "Taking a break with family",
    //       startDate: "2025-05-10",
    //       endDate: "2025-05-15",
    //       status: "InProgress"
    //     },
    //     {
    //       leaveId: 2,
    //       employeeName: "Jane Smith",
    //       leaveType: "Sick",
    //       reason: "Medical condition",
    //       description: "Feeling unwell, need rest",
    //       startDate: "2025-05-12",
    //       endDate: "2025-05-14",
    //       status: "Pending"
    //     },
    //     {
    //       leaveId: 3,
    //       employeeName: "Mark Johnson",
    //       leaveType: "Casual",
    //       reason: "Personal",
    //       description: "Urgent personal matter",
    //       startDate: "2025-05-13",
    //       endDate: "2025-05-13",
    //       status: "Completed"
    //     },
    //   ]);
    try {
      const response = await axios.get('api/security-leaves');
      setLeaves(response.data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Security Leave Management</h1>

       {
        !showCreateForm && 
        <>
         <button
          onClick={() => setShowCreateForm(true)}
          className="mb-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700"
        >
          + Create Leave
        </button>

        <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Employee</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Start</th>
                <th className="px-4 py-3 text-left">End</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length ? leaves.map((leave, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{leave.security.securityName}</td>
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
        </>
       }

        {showCreateForm && (
          <CreateLeave onClose={() => {
            setShowCreateForm(false);
            fetchLeaves(); // Refresh leaves list after creation
          }} />
        )}

      </div>
    </Layout>
  );
};

export default LeaveManagement;
