import { useState, useEffect } from 'react';
import { Save, Send, ArrowLeft, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  createCampaign,
  updateCampaign,
  sendCampaign,
  getRecipients,
} from '../../../services/emailService';
import { toast } from 'react-toastify';

const CampaignEditor = ({ campaign, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    recipients: [],
    scheduledAt: '',
  });
  const [availableRecipients, setAvailableRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        subject: campaign.subject || '',
        content: campaign.content || '',
        recipients: campaign.recipients || [],
        scheduledAt: campaign.scheduledAt
          ? new Date(campaign.scheduledAt).toISOString().slice(0, 16)
          : '',
      });
      setSelectedRecipients(campaign.recipients || []);
    }
    loadRecipients();
  }, [campaign]);

  const loadRecipients = async () => {
    try {
      const response = await getRecipients({ search: searchTerm });
      setAvailableRecipients(response.data);
    } catch (error) {
      console.error('Error loading recipients:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        loadRecipients();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        recipients: selectedRecipients,
        scheduledAt: formData.scheduledAt || null,
      };

      if (campaign) {
        await updateCampaign(campaign.id, data);
        toast.success('Cập nhật campaign thành công');
      } else {
        await createCampaign(data);
        toast.success('Tạo campaign thành công');
      }
      onSave();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!campaign) {
      toast.error('Vui lòng lưu campaign trước khi gửi');
      return;
    }

    if (selectedRecipients.length === 0) {
      toast.error('Vui lòng chọn ít nhất một người nhận');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn gửi campaign này?')) {
      setLoading(true);
      try {
        await sendCampaign(campaign.id);
        toast.success('Gửi campaign thành công');
        onSave();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleRecipient = (email) => {
    if (selectedRecipients.includes(email)) {
      setSelectedRecipients(selectedRecipients.filter((e) => e !== email));
    } else {
      setSelectedRecipients([...selectedRecipients, email]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {campaign ? 'Chỉnh sửa Campaign' : 'Tạo Campaign Mới'}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} className="inline mr-2" />
            Hủy
          </button>
          {campaign && campaign.status !== 'SENT' && (
            <button
              type="button"
              onClick={handleSend}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Send size={20} className="inline mr-2" />
              Gửi Ngay
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            <Save size={20} className="inline mr-2" />
            Lưu
          </button>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên Campaign *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề Email *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Recipients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Người nhận *
          </label>
          <input
            type="text"
            placeholder="Tìm kiếm người nhận..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
          />
          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
            {availableRecipients.map((user) => (
              <label
                key={user.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedRecipients.includes(user.email)}
                  onChange={() => toggleRecipient(user.email)}
                />
                <span className="text-sm">
                  {user.name} ({user.email})
                </span>
              </label>
            ))}
          </div>
          {selectedRecipients.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedRecipients.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => toggleRecipient(email)}
                    className="hover:text-primary-dark"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lên lịch gửi (tùy chọn)
          </label>
          <input
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung Email *
          </label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            className="bg-white"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                [{ color: [] }, { background: [] }],
                ['clean'],
              ],
            }}
          />
        </div>
      </div>
    </form>
  );
};

export default CampaignEditor;
