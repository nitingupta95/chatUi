import React, { useState, useRef, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { FiSend, FiUser, FiCpu } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Source {
  id: string;
  url: string;
  title: string;
  snippet: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

const LoadingSpinner: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="flex justify-start"
  >
    <div className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-xs">
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
        <FiCpu className="w-4 h-4 text-white" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex space-x-1">
          <motion.div
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Thinking...</span>
      </div>
    </div>
  </motion.div>
);

const SourceComponent: React.FC<{ source: Source }> = ({ source }) => (
  <motion.a
    whileHover={{ scale: 1.02, y: -2 }}
    href={source.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border border-blue-200 dark:border-gray-600 rounded-xl transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-gray-500"
  >
    <div className="flex items-center space-x-3 mb-2">
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
        {source.title}
      </span>
    </div>
    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
      {source.snippet}
    </p>
  </motion.a>
);

const MessageAvatar: React.FC<{ role: 'user' | 'assistant' }> = ({ role }) => (
  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
    role === 'user' 
      ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
      : 'bg-gradient-to-br from-blue-500 to-purple-600'
  }`}>
    {role === 'user' ? (
      <FiUser className="w-4 h-4 text-white" />
    ) : (
      <FiCpu className="w-4 h-4 text-white" />
    )}
  </div>
);

class MarkdownErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error('Error rendering Markdown:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <span>⚠️</span>
          <span>Error displaying message</span>
        </div>
      );
    }
    return this.props.children;
  }
}

const EmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center justify-center h-full text-center px-8"
  >
    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
      <FiCpu className="w-10 h-10 text-white" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
      Welcome to AURA
    </h2>
    <p className="text-gray-600 dark:text-gray-400 max-w-md leading-relaxed mb-6">
      Start a conversation by typing your question below. I'm here to help with anything you need!
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg w-full">
      {[
        "What are the latest updates from our Slack channels?",
        "Find documents about project requirements",
        "Show me meeting notes from last week",
        "What's in my Google Drive folders?"
      ].map((suggestion, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
        >
          {suggestion}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSendMessage,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    
    const message = userInput.trim();
    setUserInput('');
    await onSendMessage(message);
    
    // Focus back to input after sending
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <MessageAvatar role={msg.role} />
                  
                  <div className={`flex-1 ${msg.role === 'user' ? 'max-w-2xl' : 'max-w-3xl'}`}>
                    <div
                      className={`p-6 rounded-2xl shadow-sm border transition-all duration-200 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-200'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:shadow-md'
                      }`}
                    >
                      <MarkdownErrorBoundary>
                        <div className={`prose prose-sm max-w-none ${
                          msg.role === 'user' 
                            ? 'prose-invert' 
                            : 'dark:prose-invert'
                        }`}>
                          <MDEditor.Markdown
                            source={msg.content || '*No content provided*'}
                            style={{ backgroundColor: 'transparent' }}
                          />
                        </div>
                      </MarkdownErrorBoundary>

                      {msg.sources?.length ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                              Sources ({msg.sources.length})
                            </p>
                          </div>
                          <div className="grid gap-3">
                            {msg.sources.map((source, sourceIndex) => (
                              <motion.div
                                key={source.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: sourceIndex * 0.05 }}
                              >
                                <SourceComponent source={source} />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && <LoadingSpinner />}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="max-w-4xl mx-auto p-6">
          <form onSubmit={handleFormSubmit} className="relative">
            <div className="relative flex items-end gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-6 py-4 pr-14 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm resize-none"
                  placeholder="Type your message here... (Press Enter to send)"
                  disabled={isLoading}
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      userInput.trim() && !isLoading
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={isLoading || !userInput.trim()}
                  >
                    <FiSend className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Character count and hints */}
            <div className="flex items-center justify-between mt-3 px-2">
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Press Enter to send • Shift+Enter for new line</span>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {userInput.length > 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={userInput.length > 1000 ? 'text-orange-500' : ''}
                  >
                    {userInput.length}/2000
                  </motion.span>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};