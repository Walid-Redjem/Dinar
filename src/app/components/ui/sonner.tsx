"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme = "dark" } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      position="bottom-right"
      expand
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "!rounded-xl !border !shadow-lg !text-sm !font-medium",
          title: "!font-semibold",
          description: "!text-xs !opacity-80",
          actionButton: "!rounded-lg !text-xs !font-semibold",
          closeButton: "!rounded-lg",
          success: "!border-green-500/30",
          error: "!border-red-500/30",
          info: "!border-blue-500/30",
          warning: "!border-amber-500/30",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
