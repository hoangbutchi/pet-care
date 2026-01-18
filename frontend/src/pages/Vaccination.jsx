import { motion } from 'framer-motion';

const Vaccination = () => {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-green-50 border-l-4 border-green-500 p-8 rounded-lg shadow-lg"
                >
                    <div className="flex items-center mb-6">
                        <span className="text-5xl mr-4">💉</span>
                        <h1 className="text-3xl font-extrabold text-green-700">
                            DỊCH VỤ TIÊM PHÒNG VACCINE
                        </h1>
                    </div>

                    <div className="text-xl text-gray-800 leading-relaxed mb-6 font-medium space-y-4">
                        <p>
                            Tiêm phòng vaccine là biện pháp hiệu quả và kinh tế giúp chủ nuôi bảo vệ sức khỏe thú cưng của mình khỏi các bệnh truyền nhiễm nguy hiểm.
                            Thú cưng khi được tiêm phòng đầy đủ sẽ tạo ra hệ miễn dịch chủ động để chống lại các virus gây bệnh.
                            Điều này có lợi cho sức khỏe thú cưng hơn là phải điều trị khi phát bệnh, đặc biệt như bệnh dại còn là mối nguy hiểm cho gia đình và xã hội.
                        </p>
                        <p>
                            chúng tôi sử dụng vaccine nhập khẩu của những nhà sản xuất hàng đầu từ Mỹ và Châu Âu.
                            Không chỉ đảm bảo chất lượng vaccine mà còn tuân thủ quy trình tiêm, nguyên tắc an toàn trước và sau tiêm.
                            Đội ngũ bác sĩ sẽ tư vấn và giải đáp mọi thắc mắc để bạn hiểu rõ về quy trình, tác dụng của vaccine đối với sức khỏe của thú cưng.
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 mb-8">
                        <img src="/vaccination-dog-1.png" alt="Veterinarian examining dog" className="w-1/2 md:w-5/12 rounded-lg shadow-md object-cover h-64" />
                        <img src="/vaccination-dog-2.png" alt="Veterinarian examining cat" className="w-1/2 md:w-5/12 rounded-lg shadow-md object-cover h-64" />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-green-800 mb-4">LỊCH TIÊM PHÒNG VACCINE CHO CHÓ</h2>
                        <img src="/vaccination-schedule.png" alt="Lịch tiêm phòng" className="w-full rounded-lg shadow-md mb-6" />

                        <div className="bg-white p-6 rounded-lg shadow-inner">
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li><strong className="text-green-700">Chó từ 45 ngày tuổi:</strong> Tiêm vaccine 5 bệnh phòng các bệnh: Parvo, Carré, Viêm gan truyền nhiễm, Ho cũi chó và Phó cúm.</li>
                                <li><strong className="text-green-700">Sau 3 tuần:</strong> Tiêm mũi 2 sử dụng vaccine 7 bệnh, bao gồm phòng 5 bệnh trên cùng với: bệnh viêm ruột do Coronavirus và bệnh do 2 chủng Leptospira.</li>
                                <li><strong className="text-green-700">Sau 4 tuần:</strong> Tiêm mũi 3 nhắc lại sử dụng vaccine 7 bệnh.</li>
                                <li><strong className="text-green-700">Khi chó đạt từ 3 tháng tuổi trở lên:</strong> Tiến hành tiêm vaccine phòng Dại, sau đó tiêm nhắc lại mũi vaccine Dại sau 3 tháng.</li>
                                <li><strong className="text-green-700">Tiêm nhắc lại:</strong> Sau khi đã hoàn thành chương trình tiêm cơ bản, hàng năm bạn cần cho chó tiêm nhắc lại 1 mũi vaccine 7 bệnh và 1 mũi vaccine dại.</li>
                            </ul>
                            <div className="mt-4 bg-yellow-50 p-4 rounded border-l-4 border-yellow-400 text-sm">
                                <p className="font-bold text-yellow-800">(*) Lưu ý:</p>
                                <p>Đối với chó đã trên 2 tháng tuổi mà chưa tiêm vaccine 5 bệnh thì sẽ tiêm mũi đầu là mũi 7 bệnh. Khi đó mũi hai sẽ cách mũi một 4 tuần.</p>
                                <p className="mt-1">Để vaccine bảo hộ tốt nhất bạn cần đưa chó đi tiêm theo đúng lịch trình được khuyến cáo, trường hợp lệch ngày nếu sớm hơn không quá 3 ngày và muộn hơn không quá 6 ngày.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-center gap-4 mb-8">
                            <img src="/vaccination-cat-1.png" alt="Veterinarian examining cat" className="w-1/2 md:w-5/12 rounded-lg shadow-md object-cover h-64" />
                            <img src="/vaccination-cat-2.png" alt="Veterinarian injecting cat" className="w-1/2 md:w-5/12 rounded-lg shadow-md object-cover h-64" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-800 mb-4">LỊCH TIÊM PHÒNG VACCINE CHO MÈO</h2>
                        <img src="/cat-vaccination-schedule.png" alt="Lịch tiêm phòng mèo" className="w-full rounded-lg shadow-md mb-6" />

                        <div className="bg-white p-6 rounded-lg shadow-inner">
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li><strong className="text-green-700">Mèo từ 52 ngày tuổi:</strong> Tiêm vaccine 4 bệnh mũi 1.</li>
                                <li><strong className="text-green-700">Sau 4 tuần:</strong> Tiêm nhắc lại vaccine 4 bệnh mũi 2.</li>
                                <li><strong className="text-green-700">Sau 4 tuần:</strong> Tiêm nhắc lại vaccine 4 bệnh mũi 3.</li>
                                <li><strong className="text-green-700">Khi mèo đạt từ 3 tháng tuổi trở lên:</strong> Tiến hành tiêm vaccine phòng Dại, sau đó tiêm nhắc lại mũi vaccine Dại sau 3 tháng.</li>
                                <li><strong className="text-green-700">Vaccine FIP:</strong> Vaccine FIP có thể tiêm cho các bé đạt từ 3 tháng tuổi trở lên, mũi hai tiêm nhắc lại sau mũi một 4 tuần.</li>
                                <li><strong className="text-green-700">Tiêm nhắc lại:</strong> Khi đã hoàn thành chương trình tiêm trên, hàng năm bạn cần cho mèo tiêm nhắc lại 1 mũi vaccine 4 bệnh, 1 mũi vaccine Dại và 1 mũi vaccine FIP.</li>
                            </ul>
                            <div className="mt-4 bg-blue-50 p-4 rounded border-l-4 border-blue-400 text-sm">
                                <p className="font-bold text-blue-800">Vaccine 4 bệnh cho mèo sẽ phòng các bệnh sau:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                    <li>Bệnh suy giảm bạch cầu – FPV (Feline Panleucopenia Virus).</li>
                                    <li>Bệnh viêm mũi khí quản truyền nhiễm – FRV (Feline Rhinotrachetis Viral).</li>
                                    <li>Bệnh hô hấp do Calicivirus – FCV (Feline Calicici Virus).</li>
                                    <li>Bệnh hô hấp do Chlamydia Psittaci.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <a href="/booking" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:text-xl shadow-md transition-transform transform hover:scale-105">
                            📅 ĐẶT LỊCH TIÊM NGAY
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Vaccination;
