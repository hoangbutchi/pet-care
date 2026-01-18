import { motion } from 'framer-motion';

const Emergency = () => {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg shadow-lg"
                >
                    <div className="flex items-center mb-6">
                        <span className="text-5xl mr-4">🚑</span>
                        <h1 className="text-3xl font-extrabold text-red-700">
                            DỊCH VỤ CẤP CỨU THÚ CƯNG 24/24
                        </h1>
                    </div>

                    <div className="space-y-6 text-xl text-gray-800 leading-relaxed font-medium">
                        <p>
                            Thú cưng gặp phải các tình huống khẩn cấp, nguy hiểm như khó đẻ, nuốt dị vật, ngộ độc, tai nạn, cắn nhau…
                            Dịch vụ cấp cứu thú cưng của chúng tôi hoạt động 24/24 tất cả các ngày bao gồm cả ngày nghỉ và lễ tết,
                            luôn sẵn sàng giúp đỡ cho thú cưng của bạn.
                        </p>
                        <p>
                            Để đảm bảo rằng thú cưng của bạn luôn nhận được sự chăm sóc tốt nhất. Tropicpet có đội ngũ bác sĩ thú y giàu kinh nghiệm,
                            được đào tạo bài bản, chuyên sâu luôn sẵn sàng đáp ứng mọi tình huống cấp cứu, khẩn cấp liên quan đến sức khỏe của thú cưng của bạn.
                        </p>
                        <p>
                            Bên cạnh đó, hệ thống không ngừng nâng cấp và đầu tư bài bản các trang thiết bị y tế hiện đại và công nghệ tiên tiến giúp chẩn đoán khoa học và điều trị hiệu quả.
                            Sử dụng các dụng cụ và thiết bị y tế chuyên dụng hàng đầu trong ngành thú y để đảm bảo khả năng xử lý nhanh chóng các tình huống khẩn cấp một cách chính xác.
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 my-8">
                        <img src="/emergency-1.png" alt="Emergency care 1" className="w-1/2 md:w-5/12 rounded-lg shadow-md object-cover h-64" />
                        <img src="/emergency-2.png" alt="Emergency care 2" className="w-1/2 md:w-5/12 rounded-lg shadow-md object-cover h-64" />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4 text-gray-700">
                        <h2 className="text-2xl font-bold text-red-800 mb-4">Với dịch vụ cấp cứu thú cưng 24/24 của Tropicpet, bạn có thể yên tâm vì:</h2>
                        <ul className="list-disc pl-5 space-y-3">
                            <li><strong>Dịch vụ hoạt động 24/24:</strong> Tất cả các ngày trong tuần bao gồm cả các ngày nghỉ và lễ tết.</li>
                            <li><strong>Ưu tiên cao nhất:</strong> Tropicpet hiểu rằng trong mọi tình huống khẩn cấp, thú cưng của bạn cần có sự chăm sóc và điều trị ngay lập tức. Do vậy, chúng tôi đặt sự ưu tiên cao nhất cho các trường hợp này, đảm bảo thú cưng của bạn nhận được sự chăm sóc và điều trị ngay khi được tiếp nhận.</li>
                            <li><strong>Đội ngũ chuyên nghiệp:</strong> Đội ngũ bác sĩ và nhân viên luôn sẵn sàng túc trực, với kinh nghiệm và kiến thức chuyên môn, họ sẽ đưa ra những quyết định nhanh chóng và chính xác để cứu sống, cải thiện tình trạng sức khỏe cho thú cưng của bạn.</li>
                            <li><strong>Trang thiết bị sẵn sàng:</strong> Các thiết bị máy móc, vật tư y tế và dụng cụ hỗ trợ quá trình cấp cứu luôn đảm bảo trạng thái sẵn sàng đưa vào sử dụng.</li>
                            <li><strong>Chi phí hợp lý:</strong> Chúng tôi luôn tận dụng tối đa mọi nguồn lực để tiết kiệm chi phí cho khách hàng, bạn có thể yên tâm rằng sẽ luôn nhận được chất lượng dịch vụ tốt nhất với chi phí phù hợp.</li>
                        </ul>
                        <p className="border-t pt-4 mt-4 font-semibold text-red-700">
                            Đội ngũ chúng tôi sẽ đồng hành cùng bạn và thú cưng của mình trong mọi tình huống khẩn cấp, cấp cứu.
                            Chúng tôi sẵn sàng để hỗ trợ và đảm bảo thú cưng của bạn nhận được chăm sóc y tế tốt nhất, bất kể khung thời gian hay tình huống khẩn cấp nào.
                            <br /><span className="block mt-2 text-red-600 font-bold uppercase">Một lần nữa xin lưu ý hãy liên hệ qua hotline để chúng tôi có thể hỗ trợ bạn kịp thời 24/24.</span>
                        </p>
                    </div>

                    <div className="mt-8">
                        <a href="tel:123456789" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:text-xl shadow-md transition-transform transform hover:scale-105">
                            📞 GỌI NGAY: 123-456-789
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Emergency;
