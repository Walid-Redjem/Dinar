import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, onSnapshot, collection, query, orderBy, limit, getDocs, updateDoc, writeBatch, addDoc, startAfter, QueryDocumentSnapshot } from "firebase/firestore";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../components/ui/sheet";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  CreditCard,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Settings,
  LogOut,
  Wallet,
  TrendingUp,
  Globe,
  Bell,
  XCircle,
  Snowflake,
  Zap,
  Send,
  Plus,
  Film,
  Music,
  ShoppingBag,
  Utensils,
  MoreHorizontal,
  Loader2,
  ChevronDown,
  Phone,
  DollarSign,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "../components/ThemeToggle";
import { CopyButton } from "../components/CopyButton";
import { PageTransition } from "../components/PageTransition";
import { EmptyState } from "../components/EmptyState";
import confetti from "canvas-confetti";

interface UserData {
  phone: string;
  status: string;
  idUploaded: boolean;
  selfieUploaded: boolean;
  cardIssued: boolean;
  balance: number;
  createdAt: any;
  iban?: string;
  cardNumber?: string;
  cardNumberFull?: string;
  cvv?: string;
  cvvFull?: string;
  expiry?: string;
  name?: string;
  deliveryAddress?: string;
  physicalCardStatus?: string;
  cardFrozen?: boolean;
}

interface Transaction {
  id: string;
  type: "debit" | "credit";
  merchant: string;
  amount: string;
  date: string;
  status: string;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: any;
}

const MONTHLY_LIMIT = 50000;
const PAGE_SIZE = 10;

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 18) return "Good afternoon";
  if (h >= 18 && h < 23) return "Good evening";
  return "Good night";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [balanceColor, setBalanceColor] = useState("#ffffff");
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; idx: number }[]>([]);
  const [hasMoreTx, setHasMoreTx] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const lastTxDocRef = useRef<QueryDocumentSnapshot | null>(null);
  const [activeModal, setActiveModal] = useState<"send" | "topup" | "receive" | null>(null);
  const [sendPhone, setSendPhone] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendNote, setSendNote] = useState("");
  const [topupAmount, setTopupAmount] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const prevBalanceRef = useRef<number | null>(null);
  const greeting = getGreeting();

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) navigate("/");
    });
    return () => unsub();
  }, [navigate]);

  // Firestore user doc listener
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setUserData(snap.data() as UserData);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  // Confetti on first visit
  useEffect(() => {
    if (!user || !userData) return;
    const key = `dinar_celebrated_${user.uid}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "1");
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.3 }, colors: ["#16a34a", "#ffffff", "#bbf7d0"] });
        toast.success("Welcome to Dinar! 🎉", { description: "Your account is ready." });
      }, 800);
    }
  }, [user, userData]);

  // Load transactions with pagination
  useEffect(() => {
    if (!user) return;
    const txRef = collection(db, "users", user.uid, "transactions");
    const q = query(txRef, orderBy("createdAt", "desc"), limit(PAGE_SIZE));
    getDocs(q).then((snap) => {
      const txs: Transaction[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Transaction, "id">) }));
      setTransactions(txs);
      lastTxDocRef.current = snap.docs[snap.docs.length - 1] ?? null;
      setHasMoreTx(snap.docs.length === PAGE_SIZE);
    });
  }, [user]);

  const loadMoreTransactions = async () => {
    if (!user || !lastTxDocRef.current || loadingMore) return;
    setLoadingMore(true);
    const txRef = collection(db, "users", user.uid, "transactions");
    const q = query(txRef, orderBy("createdAt", "desc"), startAfter(lastTxDocRef.current), limit(PAGE_SIZE));
    const snap = await getDocs(q);
    const more: Transaction[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Transaction, "id">) }));
    setTransactions((prev) => [...prev, ...more]);
    lastTxDocRef.current = snap.docs[snap.docs.length - 1] ?? null;
    setHasMoreTx(snap.docs.length === PAGE_SIZE);
    setLoadingMore(false);
  };

  // Real-time notifications
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "notifications"), orderBy("createdAt", "desc"), limit(20));
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Notification, "id">) })));
    });
    return () => unsub();
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;
    const batch = writeBatch(db);
    unread.forEach((n) => batch.update(doc(db, "users", user.uid, "notifications", n.id), { read: true }));
    await batch.commit();
  };

  const handleNotifOpen = (open: boolean) => {
    setNotifOpen(open);
    if (open) markAllRead();
  };

  // Animate balance with pulse on change
  useEffect(() => {
    if (!userData) return;
    const target = userData.balance ?? 0;

    if (prevBalanceRef.current !== null && prevBalanceRef.current !== target) {
      setBalanceColor("#86efac");
      setTimeout(() => setBalanceColor("#ffffff"), 600);
    }
    prevBalanceRef.current = target;

    if (target === 0) { setAnimatedBalance(0); return; }
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setAnimatedBalance(target); clearInterval(timer); }
      else setAnimatedBalance(current);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [userData?.balance]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleToggleFreeze = async () => {
    if (!user) return;
    const frozen = !userData?.cardFrozen;
    await updateDoc(doc(db, "users", user.uid), { cardFrozen: frozen });
    toast.success(frozen ? "Card frozen." : "Card unfrozen.");
  };

  const handleSendMoney = async () => {
    if (!user || !sendPhone || !sendAmount) return;
    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) { toast.error("Enter a valid amount."); return; }
    if (amount > (userData?.balance ?? 0)) { toast.error("Insufficient balance."); return; }
    setModalLoading(true);
    try {
      await addDoc(collection(db, "users", user.uid, "transfer_requests"), {
        type: "send", recipientPhone: sendPhone, amount, note: sendNote, status: "pending",
        createdAt: new Date(),
      });
      toast.success(`Transfer of ${amount.toLocaleString()} DZD submitted.`, { description: "We'll process it within 24 hours." });
      setSendPhone(""); setSendAmount(""); setSendNote("");
      setActiveModal(null);
    } catch { toast.error("Failed to submit transfer. Please try again."); }
    finally { setModalLoading(false); }
  };

  const handleTopUp = async () => {
    if (!user || !topupAmount) return;
    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) { toast.error("Enter a valid amount."); return; }
    setModalLoading(true);
    try {
      await addDoc(collection(db, "users", user.uid, "topup_requests"), {
        amount, status: "pending", createdAt: new Date(),
      });
      toast.success(`Top-up request of ${amount.toLocaleString()} DZD submitted.`, { description: "Send the amount to the bank details shown and we'll credit your account." });
      setTopupAmount("");
      setActiveModal(null);
    } catch { toast.error("Failed to submit top-up. Please try again."); }
    finally { setModalLoading(false); }
  };

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y, idx }]);
    setTimeout(() => setRipples((r) => r.filter((rip) => rip.id !== id)), 500);
  };

  const physicalCardStatus = userData?.physicalCardStatus ?? "pending";
  const deliverySteps: { status: string; label: string; date?: string }[] = [
    { status: ["produced", "shipped", "in_transit", "delivered"].includes(physicalCardStatus) ? "completed" : "pending", label: "Card Produced" },
    { status: ["shipped", "in_transit", "delivered"].includes(physicalCardStatus) ? "completed" : physicalCardStatus === "produced" ? "active" : "pending", label: "Shipped" },
    { status: physicalCardStatus === "delivered" ? "completed" : physicalCardStatus === "in_transit" ? "active" : "pending", label: "In Transit" },
    { status: physicalCardStatus === "delivered" ? "completed" : "pending", label: "Delivered" },
  ];

  const displayName = userData?.name ?? userData?.phone ?? user?.phoneNumber ?? "User";
  const firstName = displayName.startsWith("+") ? "there" : displayName.split(" ")[0];

  const getCategoryIcon = (merchant: string) => {
    const m = merchant.toLowerCase();
    if (m.includes("netflix") || m.includes("disney") || m.includes("youtube")) return { icon: Film, color: "bg-red-500/20 text-red-400", category: "Entertainment" };
    if (m.includes("spotify") || m.includes("music") || m.includes("deezer")) return { icon: Music, color: "bg-purple-500/20 text-purple-400", category: "Music" };
    if (m.includes("amazon") || m.includes("shop") || m.includes("store")) return { icon: ShoppingBag, color: "bg-blue-500/20 text-blue-400", category: "Shopping" };
    if (m.includes("food") || m.includes("restaurant") || m.includes("eat")) return { icon: Utensils, color: "bg-orange-500/20 text-orange-400", category: "Food & Drink" };
    if (m.includes("upwork") || m.includes("fiverr") || m.includes("freelance") || m.includes("payment")) return { icon: TrendingUp, color: "bg-green-500/20 text-green-400", category: "Income" };
    return { icon: MoreHorizontal, color: "bg-surface text-app-faint", category: "Other" };
  };

  const totalCredit = transactions.filter(t => t.type === "credit").reduce((s, t) => s + parseFloat(t.amount.replace(/,/g, "")), 0);
  const totalDebit = transactions.filter(t => t.type === "debit").reduce((s, t) => s + parseFloat(t.amount.replace(/,/g, "")), 0);
  const debitCount = transactions.filter(t => t.type === "debit").length;
  const lastDebitDate = transactions.find(t => t.type === "debit")?.date ?? null;
  const spendPct = Math.min((totalDebit / MONTHLY_LIMIT) * 100, 100);
  const spendBarColor = spendPct >= 90 ? "#ef4444" : spendPct >= 70 ? "#f59e0b" : "#22c55e";

  if (loading) {
    return (
      <div className="min-h-screen bg-app">
        <div className="border-b border-app bg-app-header backdrop-blur-md sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
            <div className="flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-app">Dinar</span>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8 space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gradient-to-br from-green-600 to-green-700 overflow-hidden">
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-24 mb-2 bg-green-500" />
                  <Skeleton className="h-10 w-48 mb-8 bg-green-500" />
                  <div className="flex gap-3">
                    <Skeleton className="h-10 flex-1 bg-green-500" />
                    <Skeleton className="h-10 flex-1 bg-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-surface border-app">
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full rounded-xl mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 flex-1" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-surface border-app">
                <CardHeader><Skeleton className="h-6 w-44" /></CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16 ml-auto" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="bg-surface border-app">
                <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="bg-surface border-app">
                <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const spendingData = (() => {
    const cats: Record<string, number> = {};
    transactions.filter(t => t.type === "debit").forEach(t => {
      const m = t.merchant.toLowerCase();
      const cat = m.includes("netflix") || m.includes("spotify") || m.includes("disney") ? "Entertainment"
        : m.includes("amazon") || m.includes("shop") ? "Shopping"
        : m.includes("food") || m.includes("restaurant") ? "Food"
        : "Other";
      cats[cat] = (cats[cat] || 0) + parseFloat(t.amount.replace(/,/g, ""));
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  })();
  const CHART_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6"];

  return (
    <div className="min-h-screen bg-app">
      <Toaster />

      {/* Header */}
      <motion.header
        className="border-b border-app bg-app-header backdrop-blur-md sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <CreditCard className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-app">Dinar</span>
            </motion.div>
            <div className="flex items-center gap-3">
              <Popover open={notifOpen} onOpenChange={handleNotifOpen}>
                <PopoverTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
                    <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-app text-[10px] font-bold rounded-full flex items-center justify-center">
                        {notifications.filter((n) => !n.read).length}
                      </span>
                    )}
                  </motion.div>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[min(320px,calc(100vw-2rem))] p-0 border-app" style={{ backgroundColor: "var(--app-header)", backgroundImage: "none" }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-app">
                    <p className="font-semibold text-app">Notifications</p>
                    {notifications.length > 0 && (
                      <button onClick={markAllRead} className="text-xs text-green-600 hover:text-green-700">Mark all as read</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <EmptyState icon={<Bell className="w-full h-full" />} title="All caught up" description="Notifications about your account will appear here." size="sm" />
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-app last:border-0 ${!n.read ? "bg-green-500/10" : ""}`}>
                          <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                            n.type === "approved" ? "bg-green-500/20" : n.type === "card_issued" ? "bg-purple-500/20" : "bg-red-500/20"
                          }`}>
                            {n.type === "approved" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            {n.type === "card_issued" && <CreditCard className="w-4 h-4 text-purple-500" />}
                            {n.type === "rejected" && <XCircle className="w-4 h-4 text-red-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-app">{n.message}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />}
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <ThemeToggle />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}><Settings className="w-5 h-5" /></Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="w-5 h-5" /></Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <PageTransition>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Welcome */}
          <motion.div className="mb-6 flex items-center justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div>
              <p className="label-section mb-1">{greeting}</p>
              <h1 className="title-page">{firstName} 👋</h1>
            </div>
            <div className="text-right">
              <p className="body-secondary">Account status</p>
              <Badge className={
                userData?.status === "active" ? "bg-green-500/15 text-green-500 border border-green-500/20"
                : userData?.status === "reviewing" ? "bg-blue-500/15 text-blue-500 border border-blue-500/20"
                : "bg-amber-500/15 text-amber-500 border border-amber-500/20"
              }>{userData?.status ?? "pending"}</Badge>
            </div>
          </motion.div>

          {/* Status banners */}
          {userData?.status === "reviewing" && (
            <motion.div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                  <Clock className="w-5 h-5 text-blue-600" />
                </motion.div>
              </div>
              <div>
                <p className="font-semibold text-blue-300">Identity verification in progress</p>
                <p className="text-sm text-blue-300/70 mt-0.5">We're reviewing your documents. This usually takes 24–48 hours. You'll be notified once verified.</p>
              </div>
            </motion.div>
          )}

          {userData?.status === "pending" && !userData?.idUploaded && (
            <motion.div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start gap-3" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-300">Complete your identity verification</p>
                <p className="text-sm text-amber-300/70 mt-0.5">Upload your ID and selfie to activate your account and get your card.</p>
              </div>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 flex-shrink-0" onClick={() => navigate("/verify-identity")}>Verify now</Button>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-5">

              {/* Balance Hero */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 rounded-2xl p-6 relative overflow-hidden">
                  <motion.div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                  <motion.div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />
                  <div className="relative z-10">
                    <p className="text-white/70 text-sm font-medium mb-1">Total Balance</p>
                    <motion.div className="flex items-end gap-2 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                      <motion.span
                        className="text-5xl font-bold tracking-tight"
                        animate={{ color: balanceColor }}
                        transition={{ duration: 0.3 }}
                      >
                        {animatedBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </motion.span>
                      <span className="text-white/70 text-lg mb-1">DZD</span>
                    </motion.div>

                    <div className="flex gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                          <ArrowDownLeft className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Income</p>
                          <p className="text-white text-sm font-semibold">{totalCredit.toLocaleString()} DZD</p>
                        </div>
                      </div>
                      <div className="w-px bg-white/20" />
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                          <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Spent</p>
                          <p className="text-white text-sm font-semibold">{totalDebit.toLocaleString()} DZD</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick actions with ripple */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { icon: Send, label: "Send", action: () => setActiveModal("send") },
                        { icon: Plus, label: "Top Up", action: () => setActiveModal("topup") },
                        { icon: ArrowDownLeft, label: "Receive", action: () => setActiveModal("receive") },
                        { icon: userData?.cardFrozen ? Zap : Snowflake, label: userData?.cardFrozen ? "Unfreeze" : "Freeze", action: handleToggleFreeze },
                      ].map((action, i) => (
                        <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={(e) => { handleRipple(e, i); action.action(); }}
                          className="relative flex flex-col items-center gap-1.5 bg-white/15 hover:bg-white/25 rounded-xl py-3 px-2 transition-colors overflow-hidden">
                          {ripples.filter(r => r.idx === i).map(r => (
                            <motion.div key={r.id}
                              className="absolute w-4 h-4 bg-white/30 rounded-full pointer-events-none"
                              style={{ left: r.x - 8, top: r.y - 8 }}
                              initial={{ scale: 0, opacity: 1 }}
                              animate={{ scale: 8, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                            />
                          ))}
                          <action.icon className="w-5 h-5 text-white" />
                          <span className="text-white/90 text-xs font-medium">{action.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Virtual Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card className="bg-surface border-app overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="title-card">Virtual Card</CardTitle>
                      <Badge className={
                        !userData?.cardIssued ? "bg-amber-500/15 text-amber-500 border border-amber-500/20 text-xs"
                        : userData?.cardFrozen ? "bg-blue-500/15 text-blue-500 border border-blue-500/20 text-xs"
                        : "bg-green-500/15 text-green-500 border border-green-500/20 text-xs"
                      }>
                        {!userData?.cardIssued ? "Pending" : userData?.cardFrozen ? "Frozen" : "Active"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {userData?.cardIssued ? (
                      <div className="space-y-4">
                        {/* 3D Flip Card with swipe-to-freeze */}
                        <div style={{ perspective: "1000px" }} className="relative">
                          <p className="text-xs text-app-faint text-center mb-2 opacity-60">← swipe to freeze</p>
                          <motion.div
                            drag="x"
                            dragConstraints={{ left: -80, right: 0 }}
                            dragElastic={0.1}
                            onDragEnd={(_, info) => { if (info.offset.x < -60) handleToggleFreeze(); }}
                            className="cursor-grab active:cursor-grabbing"
                          >
                          <div className="relative" style={{ height: "170px" }}>
                            {/* Front */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-5 overflow-hidden select-none"
                              style={{ backfaceVisibility: "hidden" }}
                              animate={{ rotateY: isFlipped ? 180 : 0 }}
                              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                              <motion.div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-transparent to-blue-500/20"
                                animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
                              {userData?.cardFrozen && (
                                <div className="absolute inset-0 bg-blue-900/70 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
                                  <div className="text-center text-white">
                                    <Snowflake className="w-10 h-10 mx-auto mb-1 opacity-90" />
                                    <p className="font-semibold text-sm">Card Frozen</p>
                                  </div>
                                </div>
                              )}
                              <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-white/40 text-[10px] tracking-widest uppercase">Virtual</p>
                                    <p className="text-white text-sm font-bold mt-0.5">Dinar</p>
                                  </div>
                                  <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md" />
                                </div>
                                <p className="text-white font-mono tracking-widest text-sm">{userData.cardNumber ?? "•••• •••• •••• ••••"}</p>
                                <div className="flex justify-between items-end">
                                  <div className="flex gap-4">
                                    <div>
                                      <p className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5">Expires</p>
                                      <p className="text-white text-xs font-medium">{userData.expiry ?? "••/••"}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5">CVV</p>
                                      <p className="text-white text-xs font-medium">•••</p>
                                    </div>
                                  </div>
                                  <div className="flex">
                                    <div className="w-7 h-7 bg-red-500/80 rounded-full" />
                                    <div className="w-7 h-7 bg-yellow-500/80 rounded-full -ml-3" />
                                  </div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Back */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-[#16213e] to-[#0f3460] rounded-2xl overflow-hidden select-none"
                              style={{ backfaceVisibility: "hidden" }}
                              animate={{ rotateY: isFlipped ? 0 : -180 }}
                              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                              {/* Magnetic strip */}
                              <div className="w-full h-10 bg-black/60 mt-4 mb-4" />
                              <div className="px-5 space-y-3">
                                <div>
                                  <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1">Card Number</p>
                                  <p className="text-white font-mono tracking-widest text-sm">
                                    {(userData.cardNumberFull ?? "•••• •••• •••• ••••").split(" ").map((group, i) => (
                                      <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: isFlipped ? 1 : 0 }} transition={{ delay: i * 0.1 + 0.3 }}>
                                        {group}{" "}
                                      </motion.span>
                                    ))}
                                  </p>
                                </div>
                                <div className="flex gap-6">
                                  <div>
                                    <p className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5">Expires</p>
                                    <p className="text-white text-xs font-medium">{userData.expiry ?? "••/••"}</p>
                                  </div>
                                  <div>
                                    <p className="text-white/40 text-[9px] uppercase tracking-wider mb-0.5">CVV</p>
                                    <motion.p className="text-white text-xs font-medium" initial={{ opacity: 0 }} animate={{ opacity: isFlipped ? 1 : 0 }} transition={{ delay: 0.5 }}>
                                      {userData.cvvFull ?? "•••"}
                                    </motion.p>
                                  </div>
                                </div>
                                <p className="text-white/20 text-[9px] text-center pt-1">TAP TO HIDE</p>
                              </div>
                            </motion.div>
                          </div>
                          </motion.div>
                        </div>

                        {/* Card usage stats */}
                        <div className="flex items-center justify-between text-xs text-app-faint px-1">
                          <span>Used {debitCount} time{debitCount !== 1 ? "s" : ""} this month</span>
                          <span>Last used: {lastDebitDate ?? "Never"}</span>
                        </div>

                        {/* Card actions */}
                        <div className="grid grid-cols-3 gap-2">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" size="sm" className="w-full text-xs border-app" disabled={userData?.cardFrozen}
                              onClick={() => setIsFlipped(!isFlipped)}>
                              {isFlipped ? <><EyeOff className="w-3 h-3 mr-1" />Hide</> : <><Eye className="w-3 h-3 mr-1" />Reveal</>}
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <CopyButton text={userData.cardNumberFull ?? ""} label="Card number copied!" className="w-full text-xs border border-app" iconOnly={false} />
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" size="sm"
                              className={`w-full text-xs ${userData?.cardFrozen ? "border-green-500/30 text-green-500" : "border-blue-500/30 text-blue-500"}`}
                              onClick={handleToggleFreeze}>
                              {userData?.cardFrozen ? <><Zap className="w-3 h-3 mr-1" />Thaw</> : <><Snowflake className="w-3 h-3 mr-1" />Freeze</>}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      <EmptyState
                        icon={<CreditCard className="w-full h-full" />}
                        title="Card not yet issued"
                        description={
                          userData?.status === "reviewing"
                            ? "Your identity is under review. Your card will be ready once verified."
                            : userData?.status === "active"
                            ? "Your account is active. Your card will be issued shortly."
                            : "Complete identity verification to receive your virtual card."
                        }
                        action={
                          userData?.status === "pending" && !userData?.idUploaded
                            ? { label: "Verify identity", onClick: () => navigate("/verify-identity") }
                            : undefined
                        }
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Transactions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <Card className="bg-surface border-app">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="title-card">Recent Transactions</CardTitle>
                      {transactions.length > 0 && <span className="body-secondary">{transactions.length} total</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {transactions.length === 0 ? (
                      <motion.div
                        animate={{ boxShadow: ["0 0 0px rgba(34,197,94,0)", "0 0 30px rgba(34,197,94,0.15)", "0 0 0px rgba(34,197,94,0)"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="rounded-xl"
                      >
                        <EmptyState
                          icon={<Wallet className="w-full h-full" />}
                          title="No transactions yet"
                          description="Your spending and income will appear here once you start using your card."
                        />
                      </motion.div>
                    ) : (
                      <div className="space-y-1">
                        {transactions.map((transaction, index) => {
                          const cat = getCategoryIcon(transaction.merchant);
                          const CatIcon = cat.icon;
                          const isExpanded = expandedTx === transaction.id;
                          return (
                            <motion.div key={transaction.id} layout
                              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.25, delay: index * 0.05 }}
                              className="rounded-xl overflow-hidden cursor-pointer"
                              onClick={() => setExpandedTx(isExpanded ? null : transaction.id)}
                            >
                              <motion.div whileHover={{ backgroundColor: "var(--app-hover)" }}
                                className="flex items-center gap-3 px-2 py-2.5 transition-colors">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                                  <CatIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-app text-sm truncate">{transaction.merchant}</p>
                                  <p className="body-secondary">{transaction.date}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className={`font-semibold text-sm ${transaction.type === "credit" ? "text-green-500" : "text-app"}`}>
                                    {transaction.type === "credit" ? "+" : "−"}{transaction.amount}
                                  </p>
                                  <p className="text-xs text-app-faint">DZD</p>
                                </div>
                              </motion.div>
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="px-2 pb-3"
                                  >
                                    <div className="bg-app-input rounded-xl px-3 py-2.5 flex items-center justify-between gap-4">
                                      <div>
                                        <p className="text-xs text-app-faint mb-0.5">Category</p>
                                        <p className="text-xs font-medium text-app">{cat.category}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-app-faint mb-0.5">Date</p>
                                        <p className="text-xs font-medium text-app">{transaction.date}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-app-faint mb-0.5">Status</p>
                                        <Badge className="text-[10px] bg-green-500/15 text-green-500 border-green-500/20">{transaction.status ?? "completed"}</Badge>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                    {hasMoreTx && (
                      <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Button variant="ghost" size="sm" className="w-full text-app-faint hover:text-app text-xs" onClick={loadMoreTransactions} disabled={loadingMore}>
                          {loadingMore ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Loading…</> : <><ChevronDown className="w-3.5 h-3.5 mr-1.5" />Load more</>}
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">

              {/* Account */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card className="bg-surface border-app">
                  <CardHeader className="pb-3"><CardTitle className="title-card">Account</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="body-secondary">Phone</span>
                      <span className="text-sm font-medium text-app">{userData?.phone ?? user?.phoneNumber}</span>
                    </div>
                    {userData?.name && (
                      <div className="flex items-center justify-between">
                        <span className="body-secondary">Name</span>
                        <span className="text-sm font-medium text-app">{userData.name}</span>
                      </div>
                    )}
                    {userData?.iban && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="body-secondary">IBAN</span>
                          <CopyButton text={userData.iban!} label="IBAN copied!" iconOnly className="h-5 px-1" />
                        </div>
                        <p className="font-mono text-xs text-app-faint break-all">{userData.iban}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Monthly Spending Limit */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
                <Card className="bg-surface border-app">
                  <CardHeader className="pb-3"><CardTitle className="title-card">Monthly Spending</CardTitle></CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      {totalDebit === 0 ? (
                        <p className="text-xs text-app-faint">No spending yet</p>
                      ) : (
                        <p className="text-xs text-app-faint">
                          <span className="font-semibold text-app">{totalDebit.toLocaleString()} DZD</span> of {MONTHLY_LIMIT.toLocaleString()} DZD used
                        </p>
                      )}
                    </div>
                    <div className="h-2 bg-app-input rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: spendBarColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${spendPct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-app-faint mt-2">{(MONTHLY_LIMIT - totalDebit).toLocaleString()} DZD remaining</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Spending breakdown */}
              {spendingData.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                  <Card className="bg-surface border-app">
                    <CardHeader className="pb-2"><CardTitle className="title-card">Spending</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <ResponsiveContainer width={90} height={90}>
                          <PieChart>
                            <Pie data={spendingData} cx="50%" cy="50%" innerRadius={25} outerRadius={42} dataKey="value" strokeWidth={0}>
                              {spendingData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "var(--app-surface)", border: "1px solid var(--app-border)", borderRadius: 8, fontSize: 11 }} formatter={(v) => [`${v} DZD`]} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-1.5 flex-1">
                          {spendingData.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                              <span className="text-xs text-app-muted flex-1 truncate">{item.name}</span>
                              <span className="text-xs font-medium text-app">{item.value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Physical Card Delivery */}
              {userData?.cardIssued && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
                  <Card className="bg-surface border-app">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-green-500" />
                        <CardTitle className="title-card">Physical Card</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {deliverySteps.map((step, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="relative">
                                {step.status === "active" && (
                                  <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-green-400"
                                    animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  />
                                )}
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 relative z-10 ${
                                  step.status === "completed" ? "bg-green-500 text-white"
                                  : step.status === "active" ? "bg-green-500 text-white"
                                  : "bg-app-input text-app-faint"
                                }`}>
                                  {step.status === "completed" ? <CheckCircle2 className="w-4 h-4" />
                                    : step.status === "active" ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Clock className="w-4 h-4" /></motion.div>
                                    : <div className="w-2 h-2 rounded-full bg-app-faint" />}
                                </div>
                              </div>
                              {index < deliverySteps.length - 1 && (
                                <div className="w-0.5 h-8 mt-1 bg-app-border overflow-hidden">
                                  <motion.div
                                    className="w-full bg-green-500"
                                    initial={{ height: "0%" }}
                                    animate={{ height: step.status === "completed" ? "100%" : "0%" }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="pt-0.5 flex-1">
                              <p className={`text-sm font-medium ${step.status === "pending" ? "text-app-faint" : "text-app"}`}>{step.label}</p>
                              {step.date && <p className="body-secondary">{step.date}</p>}
                            </div>
                          </div>
                        ))}
                        {physicalCardStatus !== "delivered" && (
                          <p className="text-xs text-app-faint pt-1 pl-10">Estimated delivery: 3–5 business days</p>
                        )}
                      </div>
                      {userData?.deliveryAddress && (
                        <div className="mt-4 pt-4 border-t border-app flex gap-2">
                          <MapPin className="w-4 h-4 text-app-faint flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="body-secondary">Delivery to</p>
                            <p className="text-sm font-medium text-app">{userData.deliveryAddress}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Quick Links */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <Card className="bg-surface border-app">
                  <CardHeader className="pb-3"><CardTitle className="title-card">Quick Links</CardTitle></CardHeader>
                  <CardContent className="space-y-1">
                    {[
                      { icon: Globe, label: "International Transfer" },
                      { icon: TrendingUp, label: "Account Statement" },
                      { icon: Settings, label: "Card Settings" },
                    ].map((action, index) => (
                      <motion.div key={index} whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="ghost" className="w-full justify-start text-app-muted hover:text-app text-sm h-9">
                          <action.icon className="w-4 h-4 mr-2 text-app-faint" />
                          {action.label}
                        </Button>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </PageTransition>

      {/* Send Money Sheet */}
      <Sheet open={activeModal === "send"} onOpenChange={(o) => !o && setActiveModal(null)}>
        <SheetContent side="bottom" className="bg-surface border-app rounded-t-2xl pb-8">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-app flex items-center gap-2"><Send className="w-4 h-4 text-green-400" />Send Money</SheetTitle>
            <SheetDescription>Transfer funds to another Dinar account</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 max-w-md mx-auto">
            <div className="space-y-2">
              <Label htmlFor="send-phone" className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-green-400" />Recipient phone number</Label>
              <Input id="send-phone" placeholder="+213 6XX XXX XXX" value={sendPhone} onChange={(e) => setSendPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-amount" className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-green-400" />Amount (DZD)</Label>
              <Input id="send-amount" type="number" placeholder="0.00" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} />
              <p className="text-xs text-app-faint">Available: {(userData?.balance ?? 0).toLocaleString()} DZD</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-note">Note (optional)</Label>
              <Input id="send-note" placeholder="e.g. Rent, freelance payment…" value={sendNote} onChange={(e) => setSendNote(e.target.value)} />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSendMoney} disabled={modalLoading || !sendPhone || !sendAmount}>
              {modalLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</> : <>Send {sendAmount ? `${parseFloat(sendAmount || "0").toLocaleString()} DZD` : ""}</>}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Top Up Sheet */}
      <Sheet open={activeModal === "topup"} onOpenChange={(o) => !o && setActiveModal(null)}>
        <SheetContent side="bottom" className="bg-surface border-app rounded-t-2xl pb-8">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-app flex items-center gap-2"><Plus className="w-4 h-4 text-green-400" />Top Up</SheetTitle>
            <SheetDescription>Add funds to your Dinar account via bank transfer</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 max-w-md mx-auto">
            <div className="bg-app-input rounded-xl p-4 space-y-2 text-sm">
              <p className="text-app-faint text-xs uppercase tracking-wider font-medium">Transfer to this account</p>
              <div className="flex justify-between"><span className="text-app-faint">Bank</span><span className="font-medium text-app">CPA Algérie</span></div>
              <div className="flex justify-between"><span className="text-app-faint">Account name</span><span className="font-medium text-app">Dinar Financial</span></div>
              {userData?.iban && <div className="flex justify-between items-center"><span className="text-app-faint">IBAN</span><span className="font-mono text-xs text-app">{userData.iban}</span></div>}
              <div className="flex justify-between"><span className="text-app-faint">Reference</span><span className="font-mono text-xs text-green-400">{user?.uid?.slice(0, 8).toUpperCase()}</span></div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topup-amount">Amount you're sending (DZD)</Label>
              <Input id="topup-amount" type="number" placeholder="0.00" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)} />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleTopUp} disabled={modalLoading || !topupAmount}>
              {modalLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting…</> : "I've sent the payment"}
            </Button>
            <p className="text-xs text-app-faint text-center">Your balance will be credited within 1–2 business days after we confirm receipt.</p>
          </div>
        </SheetContent>
      </Sheet>

      {/* Receive Sheet */}
      <Sheet open={activeModal === "receive"} onOpenChange={(o) => !o && setActiveModal(null)}>
        <SheetContent side="bottom" className="bg-surface border-app rounded-t-2xl pb-8">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-app flex items-center gap-2"><ArrowDownLeft className="w-4 h-4 text-green-400" />Receive Money</SheetTitle>
            <SheetDescription>Share your details to receive a transfer</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 max-w-md mx-auto">
            <div className="bg-app-input rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-app-faint">Phone</span>
                <span className="font-medium text-app">{userData?.phone ?? user?.phoneNumber}</span>
              </div>
              {userData?.name && (
                <div className="flex justify-between items-center">
                  <span className="text-app-faint">Name</span>
                  <span className="font-medium text-app">{userData.name}</span>
                </div>
              )}
              {userData?.iban && (
                <div className="flex flex-col gap-1">
                  <span className="text-app-faint">IBAN</span>
                  <span className="font-mono text-xs text-app break-all">{userData.iban}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-app" onClick={() => { navigator.clipboard?.writeText(userData?.phone ?? ""); toast.success("Phone copied!"); }}>
                <Phone className="w-4 h-4 mr-2" />Copy phone
              </Button>
              {userData?.iban && (
                <Button variant="outline" className="flex-1 border-app" onClick={() => { navigator.clipboard?.writeText(userData!.iban!); toast.success("IBAN copied!"); }}>
                  <Building2 className="w-4 h-4 mr-2" />Copy IBAN
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
