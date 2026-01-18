import React from 'react';
import { Descriptions, Tag, Image, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface ProductDetailProps {
  product: any;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const priceColumns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Channel',
      dataIndex: ['channel', 'name'],
    },
    {
      title: 'Region',
      dataIndex: ['region', 'name'],
    },
    {
      title: 'Customer Group',
      dataIndex: ['customerGroup', 'name'],
    },
    {
      title: 'Cost Price',
      dataIndex: 'costPrice',
      render: (val) => `$${val?.toFixed(2)}`,
    },
    {
      title: 'Regular Price',
      dataIndex: 'regularPrice',
      render: (val) => `$${val?.toFixed(2)}`,
    },
    {
      title: 'Sale Price',
      dataIndex: 'salePrice',
      render: (val) => val ? `$${val.toFixed(2)}` : '-',
    },
  ];

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
          <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
          <Descriptions.Item label="Category" span={2}>
            {product.category?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Brand">
            {product.brand?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={product.status === 'IN_STOCK' ? 'green' : 'red'}>
              {product.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Stock">
            {product.inventory?.quantity || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Available">
            {product.inventory?.availableQuantity || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Short Description" span={2}>
            {product.shortDescription || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            <div dangerouslySetInnerHTML={{ __html: product.description || '' }} />
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'images',
      label: 'Images',
      children: (
        <div>
          {product.images?.map((img: any, index: number) => (
            <Image
              key={index}
              src={img.url}
              alt={img.alt}
              width={200}
              style={{ margin: 8 }}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'prices',
      label: 'Pricing',
      children: (
        <Table
          columns={priceColumns}
          dataSource={product.prices || []}
          rowKey="id"
          pagination={false}
        />
      ),
    },
  ];

  return <Tabs items={tabItems} />;
};

export default ProductDetail;
