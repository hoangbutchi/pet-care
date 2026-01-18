import { motion } from 'framer-motion';

const HealthScreening = () => {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-teal-50 border-l-4 border-teal-500 p-8 rounded-lg shadow-lg"
                >
                    <div className="flex items-center mb-6">
                        <span className="text-5xl mr-4">🩺</span>
                        <h1 className="text-3xl font-extrabold text-teal-700">
                            TẦM SOÁT SỨC KHỎE ĐỊNH KỲ
                        </h1>
                    </div>

                    <div className="text-xl text-gray-800 leading-relaxed mb-6 font-medium space-y-4">
                        <p>
                            Phòng bệnh hơn chữa bệnh. Tầm soát sức khỏe định kỳ giúp phát hiện sớm các vấn đề tiềm ẩn ở thú cưng
                            trước khi chúng trở nên nghiêm trọng. Điều này đặc biệt quan trọng với thú cưng lớn tuổi.
                        </p>
                        <p>
                            Tại Tropicpet, gói khám sức khỏe tổng quát được thiết kế khoa học, phù hợp với từng độ tuổi và
                            giống loài, giúp bạn nắm bắt chính xác tình trạng sức khỏe của người bạn nhỏ.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-inner mb-8">
                        <h2 className="text-2xl font-bold text-teal-800 mb-4">Quy trình tầm soát bao gồm:</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li><strong>Khám lâm sàng:</strong> Kiểm tra mắt, tai, răng miệng, tim phổi, da lông và hệ vận động.</li>
                            <li><strong>Xét nghiệm máu:</strong> Đánh giá chức năng gan, thận, đường huyết và các chỉ số hồng cầu, bạch cầu.</li>
                            <li><strong>Siêu âm, X-quang:</strong> Kiểm tra cấu trúc nội tạng, phát hiện khối u hoặc dị vật.</li>
                            <li><strong>Xét nghiệm ký sinh trùng:</strong> Kiểm tra giun đường ruột, ký sinh trùng máu.</li>
                            <li><strong>Tư vấn dinh dưỡng:</strong> Xây dựng chế độ ăn uống hợp lý để duy trì cân nặng lý tưởng.</li>
                        </ul>
                    </div>

                    <div className="mt-8">
                        <a href="/booking" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 md:text-xl shadow-md transition-transform transform hover:scale-105">
                            📅 ĐẶT LỊCH KHÁM TỔNG QUÁT
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HealthScreening;
