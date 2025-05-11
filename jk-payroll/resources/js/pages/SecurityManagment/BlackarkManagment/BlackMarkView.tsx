import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card, Typography, Descriptions, Spin, Alert, Tag, Divider, Button
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { fetchBlackMark } from '@/services/blackmark.service';

const BlackMarkView = () => {
  const { id } = useParams();
  const [blackMark, setBlackMark] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchBlackMark(id);
        setBlackMark(data);
      } catch (err) {
        setError('Failed to load black mark details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" message={error} style={{ margin: '2rem' }} />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        href="/black-marks"
        style={{ marginBottom: '16px' }}
      >
        Back to List
      </Button>

      <Card title="Black Mark Details" bordered>
        {
            blackMark &&
            <>
               <Descriptions column={2} bordered size="middle">
          <Descriptions.Item label="Security">
            {blackMark.security.name}
          </Descriptions.Item>

          <Descriptions.Item label="Type">
            {blackMark.type}
          </Descriptions.Item>

          <Descriptions.Item label="Incident Date">
            {new Date(blackMark.incident_date).toLocaleDateString()}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={blackMark.status === 'completed' ? 'green' : 'orange'}>
              {blackMark.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Incident Description" span={2}>
            {blackMark.incident_description}
          </Descriptions.Item>
        </Descriptions>

        {blackMark.status === 'completed' && (
          <>
            <Divider />
            <Typography.Title level={5}>Investigation Details</Typography.Title>

            <Descriptions column={2} bordered size="middle">
              <Descriptions.Item label="Inquiry Details" span={2}>
                {blackMark.inquiry_details}
              </Descriptions.Item>
              <Descriptions.Item label="Fine Amount">
                ${blackMark.fine_amount}
              </Descriptions.Item>
              <Descriptions.Item label="Fine Effective Date">
                {new Date(blackMark.fine_effective_date).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
            
            </>
        }
      </Card>
    </div>
  );
};

export default BlackMarkView;
