import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import Booking from './pages/Booking';
import Services from './pages/Services';
import Emergency from './pages/Emergency';
import Vaccination from './pages/Vaccination';
import ParasitePrevention from './pages/ParasitePrevention';
import HealthScreening from './pages/HealthScreening';
import MedicalExamination from './pages/MedicalExamination';
import DiagnosticImaging from './pages/DiagnosticImaging';
import Surgery from './pages/Surgery';
import SpayNeuter from './pages/SpayNeuter';
import Maternity from './pages/Maternity';
import DentalScaling from './pages/DentalScaling';
import Grooming from './pages/Grooming';
import ProductManagement from './pages/admin/ProductManagement';
import PriceManagement from './pages/admin/PriceManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
// Communication Module
import Chat from './pages/Chat';
import EmailMarketing from './pages/EmailMarketing';
import Consultation from './pages/Consultation';
import FloatingActions from './components/FloatingActions';
import Cart from './components/Cart';


function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50 font-sans">
                    <Navbar />
                    <FloatingActions />
                    <Cart />
                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/booking" element={<Booking />} />
                            <Route path="/emergency" element={<Emergency />} />
                            <Route path="/vaccination" element={<Vaccination />} />
                            <Route path="/parasite-prevention" element={<ParasitePrevention />} />
                            <Route path="/health-screening" element={<HealthScreening />} />
                            <Route path="/medical-examination" element={<MedicalExamination />} />
                            <Route path="/diagnostic-imaging" element={<DiagnosticImaging />} />
                            <Route path="/surgery" element={<Surgery />} />
                            <Route path="/spay-neuter" element={<SpayNeuter />} />
                            <Route path="/maternity" element={<Maternity />} />
                            <Route path="/dental-scaling" element={<DentalScaling />} />
                            <Route path="/grooming" element={<Grooming />} />
                            
                            {/* Protected Admin Routes */}
                            <Route path="/admin" element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            } />
                            <Route path="/admin/products" element={
                                <AdminRoute>
                                    <ProductManagement />
                                </AdminRoute>
                            } />
                            <Route path="/admin/prices" element={
                                <AdminRoute>
                                    <PriceManagement />
                                </AdminRoute>
                            } />
                            <Route path="/admin/inventory" element={
                                <AdminRoute>
                                    <InventoryManagement />
                                </AdminRoute>
                            } />
                            
                            {/* Communication Module Routes */}
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/email-marketing" element={
                                <AdminRoute>
                                    <EmailMarketing />
                                </AdminRoute>
                            } />
                            <Route path="/consultation" element={<Consultation />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
