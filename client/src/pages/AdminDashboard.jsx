import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/appointments');
            setAppointments(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!user || user.role !== 'admin') {
        return <div className="text-center mt-20 text-red-500 font-bold">Access Denied. Admins Only.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Appointments Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Date/Time</th>
                                <th className="py-2">Pet</th>
                                <th className="py-2">Service</th>
                                <th className="py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(apt => (
                                <tr key={apt._id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="py-3 text-sm">
                                        {new Date(apt.date).toLocaleDateString()} <br /> {apt.time}
                                    </td>
                                    <td className="py-3 text-sm">{apt.pet?.name}</td>
                                    <td className="py-3 text-sm">{apt.service}</td>
                                    <td className="py-3 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Stats / Orders could go here */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span>Total Appointments Today</span>
                            <span className="font-bold">{appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span>Pending Confirmations</span>
                            <span className="font-bold">{appointments.filter(a => a.status === 'pending').length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
