import { DeleteFilled, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Modal, Row, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import CreateLocation from './CreateLocation';
import EditLocation from './EditLocation';
import { deleteLocation, getLocation } from '@/services/location.service';
const { Title, Text } = Typography;
interface Locations {
    locationId: any,
    locationName: string;
    locationType: string;
    address: string;
    isJkPropLocation: boolean;

    billing_OIC_HourlyRate: number;
    billing_JSO_HourlyRate: number;
    billing_CSO_HourlyRate: number;
    billing_LSO_HourlyRate: number;

    paying_OIC_HourlyRate: number;
    paying_JSO_HourlyRate: number;
    paying_CSO_HourlyRate: number;
    paying_LSO_HourlyRate: number;
}

export default function ManageLocations() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [showCreate, setShowCreate] = useState<boolean>(false);
    const [viewLocation, setViewLocation] = useState<Locations | null>(null);
    const [toEditLcoation, setToEditocation] = useState<any>(null);

    const [locations, setLocations] = useState<Locations[]>([]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleView = (record: Locations) => {
        setViewLocation(record);
        showModal();
        console.log('View:', record);
    };

    const handleEdit = (record: Locations) => {
        setToEditocation(record);
    };

    const handleDelete = async(record: Locations) => {
        const result = await deleteLocation(record.locationId);
        console.log(result);
        fetchLocations();
    };

    const saveEditedLocation = (location: any) => {};

    const columns: ColumnsType<Locations> = [
        {
            title: 'Location Name',
            dataIndex: 'locationName',
            key: 'locationName',
            filters: [...new Set(locations.map((item: Locations) => item.locationName))].map((type: any) => ({
                text: type,
                value: type,
            })),
            onFilter: (value: any, record) => record.locationName === value,
        },
        {
            title: 'Location Type',
            dataIndex: 'locationType',
            key: 'locationType',
            filters: [...new Set(locations.map((item: Locations) => item.locationType))].map((type: any) => ({
                text: type,
                value: type,
            })),
            onFilter: (value: any, record) => record.locationType === value,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'JK Property',
            dataIndex: 'isJkPropLocation',
            key: 'isJkPropLocation',
            filters: [
                { text: 'Yes', value: true },
                { text: 'No', value: false },
            ],
            onFilter: (value: any, record) => record.isJkPropLocation === value,
            render: (value: boolean) => <Tag color={value ? 'green' : 'red'}>{value ? 'Yes' : 'No'}</Tag>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleView(record)}>
                        <EyeOutlined />
                    </Button>
                    <Button onClick={() => handleEdit(record)}>
                        <EditOutlined />
                    </Button>
                    <Button type="primary" danger onClick={() => handleDelete(record)}>
                        <DeleteFilled />
                    </Button>
                </Space>
            ),
        },
    ];

    const fetchLocations = async()=>{
        const result = await getLocation();
        setLocations(result.data);
    }

    useEffect(()=>{
        fetchLocations()
    },[])

    return (
        <div className="rounded-2xl bg-gray-100 p-10 pt-10 pb-10 shadow-md">
            <button
                onClick={() => setShowCreate(true)}
                className="mb-10 cursor-pointer! rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
                + Add New Location
            </button>

            {!toEditLcoation && showCreate && <CreateLocation handleCancel={() =>{fetchLocations(); setShowCreate(false)}}></CreateLocation>}

            {toEditLcoation && !showCreate && (
                <EditLocation  onCancel={() => {fetchLocations(); setToEditocation(null)}} initialValues={toEditLcoation}></EditLocation>
            )}

            {!toEditLcoation && !showCreate && (
                <>
                    <h3 className="mb-4 pb-2 text-xl font-bold text-gray-800">Client Locations</h3>
                    {locations.length > 0 && <Table columns={columns} dataSource={locations} rowKey="locationName" />}
                    <Modal
                        open={isModalOpen}
                        maskClosable
                        onOk={handleOk}
                        onClose={handleCancel}
                        onCancel={handleCancel}
                        footer={(_, { OkBtn }) => (
                            <>
                                <OkBtn />
                            </>
                        )}
                    >
                        <Typography>
                            <Title level={3}>{viewLocation?.locationName} Information</Title>
                            <Divider />
                            <Row gutter={[16, 8]}>
                                <Col span={12}>
                                    <Text strong>Location Name:</Text> <Text>{viewLocation?.locationName}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Location Type:</Text> <Text>{viewLocation?.locationType}</Text>
                                </Col>
                                <Col span={24}>
                                    <Text strong>Address:</Text> <Text>{viewLocation?.address}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>JK Property:</Text>{' '}
                                    <Text>
                                        <Tag color={viewLocation?.isJkPropLocation ? 'green' : 'red'}>
                                            {viewLocation?.isJkPropLocation ? 'Yes' : 'No'}{' '}
                                        </Tag>
                                    </Text>
                                </Col>
                            </Row>

                            <Divider />

                            <Title level={5}>Billing Rates (Rs/hr)</Title>
                            <Row gutter={[16, 8]}>
                                <Col span={6}>
                                    <Text strong>OIC:</Text> <Text>LKR {viewLocation?.billing_OIC_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>JSO:</Text> <Text>LKR {viewLocation?.billing_JSO_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>CSO:</Text> <Text>LKR {viewLocation?.billing_CSO_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>LSO:</Text> <Text>LKR {viewLocation?.billing_LSO_HourlyRate}</Text>
                                </Col>
                            </Row>

                            <Divider />

                            <Title level={5}>Paying Rates (Rs/hr)</Title>
                            <Row gutter={[16, 8]}>
                                <Col span={6}>
                                    <Text strong>OIC:</Text> <Text>LKR {viewLocation?.paying_OIC_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>JSO:</Text> <Text>LKR {viewLocation?.paying_JSO_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>CSO:</Text> <Text>LKR {viewLocation?.paying_CSO_HourlyRate}</Text>
                                </Col>
                                <Col span={6}>
                                    <Text strong>LSO:</Text> <Text>LKR {viewLocation?.paying_LSO_HourlyRate}</Text>
                                </Col>
                            </Row>
                        </Typography>
                        <Divider />
                    </Modal>
                </>
            )}
        </div>
    );
}
