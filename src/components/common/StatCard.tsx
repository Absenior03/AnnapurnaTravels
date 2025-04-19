"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`bg-white p-6 rounded-lg shadow-md text-center ${className}`}
    >
      <div className="flex justify-center mb-4 text-emerald-600">{icon}</div>
      <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-2">
        {value}
      </div>
      <div className="text-gray-600 text-sm">{label}</div>
    </motion.div>
  );
};

export default StatCard;
