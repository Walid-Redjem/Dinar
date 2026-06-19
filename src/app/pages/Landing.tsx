import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import {
  CreditCard,
  Zap,
  Globe,
  Lock,
  Wallet,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Smartphone,
  ArrowDownLeft,
  Star,
  Shield,
  Fingerprint,
  AlertOctagon,
  ChevronDown,
  Snowflake,
  Camera,
  IdCard,
  Phone,
  ExternalLink,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  animate,
  useInView,
  useScroll,
} from "motion/react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

const HEADLINE = ["All", "your", "money", "One", "move"];

function useCounter(target: number, duration = 2) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [inView, target, duration]);
  return ref;
}

const testimonials = [
  { name: "Karim B.", role: "Freelance Developer, Alger", quote: "Finally I can receive Upwork payments and spend them on AWS and Digital Ocean without any hassle. Dinar changed my workflow completely.", color: "#16a34a" },
  { name: "Yasmine D.", role: "UI Designer, Oran", quote: "I used to ask my cousin abroad to buy Figma for me. Now I just use my Dinar card. It took 5 minutes to set up.", color: "#2563eb" },
  { name: "Riad M.", role: "Content Creator, Constantine", quote: "Getting paid from YouTube and spending on international platforms was impossible before. Dinar made it simple and fast.", color: "#7c3aed" },
];

const platforms = [
  { name: "Upwork", color: "#14a800" },
  { name: "Fiverr", color: "#1dbf73" },
  { name: "Netflix", color: "#e50914" },
  { name: "Spotify", color: "#1db954" },
  { name: "Amazon", color: "#ff9900" },
  { name: "PayPal", color: "#0070ba" },
  { name: "Adobe", color: "#ff0000" },
  { name: "AWS", color: "#ff9900" },
  { name: "DigitalOcean", color: "#0080ff" },
  { name: "Figma", color: "#a259ff" },
  { name: "GitHub", color: "#ffffff" },
  { name: "Notion", color: "#ffffff" },
];


const faqItems = [
  { q: "Is it legal in Algeria?", a: "Yes, Dinar operates fully within Algerian financial regulations. We are compliant with all Bank of Algeria requirements and guidelines." },
  { q: "How long does verification take?", a: "Identity verification typically takes 24–48 hours. Once approved, your virtual card is issued instantly." },
  { q: "Can I withdraw cash?", a: "Cash withdrawals are available with the physical Dinar card at supported ATMs across all 58 wilayas." },
  { q: "What currencies are supported?", a: "Your balance is held in DZD. Transactions in foreign currencies are automatically converted at competitive exchange rates." },
  { q: "Is there a monthly fee?", a: "No hidden fees. Dinar is free to use. We believe financial access should be available to everyone." },
];

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHovered, setCardHovered] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();

  // Show sticky bar after hero
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => {
      if (v > 600 && !stickyDismissed) setShowSticky(true);
      else if (v <= 600) setShowSticky(false);
    });
    return unsub;
  }, [scrollY, stickyDismissed]);

  // Scroll-depth CTA pulse
  const [didPulse, setDidPulse] = useState(false);
  useEffect(() => {
    if (didPulse) return;
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.8 && !sessionStorage.getItem("dinar_cta_pulsed")) {
        sessionStorage.setItem("dinar_cta_pulsed", "1");
        setDidPulse(true);
      }
    });
    return unsub;
  }, [scrollYProgress, didPulse]);



  // Cursor glow
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  // 3D card tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-8, 8]), springConfig);
  const glareX = useTransform(mouseX, [-150, 150], [0, 100]);
  const glareY = useTransform(mouseY, [-150, 150], [0, 100]);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]: number[]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
  );

  // Parallax card on scroll
  const cardParallaxY = useTransform(scrollY, [0, 600], [0, -40]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (rect) { cursorX.set(e.clientX - rect.left); cursorY.set(e.clientY - rect.top); }
    if (cardRef.current) {
      const cr = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - (cr.left + cr.width / 2));
      mouseY.set(e.clientY - (cr.top + cr.height / 2));
    }
  };

  const handleHeroMouseLeave = () => {
    cursorX.set(-200); cursorY.set(-200); mouseX.set(0); mouseY.set(0); setCardHovered(false);
  };

  const ref10k = useCounter(10000);
  const ref58 = useCounter(58, 1.5);
  const ref99 = useCounter(99, 1.8);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) return;
      const { isAdmin, idUploaded } = snap.data();
      if (isAdmin) { navigate("/admin"); return; }
      if (idUploaded) { navigate("/dashboard"); return; }
    });
    return () => unsub();
  }, [navigate]);

  const features = [
    { icon: Zap, title: "Instant activation", description: "Virtual card ready in minutes" },
    { icon: Globe, title: "Global payments", description: "Shop anywhere in the world" },
    { icon: Lock, title: "Bank-level security", description: "Your money is protected" },
    { icon: Wallet, title: "Zero fees", description: "No hidden charges" },
  ];


  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Toaster />

      {/* Sticky CTA bar */}
      <AnimatePresence>
        {showSticky && !stickyDismissed && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between gap-4"
            initial={{ y: 80 }}
            animate={{ y: 0, scale: didPulse ? [1, 1.02, 1] : 1 }}
            exit={{ y: 80 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white text-sm font-medium hidden sm:block">Get your Dinar card in 5 minutes</p>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                className="bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-5 py-2 rounded-full"
                onClick={() => { setStickyDismissed(true); navigate("/signup"); }}
              >
                Get started <ArrowRight className="ml-1 w-3.5 h-3.5" />
              </Button>
              <button onClick={() => setStickyDismissed(true)} className="text-white/40 hover:text-white text-xs px-2">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md"
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between max-w-7xl">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <CreditCard className="w-7 h-7 text-green-400" />
            <span className="text-2xl font-bold text-white">Dinar</span>
          </motion.div>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 hidden sm:flex items-center gap-1.5" onClick={() => setAppModalOpen(true)}>
                <Smartphone className="w-4 h-4" />
                Get the app
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" onClick={() => navigate("/login")}>Login</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-green-500 hover:bg-green-400 text-black font-semibold" onClick={() => navigate("/signup")}>Get started</Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen bg-[#080808] flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <motion.div className="pointer-events-none absolute w-[600px] h-[600px] rounded-full blur-[100px] bg-green-500/10"
          style={{ x: useTransform(cursorX, (v) => v - 300), y: useTransform(cursorY, (v) => v - 300) }} />
        <motion.div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-green-600/20 blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[100px]"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="text-lg">🇩🇿</span>
                <span className="text-sm font-medium text-green-400">Made for Algeria, Ready for the world</span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
                {HEADLINE.map((word, i) => (
                  <motion.span key={i}
                    className={`inline-block mr-3 ${word === "One" || word === "move" ? "text-green-400" : ""}`}
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}>
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  className="inline-block text-green-400 ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                >|</motion.span>
              </h1>

              <motion.p className="text-lg sm:text-xl text-white/60 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
                The first Algerian debit card that{" "}
                <span className="text-white font-medium">actually works internationally</span>. No paperwork, no waiting.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }}>
                <Button size="lg" className="bg-green-500 hover:bg-green-400 text-black font-semibold text-base px-8 py-6 rounded-full" onClick={() => navigate("/signup")}>
                  Get started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" className="bg-white text-black hover:bg-white text-base px-8 py-6 rounded-full" onClick={() => navigate("/login")}>
                  Sign in
                </Button>
              </motion.div>

              {/* Social proof */}
              <motion.div className="mt-10 flex items-center gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                <div className="flex -space-x-2">
                  {["#22c55e", "#16a34a", "#15803d", "#166534"].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#080808]" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="text-sm text-white/50">
                  <span className="text-white font-semibold">10,000+</span> Algerians already joined
                </p>
              </motion.div>
            </div>

            {/* Right — 3D card with parallax */}
            <motion.div className="flex-1 flex items-center justify-center"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              style={{ y: cardParallaxY }}>
              <div ref={cardRef} onMouseEnter={() => setCardHovered(true)}
                className="relative w-full max-w-sm" style={{ perspective: "1000px" }}>
                <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}>
                  <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-7 shadow-2xl border border-white/10 overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
                    <AnimatePresence>
                      {cardHovered && (
                        <motion.div className="absolute inset-0 pointer-events-none rounded-3xl"
                          style={{ background: glareBackground }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                      )}
                    </AnimatePresence>
                    <motion.div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-3xl"
                      animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                        <div>
                          <p className="text-white/40 text-xs tracking-widest uppercase mb-1">Debit Card</p>
                          <p className="text-white text-lg font-bold">Dinar</p>
                        </div>
                        <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md" />
                      </div>
                      <p className="text-white text-xl font-mono tracking-widest mb-8">4532 •••• •••• 7890</p>
                      <div className="flex justify-between items-end">
                        <div className="flex gap-6">
                          <div>
                            <p className="text-white/40 text-xs mb-1">VALID THRU</p>
                            <p className="text-white text-sm font-medium">12/28</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs mb-1">CVV</p>
                            <p className="text-white text-sm font-medium">•••</p>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="w-9 h-9 bg-red-500/80 rounded-full" />
                          <div className="w-9 h-9 bg-yellow-500/80 rounded-full -ml-3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 min-w-[180px]"
                    style={{ transform: "translateZ(40px)" }} animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Upwork Payment</p>
                      <p className="text-xs text-green-600 font-bold">+12,000 DZD</p>
                    </div>
                  </motion.div>

                  <motion.div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2"
                    style={{ transform: "translateZ(40px)" }} animate={{ y: [0, 6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <p className="text-xs font-semibold text-gray-900">Card activated</p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Feature chips — staggered with icon bounce */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div key={i}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                whileHover={{ scale: 1.03 }}
              >
                <motion.div
                  className="text-green-400 flex-shrink-0"
                  whileInView={{ rotate: [0, -10, 10, 0] }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3, duration: 0.4 }}
                >
                  <f.icon className="w-5 h-5" />
                </motion.div>
                <div>
                  <p className="text-white text-sm font-medium">{f.title}</p>
                  <p className="text-white/40 text-xs">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* As seen in */}
          <motion.div className="mt-12 text-center"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-3">As featured in</p>
            <p className="text-white/20 text-sm tracking-wider">El Watan · Algérie Presse Service · Jeune Afrique · Forbes Afrique</p>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/30" />
          <p className="text-white/30 text-xs tracking-widest">SCROLL</p>
        </motion.div>
      </section>

      {/* Platform logo strip */}
      <section className="bg-[#080808] border-t border-white/5 py-8 overflow-hidden">
        <p className="text-center text-white/30 text-xs uppercase tracking-widest mb-5">Works with everything you already use</p>
        <div className="flex gap-4 animate-[scroll_25s_linear_infinite] w-max">
          {[...platforms, ...platforms].map((p, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
              <span className="text-white/70 text-sm font-medium">{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">Built for Algerian Freelancers</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Everything you need to access the global digital economy</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Pay online, anywhere", desc: "Netflix, Spotify, Amazon, and thousands of international merchants accept your Dinar card.", hover: { rotate: 360 } },
              { icon: TrendingUp, title: "Get paid from anywhere", desc: "Receive payments from Upwork, Fiverr, and PayPal directly to your account.", hover: { y: [-2, 2, -2] } },
              { icon: Smartphone, title: "Track in real-time", desc: "Instant notifications, spending insights, and full control from your phone.", hover: { scale: [1, 1.15, 1] } },
            ].map((b, i) => (
              <motion.div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm group"
                initial={{ opacity: 0, y: 50, scale: 0.96, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}>
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-5">
                  <motion.div whileHover={b.hover} transition={{ duration: 0.6 }}>
                    <b.icon className="w-8 h-8 text-green-600" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{b.title}</h3>
                <p className="text-gray-500 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">Dinar vs. your bank</h2>
            <p className="text-xl text-gray-500">The choice is obvious</p>
          </motion.div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="px-6 py-4 text-sm font-medium text-gray-500">Feature</div>
              <div className="px-6 py-4 text-sm font-medium text-gray-500 text-center">Traditional Bank</div>
              <div className="px-6 py-4 text-sm font-semibold text-green-600 text-center border-l-2 border-green-500">Dinar</div>
            </div>
            {[
              { feature: "International payments", bank: "❌ Not supported", dinar: "✅ Worldwide" },
              { feature: "Setup time", bank: "⚠️ Weeks of paperwork", dinar: "✅ 5 minutes" },
              { feature: "Virtual card", bank: "❌ Not available", dinar: "✅ Instant" },
              { feature: "Monthly fees", bank: "⚠️ Yes", dinar: "✅ Free" },
              { feature: "Freeze card instantly", bank: "❌ Visit a branch", dinar: "✅ One tap" },
            ].map((row, i) => (
              <motion.div key={i} className="grid grid-cols-3 border-b border-gray-100 last:border-0"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <div className="px-6 py-4 text-sm text-gray-700 font-medium">{row.feature}</div>
                <div className="px-6 py-4 text-sm text-gray-500 text-center">{row.bank}</div>
                <div className="px-6 py-4 text-sm text-gray-900 font-medium text-center border-l-2 border-green-500 bg-green-50/50">{row.dinar}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">Loved by Algerians</h2>
            <p className="text-xl text-gray-500">Real people, real financial freedom</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 relative"
                initial={{ opacity: 0, y: 50, scale: 0.96, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(0,0,0,0.06)" }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: t.color }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#080808]">
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">Your money is safe with us</h2>
            <p className="text-xl text-white/50">Bank-grade security, built for the modern age</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "256-bit encryption", desc: "All data encrypted end-to-end at military-grade standard" },
              { icon: Snowflake, title: "Instant freeze", desc: "Lock your card in one tap if it's ever lost or stolen" },
              { icon: AlertOctagon, title: "Zero liability fraud", desc: "You're never responsible for unauthorized transactions" },
              { icon: Fingerprint, title: "Biometric lock", desc: "Face ID and fingerprint authentication for every login" },
            ].map((s, i) => (
              <motion.div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                <motion.div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-4"
                  initial={{ scale: 0.8 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: i * 0.1 + 0.2 }}>
                  <s.icon className="w-6 h-6 text-green-400" />
                </motion.div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">Get started in minutes</h2>
            <p className="text-xl text-gray-500">Three simple steps to financial freedom</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connector lines */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px">
              <motion.div className="h-px bg-gradient-to-r from-green-400 to-green-400 w-full"
                initial={{ scaleX: 0, originX: "0%" }} whileInView={{ scaleX: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} />
            </div>

            {[
              { num: "01", title: "Sign up", desc: "Enter your Algerian phone number", illustration: (
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 text-xs text-gray-500 mx-auto w-fit mt-3">
                  <Phone className="w-3 h-3 text-green-500" />
                  <span className="text-green-600 font-medium">+213</span>
                  <span className="text-gray-300">|</span>
                  <span>6XX XXX XXX</span>
                </div>
              )},
              { num: "02", title: "Verify identity", desc: "Upload ID & take a selfie", illustration: (
                <div className="flex items-center justify-center gap-3 mt-3">
                  <div className="bg-white border border-gray-200 rounded-xl p-2"><IdCard className="w-5 h-5 text-green-500" /></div>
                  <span className="text-gray-300 text-sm">+</span>
                  <div className="bg-white border border-gray-200 rounded-xl p-2"><Camera className="w-5 h-5 text-green-500" /></div>
                </div>
              )},
              { num: "03", title: "Start using", desc: "Get your virtual card instantly", illustration: (
                <div className="mt-3 mx-auto w-fit bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl px-4 py-2 text-white font-mono text-xs tracking-widest">
                  •••• •••• •••• 7890
                </div>
              )},
            ].map((s, i) => (
              <motion.div key={i} className="text-center"
                initial={{ opacity: 0, y: 50, scale: 0.96, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}>
                <div className="text-4xl sm:text-6xl font-bold text-green-500 mb-4">{s.num}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500">{s.desc}</p>
                {s.illustration}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#080808]">
        <div className="container mx-auto max-w-7xl">
          <motion.div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div>
              <div className="text-5xl font-bold text-green-400 mb-2"><span ref={ref10k}>0</span>+</div>
              <p className="text-white/50">Active users</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-400 mb-2"><span ref={ref58}>0</span></div>
              <p className="text-white/50">Wilayas covered</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-400 mb-2"><span ref={ref99}>0</span>%</div>
              <p className="text-white/50">Satisfaction rate</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#080808] border-t border-white/5">
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">The people behind Dinar</h2>
            <p className="text-xl text-white/50">Built by Algerians, for Algerians</p>
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
            {[
              { name: "Bouchra Chieb", role: "Fondatrice & CEO", bio: "Driving Dinar's growth, partnerships, and business strategy.", degree: "Business Management", photo: "/Bouchra.jpg" },
              { name: "Walid Redjem", role: "Co-Fondateur & CTO", bio: "Designed and built the entire Dinar platform from scratch.", degree: "Computing in AI & Robotics", photo: "/Walid.jpg" },
            ].map((person, i) => (
              <motion.div key={i}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.2)" }}
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-5 overflow-hidden ring-2 ring-white/10">
                  <img src={person.photo} alt={person.name} className="w-full h-full object-cover object-top" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{person.name}</h3>
                <p className="text-green-400 text-sm font-medium mb-2">{person.role}</p>
                <p className="text-white/40 text-sm italic mb-4">{person.bio}</p>
                <div className="flex items-center justify-center gap-1.5 text-white/30 text-xs">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                  <span>{person.degree} · University of Buckingham</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Modal */}
      <Dialog open={appModalOpen} onOpenChange={setAppModalOpen}>
        <DialogContent className="bg-[#111] border border-white/10 text-white max-w-sm">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-white text-xl">Download Dinar</DialogTitle>
            <DialogDescription className="text-white/50">Available soon on iOS and Android</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {/* App Store */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-3 bg-black border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-white/25 transition-colors"
              onClick={() => { toast.success("Coming soon!", { description: "The iOS app will be available on the App Store." }); setAppModalOpen(false); }}
            >
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-center">
                <p className="text-xs text-white/50 leading-none mb-1">Download on the</p>
                <p className="text-sm font-semibold text-white">App Store</p>
              </div>
              <span className="text-[10px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full">Coming soon</span>
            </motion.button>

            {/* Google Play */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-3 bg-black border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-white/25 transition-colors"
              onClick={() => { toast.success("Coming soon!", { description: "The Android app will be available on Google Play." }); setAppModalOpen(false); }}
            >
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                <path d="M3.18 23.76c.3.17.64.24.99.2l12.47-11.5L13.16 9l-9.98 14.76z" fill="#EA4335"/>
                <path d="M20.47 10.37L17.64 8.8l-3.48 3.2 3.48 3.21 2.86-1.59a1.63 1.63 0 0 0 0-3.25z" fill="#FBBC04"/>
                <path d="M3.18.24A1.63 1.63 0 0 0 2.5 1.5v21c0 .5.24.96.68 1.26L13.16 13 3.18.24z" fill="#4285F4"/>
                <path d="M4.17.04L16.64 11.46l-3.48 3.21L3.18 23.76c.3.16.66.22 1.01.16L18.83 15.7a1.63 1.63 0 0 0 0-7.4L5.18-.12A1.63 1.63 0 0 0 4.17.04z" fill="#34A853"/>
              </svg>
              <div className="text-center">
                <p className="text-xs text-white/50 leading-none mb-1">Get it on</p>
                <p className="text-sm font-semibold text-white">Google Play</p>
              </div>
              <span className="text-[10px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full">Coming soon</span>
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CTA */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-[#080808] relative overflow-hidden">
        <motion.div className="absolute inset-0 bg-green-600/10 blur-3xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <div className="relative z-10 container mx-auto max-w-7xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">Ready to get started?</h2>
            <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto">Join thousands of Algerian freelancers accessing global financial services</p>
            <Button size="lg" className="bg-green-500 hover:bg-green-400 text-black font-semibold text-lg px-10 py-6 rounded-full" onClick={() => navigate("/signup")}>
              Create your account <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#080808] border-t border-white/5">
        <div className="container mx-auto max-w-3xl">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">Questions? We've got answers</h2>
          </motion.div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div key={i} className="border border-white/10 rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-white">{item.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0 ml-4" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <p className="px-6 pb-4 text-white/50 text-sm leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#080808] pt-12 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-6 h-6 text-green-400" />
                <span className="text-xl font-bold text-white">Dinar</span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed max-w-xs">Financial access for every Algerian. Pay globally, earn freely.</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Legal</p>
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <a key={l.label} href={l.href} className="text-white/30 hover:text-white text-sm transition-colors">{l.label}</a>
              ))}
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-4">Follow us</p>
              <div className="flex gap-3">
                {[{ label: "Twitter / X" }, { label: "Instagram" }, { label: "LinkedIn" }].map((s) => (
                  <motion.a key={s.label} href="#" whileHover={{ scale: 1.15 }} className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-white/20 text-xs">&copy; 2026 Dinar. Financial access for Algeria.</p>
            <p className="text-white/20 text-xs">Available in all 58 wilayas 🇩🇿</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
