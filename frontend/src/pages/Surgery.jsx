import { motion } from 'framer-motion';

const Surgery = () => {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-slate-50 border-l-4 border-slate-500 p-8 rounded-lg shadow-lg"
                >
                    <div className="flex items-center mb-6">
                        <span className="text-5xl mr-4">🏥</span>
                        <h1 className="text-3xl font-extrabold text-slate-700">
                            PHẪU THUẬT NGOẠI KHOA
                        </h1>
                    </div>

                    <div className="text-xl text-gray-800 leading-relaxed mb-6 font-medium space-y-4">
                        <p>
                            Phòng phẫu thuật tại Tropicpet được thiết kế vô trùng, khép kín với đầy đủ các trang thiết bị
                            hỗ trợ như máy gây mê bay hơi, máy theo dõi nhịp tim/hô hấp (Monitor), dao điện cao tần...
                            Đảm bảo an toàn tối đa cho thú cưng trong quá trình phẫu thuật.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-inner mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Các dịch vụ phẫu thuật</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-600 mb-2">Phẫu thuật phần mềm</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    <li>Mổ đẻ, triệt sản.</li>
                                    <li>Cắt khối u, áp xe.</li>
                                    <li>Khâu vết thương hở.</li>
                                    <li>Phẫu thuật thoát vị (rốn, bẹn).</li>
                                    <li>Nối ruột, lấy dị vật dạ dày/ruột.</li>
                                    <li>Phẫu thuật sỏi bàng quang, sỏi niệu đạo.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-600 mb-2">Phẫu thuật xương khớp</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    <li>Kết hợp xương (nẹp vít, đinh nội tủy).</li>
                                    <li>Phẫu thuật khớp háng, khớp gối.</li>
                                    <li>Chỉnh hình dị tật bẩm sinh.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-100 p-6 rounded-lg shadow-inner mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Quy trình an toàn phẫu thuật</h2>
                        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                            <li><strong>Khám tiền phẫu:</strong> Kiểm tra sức khỏe tổng quát và xét nghiệm máu để đảm bảo đủ điều kiện phẫu thuật.</li>
                            <li><strong>Gây mê:</strong> Sử dụng công nghệ gây mê khí dung an toàn, giúp thú cưng ngủ sâu và tỉnh lại nhanh chóng sau mổ.</li>
                            <li><strong>Hậu phẫu:</strong> Chăm sóc tại phòng hồi sức, theo dõi sát sao các chỉ số sinh tồn và giảm đau sau mổ.</li>
                        </ol>
                    </div>

                    <div className="mt-8">
                        <a href="/booking" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 md:text-xl shadow-md transition-transform transform hover:scale-105">
                            📅 ĐẶT LỊCH TƯ VẤN PHẪU THUẬT
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Surgery;
