import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { CreditCard, ArrowLeft, Save, Loader2, User, Phone, Shield, CheckCircle2, MapPin, Bell } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { motion } from "motion/react";
import { PageTransition } from "../components/PageTransition";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uid, setUid] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [initialName, setInitialName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [initialDeliveryAddress, setInitialDeliveryAddress] = useState("");
  const [notifTransactions, setNotifTransactions] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);
  const [notifUpdates, setNotifUpdates] = useState(false);
  const [initialNotifs, setInitialNotifs] = useState({ transactions: true, security: true, updates: false });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate("/"); return; }
      setUid(user.uid);
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setPhone(data.phone ?? user.phoneNumber ?? "");
        setStatus(data.status ?? "pending");
        setName(data.name ?? "");
        setInitialName(data.name ?? "");
        setDeliveryAddress(data.deliveryAddress ?? "");
        setInitialDeliveryAddress(data.deliveryAddress ?? "");
        const notifs = data.notifPrefs ?? { transactions: true, security: true, updates: false };
        setNotifTransactions(notifs.transactions ?? true);
        setNotifSecurity(notifs.security ?? true);
        setNotifUpdates(notifs.updates ?? false);
        setInitialNotifs(notifs);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  const profileChanged = name.trim() !== initialName || deliveryAddress.trim() !== initialDeliveryAddress;
  const notifsChanged = notifTransactions !== initialNotifs.transactions || notifSecurity !== initialNotifs.security || notifUpdates !== initialNotifs.updates;

  const handleSave = async () => {
    if (!uid) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", uid), {
        name: name.trim(),
        deliveryAddress: deliveryAddress.trim(),
        notifPrefs: { transactions: notifTransactions, security: notifSecurity, updates: notifUpdates },
      });
      setInitialName(name.trim());
      setInitialDeliveryAddress(deliveryAddress.trim());
      setInitialNotifs({ transactions: notifTransactions, security: notifSecurity, updates: notifUpdates });
      toast.success("Settings saved.");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const statusColor: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    reviewing: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app">
        <Loader2 className="w-8 h-8 animate-spin text-green-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app">
      <Toaster />

      <motion.header
        className="border-b border-app bg-app-header backdrop-blur-md sticky top-0 z-40"
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.4 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center gap-3 max-w-2xl">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" className="text-app-muted hover:text-white hover:bg-app-input" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </motion.div>
          <CreditCard className="w-7 h-7 text-green-400" />
          <span className="text-xl font-bold text-app">Account Settings</span>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
      </motion.header>

      <PageTransition>
        <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">

          {/* Profile */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-surface border-app">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-green-400" />
                  <CardTitle>Profile</CardTitle>
                </div>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="e.g. Walid Redjem" value={name} onChange={(e) => setName(e.target.value)} />
                  <p className="body-secondary">This is how your name appears on your card and dashboard.</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-green-400" /> Delivery Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="e.g. 12 Rue Didouche Mourad, Alger 16000"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                  <p className="body-secondary">Used for physical card delivery. Include wilaya and postal code.</p>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                    onClick={handleSave}
                    disabled={saving || (!profileChanged && !notifsChanged)}
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" />Save Changes</>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-surface border-app">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-green-400" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>Choose what you want to be notified about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { id: "transactions", label: "Transaction alerts", desc: "Get notified for every payment and top-up", value: notifTransactions, set: setNotifTransactions },
                  { id: "security", label: "Security alerts", desc: "Card freeze, login attempts, suspicious activity", value: notifSecurity, set: setNotifSecurity },
                  { id: "updates", label: "Product updates", desc: "New features, announcements, and offers", value: notifUpdates, set: setNotifUpdates },
                ].map((item, i) => (
                  <div key={i}>
                    {i > 0 && <Separator className="mb-5" />}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-app">{item.label}</p>
                        <p className="body-secondary mt-0.5">{item.desc}</p>
                      </div>
                      <Switch
                        id={item.id}
                        checked={item.value}
                        onCheckedChange={item.set}
                      />
                    </div>
                  </div>
                ))}
                {notifsChanged && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                    <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" onClick={handleSave} disabled={saving}>
                      {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : <><Save className="w-4 h-4 mr-2" />Save Preferences</>}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-surface border-app">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-400" />
                  <CardTitle>Account Information</CardTitle>
                </div>
                <CardDescription>Your account details — these cannot be changed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="form-label mb-1">Phone Number</p>
                  <p className="font-medium text-app">{phone || "—"}</p>
                </div>
                <Separator />
                <div>
                  <p className="form-label mb-1">Account Status</p>
                  <Badge className={statusColor[status] ?? "bg-gray-100 text-gray-700"}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="form-label mb-1">User ID</p>
                  <p className="font-mono text-xs text-app-faint break-all">{uid}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-surface border-app">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <CardTitle>Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Phone verification active</p>
                    <p className="text-sm text-green-700 mt-0.5">
                      Your account is secured with phone number verification. Each login requires an OTP sent to your registered number.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </PageTransition>
    </div>
  );
}
