import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { CreditCard, Upload, Camera, CheckCircle2, ArrowLeft, Shield, ArrowRight, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "../components/ThemeToggle";
import { auth, db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

type Step = "id" | "selfie" | "processing" | "done";

export default function IdentityVerification() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("id");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const readFile = (file: File): Promise<string> =>
    new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const handleIDUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }
    setIdFile(file);
    setIdPreview(await readFile(file));
  };

  const handleSelfieUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }
    setSelfieFile(file);
    setSelfiePreview(await readFile(file));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleIDUpload(file);
  }, []);

  const handleIDNext = () => {
    if (!idFile) { toast.error("Please upload your ID document"); return; }
    setStep("selfie");
  };

  const handleSubmit = async () => {
    if (!selfieFile) { toast.error("Please take or upload a selfie"); return; }
    const user = auth.currentUser;
    if (!user) { toast.error("Session expired."); navigate("/"); return; }
    setStep("processing");

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 88) { clearInterval(interval); setProgress(88); }
      else setProgress(Math.round(p));
    }, 200);

    try {
      await updateDoc(doc(db, "users", user.uid), { idUploaded: true, selfieUploaded: true, status: "reviewing" });
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => { setStep("done"); }, 400);
      setTimeout(() => navigate("/dashboard"), 2400);
    } catch {
      clearInterval(interval);
      toast.error("Submission failed. Please try again.");
      setStep("selfie");
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-app flex flex-col">
      <Toaster />

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
              onClick={() => step === "selfie" ? setStep("id") : step === "id" ? navigate("/signup") : undefined}
              disabled={step === "processing" || step === "done"}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </motion.div>
          <CreditCard className="w-7 h-7 text-green-400" />
          <span className="text-xl font-bold text-app">Dinar</span>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Progress stepper */}
          {step !== "done" && (
            <motion.div className="flex items-center justify-center mb-10"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              {[{ label: "Phone" }, { label: "Identity" }, { label: "Card" }].map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      i === 0 ? "bg-green-500 text-white"
                      : i === 1 ? "bg-green-500 text-white"
                      : "bg-surface border-2 border-app text-app-faint"
                    }`}>
                      {i === 0 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium ${i <= 1 ? "text-green-400" : "text-app-faint"}`}>{s.label}</span>
                  </div>
                  {i < 2 && <div className={`w-14 h-px mx-3 mb-5 ${i === 0 ? "bg-green-500/50" : "bg-app"}`} />}
                </div>
              ))}
            </motion.div>
          )}

          <AnimatePresence mode="wait">

            {/* Processing */}
            {step === "processing" && (
              <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-surface border border-app rounded-2xl p-10 text-center">
                  <motion.div className="w-20 h-20 bg-green-500/20 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
                    animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Upload className="w-9 h-9 text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-app mb-2">Submitting your documents</h3>
                  <p className="text-app-muted text-sm mb-6">Almost there — hang tight</p>
                  <div className="space-y-2">
                    <div className="h-1.5 bg-app rounded-full overflow-hidden">
                      <motion.div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-app-faint">{progress}%</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Done */}
            {step === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <div className="bg-surface border border-app rounded-2xl p-10 text-center">
                  <motion.div className="w-20 h-20 bg-green-500/20 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-app mb-2">Submitted!</h2>
                  <p className="text-app-muted text-sm mb-6">We'll review your documents and notify you within 24–48 hours</p>
                  <div className="h-1 bg-app rounded-full overflow-hidden">
                    <motion.div className="h-full bg-green-500" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "easeInOut" }} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ID Upload */}
            {step === "id" && (
              <motion.div key="id" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                <div className="bg-surface border border-app rounded-2xl p-8">
                  <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-7 h-7 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-app text-center mb-1">Upload your ID</h2>
                  <p className="text-app-muted text-sm text-center mb-8">Algerian national ID card or passport</p>

                  <input id="id-file" type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && handleIDUpload(e.target.files[0])} />

                  {idPreview ? (
                    <div className="relative mb-5 group">
                      <img src={idPreview} alt="ID preview" className="w-full h-48 object-cover rounded-xl border border-app" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                        <label htmlFor="id-file" className="cursor-pointer bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                          <RefreshCw className="w-3.5 h-3.5" /> Replace
                        </label>
                        <button onClick={() => { setIdFile(null); setIdPreview(null); }}
                          className="bg-white/20 hover:bg-red-500/60 text-white text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                          <X className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400 font-medium">ID uploaded</span>
                        <span className="text-xs text-app-faint ml-1">{idFile?.name}</span>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="id-file"
                      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all mb-5 ${
                        isDragging ? "border-green-500 bg-green-500/10 scale-[1.02]" : "border-app hover:border-green-500/50 hover:bg-app-hover"
                      }`}>
                      <Upload className={`w-8 h-8 mb-2 transition-colors ${isDragging ? "text-green-400" : "text-app-faint"}`} />
                      <p className="form-label">
                        {isDragging ? "Drop it here!" : <>Drop your file, or <span className="text-green-400">browse</ span></>}
                      </p>
                      <p className="text-xs text-app-faint mt-1">JPG, PNG — up to 10MB</p>
                    </label>
                  )}

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-5">
                    <p className="text-xs text-app-muted"><span className="text-amber-400 font-medium">Tips: </span>All text must be legible · All 4 corners visible · No glare · Good lighting</p>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={handleIDNext} className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold h-11" disabled={!idFile}>
                      <span>Continue to selfie</span><ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>

                <motion.div className="mt-4 flex items-start gap-3 px-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-app-muted">Encrypted end-to-end. Processed securely. Complies with international KYC standards.</p>
                </motion.div>
              </motion.div>
            )}

            {/* Selfie */}
            {step === "selfie" && (
              <motion.div key="selfie" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="bg-surface border border-app rounded-2xl p-8">
                  <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-7 h-7 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-app text-center mb-1">Take a selfie</h2>
                  <p className="text-app-muted text-sm text-center mb-8">A clear photo of your face to match your ID</p>

                  <input id="selfie-file" type="file" accept="image/*" capture="user" className="hidden"
                    onChange={e => e.target.files?.[0] && handleSelfieUpload(e.target.files[0])} />

                  {selfiePreview ? (
                    <div className="relative mb-5 group">
                      <img src={selfiePreview} alt="Selfie preview" className="w-full h-48 object-cover rounded-xl border border-app" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                        <label htmlFor="selfie-file" className="cursor-pointer bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5" /> Retake
                        </label>
                        <button onClick={() => { setSelfieFile(null); setSelfiePreview(null); }}
                          className="bg-white/20 hover:bg-red-500/60 text-white text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <X className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400 font-medium">Selfie uploaded</span>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="selfie-file"
                      className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-app hover:border-green-500/50 hover:bg-app-hover rounded-xl cursor-pointer transition-all mb-5">
                      <Camera className="w-8 h-8 text-app-faint mb-2" />
                      <p className="form-label">Tap to take or <span className="text-green-400">upload a photo</span></p>
                      <p className="text-xs text-app-faint mt-1">Face clearly visible · No glasses · Good light</p>
                    </label>
                  )}

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-5">
                    <p className="text-xs text-app-muted"><span className="text-amber-400 font-medium">Tips: </span>Look directly at camera · Remove glasses & hats · Neutral expression</p>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={handleSubmit} className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold h-11" disabled={!selfieFile}>
                      <span>Submit for verification</span><ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
