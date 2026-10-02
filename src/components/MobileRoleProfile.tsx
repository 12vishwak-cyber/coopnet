import { ChevronRight, HelpCircle, LogOut, Settings, Shield, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MobileRoleProfile({ role }: { role: "seller" | "worker" }) {
  const navigate = useNavigate();
  const label = role === "seller" ? "Ravi General Store" : "Arjun Kumar";
  const node = role === "seller" ? "Seller-23" : "Worker-07";
  const supportPath = role === "seller" ? "/seller/support" : "/worker/support";
  const logout = () => { localStorage.removeItem("coopnet-auth"); localStorage.removeItem("coopnet-role"); navigate("/login"); };

  return <div className="mx-auto max-w-md"><div className="mb-5"><p className="text-xs text-muted-foreground">Account and help</p><h1 className="text-2xl font-bold">Profile</h1></div><div className="flex items-center gap-3 rounded-lg border bg-card p-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><User className="h-5 w-5 text-primary" /></div><div><p className="font-bold">{label}</p><p className="text-xs text-muted-foreground">Node {node} · {role === "seller" ? "Seller" : "Delivery Driver"}</p></div><span className="ml-auto flex items-center gap-1 text-xs font-bold text-success"><span className="h-2 w-2 rounded-full bg-success" /> Active</span></div><div className="mt-4 overflow-hidden rounded-lg border bg-card"><ProfileLink to="/profile" icon={Shield} label="Membership details" /><ProfileLink to={supportPath} icon={HelpCircle} label="Support and voting" /><ProfileLink to="/settings" icon={Settings} label="Settings" /></div><Button variant="destructive" className="mt-4 h-12 w-full justify-start" onClick={logout}><LogOut className="mr-2 h-4 w-4" /> Log out</Button></div>;
}

function ProfileLink({ to, icon: Icon, label }: { to: string; icon: typeof User; label: string }) {
  return <Link to={to} className="flex min-h-14 items-center gap-3 border-b px-4 text-sm font-medium last:border-0"><Icon className="h-4 w-4 text-primary" /><span className="flex-1">{label}</span><ChevronRight className="h-4 w-4 text-muted-foreground" /></Link>;
}