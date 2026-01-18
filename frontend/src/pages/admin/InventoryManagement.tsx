import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Badge,
  message,
  Tabs,
  Select,
} from 'antd';
import {
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

interface Inventory {
  id: string;
  product: { name: string; sku: string };
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minimumLevel: number;
  maximumLevel?: number;
  status: string;
}

interface StockMovement {
  id: string;
  type: string;
  quantity: number;
  balanceBefore: number;
  balanceAfter: number;
  reason?: string;
  performedAt: string;
}

const InventoryManagement: React.FC = () => {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<any>({});
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [movementModalVisible, setMovementModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [form] = Form.useForm();
  const [movementForm] = Form.useForm();

  useEffect(() => {
    fetchDashboard();
    fetchLowStock();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('/api/inventory/dashboard');
      setDashboard(response.data.summary);
      setLowStockProducts(response.data.lowStockProducts || []);
    } catch (error) {
      message.error('Failed to fetch dashboard');
    }
  };

  const fetchLowStock = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/inventory/low-stock');
      setLowStockProducts(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch low stock products');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovements = async (inventoryId: string) => {
    try {
      const response = await axios.get(`/api/inventory/${inventoryId}/movements`);
      setMovements(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch stock movements');
    }
  };

  const handleStockIn = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setMovementType('IN');
    movementForm.resetFields();
    setStockModalVisible(true);
  };

  const handleStockOut = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setMovementType('OUT');
    movementForm.resetFields();
    setStockModalVisible(true);
  };

  const handleViewMovements = async (inventory: Inventory) => {
    setSelectedInventory(inventory);
    await fetchMovements(inventory.id);
    setMovementModalVisible(true);
  };

  const handleStockMovement = async (values: any) => {
    if (!selectedInventory) return;

    try {
      const endpoint = movementType === 'IN' 
        ? `/api/inventory/${selectedInventory.id}/stock-in`
        : `/api/inventory/${selectedInventory.id}/stock-out`;
      
      await axios.post(endpoint, values);
      message.success(`Stock ${movementType === 'IN' ? 'added' : 'removed'} successfully`);
      setStockModalVisible(false);
      fetchDashboard();
      fetchLowStock();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to process stock movement');
    }
  };

  const updateMinimumLevel = async (inventoryId: string, minimumLevel: number) => {
    try {
      await axios.put(`/api/inventory/${inventoryId}`, { minimumLevel });
      message.success('Minimum level updated');
      fetchDashboard();
      fetchLowStock();
    } catch (error) {
      message.error('Failed to update minimum level');
    }
  };

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      IN_STOCK: { color: 'green', text: 'In Stock' },
      OUT_OF_STOCK: { color: 'red', text: 'Out of Stock' },
      LOW_STOCK: { color: 'orange', text: 'Low Stock' },
      DISCONTINUED: { color: 'default', text: 'Discontinued' },
    };
    const c = config[status] || { color: 'default', text: status };
    return <Tag color={c.color}>{c.text}</Tag>;
  };

  const lowStockColumns = [
    {
      title: 'Product',
      dataIndex: ['product', 'name'],
      key: 'product',
    },
    {
      title: 'SKU',
      dataIndex: ['product', 'sku'],
      key: 'sku',
    },
    {
      title: 'Current Stock',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number, record: Inventory) => (
        <Badge
          count={qty}
          showZero
          style={{ backgroundColor: record.status === 'LOW_STOCK' ? '#faad14' : undefined }}
        />
      ),
    },
    {
      title: 'Available',
      dataIndex: 'availableQuantity',
      key: 'available',
    },
    {
      title: 'Minimum Level',
      dataIndex: 'minimumLevel',
      key: 'minimum',
      render: (min: number, record: Inventory) => (
        <InputNumber
          value={min}
          min={0}
          size="small"
          style={{ width: 100 }}
          onPressEnter={(e) => {
            const val = parseFloat((e.target as HTMLInputElement).value);
            if (!isNaN(val)) updateMinimumLevel(record.id, val);
          }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Inventory) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<ArrowUpOutlined />}
            onClick={() => handleStockIn(record)}
          >
            Stock In
          </Button>
          <Button
            size="small"
            icon={<ArrowDownOutlined />}
            onClick={() => handleStockOut(record)}
          >
            Stock Out
          </Button>
          <Button
            size="small"
            onClick={() => handleViewMovements(record)}
          >
            History
          </Button>
        </Space>
      ),
    },
  ];

  const movementColumns = [
    {
      title: 'Date',
      dataIndex: 'performedAt',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'IN' ? 'green' : 'red'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number, record: StockMovement) => (
        <span style={{ color: record.type === 'IN' ? 'green' : 'red' }}>
          {record.type === 'IN' ? '+' : '-'}{qty}
        </span>
      ),
    },
    {
      title: 'Before',
      dataIndex: 'balanceBefore',
      key: 'before',
    },
    {
      title: 'After',
      dataIndex: 'balanceAfter',
      key: 'after',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic
              title="Total Products"
              value={dashboard.totalProducts || 0}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="In Stock"
              value={dashboard.inStock || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Low Stock"
              value={dashboard.lowStock || 0}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Out of Stock"
              value={dashboard.outOfStock || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <h2>Low Stock Products</h2>
        <Table
          columns={lowStockColumns}
          dataSource={lowStockProducts}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={movementType === 'IN' ? 'Stock In' : 'Stock Out'}
        open={stockModalVisible}
        onCancel={() => setStockModalVisible(false)}
        onOk={() => movementForm.submit()}
      >
        <Form form={movementForm} layout="vertical" onFinish={handleStockMovement}>
          <Form.Item label="Product">
            <Input
              value={selectedInventory?.product.name}
              disabled
            />
          </Form.Item>
          <Form.Item label="Current Stock">
            <Input
              value={selectedInventory?.quantity}
              disabled
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              { required: true, message: 'Quantity is required' },
              {
                validator: (_, value) => {
                  if (movementType === 'OUT' && selectedInventory && value > selectedInventory.quantity) {
                    return Promise.reject('Insufficient stock');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="reason" label="Reason">
            <Input />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Stock Movements - ${selectedInventory?.product.name}`}
        open={movementModalVisible}
        onCancel={() => setMovementModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Table
          columns={movementColumns}
          dataSource={movements}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </div>
  );
};

export default InventoryManagement;
