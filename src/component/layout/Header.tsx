import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 dark:bg-gray-900/10 border-b border-white/20 dark:border-gray-700/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              AURA
            </span>
          </motion.div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            icon={theme === 'light' ? Moon : Sun}
            className="rounded-full"
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}