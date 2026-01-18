import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import PetCard from '../components/PetCard';
import AddPetModal from '../components/AddPetModal';
import { FaPlus } from 'react-icons/fa';

const Profile = () => {
    const { user } = useAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const { data } = await axios.get('/pets');
                setPets(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchPets();
    }, [user]);

    const handlePetAdded = (newPet) => {
        setPets(prevPets => [...prevPets, newPet]);
    };

    if (!user) return <div>Please login.</div>;

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Hello, {user.name}</h1>
                    <p className="text-gray-500">Manage your pets and profile settings.</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Pets</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-full flex items-center hover:bg-gray-800 transition shadow"
                >
                    <FaPlus className="mr-2" /> Add Pet
                </button>
            </div>

            {loading ? (
                <p>Loading pets...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map(pet => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                    {pets.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">You haven't added any pets yet.</p>
                        </div>
                    )}
                </div>
            )}

            <AddPetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPetAdded={handlePetAdded}
            />
        </div>
    );
};

export default Profile;
