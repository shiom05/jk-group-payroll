

import { useState } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Location {
    id: string;
    locationName: string;
    locationType: string;
    address: string;
    oicRate: string;
    sargentRate: string;
    costapalRate: string;
}

interface SelectLocationProps {
    onSelected: (location: Location) => void;
}

const SelectLocation = ({onSelected}: SelectLocationProps) => {

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
    // Sample data - replace with your actual data source
    const locations: Location[] = [
      {
        id: '1',
        locationName: 'Downtown Office',
        locationType: 'Office',
        address: '123 Main St, City',
        oicRate: '45.00',
        sargentRate: '50.00',
        costapalRate: '40.00'
      },
      {
        id: '2',
        locationName: 'North Warehouse',
        locationType: 'Warehouse',
        address: '500 Industrial Ave',
        oicRate: '35.00',
        sargentRate: '42.00',
        costapalRate: '32.00'
      },
      {
        id: '3',
        locationName: 'Riverside Mall',
        locationType: 'Retail',
        address: '88 Commerce Blvd',
        oicRate: '55.00',
        sargentRate: '60.00',
        costapalRate: '48.00'
      }
    ];
  
    const columns: ColumnsType<Location> = [
      {
        title: 'Location Name',
        dataIndex: 'locationName',
        key: 'locationName',
        render: (text, record) => (
          <a onClick={() => onSelected(record)}>{text}</a>
        )
      },
      {
        title: 'Type',
        dataIndex: 'locationType',
        key: 'locationType',
        render: (type) => {
          let color = '';
          switch (type.toLowerCase()) {
            case 'office':
              color = 'blue';
              break;
            case 'warehouse':
              color = 'orange';
              break;
            case 'retail':
              color = 'green';
              break;
            default:
              color = 'gray';
          }
          return <Tag color={color}>{type.toUpperCase()}</Tag>;
        }
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true
      },
      {
        title: 'OIC Rate (LKR)',
        dataIndex: 'oicRate',
        key: 'oicRate',
        align: 'right',
        render: (rate) => `LKR ${rate}/hr`
      },
      {
        title: 'Sargent Rate (LKR)',
        dataIndex: 'sargentRate',
        key: 'sargentRate',
        align: 'right',
        render: (rate) => `LKR ${rate}/hr`
      }
    ];
  
    const onSelectChange = (rowId: any, location: Location[]) => {
      setSelectedRowKeys(rowId);
      onSelected(location[0])
    };
  
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
      ],
    };
  
    return (
      <div>
        <Table
          rowKey="id"
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          columns={columns}
          dataSource={locations}
          pagination={{ pageSize: 5 }}
          onRow={(record) => ({
            onClick: () => {
              onSelected(record);
              setSelectedRowKeys([record.id]);
              
            },
          })}
        />
      </div>
    );
    

}

export default SelectLocation;