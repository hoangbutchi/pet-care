import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ArrowLeft, Plus, Minus, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import { toast } from 'react-toastify';

const ProductDetail = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    
    const { 
        currentProduct, 
        loading, 
        fetchProductById,
        relatedProducts,
        fetchProducts 
    } = useProductStore();
    
    const { addItem, openCart } = useCartStore();

    useEffect(() => {
        if (id) {
            fetchProductById(id);
            // Fetch related products
            fetchProducts({ limit: 4, status: 'IN_STOCK' });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!currentProduct) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm không tồn tại</h2>
                    <Link to="/shop" className="text-blue-600 hover:text-blue-800">
                        ← Quay lại cửa hàng
                    </Link>
                </div>
            </div>
        );
    }

    const product = {
        ...currentProduct,
        price: currentProduct.prices?.[0]?.regularPrice || currentProduct.price || 0,
        salePrice: currentProduct.prices?.[0]?.salePrice || currentProduct.salePrice,
        image: currentProduct.images?.[0]?.url || currentProduct.image || 'https://via.placeholder.com/600'
    };
    const images = [product.image || 'https://via.placeholder.com/600'];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-gray-700">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/shop" className="hover:text-gray-700">Cửa hàng</Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <motion.div 
                            className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        
                        {images.length > 1 && (
                            <div className="flex space-x-4">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                            selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                                        }`}
                                    >
                                        <img src={image} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            className={`${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-500">(0 đánh giá)</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline space-x-4">
                            <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                            {product.salePrice && (
                                <span className="text-xl text-gray-400 line-through">${product.salePrice}</span>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-gray-600 leading-relaxed">
                                {product.shortDescription || product.description || 'Sản phẩm chất lượng cao dành cho thú cưng của bạn.'}
                            </p>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 font-medium">Số lượng:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 hover:bg-gray-100 transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-4 py-2 font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-2 hover:bg-gray-100 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => {
                                        if (currentProduct) {
                                            for (let i = 0; i < quantity; i++) {
                                                addItem({
                                                    id: currentProduct.id,
                                                    name: currentProduct.name,
                                                    price: currentProduct.prices?.[0]?.regularPrice || 0,
                                                    image: currentProduct.images?.[0]?.url,
                                                });
                                            }
                                            toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
                                            openCart();
                                        }
                                    }}
                                    disabled={!currentProduct || currentProduct.status !== 'IN_STOCK'}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart size={20} />
                                    <span>Thêm vào giỏ hàng</span>
                                </button>
                                <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                                    <Heart size={20} />
                                </button>
                                <button className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="border-t pt-6 space-y-4">
                            <div className="flex items-center space-x-3 text-gray-600">
                                <Truck size={20} />
                                <span>Miễn phí vận chuyển cho đơn hàng trên $50</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <Shield size={20} />
                                <span>Bảo hành chính hãng</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <RotateCcw size={20} />
                                <span>Đổi trả trong 30 ngày</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Tabs */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-16">
                    <div className="border-b border-gray-200 mb-8">
                        <nav className="flex space-x-8">
                            {['description', 'specifications', 'reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab === 'description' && 'Mô tả'}
                                    {tab === 'specifications' && 'Thông số'}
                                    {tab === 'reviews' && 'Đánh giá'}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="prose max-w-none">
                        {activeTab === 'description' && (
                            <div>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description || 'Sản phẩm chất lượng cao, được thiết kế đặc biệt cho thú cưng của bạn. Đảm bảo an toàn và tiện lợi trong sử dụng.'}
                                </p>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-medium text-gray-900">Danh mục:</span>
                                        <span className="ml-2 text-gray-600">{product.category?.name || 'Chưa phân loại'}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">Thương hiệu:</span>
                                        <span className="ml-2 text-gray-600">{product.brand?.name || 'Chưa có thông tin'}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">Trạng thái:</span>
                                        <span className="ml-2 text-gray-600">{product.status === 'IN_STOCK' ? 'Còn hàng' : 'Hết hàng'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm liên quan</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.slice(0, 4).map((relatedProduct) => (
                                <Link
                                    key={relatedProduct.id}
                                    to={`/product/${relatedProduct.id}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={relatedProduct.image || 'https://via.placeholder.com/300'}
                                            alt={relatedProduct.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                                        <p className="text-lg font-bold text-gray-900">${relatedProduct.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;