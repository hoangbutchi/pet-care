import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Card,
  Row,
  Col,
  Tag,
  message,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

interface PriceTable {
  id: string;
  name: string;
  product: { name: string; sku: string };
  channel?: { name: string };
  region?: { name: string };
  customerGroup?: { name: string };
  costPrice: number;
  regularPrice: number;
  salePrice?: number;
  vatRate: number;
  startDate: string;
  endDate?: string;
  priority: number;
  isActive: boolean;
}

const PriceManagement: React.FC = () => {
  const [prices, setPrices] = useState<PriceTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PriceTable | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [customerGroups, setCustomerGroups] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPrices();
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [productsRes, channelsRes, regionsRes, groupsRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/prices/channels'),
        axios.get('/api/prices/regions'),
        axios.get('/api/prices/customer-groups'),
      ]);
      setProducts(productsRes.data.data || productsRes.data);
      setChannels(channelsRes.data);
      setRegions(regionsRes.data);
      setCustomerGroups(groupsRes.data);
    } catch (error) {
      message.error('Failed to fetch options');
    }
  };

  const fetchPrices = async () => {
    setLoading(true);
    try {
      // In real app, you'd fetch all prices or filter by product
      // For now, we'll need a product ID or show empty
      setPrices([]);
    } catch (error) {
      message.error('Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPrice(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (price: PriceTable) => {
    setSelectedPrice(price);
    form.setFieldsValue({
      ...price,
      startDate: price.startDate ? moment(price.startDate) : null,
      endDate: price.endDate ? moment(price.endDate) : null,
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        ...values,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
      };
      if (selectedPrice) {
        await axios.put(`/api/prices/${selectedPrice.id}`, data);
        message.success('Price updated successfully');
      } else {
        await axios.post('/api/prices', data);
        message.success('Price created successfully');
      }
      setModalVisible(false);
      fetchPrices();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save price');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/prices/${id}`);
      message.success('Price deleted successfully');
      fetchPrices();
    } catch (error) {
      message.error('Failed to delete price');
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: ['product', 'name'],
      key: 'product',
    },
    {
      title: 'Channel',
      dataIndex: ['channel', 'name'],
      key: 'channel',
    },
    {
      title: 'Region',
      dataIndex: ['region', 'name'],
      key: 'region',
    },
    {
      title: 'Customer Group',
      dataIndex: ['customerGroup', 'name'],
      key: 'customerGroup',
    },
    {
      title: 'Cost Price',
      dataIndex: 'costPrice',
      render: (val: number) => `$${val.toFixed(2)}`,
    },
    {
      title: 'Regular Price',
      dataIndex: 'regularPrice',
      render: (val: number) => `$${val.toFixed(2)}`,
    },
    {
      title: 'Sale Price',
      dataIndex: 'salePrice',
      render: (val: number) => val ? `$${val.toFixed(2)}` : '-',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PriceTable) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            <h2>Price Management</h2>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Add Price Table
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={prices}
          loading={loading}
          rowKey="id"
        />
      </Card>

      <Modal
        title={selectedPrice ? 'Edit Price Table' : 'Create Price Table'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Price Table Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="productId"
            label="Product"
            rules={[{ required: true }]}
          >
            <Select>
              {products.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="channelId" label="Channel">
                <Select allowClear>
                  {channels.map((c) => (
                    <Option key={c.id} value={c.id}>{c.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="regionId" label="Region">
                <Select allowClear>
                  {regions.map((r) => (
                    <Option key={r.id} value={r.id}>{r.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="customerGroupId" label="Customer Group">
                <Select allowClear>
                  {customerGroups.map((g) => (
                    <Option key={g.id} value={g.id}>{g.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="costPrice"
                label="Cost Price"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="regularPrice"
                label="Regular Price"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="salePrice" label="Sale Price">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="vatRate" label="VAT Rate (%)" initialValue={10}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="priority" label="Priority" initialValue={0}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="End Date">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PriceManagement;
