import React from 'react';
import { IconType } from 'react-icons';
import { FaSignOutAlt } from 'react-icons/fa';

type TabType = 'profile' | 'favorites' | 'settings';

interface TabItem {
  id: TabType;
  label: string;
  icon: IconType;
}

interface AccountTabsProps {
  tabs: readonly TabItem[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  handleLogout: () => void;
}

const AccountTabs: React.FC<AccountTabsProps> = ({ 
  tabs, 
  activeTab, 
  setActiveTab,
  handleLogout
}) => {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between overflow-x-auto">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-6 inline-flex items-center border-b-2 font-medium transition-all
                  ${activeTab === tab.id
                    ? 'border-custom-terra text-custom-terra'
                    : 'border-transparent text-custom-charcoal hover:text-custom-dark hover:border-custom-cream'
                  }
                `}
              >
                <tab.icon className={`mr-2 ${activeTab === tab.id ? 'text-custom-terra' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center py-4 px-6 text-custom-charcoal hover:text-custom-terra transition-colors"
          >
            <FaSignOutAlt className="mr-2" />
            Log Out
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AccountTabs;
