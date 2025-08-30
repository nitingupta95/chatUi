import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, X, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Conversation } from '../../types/index';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  isOpen,
  onClose,
}: SidebarProps) {
  // Use a fallback for conversations prop to prevent errors
  const conversationsList = conversations ?? [];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Mobile vs. Desktop */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="
          fixed lg:static 
          left-0 top-0 h-full w-80 
          bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg 
          border-r border-white/20 dark:border-gray-700/20 
          z-50 
          flex flex-col 
          lg:flex
          "
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-gray-700/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              AURA
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* New Conversation */}
        <div className="p-4">
          <Button
            onClick={onNewConversation}
            icon={Plus}
            className="w-full"
          >
            New Conversation
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversationsList.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No conversations yet. Start your first chat!
              </p>
            </div>
          ) : (
            conversationsList.map((conversation) => (
              <motion.div
                key={conversation.id}
                whileHover={{ x: 4 }}
                className={`
                  group relative p-4 rounded-xl cursor-pointer transition-all
                  ${currentConversationId === conversation.id
                      ? 'bg-primary-600/20 border border-primary-600/30'
                      : 'hover:bg-white/10 dark:hover:bg-gray-800/10'
                  }
                `}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {conversation.title}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {conversation.messages.length} messages
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.aside>
    </>
  );
}