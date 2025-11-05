'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Trash2, Tag, Clock } from 'lucide-react';
import { KnowledgeEntry, useStore } from '@/lib/store';

export default function KnowledgePanel() {
  const { knowledge, lockKnowledge, removeKnowledge } = useStore();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="glass rounded-2xl p-6 h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
          <p className="text-sm text-gray-400 mt-1">
            {knowledge.filter(k => k.locked).length} locked · {knowledge.length} total
          </p>
        </div>
        <div className="flex items-center gap-2 text-purple-400">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <Lock size={20} />
          </motion.div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3">
        <AnimatePresence>
          {knowledge.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-500"
            >
              <Lock size={48} className="mx-auto mb-4 opacity-20" />
              <p>No knowledge entries yet</p>
              <p className="text-sm mt-2">Lock insights from your chats to save them here</p>
            </motion.div>
          ) : (
            knowledge.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl transition-all ${
                  entry.locked
                    ? 'bg-purple-500/10 border border-purple-500/30'
                    : 'bg-gray-800/30 border border-gray-700/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-white mb-2">{entry.content}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatTime(entry.timestamp)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag size={12} />
                        {entry.source}
                      </span>
                    </div>

                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {entry.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => lockKnowledge(entry.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        entry.locked
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-gray-700/50 text-gray-400'
                      }`}
                    >
                      {entry.locked ? <Lock size={14} /> : <Unlock size={14} />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeKnowledge(entry.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
