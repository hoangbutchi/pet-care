import { motion } from 'framer-motion';

const MedicalExamination = () => {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-cyan-50 border-l-4 border-cyan-500 p-8 rounded-lg shadow-lg"
                >
                    <div className="flex items-center mb-6">
                        <span className="text-5xl mr-4">👨‍⚕️</span>
                        <h1 className="text-3xl font-extrabold text-cyan-700">
                            KHÁM & ĐIỀU TRỊ BỆNH NỘI KHOA
                        </h1>
                    </div>

                    <div className="text-xl text-gray-800 leading-relaxed mb-6 font-medium space-y-4">
                        <p>
                            Khi thú cưng có dấu hiệu mệt mỏi, bỏ ăn, nôn mửa hoặc các triệu chứng bất thường khác,
                            việc thăm khám kịp thời là vô cùng quan trọng. Đội ngũ bác sĩ tại Tropicpet với chuyên môn cao
                            sẽ chẩn đoán và đưa ra phác đồ điều trị hiệu quả nhất.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-cyan-600 mb-2">Các bệnh lý thường gặp</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li>Bệnh đường tiêu hóa (Viêm ruột, Parvo, Care...)</li>
                                <li>Bệnh đường hô hấp (Viêm phổi, viêm phế quản...)</li>
                                <li>Bệnh da liễu (Nấm, ghẻ, viêm da...)</li>
                                <li>Bệnh tiết niệu, sinh dục</li>
                                <li>Các bệnh truyền nhiễm khác</li>
                            </ul>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-cyan-600 mb-2">Phương pháp điều trị</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li>Sử dụng thuốc đặc trị (tiêm, uống, bôi)</li>
                                <li>Truyền dịch nuôi dưỡng và bù nước</li>
                                <li>Điều trị triệu chứng kết hợp nâng cao sức đề kháng</li>
                                <li>Theo dõi và chăm sóc nội trú 24/7</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8">
                        <a href="/booking" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 md:text-xl shadow-md transition-transform transform hover:scale-105">
                            📅 ĐẶT LỊCH KHÁM BỆNH
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MedicalExamination;
