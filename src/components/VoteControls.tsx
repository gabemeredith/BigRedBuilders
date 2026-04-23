"use client";

import { VoteResult } from "@/types";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Equal, SkipForward } from "lucide-react";

interface VoteControlsProps {
  onVote: (result: VoteResult) => void;
  disabled: boolean;
}

const controls: {
  result: VoteResult;
  label: string;
  icon: React.ReactNode;
  variant: "default" | "outline" | "secondary" | "ghost";
}[] = [
  {
    result: "left",
    label: "Left wins",
    icon: <ArrowLeft className="size-4" />,
    variant: "default",
  },
  {
    result: "equal",
    label: "Equal",
    icon: <Equal className="size-4" />,
    variant: "secondary",
  },
  {
    result: "right",
    label: "Right wins",
    icon: <ArrowRight className="size-4" />,
    variant: "default",
  },
  {
    result: "skip",
    label: "Skip",
    icon: <SkipForward className="size-4" />,
    variant: "ghost",
  },
];

export function VoteControls({ onVote, disabled }: VoteControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="flex flex-wrap items-center justify-center gap-3"
    >
      {controls.map((ctrl) => (
        <Button
          key={ctrl.result}
          variant={ctrl.variant}
          size="lg"
          disabled={disabled}
          onClick={() => onVote(ctrl.result)}
          className="gap-2"
        >
          {ctrl.icon}
          {ctrl.label}
        </Button>
      ))}
    </motion.div>
  );
}
