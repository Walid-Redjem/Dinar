import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import { CreditCard, ArrowLeft, Shield, Smartphone, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "../components/ThemeToggle";
import { auth, db } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function PhoneVerification() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) return;
      const { isAdmin, idUploaded } = snap.data();
      if (isAdmin) { navigate("/admin"); return; }
      navigate(idUploaded ? "/dashboard" : "/verify-identity");
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    return () => { if (recaptchaRef.current) recaptchaRef.current.clear(); };
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (otp.length === 6 && step === "otp" && !isLoading) {
      handleVerifyOTP();
    }
  }, [otp]);

  useEffect(() => {
    if (step === "phone") setTimeout(() => phoneInputRef.current?.focus(), 300);
  }, [step]);

  const setupRecaptcha = () => {
    if (recaptchaRef.current) { recaptchaRef.current.clear(); recaptchaRef.current = null; }
    const container = document.getElementById("recaptcha-container");
    if (container) container.innerHTML = "";
    recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    return recaptchaRef.current;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 8) { toast.error("Please enter a valid phone number"); return; }
    setIsLoading(true);
    const fullPhone = `+213${phoneNumber.replace(/\s/g, "")}`;
    try {
      const verifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, fullPhone, verifier);
      confirmationRef.current = result;
      setStep("otp");
      setCountdown(60);
    } catch (err: any) {
      toast.error(err.message || "Failed to send code. Please try again.");
      if (recaptchaRef.current) { recaptchaRef.current.clear(); recaptchaRef.current = null; }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (otp.length !== 6 || isLoading) return;
    if (!confirmationRef.current) { toast.error("Session expired."); setStep("phone"); return; }
    setIsLoading(true);
    try {
      const result = await confirmationRef.current.confirm(otp);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, { phone: user.phoneNumber, status: "pending", idUploaded: false, selfieUploaded: false, cardIssued: false, balance: 0, createdAt: serverTimestamp() });
        setStep("success");
        setTimeout(() => navigate("/verify-identity"), 1600);
      } else {
        const { idUploaded } = userSnap.data();
        setStep("success");
        setTimeout(() => navigate(idUploaded ? "/dashboard" : "/verify-identity"), 1600);
      }
    } catch {
      toast.error("Invalid code. Please try again.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setOtp("");
    if (recaptchaRef.current) { recaptchaRef.current.clear(); recaptchaRef.current = null; }
    setStep("phone");
  };

  return (
    <div className="min-h-screen bg-app flex flex-col">
      <Toaster />
      <div id="recaptcha-container" />

      {/* Orbs */}
      <motion.div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-green-600/20 blur-[120px] pointer-events-none"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/15 blur-[100px] pointer-events-none"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} />

      {/* Header */}
      <header className="relative z-10 border-b border-app bg-app-header backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" className="text-app-muted hover:text-app hover:bg-surface"
              onClick={() => step === "otp" ? setStep("phone") : navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </motion.div>
          <CreditCard className="w-7 h-7 text-green-400" />
          <span className="text-xl font-bold text-app">Dinar</span>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Step progress */}
          {step !== "success" && (
            <motion.div className="flex items-center justify-center mb-10"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              {[{ label: "Phone" }, { label: "Identity" }, { label: "Card" }].map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? "bg-green-500 text-white" : "bg-surface border-2 border-app text-app-faint"
                    }`}>
                      {i === 0 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium ${i === 0 ? "text-green-400" : "text-app-faint"}`}>{s.label}</span>
                  </div>
                  {i < 2 && <div className="w-14 h-px bg-app mx-3 mb-5" />}
                </div>
              ))}
            </motion.div>
          )}

          <AnimatePresence mode="wait">

            {/* Success */}
            {step === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-surface border border-app rounded-2xl p-10 text-center">
                <motion.div className="w-20 h-20 bg-green-500/20 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </motion.div>
                </motion.div>
                <h2 className="text-2xl font-bold text-app mb-2">Phone verified!</h2>
                <p className="text-app-muted text-sm mb-6">Heading to the next step…</p>
                <div className="h-1 bg-app rounded-full overflow-hidden">
                  <motion.div className="h-full bg-green-500 rounded-full"
                    initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.4, ease: "easeInOut" }} />
                </div>
              </motion.div>
            )}

            {/* Phone */}
            {step === "phone" && (
              <motion.div key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                <div className="bg-surface border border-app rounded-2xl p-8">
                  <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Smartphone className="w-7 h-7 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-app text-center mb-1">Your phone number</h2>
                  <p className="text-app-muted text-sm text-center mb-8">We'll send a one-time code to verify it's you</p>

                  <form onSubmit={handleSendOTP} className="space-y-5">
                    <div className="space-y-2">
                      <label className="form-label">Algerian number</label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 bg-app-input border border-app-input rounded-lg px-3 h-10 text-app-muted text-sm font-medium flex-shrink-0 whitespace-nowrap">
                          🇩🇿 +213
                        </div>
                        <Input ref={phoneInputRef} type="tel" placeholder="5XX XXX XXX" value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 9))} required
                          className="flex-1 bg-app-input border-app-input text-app placeholder:text-app-faint focus:border-green-500 font-mono text-base" />
                      </div>
                      <p className="text-xs text-app-faint">Without the leading 0 — e.g. 555 123 456</p>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold h-11" disabled={isLoading || phoneNumber.length < 8}>
                        {isLoading
                          ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                          : <><span>Send code</span><ArrowRight className="w-4 h-4 ml-2" /></>}
                      </Button>
                    </motion.div>
                  </form>
                </div>

                <motion.div className="mt-4 flex items-start gap-3 px-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-app-muted">Your number is encrypted and only used for verification. We never share it with third parties.</p>
                </motion.div>
              </motion.div>
            )}

            {/* OTP */}
            {step === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="bg-surface border border-app rounded-2xl p-8">
                  <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, delay: 0.3 }}>
                      <Smartphone className="w-7 h-7 text-green-400" />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-bold text-app text-center mb-1">Enter the code</h2>
                  <p className="text-app-muted text-sm text-center mb-1">Sent to <span className="text-app font-semibold">+213 {phoneNumber}</span></p>
                  <p className="text-xs text-app-faint text-center mb-8">It submits automatically when all 6 digits are entered</p>

                  <div className="flex justify-center mb-6">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
                      <InputOTPGroup className="gap-2">
                        {[0,1,2,3,4,5].map(i => (
                          <InputOTPSlot key={i} index={i}
                            className="w-11 h-12 text-lg font-bold bg-app-input border-app-input text-app rounded-xl" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <AnimatePresence>
                    {isLoading && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2 mb-4">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full" />
                        <span className="text-sm text-app-muted">Verifying your code…</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="text-center">
                    {countdown > 0
                      ? <p className="text-sm text-app-faint">Resend available in <span className="text-app font-mono font-semibold">{countdown}s</span></p>
                      : <button onClick={handleResend} className="text-sm text-green-400 hover:text-green-300 font-medium">Didn't receive it? Try again</button>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
