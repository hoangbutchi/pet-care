import { useState, useEffect } from 'react';
import { Video, VideoOff, PhoneOff, MessageSquare, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { updateConsultation } from '../../../services/consultationService';
import { toast } from 'react-toastify';

const ConsultationRoom = ({ consultation, onEnd }) => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [notes, setNotes] = useState(consultation?.notes || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Start consultation if not already started
    if (consultation && consultation.status === 'SCHEDULED') {
      startConsultation();
    }
  }, [consultation]);

  const startConsultation = async () => {
    try {
      await updateConsultation(consultation.id, { status: 'IN_PROGRESS' });
    } catch (error) {
      console.error('Error starting consultation:', error);
    }
  };

  const handleEndConsultation = async () => {
    if (window.confirm('Bạn có chắc chắn muốn kết thúc cuộc tư vấn?')) {
      setSaving(true);
      try {
        await updateConsultation(consultation.id, {
          status: 'COMPLETED',
          notes: notes,
        });
        toast.success('Cuộc tư vấn đã kết thúc');
        if (onEnd) onEnd();
      } catch (error) {
        toast.error('Lỗi khi kết thúc cuộc tư vấn');
        console.error(error);
      } finally {
        setSaving(false);
      }
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      await updateConsultation(consultation.id, { notes: notes });
      toast.success('Đã lưu ghi chú');
    } catch (error) {
      toast.error('Lỗi khi lưu ghi chú');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!consultation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Không tìm thấy thông tin tư vấn</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Phòng Tư Vấn - {consultation.consultant?.name || 'Consultant'}
            </h2>
            <p className="text-sm text-gray-500">
              {format(new Date(consultation.scheduledAt), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                consultation.status === 'IN_PROGRESS'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {consultation.status === 'IN_PROGRESS' ? 'Đang diễn ra' : consultation.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Video area */}
        <div className="flex-1 bg-gray-900 rounded-lg flex items-center justify-center relative">
          {/* Video placeholder - có thể tích hợp WebRTC ở đây */}
          <div className="text-white text-center">
            <Video size={64} className="mx-auto mb-4 opacity-50" />
            <p>Video call area</p>
            <p className="text-sm opacity-75 mt-2">
              (Tích hợp WebRTC hoặc third-party service như Zoom/Jitsi)
            </p>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full ${
                isVideoOn ? 'bg-gray-700' : 'bg-red-600'
              } text-white hover:opacity-80 transition-opacity`}
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full ${
                isMuted ? 'bg-red-600' : 'bg-gray-700'
              } text-white hover:opacity-80 transition-opacity`}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={handleEndConsultation}
              disabled={saving}
              className="p-3 rounded-full bg-red-600 text-white hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar - Notes */}
        <div className="w-80 bg-white rounded-lg border border-gray-200 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={20} />
              Ghi chú
            </h3>
            <button
              onClick={saveNotes}
              disabled={saving}
              className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              Lưu
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú tư vấn..."
            className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ConsultationRoom;
