'use client';

import { motion } from 'framer-motion';
import { Power, Settings, Zap } from 'lucide-react';
import { Provider } from '@/lib/store';

interface ProviderCardProps {
  provider: Provider;
  onToggle: () => void;
  onClick: () => void;
  isSelected: boolean;
}

export default function ProviderCard({ provider, onToggle, onClick, isSelected }: ProviderCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-purple-500 animate-glow' : ''
      } ${provider.enabled ? 'glass' : 'bg-gray-900/50'}`}
      style={{
        borderColor: provider.enabled ? `${provider.color}40` : 'rgba(255,255,255,0.1)'
      }}
      onClick={onClick}
    >
      <div className="absolute top-4 right-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`p-2 rounded-full transition-colors ${
            provider.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-500'
          }`}
        >
          <Power size={16} />
        </motion.button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div
          className="text-4xl w-16 h-16 flex items-center justify-center rounded-xl"
          style={{ backgroundColor: `${provider.color}20` }}
        >
          {provider.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{provider.name}</h3>
          <p className="text-sm text-gray-400 capitalize">{provider.type}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {provider.enabled ? (
          <>
            <Zap size={14} className="text-green-400" />
            <span className="text-green-400">Active</span>
          </>
        ) : (
          <>
            <Settings size={14} className="text-gray-500" />
            <span className="text-gray-500">Configure to activate</span>
          </>
        )}
      </div>

      {provider.enabled && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
          style={{ backgroundColor: provider.color }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
