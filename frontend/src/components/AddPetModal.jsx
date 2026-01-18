import { useState, useRef } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Camera, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AddPetModal = ({ isOpen, onClose, onPetAdded }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '', species: 'Dog', breed: '', age: 0, weight: 0
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            validateAndSetImage(file);
        }
    };

    const validateAndSetImage = (file) => {
        setError('');
        // Validate types
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setError(t('errors.invalid_file_type', 'Invalid file type. Only JPG, PNG, WEBP allowed.'));
            return;
        }
        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError(t('errors.file_too_large', 'File too large. Max 5MB.'));
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            validateAndSetImage(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('species', formData.species);
        data.append('breed', formData.breed);
        // Replace comma with dot and parse to ensure valid number for backend
        data.append('age', parseFloat(formData.age.toString().replace(',', '.')) || 0);
        data.append('weight', parseFloat(formData.weight.toString().replace(',', '.')) || 0);
        if (image) {
            data.append('image', image);
        }

        try {
            const { data: newPet } = await axios.post('/pets', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onPetAdded(newPet);
            // Reset form
            setFormData({ name: '', species: 'Dog', breed: '', age: 0, weight: 0 });
            setImage(null);
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            onClose();
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to add pet');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Add New Pet</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Image Upload Section */}
                        <div
                            className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                            />

                            <AnimatePresence>
                                {preview ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="relative w-full h-full"
                                    >
                                        <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                        <div
                                            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-md cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                        >
                                            <X size={16} />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                                        <div className="p-4 bg-gray-100 rounded-full mb-3 group-hover:bg-white group-hover:shadow-md transition-all">
                                            <Camera size={32} />
                                        </div>
                                        <p className="font-medium text-sm">Click or Drag & Drop photo</p>
                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Max 5MB)</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Text Fields */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Pet's name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Species</label>
                            <div className="relative">
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white transition-all"
                                    value={formData.species}
                                    onChange={e => setFormData({ ...formData, species: e.target.value })}
                                >
                                    <option value="Dog">Dog</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Breed</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                value={formData.breed}
                                onChange={e => setFormData({ ...formData, breed: e.target.value })}
                                placeholder="e.g. Golden Retriever"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Age (years)</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                                    placeholder="0.0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Weight (kg)</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    value={formData.weight}
                                    onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                    placeholder="0.0"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 shadow-lg shadow-gray-900/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Save Pet'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddPetModal;
