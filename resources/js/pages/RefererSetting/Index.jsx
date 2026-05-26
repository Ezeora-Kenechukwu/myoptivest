import AppLayout from '../../layouts/app-layout'
import Tabs from "@/components/Tab";
import ReferralSettingsForm from "./ReferralSettingsForm";
import { FaPiggyBank, FaChartLine } from "react-icons/fa";

export default function ReferralSettingsPage({ settings }) {
    console.log('=============settings=======================');
    console.log(settings);
    console.log('=====================settings===============');
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Referal Settings", href: "/referral-settings" },
  ];

  const tabButton = [
    { id: 1, title: "Savings", icon: <FaPiggyBank />, link: "#savings" },
    { id: 2, title: "Investment", icon: <FaChartLine />, link: "#investment" },
  ];

  const tabComponents = [
    {
      id: 1,
      linkId: "savings",
      component: (
        <ReferralSettingsForm
        referralSetting={settings.savings}
          type="savings"
        />
      ),
    },
    {
      id: 2,
      linkId: "investment",
      component: (
        <ReferralSettingsForm
        referralSetting={settings.investment}
          type="investment"
        />
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-5xl mx-auto py-8 w-full">
        <h1 className="text-2xl font-bold mb-6">Referral Settings</h1>
        <Tabs color="slate" tabButton={tabButton} tabComponents={tabComponents} />
      </div>
    </AppLayout>
  );
}
