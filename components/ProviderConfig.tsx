'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Save, AlertCircle } from 'lucide-react';
import { Provider, useStore } from '@/lib/store';

interface ProviderConfigProps {
  provider: Provider;
  onClose: () => void;
}

export default function ProviderConfig({ provider, onClose }: ProviderConfigProps) {
  const [apiKey, setApiKey] = useState(provider.apiKey);
  const [showKey, setShowKey] = useState(false);
  const { updateProvider } = useStore();

  const handleSave = () => {
    updateProvider(provider.id, {
      apiKey,
      enabled: apiKey.length > 0
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-2xl p-8 max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="text-3xl w-14 h-14 flex items-center justify-center rounded-xl"
                style={{ backgroundColor: `${provider.color}20` }}
              >
                {provider.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{provider.name}</h2>
                <p className="text-sm text-gray-400">Configure API Access</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
            >
              <X size={20} />
            </motion.button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex gap-3">
              <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-semibold mb-1">Demo Mode Active</p>
                <p className="text-blue-200/80">
                  This is a demonstration. API keys are stored locally in your browser and
                  not used for actual API calls. In production, implement secure key storage
                  and real API integration.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Key size={16} className="inline mr-2" />
                API Key
              </label>
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${provider.name} API key`}
                className="w-full bg-gray-800/60 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="text-sm text-purple-400 hover:text-purple-300 mt-2 transition-colors"
              >
                {showKey ? 'Hide' : 'Show'} API Key
              </button>
            </div>

            <div className="pt-4 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Save size={18} />
                Save Configuration
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-gray-800/60 hover:bg-gray-800 text-gray-300 font-semibold transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
