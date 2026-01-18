import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Eye, ChevronDown, Filter, Grid, List, Search, ArrowRight, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import Store
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';

// Import Icons for decorative elements if needed
// Assuming we are using Unsplash for floating pets as per design

const Shop = () => {
    const { t } = useTranslation();
    const [view, setView] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [sortBy, setSortBy] = useState('popular');
    const [searchQuery, setSearchQuery] = useState('');
    const [ratingFilter, setRatingFilter] = useState(0); // 0 means all
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

    // Use Store
    const {
        products,
        loading,
        pagination,
        fetchProducts,
        categories: storeCategories,
        fetchCategories
    } = useProductStore();

    // Cart Store
    const { addItem } = useCartStore();

    // Fetch Categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch Products when filters change
    useEffect(() => {
        const params = {
            page: 1, // Reset to page 1 on filter change
            limit: 12, // Show 12 items per page
            search: searchQuery || undefined,
            categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
            status: 'IN_STOCK', // Default to showing in-stock items
            // Note: Price range and rating filtering is currently done client-side in the store or needs backend support
            // For now, we fetch and let the backend filter what it supports
        };

        fetchProducts(params);
    }, [selectedCategory, searchQuery, sortBy]);

    // Construct Categories for UI
    const categories = [
        { id: 'all', name: t('shop_page.categories.all'), count: pagination.total, icon: '🐾' },
        ...storeCategories.map(cat => {
            // Map category names to appropriate icons
            let icon = '📦'; // Default icon
            
            if (cat.slug === 'dog' || cat.name.toLowerCase().includes('chó')) {
                icon = '🐕';
            } else if (cat.slug === 'cat' || cat.name.toLowerCase().includes('mèo')) {
                icon = '🐱';
            } else if (cat.name.toLowerCase().includes('food') || cat.name.toLowerCase().includes('thức ăn')) {
                icon = '🍖';
            } else if (cat.name.toLowerCase().includes('toy') || cat.name.toLowerCase().includes('đồ chơi')) {
                icon = '🎾';
            } else if (cat.name.toLowerCase().includes('accessories') || cat.name.toLowerCase().includes('phụ kiện')) {
                icon = '🎀';
            }
            
            return {
                id: cat.id,
                name: cat.name,
                count: 0, // Backend doesn't return count per category in this API yet
                icon: icon
            };
        })
    ];

    // Map backend products to UI format if needed, or use directly
    // The store returns formatted data, but we might need to adapt specific fields
    const filteredProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.salePrice || (p.price * 1.2), // Mock original price if not exists
        rating: 5, // Mock rating as backend doesn't have reviews yet
        reviews: 0,
        category: p.category?.slug,
        image: p.image || 'https://via.placeholder.com/400',
        tag: p.status === 'IN_STOCK' ? 'new' : '',
        description: p.shortDescription || p.name,
        inStock: p.status === 'IN_STOCK'
    }));

    const handleResetFilters = () => {
        setSelectedCategory('all');
        setPriceRange([0, 100]);
        setRatingFilter(0);
        setSearchQuery('');
    };


    // Floating Background Component
    const FloatingPets = () => (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {[
                { src: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop", top: "200px", left: "100px", size: "300px", delay: "0s", rotate: -15 }, // Golden Retriever
                { src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=280&h=280&fit=crop", top: "150px", right: "150px", size: "280px", delay: "2s", rotate: 10 }, // Persian Cat
                { src: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=250&h=250&fit=crop", top: "40%", left: "50px", size: "250px", delay: "4s", rotate: 20 }, // Puppy
                { src: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=240&h=240&fit=crop", top: "50%", right: "100px", size: "240px", delay: "1s", rotate: -10 }, // Kitten
            ].map((img, idx) => (
                <motion.img
                    key={idx}
                    src={img.src}
                    className="absolute rounded-full object-cover shadow-2xl opacity-[0.06] filter blur-[1px]"
                    style={{
                        top: img.top,
                        left: img.left,
                        right: img.right,
                        width: img.size,
                        height: img.size,
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        rotate: [img.rotate - 5, img.rotate + 5, img.rotate - 5]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: parseFloat(img.delay)
                    }}
                />
            ))}
            {/* Paw Prints Pattern - Simplified for React */}
            <div className="absolute bottom-0 left-0 w-full h-full opacity-[0.03] bg-[url('https://cdn-icons-png.flaticon.com/512/12/12638.png')] bg-repeat space-y-4 pointer-events-none" style={{ backgroundSize: '100px' }}></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-['Poppins'] text-gray-800 relative">
            <FloatingPets />

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-16 bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900 overflow-hidden shadow-lg mb-8">
                {/* Hero Overlay Images */}
                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500" className="absolute bottom-0 left-0 w-64 opacity-5 transform translate-y-10" alt="Dog" />
                <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500" className="absolute bottom-0 right-0 w-64 opacity-5 transform translate-y-10 scale-x-[-1]" alt="Cat" />

                <div className="max-w-7xl mx-auto px-4 text-center relative z-20">
                    <div className="text-sm text-gray-500 mb-4 flex items-center justify-center gap-2">
                        <span>Home</span> <span>&gt;</span> <span className="font-semibold text-primary">Cửa Hàng</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-sm text-gray-900">
                        {t('shop_page.hero_title')}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 font-light">
                        {t('shop_page.hero_subtitle')}
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-lg mx-auto relative group">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm cho thú cưng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-6 pr-12 py-4 rounded-full text-gray-800 shadow-xl border-none outline-none focus:ring-4 focus:ring-tan/50 transition-all font-medium placeholder:text-gray-400"
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                            <Search className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 pb-20 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mobile Filter Toggle */}
                    <button
                        className="lg:hidden flex items-center justify-center w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-bold shadow-md"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Filter className="w-5 h-5 mr-2" /> {t('shop_page.filters.title')}
                    </button>

                    {/* Sidebar Filters */}
                    <AnimatePresence>
                        {(isSidebarOpen || window.innerWidth >= 1024) && (
                            <motion.aside
                                initial={{ x: -300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                className={`
                                    fixed inset-0 z-50 bg-black/50 lg:bg-transparent lg:static lg:block lg:w-72 flex-shrink-0
                                    ${isSidebarOpen ? 'block' : 'hidden lg:block'}
                                `}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <div
                                    className="bg-white lg:rounded-2xl h-full lg:h-auto w-80 lg:w-full p-6 shadow-xl lg:shadow-sm overflow-y-auto sticky top-24"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Filter Header */}
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Filter className="w-6 h-6 fill-current" />
                                            <h3 className="font-bold text-xl">{t('shop_page.filters.title')}</h3>
                                        </div>
                                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">✕</button>
                                    </div>

                                    {/* Categories */}
                                    <div className="mb-8">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            {t('shop_page.filters.category')}
                                        </h4>
                                        <div className="space-y-3">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setSelectedCategory(cat.id)}
                                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${selectedCategory === cat.id
                                                        ? 'bg-gray-900 text-white shadow-md transform scale-[1.02]'
                                                        : 'bg-white border border-gray-100 text-gray-600 hover:bg-cream hover:border-tan'
                                                        }`}
                                                >
                                                    <span className="font-medium flex items-center gap-2">
                                                        <span>{cat.icon}</span> {cat.name}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                        {cat.count}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div className="mb-8">
                                        <h4 className="font-bold text-gray-800 mb-4">{t('shop_page.filters.price_range')}</h4>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                                <input
                                                    type="number"
                                                    value={priceRange[0]}
                                                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                                    className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm text-center focus:border-primary outline-none"
                                                />
                                            </div>
                                            <div className="h-px w-4 bg-gray-300"></div>
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                                <input
                                                    type="number"
                                                    value={priceRange[1]}
                                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100])}
                                                    className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm text-center focus:border-primary outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="relative h-2 bg-gray-100 rounded-full mb-2">
                                            <div
                                                className="absolute h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                                style={{ left: `${priceRange[0]}%`, right: `${100 - priceRange[1]}%` }}
                                            ></div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                        </div>
                                        <p className="text-xs text-center text-gray-500">
                                            Đang chọn: ${priceRange[0]} - ${priceRange[1]}
                                        </p>
                                    </div>

                                    {/* Rating */}
                                    <div className="mb-8">
                                        <h4 className="font-bold text-gray-800 mb-4">{t('shop_page.filters.rating')}</h4>
                                        <div className="space-y-2">
                                            {[5, 4, 3, 2].map(rating => (
                                                <label key={rating} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${ratingFilter === rating ? 'bg-gray-900 border-gray-900' : 'border-gray-300 bg-white'}`}>
                                                        <input
                                                            type="radio"
                                                            name="rating"
                                                            checked={ratingFilter === rating}
                                                            onChange={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                                                            className="hidden"
                                                        />
                                                        {ratingFilter === rating && <span className="text-white text-xs">✓</span>}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={16}
                                                                className={`${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                                            />
                                                        ))}
                                                        <span className="text-sm text-gray-600 font-medium ml-1">{rating === 5 ? '5 sao' : `${rating}+ sao`}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reset Button */}
                                    <button
                                        onClick={handleResetFilters}
                                        className="w-full py-3 border-2 border-tan text-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cream hover:border-primary transition-all group"
                                    >
                                        <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                                        {t('shop_page.filters.reset')}
                                    </button>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Main Grid */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="bg-cream text-primary px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2">
                                <span>📊</span> {filteredProducts.length} {t('shop_page.toolbar.products_found')}
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-none">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full sm:w-48 appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-cream hover:border-tan transition-colors cursor-pointer"
                                    >
                                        <option value="popular">{t('shop_page.toolbar.sort_by.popular')}</option>
                                        <option value="price-low">{t('shop_page.toolbar.sort_by.price_low')}</option>
                                        <option value="price-high">{t('shop_page.toolbar.sort_by.price_high')}</option>
                                        <option value="rating">{t('shop_page.toolbar.sort_by.rating')}</option>
                                        <option value="newest">{t('shop_page.toolbar.sort_by.newest')}</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                                </div>

                                <div className="flex bg-gray-100 p-1 rounded-xl">
                                    <button
                                        onClick={() => setView('grid')}
                                        className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setView('list')}
                                        className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
                                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm nào</h3>
                                <p className="text-gray-500 mb-6">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                                <button
                                    onClick={handleResetFilters}
                                    className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        ) : (
                            <div className={view === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-6'
                            }>
                                {filteredProducts.map(product => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={product.id}
                                        className={`group bg-white rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 border border-transparent hover:border-tan hover:-translate-y-2 ${view === 'list' ? 'flex flex-row items-center p-4 gap-6' : 'flex flex-col'}`}
                                    >
                                        {/* Image Section */}
                                        <Link to={`/product/${product.id}`} className={`relative overflow-hidden cursor-pointer ${view === 'list' ? 'w-48 h-48 rounded-2xl shrink-0' : 'aspect-square'}`}>
                                            <div className="absolute inset-0 bg-gray-50/50 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                            />

                                            {/* Badges */}
                                            {product.tag && (
                                                <span className={`absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-lg ${product.tag === 'sale' ? 'bg-red-500 text-white' :
                                                    product.tag === 'new' ? 'bg-primary text-white' :
                                                        'bg-gradient-to-r from-secondary to-accent text-white'
                                                    }`}>
                                                    {t(`shop_page.product.tags.${product.tag}`)}
                                                </span>
                                            )}

                                            {/* Quick Actions */}
                                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 shadow-lg transition-all hover:scale-110">
                                                    <Heart size={18} />
                                                </button>
                                                <Link to={`/product/${product.id}`} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:bg-cream hover:text-primary shadow-lg transition-all hover:scale-110 delay-75">
                                                    <Eye size={18} />
                                                </Link>
                                            </div>

                                            {!product.inStock && (
                                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-30 flex items-center justify-center">
                                                    <span className="text-white font-bold border-2 border-white px-4 py-2 uppercase tracking-widest text-sm">Hết Hàng</span>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Content Section */}
                                        <div className={`flex flex-col flex-1 ${view === 'list' ? '' : 'p-6'}`}>
                                            <Link to={`/product/${product.id}`} className="cursor-pointer">
                                                <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-primary transition-colors line-clamp-1 hover:text-blue-600">{product.name}</h3>
                                            </Link>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed h-[40px]">{product.description}</p>

                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className={`${i < Math.floor(product.rating)
                                                                ? 'fill-amber-400 text-amber-400'
                                                                : 'fill-gray-100 text-gray-200'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">{product.rating} ({product.reviews})</span>
                                            </div>

                                            <div className={`mt-auto flex flex-col gap-3 ${view === 'list' ? '' : ''}`}>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                                                    {product.originalPrice && (
                                                        <span className="text-sm text-gray-400 line-through decoration-gray-300 decoration-2">${product.originalPrice}</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* Add to Cart Button */}
                                                    <button
                                                        onClick={() => {
                                                            addItem({
                                                                id: product.id,
                                                                name: product.name,
                                                                price: product.price,
                                                                image: product.image,
                                                            });
                                                        }}
                                                        disabled={!product.inStock}
                                                        className="h-12 w-12 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-tan/50 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                                                        title="Add to Cart"
                                                    >
                                                        <ShoppingCart size={20} />
                                                    </button>

                                                    {/* Buy Button */}
                                                    <button
                                                        disabled={!product.inStock}
                                                        className="flex-1 h-12 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 bg-blue-600 text-white hover:bg-blue-700"
                                                    >
                                                        <span>Buy</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
