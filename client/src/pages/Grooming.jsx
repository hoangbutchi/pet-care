import { motion } from 'framer-motion';

const Grooming = () => {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-purple-50 border-l-4 border-purple-500 p-8 rounded-lg shadow-lg"
                >
                    <div className="flex items-center mb-6">
                        <span className="text-5xl mr-4">🛁</span>
                        <h1 className="text-3xl font-extrabold text-purple-700">
                            DỊCH VỤ SPA & GROOMING (CẮT TỈA)
                        </h1>
                    </div>

                    <div className="text-xl text-gray-800 leading-relaxed mb-6 font-medium space-y-4">
                        <p>
                            Grooming không chỉ đơn thuần là làm đẹp, mà còn giúp thú cưng của bạn sạch sẽ,
                            thoải mái và ngăn ngừa các bệnh về da, lông. Tại Tropicpet, các bé sẽ được "biến hình"
                            trở nên xinh xắn, đáng yêu hơn bao giờ hết dưới bàn tay của các chuyên viên Grooming chuyên nghiệp.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-purple-600 mb-2">Quy trình Grooming 7 bước</h3>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                                <li>Kiểm tra sức khỏe da lông tổng quát.</li>
                                <li>Cắt mài móng, vệ sinh tai, vắt tuyến hôi.</li>
                                <li>Chải lông, gỡ rối, loại bỏ lông rụng.</li>
                                <li>Tắm massage bằng sữa tắm chuyên dụng cao cấp.</li>
                                <li>Sấy khô và chải bông lông.</li>
                                <li>Cắt tỉa tạo kiểu theo yêu cầu (Cắt style, cạo lông máu...).</li>
                                <li>Xịt nước hoa và đeo phụ kiện xinh xắn.</li>
                            </ol>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-purple-600 mb-2">Tại sao chọn Tropicpet?</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li>Sử dụng các dòng sữa tắm nhập khẩu, an toàn cho da nhạy cảm.</li>
                                <li>Hệ thống bồn tắm, máy sấy hiện đại, giảm tiếng ồn.</li>
                                <li>Không sử dụng thuốc an thần, làm việc bằng tình yêu thương.</li>
                                <li>Tư vấn kiểu cắt phù hợp nhất với từng bé.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-purple-100 p-6 rounded-lg shadow-inner mb-8">
                        <h2 className="text-2xl font-bold text-purple-800 mb-4">Các gói dịch vụ</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li><strong>Gói Tắm Vệ Sinh:</strong> Tắm, sấy, vệ sinh tai, móng, tuyến hôi.</li>
                            <li><strong>Gói Cắt Tỉa Toàn Diện:</strong> Bao gồm gói tắm vệ sinh + Cắt tỉa tạo kiểu.</li>
                            <li><strong>Gói Cạo Lông:</strong> Cạo lông toàn thân, để lại phần đầu/đuôi theo yêu cầu.</li>
                            <li><strong>Nhuộm lông:</strong> Nhuộm nghệ thuật (vui lòng đặt trước).</li>
                        </ul>
                    </div>

                    <div className="mt-8">
                        <a href="/booking" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:text-xl shadow-md transition-transform transform hover:scale-105">
                            📅 ĐẶT LỊCH SPA NGAY
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Grooming;
