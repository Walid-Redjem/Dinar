import { useState } from "react";
import { useNavigate } from "react-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CreditCard, ArrowLeft, Mail, Phone, Clock, CheckCircle2, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";

export default function Contact() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) { toast.error("Please fill in all fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, "contact_requests"), {
        name: name.trim(), email: email.trim(), subject, message: message.trim(),
        status: "open", createdAt: new Date(),
      });
      setSubmitted(true);
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808]">
      <Toaster />

      {/* Header */}
      <motion.header
        className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-40"
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3 max-w-7xl">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
            className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <CreditCard className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold text-white">Dinar</span>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-6xl">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">Get in touch</h1>
          <p className="text-xl text-white/50 max-w-xl mx-auto">Have a question or need help? We're here for you.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — contact info */}
          <motion.div className="space-y-6"
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "support@dinar.dz", color: "bg-green-500/10 text-green-400" },
                { icon: Phone, label: "Phone", value: "+213 XX XX XX XX", color: "bg-blue-500/10 text-blue-400" },
                { icon: Clock, label: "Hours", value: "Sunday – Thursday, 9am – 6pm", color: "bg-purple-500/10 text-purple-400" },
              ].map((item, i) => (
                <motion.div key={i} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.p className="text-white/30 text-sm px-1"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              We typically respond within 24 hours on business days.
            </motion.p>
          </motion.div>

          {/* Right — form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success"
                  className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                  <motion.div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-5"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-3">Message sent!</h2>
                  <p className="text-white/50 mb-6">Thanks for reaching out. We'll get back to you at <span className="text-white">{email}</span> within 24 hours.</p>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => navigate("/")}>
                    Back to home
                  </Button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit}
                  className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <motion.div className="space-y-2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      <Label htmlFor="name" className="text-white/60 text-xs uppercase tracking-wider">Full name</Label>
                      <Input id="name" placeholder="Karim Bensalem" value={name} onChange={(e) => setName(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-green-500/50" />
                    </motion.div>
                    <motion.div className="space-y-2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                      <Label htmlFor="email" className="text-white/60 text-xs uppercase tracking-wider">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-green-500/50" />
                    </motion.div>
                  </div>
                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Label htmlFor="subject" className="text-white/60 text-xs uppercase tracking-wider">Subject</Label>
                    <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500/50">
                      <option value="" className="bg-[#111]">Select a topic…</option>
                      <option value="General inquiry" className="bg-[#111]">General inquiry</option>
                      <option value="Card issue" className="bg-[#111]">Card issue</option>
                      <option value="Verification" className="bg-[#111]">Verification</option>
                      <option value="Payment" className="bg-[#111]">Payment</option>
                      <option value="Other" className="bg-[#111]">Other</option>
                    </select>
                  </motion.div>
                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                    <Label htmlFor="message" className="text-white/60 text-xs uppercase tracking-wider">Message</Label>
                    <textarea id="message" rows={5} placeholder="Tell us how we can help…" value={message} onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-green-500/50 resize-none" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-5">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</> : <><Send className="w-4 h-4 mr-2" />Send message</>}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
