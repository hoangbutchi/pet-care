import { useState, useEffect } from 'react';
import { Calendar, Video, Plus } from 'lucide-react';
import { format } from 'date-fns';
import AppointmentScheduler from '../components/communication/OnlineConsultation/AppointmentScheduler';
import ConsultationRoom from '../components/communication/OnlineConsultation/ConsultationRoom';
import { getConsultations } from '../services/consultationService';
import useConsultationStore from '../store/consultationStore';
import { toast } from 'react-toastify';

const Consultation = () => {
  const { consultations, setConsultations, setCurrentConsultation, currentConsultation } =
    useConsultationStore();
  const [view, setView] = useState('list'); // 'list', 'scheduler', 'room'
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const response = await getConsultations();
      setConsultations(response.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách lịch hẹn');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedConsultation(null);
    setView('scheduler');
  };

  const handleEdit = (consultation) => {
    setSelectedConsultation(consultation);
    setView('scheduler');
  };

  const handleJoinRoom = (consultation) => {
    setSelectedConsultation(consultation);
    setCurrentConsultation(consultation);
    setView('room');
  };

  const handleSave = () => {
    setSelectedConsultation(null);
    setView('list');
    loadConsultations();
  };

  const handleCancel = () => {
    setSelectedConsultation(null);
    setView('list');
  };

  const handleEndConsultation = () => {
    setSelectedConsultation(null);
    setCurrentConsultation(null);
    setView('list');
    loadConsultations();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Đã đặt lịch';
      case 'IN_PROGRESS':
        return 'Đang diễn ra';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {view === 'list' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={28} />
              Tư Vấn Trực Tuyến
            </h1>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus size={20} />
              Đặt Lịch Mới
            </button>
          </div>

          {/* Consultations list */}
          {consultations.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Calendar size={48} className="mx-auto mb-4" />
              <p>Chưa có lịch hẹn nào</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {consultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Tư vấn với {consultation.consultant?.name || 'Consultant'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {format(new Date(consultation.scheduledAt), 'dd/MM/yyyy HH:mm')} -{' '}
                        {consultation.duration} phút
                      </p>
                      {consultation.pet && (
                        <p className="text-sm text-gray-500">
                          Thú cưng: {consultation.pet.name}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        consultation.status
                      )}`}
                    >
                      {getStatusText(consultation.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(consultation.status === 'SCHEDULED' ||
                      consultation.status === 'IN_PROGRESS') && (
                      <button
                        onClick={() => handleJoinRoom(consultation)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        <Video size={16} />
                        {consultation.status === 'IN_PROGRESS'
                          ? 'Vào phòng'
                          : 'Bắt đầu tư vấn'}
                      </button>
                    )}
                    {consultation.status === 'SCHEDULED' && (
                      <button
                        onClick={() => handleEdit(consultation)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Chỉnh sửa
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'scheduler' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <AppointmentScheduler
            consultation={selectedConsultation}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {view === 'room' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)]">
          <ConsultationRoom
            consultation={selectedConsultation}
            onEnd={handleEndConsultation}
          />
        </div>
      )}
    </div>
  );
};

export default Consultation;
