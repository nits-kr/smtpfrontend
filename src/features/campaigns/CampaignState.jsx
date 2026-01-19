import React, { useEffect, useState } from "react";
import { useGetStatCompaignMutation } from "./campaignsApi";
import {
  Mail,
  Send,
  AlertCircle,
  MousePointerClick,
  Eye,
  User,
  Type
} from "lucide-react";

export default function CampaignState({ id }) {
  const [getCampaignStats, { isLoading }] = useGetStatCompaignMutation();
  const [campaignData, setCampaignData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getCampaignStats({ id });
        if (res.data && res.data.data) {
          setCampaignData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch campaign stats:", error);
      }
    };

    if (id) {
      fetchStats();
    }
  }, [id, getCampaignStats]);

  if (isLoading || !campaignData) {
    return (
      <div className="flex items-center justify-center min-h-[50px] w-full">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const { campaign, stats } = campaignData;

  const StatCard = ({ icon: Icon, title, value, color, borderColor }) => (
    <div className={`bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border ${borderColor} flex items-center space-x-4 hover:bg-gray-900/80 transition-colors`}>
      <div className={`p-2 rounded-lg bg-black/40 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-xl font-bold text-white font-mono">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Stats Grid - Single Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={Send}
          title="Total Sent"
          value={stats?.totalSent || 0}
          color="text-blue-400"
          borderColor="border-blue-900/30"
        />
        <StatCard
          icon={Mail}
          title="Success"
          value={stats?.sentCount || 0}
          color="text-green-400"
          borderColor="border-green-900/30"
        />
        <StatCard
          icon={AlertCircle}
          title="Failed"
          value={stats?.failedCount || 0}
          color="text-red-400"
          borderColor="border-red-900/30"
        />
        <StatCard
          icon={Eye}
          title="Opened"
          value={stats?.totalOpens || 0}
          color="text-purple-400"
          borderColor="border-purple-900/30"
        />
        <StatCard
          icon={MousePointerClick}
          title="Clicked"
          value={stats?.totalClicks || 0}
          color="text-orange-400"
          borderColor="border-orange-900/30"
        />
      </div>
    </div>
  );
}
