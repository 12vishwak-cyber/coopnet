import { PageHeader } from "@/components/PageHeader";
import { User, Globe, MapPin, Calendar, Activity, Shield, Star, Award, CheckCircle, BarChart3 } from "lucide-react";

const profileData = {
  memberId: "COOP-00482",
  nodeId: "NODE-IN-MH-012",
  role: "Seller",
  location: "MG Road, Pune",
  memberSince: "March 2025",
  contributionRate: "6%",
  status: "Active",
  nodeReputation: "Trusted",
  trustScore: "92/100",
  participationLevel: "High",
  contributionHistory: "₹18,420",
  assignmentsCompleted: "342",
  networkRating: "4.8/5",
};

export default function Profile() {
  return (
    <div className="max-w-xl">
      <PageHeader title="Profile" description="Your cooperative membership" />

      <div className="bg-card border rounded-lg p-6 animate-fade-up">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b">
          <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
            <User className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">{profileData.memberId}</p>
            <p className="text-xs text-muted-foreground">Member of cooperative network</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-xs font-medium text-success">{profileData.status}</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { icon: Globe, label: "Node ID", value: profileData.nodeId },
            { icon: Shield, label: "Role", value: profileData.role },
            { icon: MapPin, label: "Location", value: profileData.location },
            { icon: Calendar, label: "Member Since", value: profileData.memberSince },
            { icon: Activity, label: "Contribution Rate", value: profileData.contributionRate },
            { icon: Star, label: "Node Reputation", value: profileData.nodeReputation },
            { icon: BarChart3, label: "Trust Score", value: profileData.trustScore },
            { icon: Award, label: "Participation Level", value: profileData.participationLevel },
            { icon: Activity, label: "Contribution History", value: profileData.contributionHistory },
            { icon: CheckCircle, label: "Assignments Completed", value: profileData.assignmentsCompleted },
            { icon: Star, label: "Network Rating", value: profileData.networkRating },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </div>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground mt-4 animate-fade-up">
        Data shared across system · Rules applied by cooperative · Member of cooperative network
      </p>
    </div>
  );
}
