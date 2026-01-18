import { useState } from 'react';
import { Mail } from 'lucide-react';
import CampaignList from '../components/communication/EmailMarketing/CampaignList';
import CampaignEditor from '../components/communication/EmailMarketing/CampaignEditor';

const EmailMarketing = () => {
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const handleSelectCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setView('editor');
  };

  const handleCreateNew = () => {
    setSelectedCampaign(null);
    setView('editor');
  };

  const handleSave = () => {
    setSelectedCampaign(null);
    setView('list');
  };

  const handleCancel = () => {
    setSelectedCampaign(null);
    setView('list');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {view === 'list' ? (
        <CampaignList
          onSelectCampaign={handleSelectCampaign}
          onCreateNew={handleCreateNew}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <CampaignEditor
            campaign={selectedCampaign}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;
