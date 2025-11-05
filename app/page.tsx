'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Database } from 'lucide-react';
import { useStore } from '@/lib/store';
import ProviderCard from '@/components/ProviderCard';
import ProviderConfig from '@/components/ProviderConfig';
import KnowledgePanel from '@/components/KnowledgePanel';
import ChatInterface from '@/components/ChatInterface';
import DataFlowVisualization from '@/components/DataFlowVisualization';

export default function Home() {
  const { providers, selectedProvider, setSelectedProvider, updateProvider } = useStore();
  const [configProvider, setConfigProvider] = useState<string | null>(null);

  const provider = configProvider ? providers.find(p => p.id === configProvider) : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 p-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center"
              >
                <Brain size={32} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">
                  AI Control Center
                </h1>
                <p className="text-gray-400 flex items-center gap-2">
                  <Sparkles size={16} />
                  Unified Knowledge Base for All Your AI Agents
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 glass px-6 py-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-green-400"
                />
                <span className="text-sm text-gray-300">
                  {providers.filter(p => p.enabled).length} Active
                </span>
              </div>
              <div className="w-px h-6 bg-gray-700" />
              <div className="flex items-center gap-2">
                <Database size={16} className="text-purple-400" />
                <span className="text-sm text-gray-300">
                  {useStore.getState().knowledge.filter(k => k.locked).length} Locked
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Providers */}
          <div className="col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">AI Providers</h2>
              <div className="space-y-3">
                {providers.map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProviderCard
                      provider={provider}
                      onToggle={() => {
                        if (!provider.enabled && !provider.apiKey) {
                          setConfigProvider(provider.id);
                        } else {
                          updateProvider(provider.id, { enabled: !provider.enabled });
                        }
                      }}
                      onClick={() => setConfigProvider(provider.id)}
                      isSelected={selectedProvider === provider.id}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DataFlowVisualization />
            </motion.div>
          </div>

          {/* Center Column - Chat */}
          <div className="col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="h-[calc(100vh-200px)]"
            >
              <ChatInterface />
            </motion.div>
          </div>

          {/* Right Column - Knowledge Base */}
          <div className="col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="h-[calc(100vh-200px)]"
            >
              <KnowledgePanel />
            </motion.div>
          </div>
        </div>

        {/* Provider Configuration Modal */}
        {provider && (
          <ProviderConfig
            provider={provider}
            onClose={() => {
              setConfigProvider(null);
              if (provider.enabled) {
                setSelectedProvider(provider.id);
              }
            }}
          />
        )}
      </div>
    </main>
  );
}
