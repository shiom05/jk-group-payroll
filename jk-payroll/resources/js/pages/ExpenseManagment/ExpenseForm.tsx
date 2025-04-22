import { getSecuiryDropdownOptions } from '@/utils/security';
import { Form, Input, InputNumber, Button, Select, DatePicker } from 'antd';
import { useEffect, useState } from 'react';

interface ExpenseFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  editingId?: number | null;
  securityList: any[];
}

export default function ExpenseForm({ onSubmit, securityList }: ExpenseFormProps) {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<'security' | 'general'>('security');
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    setOptions(getSecuiryDropdownOptions(securityList));
  }, [securityList]);

  const handleModeChange = (selectedMode: 'security' | 'general') => {
    setMode(selectedMode);
    if (selectedMode === 'general') {
      form.setFieldValue('securityId', null);
    }
  };

  const handleFinish = (values: any) => {
    const formatted = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
    };
    onSubmit(formatted);
    form.resetFields();
    setMode('security');
  };

  const expenseType = Form.useWatch('type', form);

  return (
    <>
      <div className="mb-6 flex space-x-4">
        <button
          type="button"
          onClick={() => handleModeChange('security')}
          className={`rounded-md px-4 py-2 ${mode === 'security' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Security Expense
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('general')}
          className={`rounded-md px-4 py-2 ${mode === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          General Company Expense
        </button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mb-10! space-y-4 rounded-lg bg-white p-6! shadow-md"
      >
        <h2 className="text-2xl font-semibold text-gray-700">Add Expense</h2>

        {mode === 'security' && (
          <Form.Item
            name="securityId"
            label={<span className="block text-sm font-medium text-gray-700">Select Security</span>}
            className="mb-4"
            rules={[{ required: true, message: 'Please select a security' }]}
          >
            <Select
              showSearch
              placeholder="Search to Select Security"
              optionFilterProp="label"
              className="w-full"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={options}
            />
          </Form.Item>
        )}

        {(mode === 'general' || form.getFieldValue('securityId')) && (
          <div className='grid grid-cols-3 gap-4'>
            <Form.Item
              name="type"
              label={<span className="text-sm font-medium text-gray-700">Expense Type</span>}
              className="mb-4"
              rules={[{ required: true, message: 'Please select expense type' }]}
            >
              <Select placeholder="Select expense type" className="w-full">
                <Select.Option value="Inventory">Inventory</Select.Option>
                <Select.Option value="Food">Food</Select.Option>
                <Select.Option value="Travel">Travel</Select.Option>
                <Select.Option value="Accommodation">Accommodation</Select.Option>
                <Select.Option value="Loan">Loan</Select.Option>
              </Select>
            </Form.Item>

            {expenseType === 'Inventory' && (
              <Form.Item
                name="item"
                label={<span className="block text-sm font-medium text-gray-700">Item</span>}
                className="mb-4"
                rules={[{ required: true, message: 'Please enter item name' }]}
              >
                <Input className="w-full" />
              </Form.Item>
            )}

            {['Food', 'Travel', 'Accommodation', 'Loan'].includes(expenseType) && (
              <Form.Item
                name="description"
                label={<span className="block text-sm font-medium text-gray-700">Description</span>}
                className="mb-4"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <Input className="w-full" />
              </Form.Item>
            )}

            <Form.Item
              name="date"
              label={<span className="block text-sm font-medium text-gray-700">Date</span>}
              className="mb-4"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="amount"
              label={<span className="block text-sm font-medium text-gray-700">Amount (LKR)</span>}
              className="mb-4"
              rules={[{ required: true, message: 'Please enter amount' }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            {expenseType === 'Loan' && (
              <Form.Item
                name="installments"
                label={<span className="block text-sm font-medium text-gray-700">Installments</span>}
                className="mb-4"
                rules={[{ required: true, message: 'Please enter number of installments' }]}
              >
                <InputNumber min={1} className="w-full" />
              </Form.Item>
            )}
          </div>
        )}

        <Form.Item className="!mt-6">
          <Button htmlType="submit" className="rounded-md! bg-blue-600! px-4! py-2! text-white! shadow! hover:bg-blue-700!">
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
