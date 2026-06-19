import { useState, useEffect } from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import { EmptyState } from "../components/EmptyState";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, orderBy, query, addDoc, serverTimestamp, increment } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../components/ui/dialog";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  CreditCard, LogOut, Users, Clock, CheckCircle2, XCircle, Loader2,
  Eye, ShieldCheck, PlusCircle, ArrowUpRight, ArrowDownLeft,
  LayoutDashboard, BarChart2, Search, RefreshCw, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { motion, AnimatePresence } from "motion/react";

interface UserRecord {
  uid: string;
  phone: string;
  status: string;
  idUploaded: boolean;
  selfieUploaded: boolean;
  cardIssued: boolean;
  balance: number;
  createdAt: any;
  idUrl?: string;
  selfieUrl?: string;
  name?: string;
  isAdmin?: boolean;
}

type NavTab = "overview" | "users" | "analytics";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "reviewing" | "active" | "pending">("all");
  const [openMenuUid, setOpenMenuUid] = useState<string | null>(null);

  // Dialogs
  const [txDialog, setTxDialog] = useState<string | null>(null);
  const [txType, setTxType] = useState<"credit" | "debit">("credit");
  const [txMerchant, setTxMerchant] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [balanceDialog, setBalanceDialog] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<UserRecord, "uid">) })));
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleLogout = async () => { await signOut(auth); navigate("/"); };

  const sendNotification = async (uid: string, type: string, message: string) => {
    await addDoc(collection(db, "users", uid, "notifications"), { type, message, read: false, createdAt: serverTimestamp() });
  };

  const handleApprove = async (uid: string) => {
    setActionLoading(uid + "_approve");
    try {
      await updateDoc(doc(db, "users", uid), { status: "active" });
      await sendNotification(uid, "approved", "Your identity has been verified! Your account is now active.");
      setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, status: "active" } : u));
      toast.success("User approved.");
    } catch { toast.error("Failed to approve user."); }
    finally { setActionLoading(null); setOpenMenuUid(null); }
  };

  const handleReject = async (uid: string) => {
    setActionLoading(uid + "_reject");
    try {
      await updateDoc(doc(db, "users", uid), { status: "pending", idUploaded: false, selfieUploaded: false, idUrl: null, selfieUrl: null });
      await sendNotification(uid, "rejected", "Your identity verification was rejected. Please re-submit your documents.");
      setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, status: "pending", idUploaded: false, selfieUploaded: false } : u));
      toast.success("User rejected.");
    } catch { toast.error("Failed to reject user."); }
    finally { setActionLoading(null); setOpenMenuUid(null); }
  };

  const handleIssueCard = async (uid: string) => {
    setActionLoading(uid + "_card");
    try {
      await updateDoc(doc(db, "users", uid), { cardIssued: true });
      await sendNotification(uid, "card_issued", "Your virtual card has been issued! You can now use it for online payments.");
      setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, cardIssued: true } : u));
      toast.success("Card issued.");
    } catch { toast.error("Failed to issue card."); }
    finally { setActionLoading(null); setOpenMenuUid(null); }
  };

  const handleAddTransaction = async () => {
    if (!txDialog || !txMerchant.trim() || !txAmount) return;
    const amount = parseFloat(txAmount);
    if (isNaN(amount) || amount <= 0) { toast.error("Enter a valid amount."); return; }
    setActionLoading(txDialog + "_tx");
    try {
      const now = new Date();
      const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      await addDoc(collection(db, "users", txDialog, "transactions"), {
        type: txType, merchant: txMerchant.trim(),
        amount: amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        date, status: "completed", createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "users", txDialog), { balance: increment(txType === "credit" ? amount : -amount) });
      setUsers((prev) => prev.map((u) => u.uid === txDialog ? { ...u, balance: u.balance + (txType === "credit" ? amount : -amount) } : u));
      toast.success("Transaction added.");
      setTxDialog(null); setTxMerchant(""); setTxAmount(""); setTxType("credit");
    } catch { toast.error("Failed to add transaction."); }
    finally { setActionLoading(null); }
  };

  const handleSetBalance = async () => {
    if (!balanceDialog) return;
    const amount = parseFloat(newBalance);
    if (isNaN(amount) || amount < 0) { toast.error("Enter a valid balance."); return; }
    setActionLoading(balanceDialog + "_balance");
    try {
      await updateDoc(doc(db, "users", balanceDialog), { balance: amount });
      setUsers((prev) => prev.map((u) => u.uid === balanceDialog ? { ...u, balance: amount } : u));
      toast.success("Balance updated.");
      setBalanceDialog(null); setNewBalance("");
    } catch { toast.error("Failed to update balance."); }
    finally { setActionLoading(null); }
  };

  const nonAdmin = users.filter((u) => !u.isAdmin);
  const reviewing = nonAdmin.filter((u) => u.status === "reviewing");
  const active = nonAdmin.filter((u) => u.status === "active");
  const pending = nonAdmin.filter((u) => u.status === "pending");

  const filtered = nonAdmin.filter((u) => {
    const matchesSearch = !search || u.phone?.includes(search) || u.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusBadge = (u: UserRecord) => {
    if (u.status === "active") return <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/20">Active</Badge>;
    if (u.status === "reviewing") return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20">Reviewing</Badge>;
    return <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20">Pending</Badge>;
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart2 className="w-4 h-4" /> },
  ];

  const signupChartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const count = nonAdmin.filter((u) => {
      const ts = u.createdAt?.toDate?.() ?? (u.createdAt ? new Date(u.createdAt) : null);
      return ts && ts.toDateString() === d.toDateString();
    }).length;
    return { label: d.toLocaleDateString("en-US", { weekday: "short" }), count };
  });

  return (
    <div className="min-h-screen bg-app flex">
      <Toaster />

      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-56 border-r border-app bg-app-header backdrop-blur-md fixed left-0 top-0 h-full z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-app">
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-green-400" />
            <span className="text-lg font-bold text-app">Dinar</span>
            <Badge className="bg-app-input text-app-muted border-0 text-[10px] ml-auto">Admin</Badge>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-green-500/15 text-green-400 border border-green-500/20"
                  : "text-app-muted hover:text-white hover:bg-surface"
              }`}
            >
              {item.icon}
              {item.label}
              {item.id === "users" && reviewing.length > 0 && (
                <span className="ml-auto bg-blue-500 text-app text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {reviewing.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-app space-y-1">
          <div className="flex items-center gap-2 px-3 py-1">
            <span className="text-xs text-app-faint">Theme</span>
            <ThemeToggle />
          </div>
          <button
            onClick={fetchUsers}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-app-muted hover:text-white hover:bg-surface transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-app-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="border-b border-app bg-app-header backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-app font-semibold capitalize">{activeTab}</h1>
            <p className="text-app-faint text-xs mt-0.5">Dinar Admin Panel</p>
          </div>
          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`p-2 rounded-lg ${activeTab === item.id ? "bg-green-500/15 text-green-400" : "text-app-muted"}`}>
                {item.icon}
              </button>
            ))}
            <button onClick={handleLogout} className="p-2 rounded-lg text-app-muted hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-green-400">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Users", value: nonAdmin.length, icon: Users, color: "text-app", bg: "bg-app-input", border: "border-app" },
                  { label: "Under Review", value: reviewing.length, icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                  { label: "Active Users", value: active.length, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                  { label: "Pending", value: pending.length, icon: XCircle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={`bg-surface border border-app rounded-xl p-5`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="label-section">{s.label}</p>
                      <div className={`w-8 h-8 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center`}>
                        <s.icon className={`w-4 h-4 ${s.color}`} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-app">{loading ? "—" : s.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick actions for reviewing users — or all-clear empty state */}
              {reviewing.length === 0 && !loading && nonAdmin.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl">
                  <EmptyState icon={<CheckCircle2 className="w-full h-full" />} title="All clear" description="No KYC submissions waiting for review." size="sm" />
                </div>
              )}
              {reviewing.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <p className="text-sm font-semibold text-blue-400">{reviewing.length} user{reviewing.length > 1 ? "s" : ""} waiting for KYC review</p>
                  </div>
                  <div className="space-y-3">
                    {reviewing.slice(0, 3).map((u) => (
                      <div key={u.uid} className="flex items-center justify-between bg-surface rounded-lg px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                            {(u.name ?? u.phone ?? "?")[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-app">{u.name ?? u.phone}</p>
                            {u.name && <p className="text-xs text-app-faint">{u.phone}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 h-7 text-xs"
                            disabled={!!actionLoading} onClick={() => handleApprove(u.uid)}>
                            {actionLoading === u.uid + "_approve" ? <Loader2 className="w-3 h-3 animate-spin" /> : <><CheckCircle2 className="w-3 h-3 mr-1" />Approve</>}
                          </Button>
                          <Button size="sm" className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 h-7 text-xs"
                            disabled={!!actionLoading} onClick={() => handleReject(u.uid)}>
                            {actionLoading === u.uid + "_reject" ? <Loader2 className="w-3 h-3 animate-spin" /> : <><XCircle className="w-3 h-3 mr-1" />Reject</>}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {reviewing.length > 3 && (
                      <button onClick={() => setActiveTab("users")} className="text-xs text-blue-400 hover:text-blue-300 pl-1">
                        View all {reviewing.length} →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Signup chart */}
              <div className="bg-surface border border-app rounded-xl p-5">
                <p className="text-sm font-semibold text-app mb-4">Signups — Last 7 Days</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={signupChartData}>
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} width={24} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white" }} cursor={{ fill: "rgba(255,255,255,0.05)" }} formatter={(v) => [v, "Signups"]} />
                    <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* ── USERS TAB ── */}
          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-faint" />
                  <Input placeholder="Search by phone or name…" value={search} onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-surface border-app text-app placeholder:text-app-faint focus:border-green-500/50" />
                </div>
                <div className="flex gap-2">
                  {(["all", "reviewing", "active", "pending"] as const).map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                        statusFilter === s
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "text-app-faint hover:text-white hover:bg-surface border border-app"
                      }`}>
                      {s === "all" ? `All (${nonAdmin.length})` : s === "reviewing" ? `Review (${reviewing.length})` : s === "active" ? `Active (${active.length})` : `Pending (${pending.length})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="bg-surface border border-app rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-app">
                      <th className="text-left px-4 py-3 label-section">User</th>
                      <th className="text-left px-4 py-3 label-section hidden sm:table-cell">Status</th>
                      <th className="text-left px-4 py-3 label-section hidden md:table-cell">KYC</th>
                      <th className="text-left px-4 py-3 label-section hidden lg:table-cell">Card</th>
                      <th className="text-left px-4 py-3 label-section hidden lg:table-cell">Balance</th>
                      <th className="text-right px-4 py-3 label-section">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin text-green-400 mx-auto" /></td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={6}><EmptyState icon={<Users className="w-full h-full" />} title={search ? "No results" : "No users yet"} description={search ? `No users match "${search}".` : "Users will appear here once they sign up."} size="sm" /></td></tr>
                    ) : (
                      filtered.map((u) => (
                        <tr key={u.uid} className="border-b border-app hover:bg-white/3 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-app-input flex items-center justify-center text-app-muted text-xs font-bold flex-shrink-0">
                                {(u.name ?? u.phone ?? "?")[0]}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-app">{u.name ?? u.phone}</p>
                                {u.name && <p className="text-xs text-app-faint">{u.phone}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">{statusBadge(u)}</td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            {u.idUploaded
                              ? <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Verified</span>
                              : <span className="text-xs text-app-faint">Not submitted</span>}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            {u.cardIssued
                              ? <span className="text-xs text-green-400 flex items-center gap-1"><CreditCard className="w-3 h-3" />Issued</span>
                              : <span className="text-xs text-app-faint">—</span>}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className="text-sm text-app font-mono">{(u.balance ?? 0).toLocaleString()} DZD</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="relative inline-block">
                              <Button size="sm" variant="ghost"
                                className="text-app-muted hover:text-white hover:bg-app-input h-7 px-2 gap-1"
                                onClick={() => setOpenMenuUid(openMenuUid === u.uid ? null : u.uid)}>
                                Actions <ChevronDown className="w-3 h-3" />
                              </Button>

                              <AnimatePresence>
                                {openMenuUid === u.uid && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute right-0 top-full mt-1 w-48 bg-surface border border-app rounded-xl shadow-xl z-50 overflow-hidden"
                                  >
                                    {u.status === "reviewing" && (
                                      <>
                                        <button onClick={() => handleApprove(u.uid)}
                                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-green-400 hover:bg-green-500/10 transition-colors">
                                          {actionLoading === u.uid + "_approve" ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                          Approve KYC
                                        </button>
                                        <button onClick={() => handleReject(u.uid)}
                                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                          {actionLoading === u.uid + "_reject" ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                          Reject
                                        </button>
                                        <div className="border-t border-app" />
                                      </>
                                    )}
                                    {u.status === "active" && !u.cardIssued && (
                                      <>
                                        <button onClick={() => handleIssueCard(u.uid)}
                                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-purple-400 hover:bg-purple-500/10 transition-colors">
                                          {actionLoading === u.uid + "_card" ? <Loader2 className="w-3 h-3 animate-spin" /> : <CreditCard className="w-3 h-3" />}
                                          Issue Card
                                        </button>
                                        <div className="border-t border-app" />
                                      </>
                                    )}
                                    {(u.idUrl || u.selfieUrl) && (
                                      <>
                                        {u.idUrl && (
                                          <a href={u.idUrl} target="_blank" rel="noopener noreferrer"
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-app-muted hover:text-white hover:bg-surface transition-colors">
                                            <Eye className="w-3 h-3" />View ID
                                          </a>
                                        )}
                                        {u.selfieUrl && (
                                          <a href={u.selfieUrl} target="_blank" rel="noopener noreferrer"
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-app-muted hover:text-white hover:bg-surface transition-colors">
                                            <Eye className="w-3 h-3" />View Selfie
                                          </a>
                                        )}
                                        <div className="border-t border-app" />
                                      </>
                                    )}
                                    <button onClick={() => { setBalanceDialog(u.uid); setNewBalance(String(u.balance ?? 0)); setOpenMenuUid(null); }}
                                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-app-muted hover:text-white hover:bg-surface transition-colors">
                                      <ShieldCheck className="w-3 h-3" />Set Balance
                                    </button>
                                    <button onClick={() => { setTxDialog(u.uid); setTxType("credit"); setTxMerchant(""); setTxAmount(""); setOpenMenuUid(null); }}
                                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-app-muted hover:text-white hover:bg-surface transition-colors">
                                      <PlusCircle className="w-3 h-3" />Add Transaction
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {!loading && (
                  <div className="px-4 py-3 border-t border-app">
                    <p className="text-xs text-app-faint">{filtered.length} of {nonAdmin.length} users</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-surface border border-app rounded-xl p-5">
                  <p className="text-sm font-semibold text-app mb-4">Signups — Last 7 Days</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={signupChartData}>
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }} width={24} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white" }} cursor={{ fill: "rgba(255,255,255,0.05)" }} formatter={(v) => [v, "Signups"]} />
                      <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-surface border border-app rounded-xl p-5">
                  <p className="text-sm font-semibold text-app mb-4">Status Distribution</p>
                  <div className="flex items-center justify-center gap-8">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie data={[
                          { name: "Active", value: active.length || 0.001 },
                          { name: "Reviewing", value: reviewing.length || 0.001 },
                          { name: "Pending", value: pending.length || 0.001 },
                        ]} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                          <Cell fill="#22c55e" />
                          <Cell fill="#3b82f6" />
                          <Cell fill="#f59e0b" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white" }} formatter={(v, name) => [v === 0.001 ? 0 : v, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3 text-sm">
                      {[
                        { label: "Active", count: active.length, color: "bg-green-500" },
                        { label: "Reviewing", count: reviewing.length, color: "bg-blue-500" },
                        { label: "Pending", count: pending.length, color: "bg-amber-500" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                          <span className="text-app-muted">{item.label}</span>
                          <span className="font-semibold text-app ml-auto pl-4">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary table */}
              <div className="bg-surface border border-app rounded-xl p-5">
                <p className="text-sm font-semibold text-app mb-4">Summary</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "KYC Submitted", value: nonAdmin.filter(u => u.idUploaded).length },
                    { label: "Cards Issued", value: nonAdmin.filter(u => u.cardIssued).length },
                    { label: "Total Balance", value: `${nonAdmin.reduce((s, u) => s + (u.balance ?? 0), 0).toLocaleString()} DZD` },
                    { label: "Approval Rate", value: nonAdmin.length ? `${Math.round((active.length / nonAdmin.length) * 100)}%` : "—" },
                  ].map((s, i) => (
                    <div key={i} className="bg-surface rounded-xl p-4 border border-app">
                      <p className="text-xs text-app-faint mb-1">{s.label}</p>
                      <p className="text-xl font-bold text-app">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Click outside to close menu */}
      {openMenuUid && <div className="fixed inset-0 z-40" onClick={() => setOpenMenuUid(null)} />}

      {/* Set Balance Dialog */}
      <Dialog open={!!balanceDialog} onOpenChange={(open) => !open && setBalanceDialog(null)}>
        <DialogContent className="bg-surface border-app text-app">
          <DialogHeader><DialogTitle className="text-app">Set Balance</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="body-secondary">
              Current: <span className="font-semibold text-app">{users.find(u => u.uid === balanceDialog)?.balance?.toLocaleString() ?? 0} DZD</span>
            </p>
            <div className="space-y-2">
              <Label className="text-app-muted">New Balance (DZD)</Label>
              <Input type="number" placeholder="e.g. 10000" value={newBalance} onChange={(e) => setNewBalance(e.target.value)}
                className="bg-app-input border-app-input text-app placeholder:text-app-faint" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-app-muted hover:text-white" onClick={() => setBalanceDialog(null)}>Cancel</Button>
            <Button className="bg-green-500 hover:bg-green-400 text-black font-semibold"
              disabled={actionLoading === balanceDialog + "_balance"} onClick={handleSetBalance}>
              {actionLoading === balanceDialog + "_balance" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Balance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Transaction Dialog */}
      <Dialog open={!!txDialog} onOpenChange={(open) => !open && setTxDialog(null)}>
        <DialogContent className="bg-surface border-app text-app">
          <DialogHeader><DialogTitle className="text-app">Add Transaction</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setTxType("credit")}
                className={`flex-1 ${txType === "credit" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-surface text-app-muted border border-app"}`}>
                <ArrowDownLeft className="w-3 h-3 mr-1" />Credit
              </Button>
              <Button size="sm" onClick={() => setTxType("debit")}
                className={`flex-1 ${txType === "debit" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-surface text-app-muted border border-app"}`}>
                <ArrowUpRight className="w-3 h-3 mr-1" />Debit
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-app-muted">Merchant / Description</Label>
              <Input placeholder="e.g. Upwork Payment" value={txMerchant} onChange={(e) => setTxMerchant(e.target.value)}
                className="bg-app-input border-app-input text-app placeholder:text-app-faint" />
            </div>
            <div className="space-y-2">
              <Label className="text-app-muted">Amount (DZD)</Label>
              <Input type="number" placeholder="e.g. 5000" value={txAmount} onChange={(e) => setTxAmount(e.target.value)}
                className="bg-app-input border-app-input text-app placeholder:text-app-faint" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-app-muted hover:text-white" onClick={() => setTxDialog(null)}>Cancel</Button>
            <Button className="bg-green-500 hover:bg-green-400 text-black font-semibold"
              disabled={actionLoading === txDialog + "_tx"} onClick={handleAddTransaction}>
              {actionLoading === txDialog + "_tx" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Transaction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
