import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function Card({ children, className = '', animate = true }: CardProps) {
  const cardContent = (
    <div className={`
      bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg 
      border border-white/20 dark:border-gray-700/20 
      rounded-2xl shadow-xl 
      ${className}
    `}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className="transition-all duration-300"
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}