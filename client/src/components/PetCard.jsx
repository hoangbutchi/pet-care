import { format } from 'date-fns';

const PetCard = ({ pet }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-3xl">
                {pet.imageUrl ? (
                    <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => { e.target.onerror = null; e.target.src = '' }} // Fallback if load fails
                    />
                ) : (
                    pet.species === 'Dog' ? '🐶' : pet.species === 'Cat' ? '🐱' : '🐾'
                )}
            </div>
            <h3 className="text-xl font-bold">{pet.name}</h3>
            <p className="text-gray-500 text-sm">{pet.breed} • {pet.age} years</p>
            <div className="mt-4 w-full">
                <h4 className="font-semibold text-left mb-2 text-xs uppercase text-gray-400">Recent Health Log</h4>
                {pet.medicalHistory && pet.medicalHistory.length > 0 ? (
                    <div className="text-left bg-gray-50 p-3 rounded text-sm">
                        <p className="font-bold">{pet.medicalHistory[pet.medicalHistory.length - 1].title}</p>
                        <p className="text-gray-500 text-xs">{format(new Date(pet.medicalHistory[pet.medicalHistory.length - 1].date), 'PPP')}</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No records yet.</p>
                )}
            </div>
        </div>
    );
};

export default PetCard;
