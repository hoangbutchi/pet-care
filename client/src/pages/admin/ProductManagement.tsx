import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  message,
  Card,
  Row,
  Col,
  Select,
  Image,
  Popconfirm,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useProductStore } from '../../store/productStore';
import ProductForm from '../../components/products/ProductForm';
import ProductDetail from '../../components/products/ProductDetail';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface Product {
  id: string;
  sku: string;
  name: string;
  shortDescription?: string;
  status: string;
  category?: { name: string };
  brand?: { name: string };
  images?: Array<{ url: string; isPrimary: boolean }>;
  inventory?: { quantity: number; status: string };
}

const ProductManagement: React.FC = () => {
  const {
    products,
    loading,
    pagination,
    fetchProducts,
    deleteProduct,
    fetchCategories,
    fetchBrands,
    fetchTags,
    categories,
    brands,
  } = useProductStore();

  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
    fetchTags();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [categoryFilter, statusFilter]);

  const handleSearch = () => {
    fetchProducts({
      search: searchText || undefined,
      categoryId: categoryFilter,
      status: statusFilter,
      page: 1,
      limit: pagination.limit,
    });
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setFormMode('create');
    setModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormMode('edit');
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success('Product deleted successfully');
    } catch (error: any) {
      message.error(error.message || 'Failed to delete product');
    }
  };

  const handleView = async (product: Product) => {
    const fullProduct = await useProductStore.getState().fetchProductById(product.id);
    setSelectedProduct(fullProduct as any);
    setDetailVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      IN_STOCK: { color: 'green', text: 'In Stock' },
      OUT_OF_STOCK: { color: 'red', text: 'Out of Stock' },
      LOW_STOCK: { color: 'orange', text: 'Low Stock' },
      DISCONTINUED: { color: 'default', text: 'Discontinued' },
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'image',
      width: 80,
      render: (images: Product['images']) => {
        const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
        return primaryImage ? (
          <Image
            src={primaryImage.url}
            alt="Product"
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={false}
          />
        ) : (
          <div style={{ width: 50, height: 50, background: '#f0f0f0', borderRadius: 4 }} />
        );
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 150,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 150,
    },
    {
      title: 'Brand',
      dataIndex: ['brand', 'name'],
      key: 'brand',
      width: 120,
    },
    {
      title: 'Stock',
      dataIndex: ['inventory', 'quantity'],
      key: 'stock',
      width: 100,
      render: (quantity: number, record: Product) => (
        <Badge
          count={quantity}
          showZero
          style={{
            backgroundColor: record.inventory?.status === 'LOW_STOCK' ? '#faad14' : undefined,
          }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: getStatusTag,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search by name, SKU..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Category"
              allowClear
              style={{ width: '100%' }}
              size="large"
              value={categoryFilter}
              onChange={setCategoryFilter}
            >
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Status"
              allowClear
              style={{ width: '100%' }}
              size="large"
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="IN_STOCK">In Stock</Option>
              <Option value="OUT_OF_STOCK">Out of Stock</Option>
              <Option value="LOW_STOCK">Low Stock</Option>
              <Option value="DISCONTINUED">Discontinued</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              block
              onClick={handleCreate}
            >
              Add Product
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={products}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
            onChange: (page, pageSize) => {
              fetchProducts({
                search: searchText || undefined,
                categoryId: categoryFilter,
                status: statusFilter,
                page,
                limit: pageSize,
              });
            },
          }}
        />
      </Card>

      <Modal
        title={formMode === 'create' ? 'Create Product' : 'Edit Product'}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={1200}
        destroyOnClose
      >
        <ProductForm
          product={selectedProduct}
          mode={formMode}
          onSuccess={handleModalClose}
        />
      </Modal>

      <Modal
        title="Product Details"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={1000}
        destroyOnClose
      >
        {selectedProduct && <ProductDetail product={selectedProduct} />}
      </Modal>
    </div>
  );
};

export default ProductManagement;
