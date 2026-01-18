import { motion } from 'framer-motion';

const DentalScaling = () => {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-lg shadow-lg"
                >
                    <div className="flex items-center mb-6">
                        <span className="text-5xl mr-4">🦷</span>
                        <h1 className="text-3xl font-extrabold text-blue-700">
                            NHA KHOA & LẤY CAO RĂNG
                        </h1>
                    </div>

                    <div className="text-xl text-gray-800 leading-relaxed mb-6 font-medium space-y-4">
                        <p>
                            Bệnh răng miệng là một trong những vấn đề phổ biến nhất ở thú cưng, gây đau đớn, hôi miệng
                            và có thể dẫn đến các bệnh lý nghiêm trọng về tim, gan, thận do vi khuẩn xâm nhập vào máu.
                            Lấy cao răng định kỳ là cách tốt nhất để bảo vệ nụ cười của thú cưng.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-blue-600 mb-2">Dấu hiệu cần đi khám nha khoa</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li>Hôi miệng nồng nặc.</li>
                                <li>Răng ố vàng, có mảng bám dày ở chân răng.</li>
                                <li>Nướu sưng đỏ, chảy máu.</li>
                                <li>Chảy nước dãi nhiều.</li>
                                <li>Biếng ăn, khó nhai hoặc chỉ nhai một bên.</li>
                            </ul>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-blue-600 mb-2">Quy trình lấy cao răng</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li><strong>Kiểm tra sơ bộ:</strong> Đánh giá mức độ vôi răng và viêm lợi.</li>
                                <li><strong>Gây mê nhẹ:</strong> Giúp thú cưng nằm im, tránh hoảng sợ và đảm bảo an toàn thao tác.</li>
                                <li><strong>Lấy cao răng siêu âm:</strong> Sử dụng máy lấy cao răng chuyên dụng, làm sạch mảng bám mà không hại men răng.</li>
                                <li><strong>Đánh bóng:</strong> Làm nhẵn bề mặt răng, ngăn ngừa mảng bám quay lại.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-blue-100 p-6 rounded-lg shadow-inner mb-8">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Chăm sóc răng miệng tại nhà</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>Chải răng cho thú cưng hàng ngày hoặc ít nhất 2-3 lần/tuần.</li>
                            <li>Sử dụng các loại xương gặm sạch răng, đồ chơi nha khoa.</li>
                            <li>Sử dụng nước súc miệng hoặc gel bôi răng chuyên dụng cho thú cưng.</li>
                            <li>Kiểm tra răng miệng định kỳ 6 tháng/lần.</li>
                        </ul>
                    </div>

                    <div className="mt-8">
                        <a href="/booking" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-xl shadow-md transition-transform transform hover:scale-105">
                            📅 ĐẶT LỊCH LẤY CAO RĂNG
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DentalScaling;
