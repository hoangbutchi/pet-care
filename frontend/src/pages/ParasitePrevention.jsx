import { motion } from 'framer-motion';

const ParasitePrevention = () => {
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
                        <span className="text-5xl mr-4">🦠</span>
                        <h1 className="text-3xl font-extrabold text-blue-700">
                            PHÒNG CHỐNG KÝ SINH TRÙNG
                        </h1>
                    </div>

                    <div className="text-xl text-gray-800 leading-relaxed mb-6 font-medium space-y-4">
                        <p>
                            Ký sinh trùng không chỉ gây khó chịu cho thú cưng mà còn là nguyên nhân của nhiều bệnh lý nghiêm trọng,
                            thậm chí lây sang người. Việc phòng chống ký sinh trùng định kỳ là vô cùng quan trọng để bảo vệ sức khỏe
                            cho cả thú cưng và gia đình bạn.
                        </p>
                        <p>
                            Tại Tropicpet, chúng tôi cung cấp các giải pháp toàn diện để phòng ngừa và điều trị cả nội ký sinh trùng
                            (giun, sán...) và ngoại ký sinh trùng (ve, rận, bọ chét...).
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-inner mb-8">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Các loại ký sinh trùng thường gặp</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-blue-600 mb-2">Nội ký sinh trùng</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    <li><strong>Giun đũa, giun móc, giun tóc:</strong> Gây suy dinh dưỡng, tiêu chảy, thiếu máu.</li>
                                    <li><strong>Giun tim:</strong> Lây qua muỗi đốt, gây suy tim và tử vong.</li>
                                    <li><strong>Sán dây:</strong> Gây sụt cân, ngứa hậu môn.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-blue-600 mb-2">Ngoại ký sinh trùng</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    <li><strong>Ve, rận:</strong> Hút máu, gây viêm da, truyền bệnh ký sinh trùng máu.</li>
                                    <li><strong>Bọ chét:</strong> Gây ngứa dữ dội, viêm da dị ứng, truyền sán dây.</li>
                                    <li><strong>Ghẻ:</strong> Gây rụng lông, ngứa ngáy, viêm da.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-100 p-6 rounded-lg shadow-inner mb-8">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Lịch tẩy giun và phòng chống ký sinh trùng</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li><strong>Tẩy giun:</strong> Bắt đầu từ 2 tuần tuổi, lặp lại mỗi 2 tuần cho đến 2 tháng tuổi. Sau đó mỗi tháng 1 lần đến 6 tháng tuổi. Với chó trưởng thành, tẩy giun mỗi 3-6 tháng/lần.</li>
                            <li><strong>Phòng giun tim:</strong> Nên uống thuốc hoặc nhỏ gáy định kỳ hàng tháng.</li>
                            <li><strong>Phòng ve, rận, bọ chét:</strong> Sử dụng thuốc nhỏ gáy, vòng đeo hoặc viên nhai định kỳ theo hướng dẫn của bác sĩ thú y (thường là 1-3 tháng/lần).</li>
                        </ul>
                        <div className="mt-4 bg-white p-4 rounded border-l-4 border-yellow-400 text-sm">
                            <p className="font-bold text-yellow-800">(*) Lưu ý:</p>
                            <p>Lịch trình cụ thể có thể thay đổi tùy theo độ tuổi, cân nặng và môi trường sống của thú cưng. Hãy tham khảo ý kiến bác sĩ thú y để có phác đồ tốt nhất.</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <a href="/booking" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-xl shadow-md transition-transform transform hover:scale-105">
                            📅 ĐẶT LỊCH TƯ VẤN & PHÒNG BỆNH
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ParasitePrevention;
