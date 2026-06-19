import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Props {
  text: string;
  label?: string;
  size?: "sm" | "default";
  className?: string;
  iconOnly?: boolean;
}

export function CopyButton({ text, label = "Copied!", size = "sm", className = "", iconOnly = false }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    toast.success(label);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size={size} className={`relative overflow-hidden ${className}`} onClick={handleCopy}>
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div key="check"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-green-500">
            <Check className="w-4 h-4" />
            {!iconOnly && <span className="text-xs font-medium">Copied!</span>}
          </motion.div>
        ) : (
          <motion.div key="copy"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5">
            <Copy className="w-4 h-4" />
            {!iconOnly && <span className="text-xs">Copy</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
