import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Form State
    const [service, setService] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [petId, setPetId] = useState('');
    const [doctorId, setDoctorId] = useState(''); // Optional
    const [notes, setNotes] = useState('');

    // Metadata State
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Fetch User Pets
        axios.get('/pets').then(res => setPets(res.data)).catch(err => console.error(err));
    }, [user, navigate]);

    const handleBooking = async () => {
        setLoading(true);
        try {
            await axios.post('/appointments', {
                petId, service, date, time, notes, doctorId: doctorId || undefined
            });
            setStep(4); // Success Step
        } catch (error) {
            setMsg(error.response?.data?.message || 'Booking Failed');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Book an Appointment</h1>

            {/* Progress Bar */}
            <div className="flex justify-between mb-8 text-sm font-bold text-gray-500">
                <span className={step >= 1 ? 'text-primary' : ''}>1. Service & Pet</span>
                <span className={step >= 2 ? 'text-primary' : ''}>2. Date & Time</span>
                <span className={step >= 3 ? 'text-primary' : ''}>3. Confirm</span>
            </div>

            {msg && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{msg}</div>}

            {step === 1 && (
                <div className="space-y-4">
                    <div>
                        <label className="block font-bold">Select Service</label>
                        <select className="w-full border p-2 rounded" value={service} onChange={e => setService(e.target.value)}>
                            <option value="">-- Choose Service --</option>
                            
                            {/* Veterinary Services */}
                            <optgroup label="🏥 Veterinary Services">
                                <option value="Regular Health Checkup">Regular Health Checkup</option>
                                <option value="Medical Examination">Medical Examination</option>
                                <option value="Emergency Care">Emergency Care</option>
                                <option value="Health Screening">Health Screening</option>
                            </optgroup>
                            
                            {/* Preventive Care */}
                            <optgroup label="💉 Preventive Care">
                                <option value="Vaccination">Vaccination</option>
                                <option value="Parasite Prevention">Parasite Prevention</option>
                                <option value="Deworming">Deworming</option>
                                <option value="Flea & Tick Treatment">Flea & Tick Treatment</option>
                            </optgroup>
                            
                            {/* Surgical Services */}
                            <optgroup label="🔬 Surgical Services">
                                <option value="Spay/Neuter">Spay/Neuter</option>
                                <option value="Surgery">General Surgery</option>
                                <option value="Dental Surgery">Dental Surgery</option>
                                <option value="Emergency Surgery">Emergency Surgery</option>
                            </optgroup>
                            
                            {/* Diagnostic Services */}
                            <optgroup label="🔍 Diagnostic Services">
                                <option value="Diagnostic Imaging">Diagnostic Imaging (X-ray, Ultrasound)</option>
                                <option value="Blood Test">Blood Test & Lab Work</option>
                                <option value="Urine Analysis">Urine Analysis</option>
                                <option value="Skin Test">Skin & Allergy Testing</option>
                            </optgroup>
                            
                            {/* Dental Care */}
                            <optgroup label="🦷 Dental Care">
                                <option value="Dental Scaling">Dental Scaling & Cleaning</option>
                                <option value="Dental Checkup">Dental Checkup</option>
                                <option value="Tooth Extraction">Tooth Extraction</option>
                            </optgroup>
                            
                            {/* Specialized Care */}
                            <optgroup label="🤱 Specialized Care">
                                <option value="Maternity Care">Maternity Care</option>
                                <option value="Puppy/Kitten Care">Puppy/Kitten Care</option>
                                <option value="Senior Pet Care">Senior Pet Care</option>
                                <option value="Behavioral Consultation">Behavioral Consultation</option>
                            </optgroup>
                            
                            {/* Grooming & Wellness */}
                            <optgroup label="✨ Grooming & Wellness">
                                <option value="Grooming">Full Grooming Service</option>
                                <option value="Bath & Brush">Bath & Brush</option>
                                <option value="Nail Trimming">Nail Trimming</option>
                                <option value="Ear Cleaning">Ear Cleaning</option>
                            </optgroup>
                            
                            {/* Other Services */}
                            <optgroup label="📋 Other Services">
                                <option value="Consultation">General Consultation</option>
                                <option value="Follow-up Visit">Follow-up Visit</option>
                                <option value="Medication Review">Medication Review</option>
                                <option value="Nutrition Consultation">Nutrition Consultation</option>
                            </optgroup>
                        </select>
                    </div>
                    <div>
                        <label className="block font-bold">Select Pet</label>
                        <select className="w-full border p-2 rounded" value={petId} onChange={e => setPetId(e.target.value)}>
                            <option value="">-- Choose Pet --</option>
                            {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button onClick={nextStep} disabled={!service || !petId} className="bg-primary text-white px-6 py-2 rounded disabled:opacity-50">Next</button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <div>
                        <label className="block font-bold">Date</label>
                        <input type="date" className="w-full border p-2 rounded" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="block font-bold">Time</label>
                        <select className="w-full border p-2 rounded" value={time} onChange={e => setTime(e.target.value)}>
                            <option value="">-- Choose Time --</option>
                            <option value="09:00">09:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-bold">Notes</label>
                        <textarea className="w-full border p-2 rounded" value={notes} onChange={e => setNotes(e.target.value)}></textarea>
                    </div>
                    <div className="flex justify-between mt-6">
                        <button onClick={prevStep} className="bg-gray-300 text-gray-800 px-6 py-2 rounded">Back</button>
                        <button onClick={nextStep} disabled={!date || !time} className="bg-primary text-white px-6 py-2 rounded disabled:opacity-50">Next</button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">Summary</h3>
                    <div className="bg-gray-50 p-4 rounded">
                        <p><strong>Service:</strong> {service}</p>
                        <p><strong>Pet:</strong> {pets.find(p => p.id === petId)?.name}</p>
                        <p><strong>Date:</strong> {date} at {time}</p>
                        <p><strong>Notes:</strong> {notes || 'None'}</p>
                    </div>
                    <div className="flex justify-between mt-6">
                        <button onClick={prevStep} className="bg-gray-300 text-gray-800 px-6 py-2 rounded">Back</button>
                        <button onClick={handleBooking} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded">
                            {loading ? 'Booking...' : 'Confirm Appointment'}
                        </button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="text-center py-12">
                    <div className="text-green-500 text-6xl mb-4">✓</div>
                    <h2 className="text-2xl font-bold mb-4">Booking Successful!</h2>
                    <p>We have sent a confirmation to your email.</p>
                    <button onClick={() => navigate('/profile')} className="mt-8 bg-primary text-white px-6 py-2 rounded">Go to Profile</button>
                </div>
            )}
        </div>
    );
};

export default Booking;
