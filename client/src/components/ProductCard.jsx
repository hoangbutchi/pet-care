import { useCartStore } from '../store/cartStore';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
    const { addItem } = useCartStore();
    
    const addToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price || 0,
            image: product.image,
        });
        toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
    };

    return (
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
            <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain hover:scale-110 transition-transform duration-500" />
                ) : (
                    <span className="text-4xl text-gray-400">📦</span>
                )}
            </div>
            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-2 h-10 overflow-hidden">{product.description}</p>
            <div className="flex justify-between items-center mt-auto">
                <span className="font-bold text-indigo-600">${product.price}</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => alert(`Buy ${product.name} clicked! (Mock)`)}
                        className="bg-secondary text-white text-sm px-3 py-1 rounded hover:bg-pink-600 transition"
                    >
                        Buy
                    </button>
                    <button
                        onClick={addToCart}
                        className="bg-primary text-white text-sm px-3 py-1 rounded hover:bg-indigo-700 transition"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
