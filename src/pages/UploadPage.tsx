import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, Link, FileText, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../component/ui/Button';
import { Card } from '../component/ui/Card';

export function UploadPage() {
  const navigate = useNavigate();
  const [linkUrl, setLinkUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    setUploadComplete(true);
    
    // Auto-redirect after success
    setTimeout(() => {
      navigate('/chat');
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Data
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Upload files or connect your favorite platforms to get started
          </p>
        </motion.div>

        <Card className="p-8">
          {uploadComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <CheckCircle className="w-16 h-16 text-accent-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Upload Complete!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your data has been processed and is ready to search.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Redirecting to chat...
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Link Upload */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Link className="w-6 h-6 mr-2 text-primary-600" />
                  Paste a Link
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://docs.google.com/... or https://notion.so/..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Supported: Google Drive, Notion, Slack channels, and more
                  </div>
                </form>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 rounded-lg">
                    or
                  </span>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-secondary-600" />
                  Upload Files
                </h3>
                
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-white/30 dark:bg-gray-800/30"
                >
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      Drop files here or click to browse
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Supports PDF, DOCX files up to 10MB
                    </p>
                  </div>
                  
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileUpload}
                  />
                </motion.label>
              </div>

              {/* Upload Animation */}
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-primary-600/30 border-t-primary-600 rounded-full mx-auto mb-4"
                  />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Processing your data...
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    This may take a few moments
                  </p>
                </motion.div>
              )}

              {/* Action Button */}
              {!isUploading && (linkUrl || false) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={handleSubmit}
                    icon={MessageSquare}
                    size="lg"
                    disabled={!linkUrl}
                  >
                    Start Chatting
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </Card>

        {/* Quick Start Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Or try AURA with sample data
          </p>
          
          <Button
            variant="outline"
            onClick={() => navigate('/chat')}
            icon={ArrowRight}
          >
            Explore Demo
          </Button>
        </motion.div>
      </div>
    </div>
  );
}