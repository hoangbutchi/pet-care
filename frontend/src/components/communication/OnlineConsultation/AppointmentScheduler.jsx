import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Save } from 'lucide-react';
import { format } from 'date-fns';
import {
  getConsultants,
  getAvailableSlots,
  createConsultation,
  updateConsultation,
} from '../../../services/consultationService';
import { toast } from 'react-toastify';
import useConsultationStore from '../../../store/consultationStore';

const AppointmentScheduler = ({ consultation, onSave, onCancel }) => {
  const { consultants, setConsultants, availableSlots, setAvailableSlots } =
    useConsultationStore();
  const [formData, setFormData] = useState({
    consultantId: '',
    petId: '',
    scheduledAt: '',
    duration: 30,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    loadConsultants();
    if (consultation) {
      setFormData({
        consultantId: consultation.consultantId || '',
        petId: consultation.petId || '',
        scheduledAt: consultation.scheduledAt
          ? new Date(consultation.scheduledAt).toISOString().slice(0, 16)
          : '',
        duration: consultation.duration || 30,
        notes: consultation.notes || '',
      });
      setSelectedDate(
        consultation.scheduledAt
          ? new Date(consultation.scheduledAt).toISOString().split('T')[0]
          : ''
      );
    }
  }, [consultation]);

  useEffect(() => {
    if (formData.consultantId && selectedDate) {
      loadAvailableSlots();
    }
  }, [formData.consultantId, selectedDate]);

  const loadConsultants = async () => {
    try {
      const response = await getConsultants();
      setConsultants(response.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách consultants');
      console.error(error);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      const response = await getAvailableSlots(
        formData.consultantId,
        selectedDate,
        formData.duration
      );
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error loading slots:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        consultantId: formData.consultantId,
        petId: formData.petId || null,
        scheduledAt: formData.scheduledAt,
        duration: parseInt(formData.duration),
        notes: formData.notes,
      };

      if (consultation) {
        await updateConsultation(consultation.id, data);
        toast.success('Cập nhật lịch hẹn thành công');
      } else {
        await createConsultation(data);
        toast.success('Đặt lịch tư vấn thành công');
      }
      onSave();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectSlot = (slotTime) => {
    setFormData({ ...formData, scheduledAt: slotTime });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {consultation ? 'Chỉnh sửa Lịch Hẹn' : 'Đặt Lịch Tư Vấn'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Hủy
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consultant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User size={16} className="inline mr-2" />
            Consultant *
          </label>
          <select
            value={formData.consultantId}
            onChange={(e) => setFormData({ ...formData, consultantId: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Chọn consultant</option>
            {consultants.map((consultant) => (
              <option key={consultant.id} value={consultant.id}>
                {consultant.name} ({consultant.email})
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size={16} className="inline mr-2" />
            Thời lượng (phút) *
          </label>
          <select
            value={formData.duration}
            onChange={(e) => {
              setFormData({ ...formData, duration: parseInt(e.target.value) });
              setSelectedDate(''); // Reset date to reload slots
            }}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={30}>30 phút</option>
            <option value={60}>60 phút</option>
            <option value={90}>90 phút</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Ngày *
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setFormData({ ...formData, scheduledAt: '' });
            }}
            min={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Available slots */}
        {selectedDate && formData.consultantId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn giờ
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {availableSlots.map((slot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSlot(slot.time)}
                  className={`p-2 border rounded-lg text-sm transition-colors ${
                    formData.scheduledAt === slot.time
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {format(new Date(slot.time), 'HH:mm')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Nhập ghi chú (nếu có)..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading || !formData.scheduledAt}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <Save size={20} />
          {consultation ? 'Cập nhật' : 'Đặt lịch'}
        </button>
      </div>
    </form>
  );
};

export default AppointmentScheduler;
