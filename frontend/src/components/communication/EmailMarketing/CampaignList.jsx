import { useState, useEffect } from 'react';
import { Plus, Mail, Calendar, Users, Eye, MousePointerClick } from 'lucide-react';
import { format } from 'date-fns';
import { getCampaigns } from '../../../services/emailService';
import { toast } from 'react-toastify';

const CampaignList = ({ onSelectCampaign, onCreateNew }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCampaigns();
  }, [filter]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await getCampaigns({
        status: filter !== 'all' ? filter : undefined,
      });
      setCampaigns(response.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách campaigns');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'SENT':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'Nháp';
      case 'SCHEDULED':
        return 'Đã lên lịch';
      case 'SENT':
        return 'Đã gửi';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Email Campaigns</h2>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={20} />
          Tạo Campaign Mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'DRAFT', 'SCHEDULED', 'SENT'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Tất cả' : getStatusText(status)}
          </button>
        ))}
      </div>

      {/* Campaigns list */}
      {campaigns.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Mail size={48} className="mx-auto mb-4" />
          <p>Chưa có campaign nào</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => onSelectCampaign(campaign)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {campaign.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{campaign.subject}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    campaign.status
                  )}`}
                >
                  {getStatusText(campaign.status)}
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{campaign.recipients?.length || 0} người nhận</span>
                </div>
                {campaign.scheduledAt && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{format(new Date(campaign.scheduledAt), 'dd/MM/yyyy HH:mm')}</span>
                  </div>
                )}
                {campaign.stats && (
                  <>
                    <div className="flex items-center gap-2">
                      <Eye size={16} />
                      <span>
                        {campaign.stats.opened}/{campaign.stats.sent} mở
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointerClick size={16} />
                      <span>
                        {campaign.stats.clicked}/{campaign.stats.sent} click
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignList;
