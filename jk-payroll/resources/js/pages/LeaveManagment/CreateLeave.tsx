import { useEffect, useState } from 'react';
import axios from 'axios';

const leaveReasons: { [key: string]: string[] } = {
  Annual: ['Vacation', 'Travel', 'Rest'],
  Casual: ['Family Matter', 'Personal Errand'],
  Sick: ['Fever', 'Medical Appointment', 'Flu']
};

const CreateLeave = ({ onClose }: { onClose: () => void }) => {
  const [securities, setSecurities] = useState([]);
  const [leaveType, setLeaveType] = useState('Annual');
  const [form, setForm] = useState({
    securityId: '',
    reason: '',
    description: '',
    startDate: '',
    endDate: '',
  });



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

  const handleChange = (e: any) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const leaveBody = {
      security_id: form.securityId,
      leave_type : leaveType,
      reason : form.reason,
      description : form.description,
      start_date : form.startDate,
      end_date: form.endDate
    }
    try {
      await axios.post('api/security-leaves', leaveBody);
      onClose();
    } catch (error) {
      console.error('Failed to create leave:', error);
    }
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-700">Create Leave</h2>

      <div className="mb-4">
        <label className="mb-1 block font-semibold text-gray-600">Employee</label>
        <select
          name="securityId"
          value={form.securityId}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Select Employee</option>
          {securities.map((user: any) => (
            <option key={user.securityId} value={user.securityId}>{user.securityName}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-semibold text-gray-600">Leave Type</label>
        <select
          value={leaveType}
          onChange={(e) => {
            setLeaveType(e.target.value);
            setForm(prev => ({ ...prev, reason: '' }));
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
          value={form.reason}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Select Reason</option>
          {leaveReasons[leaveType].map(reason => (
            <option key={reason} value={reason}>{reason}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-semibold text-gray-600">Description</label>
        <textarea
          name="description"
          value={form.description}
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
            value={form.startDate}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="w-1/2">
          <label className="mb-1 block font-semibold text-gray-600">End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
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
          className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateLeave;
