import { motion } from 'framer-motion';

const SpayNeuter = () => {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-orange-50 border-l-4 border-orange-500 p-8 rounded-lg shadow-lg"
                >
                    <div className="flex items-center mb-6">
                        <span className="text-5xl mr-4">⚕️</span>
                        <h1 className="text-3xl font-extrabold text-orange-700">
                            TRIỆT SẢN THÚ CƯNG
                        </h1>
                    </div>

                    <div className="text-xl text-gray-800 leading-relaxed mb-6 font-medium space-y-4">
                        <p>
                            Triệt sản là một quyết định văn minh và mang lại nhiều lợi ích sức khỏe lâu dài cho thú cưng.
                            Tại Tropicpet, phẫu thuật triệt sản được thực hiện bởi các bác sĩ tay nghề cao với phương pháp
                            hiện đại, trọn gói chăm sóc hậu phẫu chu đáo.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-orange-600 mb-2">Lợi ích của triệt sản</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li>Kiểm soát số lượng thú cưng ngoài ý muốn.</li>
                                <li>Giảm nguy cơ ung thư tuyến vú, ung thư tinh hoàn/buồng trứng.</li>
                                <li>Giảm viêm tử cung ở cái và các bệnh tuyến tiền liệt ở đực.</li>
                                <li>Giảm các hành vi không mong muốn: đánh dấu lãnh thổ, bỏ đi hoang, hung dữ...</li>
                                <li>Kéo dài tuổi thọ cho thú cưng.</li>
                            </ul>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-orange-600 mb-2">Thời điểm thích hợp</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li><strong>Chó:</strong> Tốt nhất từ 6 tháng tuổi trở lên.</li>
                                <li><strong>Mèo:</strong> Tốt nhất từ 5-6 tháng tuổi.</li>
                                <li>Không nên triệt sản khi thú cưng đang động dục hoặc đang mang thai (trừ trường hợp bệnh lý).</li>
                                <li>Cần được bác sĩ thăm khám trước khi quyết định phẫu thuật.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-orange-100 p-6 rounded-lg shadow-inner mb-8">
                        <h2 className="text-2xl font-bold text-orange-800 mb-4">Quy trình triệt sản thẩm mỹ</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li><strong>Vết mổ nhỏ:</strong> Sử dụng kỹ thuật xâm lấn tối thiểu, đường mổ nhỏ (chỉ 1-2cm với mèo đực, nhỏ gọn với cái).</li>
                            <li><strong>Chỉ tự tiêu:</strong> Không cần cắt chỉ (tùy trường hợp), hạn chế sưng viêm.</li>
                            <li><strong>Mau lành:</strong> Thú cưng có thể ăn uống và đi lại bình thường ngay sau khi hết thuốc mê 4-6 tiếng.</li>
                        </ul>
                    </div>

                    <div className="mt-8">
                        <a href="/booking" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 md:text-xl shadow-md transition-transform transform hover:scale-105">
                            📅 ĐẶT LỊCH TRIỆT SẢN
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SpayNeuter;
