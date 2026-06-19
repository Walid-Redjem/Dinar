import { useState } from "react";
import { useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CreditCard, ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { motion } from "motion/react";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", result.user.uid));
      if (snap.exists() && snap.data().isAdmin) { navigate("/admin"); return; }
      if (snap.exists()) { navigate(snap.data().idUploaded ? "/dashboard" : "/verify-identity"); return; }
      navigate("/dashboard");
    } catch (err: any) {
      const messages: Record<string, string> = {
        "auth/invalid-credential": "Invalid email or password.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
      };
      toast.error(messages[err.code] ?? "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app flex flex-col overflow-hidden">
      <Toaster />

      {/* Orbs */}
      <motion.div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-green-600/20 blur-[120px] pointer-events-none"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/15 blur-[100px] pointer-events-none"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} />

      {/* Grid */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Header */}
      <header className="relative z-10 border-b border-app bg-app-header backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3 max-w-7xl">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" className="text-app-muted hover:text-white hover:bg-app-input" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </motion.div>
          <CreditCard className="w-7 h-7 text-green-400" />
          <span className="text-xl font-bold text-app">Dinar</span>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
      </header>

      {/* Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="bg-surface border border-app backdrop-blur-sm rounded-2xl p-8">
            <motion.div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}>
              <Lock className="w-7 h-7 text-green-400" />
            </motion.div>

            <h1 className="text-2xl font-bold text-app text-center mb-1">Welcome back</h1>
            <p className="text-app-muted text-center text-sm mb-8">Sign in to your Dinar account</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Label className="text-app-muted text-sm">Email</Label>
                <Input
                  type="email" placeholder="you@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
                  className="bg-app-input border-app-input text-app placeholder:text-app-faint focus:border-green-500 focus:ring-green-500/20"
                />
              </motion.div>

              <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <Label className="text-app-muted text-sm">Password</Label>
                <Input
                  type="password" placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                  className="bg-app-input border-app-input text-app placeholder:text-app-faint focus:border-green-500 focus:ring-green-500/20"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-6" disabled={isLoading}>
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                  ) : "Sign In"}
                </Button>
              </motion.div>
            </form>

            <motion.div className="mt-6 text-center space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <p className="text-sm text-app-faint">
                Don't have an account?{" "}
                <button onClick={() => navigate("/signup")} className="text-green-400 hover:text-green-300 font-medium">Sign up</button>
              </p>
              <p className="text-sm text-app-faint">
                Have a phone account?{" "}
                <button onClick={() => navigate("/signup")} className="text-green-400 hover:text-green-300 font-medium">Login with phone number</button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
