'use client';

import { motion } from 'framer-motion';
import { Database, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function DataFlowVisualization() {
  const { providers, knowledge } = useStore();
  const activeProviders = providers.filter(p => p.enabled);
  const lockedKnowledge = knowledge.filter(k => k.locked).length;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Data Flow</h3>
        <div className="text-sm text-gray-400">
          {activeProviders.length} active · {lockedKnowledge} locked
        </div>
      </div>

      <div className="relative flex items-center justify-center gap-8">
        {/* Left side - Active Providers */}
        <div className="flex flex-col gap-3">
          {activeProviders.length > 0 ? (
            activeProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ backgroundColor: `${provider.color}20` }}
              >
                <span className="text-xl">{provider.icon}</span>
                <span className="text-sm font-medium text-white">
                  {provider.name.split(' ')[0]}
                </span>
              </motion.div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">No active providers</div>
          )}
        </div>

        {/* Center - Flow Animation */}
        <div className="flex flex-col items-center gap-4">
          {activeProviders.length > 0 && (
            <>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="text-purple-400" size={24} />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-purple-400"
              />
              <motion.div
                animate={{ x: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="text-purple-400 rotate-180" size={24} />
              </motion.div>
            </>
          )}
        </div>

        {/* Right side - Knowledge Base */}
        <motion.div
          animate={{ scale: lockedKnowledge > 0 ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 3, repeat: Infinity }}
          className="glass px-6 py-4 rounded-xl border-2 border-purple-500/30"
        >
          <div className="flex flex-col items-center gap-2">
            <Database className="text-purple-400" size={32} />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{lockedKnowledge}</div>
              <div className="text-xs text-gray-400">Knowledge Entries</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
        <p className="text-sm text-purple-200 text-center">
          Knowledge locked from any provider is instantly available to all others
        </p>
      </div>
    </div>
  );
}
