import { motion } from 'framer-motion';

const Maternity = () => {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-pink-50 border-l-4 border-pink-500 p-8 rounded-lg shadow-lg"
                >
                    <div className="flex items-center mb-6">
                        <span className="text-5xl mr-4">🤱</span>
                        <h1 className="text-3xl font-extrabold text-pink-700">
                            DỊCH VỤ ĐỠ ĐẺ & HỘ SINH
                        </h1>
                    </div>

                    <div className="text-xl text-gray-800 leading-relaxed mb-6 font-medium space-y-4">
                        <p>
                            Thời kỳ mang thai và sinh nở là giai đoạn nhạy cảm và quan trọng nhất của thú cưng cái.
                            Tropicpet đồng hành cùng bạn chăm sóc "mẹ tròn con vuông" với dịch vụ đỡ đẻ, mổ đẻ an toàn
                            và chăm sóc sơ sinh chuyên nghiệp.
                        </p>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-pink-100">
                            <h3 className="text-2xl font-bold text-pink-800 mb-3">Chăm sóc thai kỳ</h3>
                            <ul className="list-disc pl-5 text-gray-700">
                                <li>Siêu âm xác định thai, dự kiến ngày sinh, số lượng thai.</li>
                                <li>Tư vấn chế độ dinh dưỡng, vận động cho mẹ bầu.</li>
                                <li>Tiêm phòng và tẩy giun định kỳ an toàn cho thai.</li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-pink-100">
                            <h3 className="text-2xl font-bold text-pink-800 mb-3">Dịch vụ đỡ đẻ & Mổ đẻ</h3>
                            <ul className="list-disc pl-5 text-gray-700">
                                <li><strong>Đỡ đẻ thường:</strong> Hỗ trợ thú cưng sinh tự nhiên, can thiệp khi có dấu hiệu khó sinh nhẹ.</li>
                                <li><strong>Mổ đẻ (C-section):</strong> Chỉ định trong trường hợp thai quá to, ngôi thai ngược, mẹ yếu sức, hoặc giống chó khó sinh (Bull, Pug...). Thực hiện nhanh chóng, an toàn.</li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-pink-100">
                            <h3 className="text-2xl font-bold text-pink-800 mb-3">Chăm sóc sơ sinh</h3>
                            <ul className="list-disc pl-5 text-gray-700">
                                <li>Hồi sức sơ sinh: hút dịch, kích thích hô hấp, ủ ấm lồng ấp.</li>
                                <li>Cắt rốn, vệ sinh an toàn.</li>
                                <li>Hướng dẫn chủ nuôi cách chăm sóc, cho bú và giữ ấm cho đàn con.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8">
                        <a href="/booking" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 md:text-xl shadow-md transition-transform transform hover:scale-105">
                            📅 ĐẶT LỊCH KHÁM THAI
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Maternity;
