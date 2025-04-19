"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiMapPin, FiAward, FiStar } from "react-icons/fi";

interface StatProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  delay?: number;
}

const StatItem: React.FC<StatProps> = ({ value, label, icon, delay = 0 }) => {
  return (
    <motion.div
      className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="mb-4 text-emerald-500 text-4xl">{icon}</div>
      <div className="text-3xl md:text-4xl font-bold text-white mb-2">
        {value}
      </div>
      <div className="text-gray-300 text-sm md:text-base">{label}</div>
    </motion.div>
  );
};

const StatCounter: React.FC = () => {
  const stats = [
    {
      id: 1,
      value: "5000+",
      label: "Happy Travelers",
      icon: <FiUsers />,
      delay: 0.1,
    },
    {
      id: 2,
      value: "25+",
      label: "Destinations",
      icon: <FiMapPin />,
      delay: 0.2,
    },
    {
      id: 3,
      value: "10+",
      label: "Years Experience",
      icon: <FiAward />,
      delay: 0.3,
    },
    {
      id: 4,
      value: "4.9/5",
      label: "Traveler Rating",
      icon: <FiStar />,
      delay: 0.4,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
      {stats.map((stat) => (
        <StatItem
          key={stat.id}
          value={stat.value}
          label={stat.label}
          icon={stat.icon}
          delay={stat.delay}
        />
      ))}
    </div>
  );
};

export default StatCounter;
