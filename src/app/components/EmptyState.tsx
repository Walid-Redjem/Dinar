import { ReactNode } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  size?: "sm" | "md";
}

export function EmptyState({ icon, title, description, action, size = "md" }: Props) {
  const padding = size === "sm" ? "py-8" : "py-12";
  const iconSize = size === "sm" ? "w-12 h-12" : "w-16 h-16";
  const iconInner = size === "sm" ? "w-5 h-5" : "w-7 h-7";

  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center ${padding} px-4`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Icon container with subtle glow ring */}
      <div className="relative mb-5">
        <div className={`${iconSize} rounded-2xl bg-surface border-2 border-dashed border-app flex items-center justify-center text-app-faint`}>
          <span className={iconInner}>{icon}</span>
        </div>
        {/* Soft glow */}
        <div className={`absolute inset-0 ${iconSize} rounded-2xl bg-green-500/5 blur-xl`} />
      </div>

      <p className={`font-semibold text-app mb-1 ${size === "sm" ? "text-sm" : "text-base"}`}>{title}</p>
      <p className={`text-app-muted max-w-xs ${size === "sm" ? "text-xs" : "text-sm"}`}>{description}</p>

      {action && (
        <motion.div className="mt-5" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            size="sm"
            className="bg-green-500 hover:bg-green-400 text-black font-semibold"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
