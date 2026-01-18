import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  InputNumber,
  Switch,
  Tag,
  Space,
  Card,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDropzone } from 'react-dropzone';

import { useProductStore } from '../../store/productStore';

const { TextArea } = Input;
const { Option } = Select;

interface ProductFormProps {
  product?: any;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

const productSchema = yup.object().shape({
  name: yup.string().required('Product name is required').max(200, 'Max 200 characters'),
  shortDescription: yup.string().max(500, 'Max 500 characters'),
  categoryId: yup.string().required('Category is required'),
  sku: yup.string(),
  brandId: yup.string(),
  status: yup.string(),
  isActive: yup.boolean(),
  stock: yup.number().min(0, 'Must be positive').default(0),
  price: yup.number().min(0, 'Must be positive').default(0),
});

const ProductForm: React.FC<ProductFormProps> = ({ product, mode, onSuccess }) => {
  const { createProduct, updateProduct, categories, brands, tags, fetchCategories, fetchBrands, fetchTags } = useProductStore();
  
  const [loading, setLoading] = useState(false);
  
  // Ensure data is loaded when component mounts
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
    if (brands.length === 0) {
      fetchBrands();
    }
    if (tags.length === 0) {
      fetchTags();
    }
  }, [categories.length, brands.length, tags.length, fetchCategories, fetchBrands, fetchTags]);
  const [description, setDescription] = useState(product?.description || '');
  const [productImages, setProductImages] = useState<any[]>(product?.images || []);
  const [productVideos, setProductVideos] = useState<any[]>(product?.videos || []);
  const [productDocuments, setProductDocuments] = useState<any[]>(product?.documents || []);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    product?.tags?.map((t: any) => t.tagId || t.tag?.id) || []
  );
  const [attributes, setAttributes] = useState<Record<string, string>>(
    product?.attributes || {}
  );
  const [variants, setVariants] = useState<any[]>(product?.variants || []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      shortDescription: product?.shortDescription || '',
      categoryId: product?.categoryId || '',
      brandId: product?.brandId || '',
      status: product?.status || 'IN_STOCK',
      isActive: product?.isActive !== undefined ? product.isActive : true,
      price: product?.prices?.[0]?.regularPrice || 0,
      stock: product?.inventory?.quantity || 0,
    },
  });

  // Image upload
  const onDropImages = async (acceptedFiles: File[]) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      // In production, this would upload to your server/S3
      // For now, we'll use base64 preview
      const newImages = await Promise.all(
        acceptedFiles.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                id: Date.now() + Math.random(),
                url: e.target?.result as string,
                alt: file.name,
                isPrimary: productImages.length === 0,
                sortOrder: productImages.length,
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );
      setProductImages([...productImages, ...newImages]);
    } catch (error) {
      message.error('Failed to upload images');
    }
  };

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    onDrop: onDropImages,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: true,
  });

  const removeImage = (index: number) => {
    const newImages = [...productImages];
    newImages.splice(index, 1);
    // Reorder
    newImages.forEach((img, idx) => {
      img.sortOrder = idx;
      if (idx === 0) img.isPrimary = true;
      else img.isPrimary = false;
    });
    setProductImages(newImages);
  };

  const setPrimaryImage = (index: number) => {
    const newImages = productImages.map((img, idx) => ({
      ...img,
      isPrimary: idx === index,
    }));
    setProductImages(newImages);
  };

  // Add attribute
  const addAttribute = () => {
    setAttributes({ ...attributes, '': '' });
  };

  const updateAttribute = (oldKey: string, newKey: string, value: string) => {
    const newAttrs = { ...attributes };
    delete newAttrs[oldKey];
    if (newKey) {
      newAttrs[newKey] = value;
    }
    setAttributes(newAttrs);
  };

  const removeAttribute = (key: string) => {
    const newAttrs = { ...attributes };
    delete newAttrs[key];
    setAttributes(newAttrs);
  };

  // Add variant
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now(),
        name: '',
        attributes: {},
        price: 0,
        stock: 0,
        sku: '',
      },
    ]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = {
        ...data,
        description,
        // Convert empty strings to null for optional foreign keys
        brandId: data.brandId || null,
        images: productImages.map((img) => ({
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
        })),
        videos: productVideos,
        documents: productDocuments,
        tags: selectedTags.length > 0 ? selectedTags : null,
        attributes,
        regularPrice: data.price, // Mapping form price to regularPrice
        stock: data.stock,       // Direct stock mapping
        variants: variants.map((v) => ({
          name: v.name,
          attributes: v.attributes,
          price: v.price,
          stock: v.stock,
          sku: v.sku,
        })),
      };

      console.log('Submitting form data:', formData);

      if (mode === 'create') {
        await createProduct(formData);
        message.success('Product created successfully');
      } else {
        await updateProduct(product.id, formData);
        message.success('Product updated successfully');
      }
      onSuccess();
    } catch (error: any) {
      message.error(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'basic',
      label: 'Basic Information',
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="SKU"
              validateStatus={errors.sku ? 'error' : ''}
              help={errors.sku?.message as string}
            >
              <Controller
                name="sku"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Auto-generated if empty" />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Product Name"
              required
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name?.message as string}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Product name" maxLength={200} />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Short Description"
              validateStatus={errors.shortDescription ? 'error' : ''}
              help={errors.shortDescription?.message as string}
            >
              <Controller
                name="shortDescription"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={3}
                    placeholder="Short description (max 500 characters)"
                    maxLength={500}
                    showCount
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Category"
              required
              validateStatus={errors.categoryId ? 'error' : ''}
              help={errors.categoryId?.message as string}
            >
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select category">
                    {categories.map((cat) => (
                      <Option key={cat.id} value={cat.id}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Brand">
              <Controller
                name="brandId"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Select brand" allowClear>
                    {brands.map((brand) => (
                      <Option key={brand.id} value={brand.id}>
                        {brand.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Price" initialValue={0}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    style={{ width: '100%' }}
                    min={0}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => {
                      const parsed = value!.replace(/\$\s?|(,*)/g, '');
                      return parseFloat(parsed) || 0;
                    }}
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Stock" initialValue={0}>
              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} style={{ width: '100%' }} min={0} />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Tags">
              <Select
                mode="multiple"
                placeholder="Select tags"
                value={selectedTags}
                onChange={setSelectedTags}
                style={{ width: '100%' }}
              >
                {tags.map((tag) => (
                  <Option key={tag.id} value={tag.id}>
                    {tag.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Status">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    <Option value="IN_STOCK">In Stock</Option>
                    <Option value="OUT_OF_STOCK">Out of Stock</Option>
                    <Option value="LOW_STOCK">Low Stock</Option>
                    <Option value="DISCONTINUED">Discontinued</Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Active">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onChange={field.onChange} />
                )}
              />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      children: (
        <Form.Item label="Detailed Description">
          <TextArea
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter detailed product description here..."
          />
        </Form.Item>
      ),
    },
    {
      key: 'images',
      label: 'Images & Media',
      children: (
        <div>
          <div
            {...getImageRootProps()}
            style={{
              border: '2px dashed #d9d9d9',
              borderRadius: 8,
              padding: 20,
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: 16,
            }}
          >
            <input {...getImageInputProps()} />
            <UploadOutlined style={{ fontSize: 32, color: '#999' }} />
            <p>Drag & drop images here, or click to select</p>
          </div>
          <Row gutter={16}>
            {productImages.map((img, index) => (
              <Col span={6} key={img.id || index}>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <img
                    src={img.url}
                    alt={img.alt}
                    style={{
                      width: '100%',
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                  />
                  {img.isPrimary && (
                    <Tag color="green" style={{ position: 'absolute', top: 5, left: 5 }}>
                      Primary
                    </Tag>
                  )}
                  <div style={{ marginTop: 8, textAlign: 'center' }}>
                    <Space>
                      {!img.isPrimary && (
                        <Button
                          size="small"
                          onClick={() => setPrimaryImage(index)}
                        >
                          Set Primary
                        </Button>
                      )}
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeImage(index)}
                      >
                        Remove
                      </Button>
                    </Space>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      ),
    },
    {
      key: 'attributes',
      label: 'Attributes',
      children: (
        <div>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addAttribute}
            style={{ marginBottom: 16 }}
          >
            Add Attribute
          </Button>
          {Object.entries(attributes).map(([key, value], index) => (
            <Row gutter={8} key={index} style={{ marginBottom: 8 }}>
              <Col span={10}>
                <Input
                  placeholder="Attribute name"
                  value={key}
                  onChange={(e) => updateAttribute(key, e.target.value, value)}
                />
              </Col>
              <Col span={10}>
                <Input
                  placeholder="Attribute value"
                  value={value}
                  onChange={(e) => updateAttribute(key, key, e.target.value)}
                />
              </Col>
              <Col span={4}>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeAttribute(key)}
                />
              </Col>
            </Row>
          ))}
        </div>
      ),
    },
    {
      key: 'variants',
      label: 'Variants',
      children: (
        <div>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addVariant}
            style={{ marginBottom: 16 }}
          >
            Add Variant
          </Button>
          {variants.map((variant, index) => (
            <Card key={variant.id || index} style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <Input
                    placeholder="Variant name (e.g., Red - M)"
                    value={variant.name}
                    onChange={(e) => updateVariant(index, 'name', e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                </Col>
                <Col span={8}>
                  <Input
                    placeholder="SKU"
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                  />
                </Col>
                <Col span={8}>
                  <InputNumber
                    placeholder="Price"
                    value={variant.price}
                    onChange={(val) => updateVariant(index, 'price', val)}
                    style={{ width: '100%' }}
                    min={0}
                  />
                </Col>
                <Col span={6}>
                  <InputNumber
                    placeholder="Stock"
                    value={variant.stock}
                    onChange={(val) => updateVariant(index, 'stock', val)}
                    style={{ width: '100%' }}
                    min={0}
                  />
                </Col>
                <Col span={2}>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeVariant(index)}
                  />
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Tabs items={tabItems} />
      <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
        <Space>
          <Button onClick={onSuccess}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {mode === 'create' ? 'Create' : 'Update'} Product
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
