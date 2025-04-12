import { useEffect, useState } from 'react';
import axios from 'axios';

const leaveReasons: { [key: string]: string[] } = {
  Annual: ['Vacation', 'Travel', 'Rest'],
  Casual: ['Family Matter', 'Personal Errand'],
  Sick: ['Fever', 'Medical Appointment', 'Flu']
};

const EditLeave = ({ leaveId, onClose, onUpdate }: { leaveId: number; onClose: () => void; onUpdate: () => void }) => {
  const [users, setUsers] = useState([]);
  const [leave, setLeave] = useState<any>(null);

  const fetchLeave = async () => {
    try {
      const response = await axios.get(`/api/leaves/${leaveId}`);
      setLeave(response.data);
    } catch (error) {
      console.error('Failed to fetch leave:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLeave();
  }, [leaveId]);

  const handleChange = (e: any) => {
    setLeave((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/leaves/${leaveId}`, leave);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update leave:', error);
    }
  };

  if (!leave) return <div>Loading...</div>;

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-700">Edit Leave</h2>

      <div className="mb-4">
        <label className="mb-1 block font-semibold text-gray-600">Employee</label>
        <select
          name="userId"
          value={leave.userId}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Select Employee</option>
          {users.map((user: any) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-semibold text-gray-600">Leave Type</label>
        <select
          name="leaveType"
          value={leave.leaveType}
          onChange={(e) => {
            handleChange(e);
            setLeave((prev: any) => ({ ...prev, reason: '' }));
          }}
          className="w-full rounded border px-3 py-2"
        >
          {['Annual', 'Casual', 'Sick'].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-semibold text-gray-600">Reason</label>
        <select
          name="reason"
          value={leave.reason}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Select Reason</option>
          {leaveReasons[leave.leaveType]?.map(reason => (
            <option key={reason} value={reason}>{reason}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-semibold text-gray-600">Description</label>
        <textarea
          name="description"
          value={leave.description}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
          rows={3}
        />
      </div>

      <div className="mb-4 flex gap-4">
        <div className="w-1/2">
          <label className="mb-1 block font-semibold text-gray-600">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={leave.startDate}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="w-1/2">
          <label className="mb-1 block font-semibold text-gray-600">End Date</label>
          <input
            type="date"
            name="endDate"
            value={leave.endDate}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="rounded bg-gray-300 px-4 py-2 font-semibold text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default EditLeave;
