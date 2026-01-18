import { create } from 'zustand';
import axios from '../utils/axios';

interface Product {
  id: string;
  sku: string;
  name: string;
  shortDescription?: string;
  description?: string;
  categoryId: string;
  brandId?: string;
  attributes?: Record<string, any>;
  status: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK' | 'DISCONTINUED';
  isActive: boolean;
  images?: ProductImage[];
  videos?: ProductVideo[];
  documents?: ProductDocument[];
  tags?: ProductTag[];
  variants?: ProductVariant[];
  inventory?: Inventory;
  prices?: PriceTable[];
  category?: Category;
  brand?: Brand;
}

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductVideo {
  id: string;
  url: string;
  type: 'UPLOAD' | 'YOUTUBE' | 'VIMEO';
  embedCode?: string;
  thumbnail?: string;
}

interface ProductDocument {
  id: string;
  url: string;
  fileName: string;
  displayName: string;
  fileType: string;
  fileSize?: number;
}

interface ProductTag {
  id: string;
  tag: Tag;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  attributes: Record<string, any>;
  price?: number;
  stock: number;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  level: number;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

interface Inventory {
  id: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minimumLevel: number;
  maximumLevel?: number;
  status: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK' | 'DISCONTINUED';
}

interface PriceTable {
  id: string;
  name: string;
  costPrice: number;
  regularPrice: number;
  salePrice?: number;
  margin?: number;
  vatRate: number;
  vatAmount?: number;
  startDate: string;
  endDate?: string;
  priority: number;
  channel?: PriceChannel;
  region?: PriceRegion;
  customerGroup?: CustomerGroup;
}

interface PriceChannel {
  id: string;
  code: string;
  name: string;
}

interface PriceRegion {
  id: string;
  code: string;
  name: string;
}

interface CustomerGroup {
  id: string;
  code: string;
  name: string;
  discount?: number;
}

interface ProductStore {
  products: Product[];
  currentProduct: Product | null;
  relatedProducts: Product[];
  categories: Category[];
  brands: Brand[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  
  // Actions
  fetchProducts: (params?: any) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  createProduct: (data: any) => Promise<Product>;
  updateProduct: (id: string, data: any) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  fetchTags: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  currentProduct: null,
  relatedProducts: [],
  categories: [],
  brands: [],
  tags: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/products', { params });
      const data = {
        products: response.data.data,
        pagination: response.data.pagination,
        loading: false,
      };
      
      // If this is for related products (small limit), set relatedProducts
      if (params.limit && params.limit <= 4) {
        data.relatedProducts = response.data.data;
      }
      
      set(data);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch products',
        loading: false,
      });
    }
  },

  fetchProductById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/products/${id}`);
      set({ 
        currentProduct: response.data,
        loading: false 
      });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch product',
        loading: false,
      });
      return null;
    }
  },

  createProduct: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('http://localhost:3001/api/products', data);
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create product',
        loading: false,
      });
      throw error;
    }
  },

  updateProduct: async (id: string, data: any) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/products/${id}`, data);
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update product',
        loading: false,
      });
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/products/${id}`);
      set({ loading: false });
      // Refresh products list
      get().fetchProducts();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete product',
        loading: false,
      });
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      const response = await axios.get('/products/categories');
      set({ categories: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch categories' });
    }
  },

  fetchBrands: async () => {
    try {
      const response = await axios.get('/products/brands');
      set({ brands: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch brands' });
    }
  },

  fetchTags: async () => {
    try {
      const response = await axios.get('/products/tags');
      set({ tags: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch tags' });
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));
