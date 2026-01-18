import { motion } from 'framer-motion';

const DiagnosticImaging = () => {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-indigo-50 border-l-4 border-indigo-500 p-8 rounded-lg shadow-lg"
                >
                    <div className="flex items-center mb-6">
                        <span className="text-5xl mr-4">🔬</span>
                        <h1 className="text-3xl font-extrabold text-indigo-700">
                            CHẨN ĐOÁN HÌNH ẢNH & XÉT NGHIỆM
                        </h1>
                    </div>

                    <div className="text-xl text-gray-800 leading-relaxed mb-6 font-medium space-y-4">
                        <p>
                            Việc chẩn đoán chính xác là chìa khóa để điều trị thành công. Tropicpet trang bị hệ thống máy móc
                            hiện đại bậc nhất, giúp các bác sĩ nhìn thấy những gì mắt thường không thấy được, từ đó đưa ra
                            kết luận chính xác về tình trạng bệnh.
                        </p>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
                            <h3 className="text-2xl font-bold text-indigo-800 mb-3">Siêu Âm (Ultrasound)</h3>
                            <p className="text-gray-700 mb-2">Sử dụng máy siêu âm màu 4D hiện đại để:</p>
                            <ul className="list-disc pl-5 text-gray-700">
                                <li>Kiểm tra thai kỳ: dự đoán ngày sinh, số lượng thai.</li>
                                <li>Phát hiện các bệnh lý về gan, thận, bàng quang, tử cung...</li>
                                <li>Tầm soát các khối u trong ổ bụng.</li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
                            <h3 className="text-2xl font-bold text-indigo-800 mb-3">X-Quang Kỹ Thuật Số (Digital X-Ray)</h3>
                            <p className="text-gray-700 mb-2">Hình ảnh sắc nét, trả kết quả nhanh chóng giúp:</p>
                            <ul className="list-disc pl-5 text-gray-700">
                                <li>Chẩn đoán gãy xương, sai khớp, các bệnh lý xương khớp.</li>
                                <li>Kiểm tra tim phổi, phát hiện dị vật đường tiêu hóa.</li>
                                <li>Hỗ trợ chẩn đoán sỏi bàng quang, sỏi thận.</li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
                            <h3 className="text-2xl font-bold text-indigo-800 mb-3">Xét Nghiệm Phòng Lab</h3>
                            <p className="text-gray-700 mb-2">Hệ thống máy xét nghiệm IDEXX (Mỹ) cho kết quả chính xác:</p>
                            <ul className="list-disc pl-5 text-gray-700">
                                <li>Xét nghiệm máu tổng quát (Huyết học, Sinh hóa).</li>
                                <li>Xét nghiệm nước tiểu, phân, da.</li>
                                <li>Test nhanh các bệnh truyền nhiễm (Care, Parvo, FIP, FeLV...).</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8">
                        <a href="/booking" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-xl shadow-md transition-transform transform hover:scale-105">
                            📅 ĐẶT LỊCH XÉT NGHIỆM
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DiagnosticImaging;
