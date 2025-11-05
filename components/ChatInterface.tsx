'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lock, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { selectedProvider, providers, addMessage, addKnowledge, knowledge } = useStore();

  const provider = providers.find(p => p.id === selectedProvider);

  const handleSend = async () => {
    if (!input.trim() || !provider || !provider.enabled) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    addMessage({
      providerId: provider.id,
      content: userMessage,
      role: 'user'
    });

    // Simulate AI response with knowledge context
    setTimeout(() => {
      const relevantKnowledge = knowledge
        .filter(k => k.locked)
        .slice(-3)
        .map(k => k.content)
        .join('\n');

      const contextNote = relevantKnowledge
        ? `\n\n[Using locked knowledge from previous conversations]`
        : '';

      const response = `I'm ${provider.name}. I received your message: "${userMessage}"${contextNote}

This is a demo response. In a production environment, this would connect to the actual ${provider.type} API using your configured API key and include context from your locked knowledge base.`;

      addMessage({
        providerId: provider.id,
        content: response,
        role: 'assistant'
      });

      setIsLoading(false);
    }, 1500);
  };

  const handleLockMessage = (content: string) => {
    addKnowledge({
      content,
      tags: ['chat', provider?.type || 'unknown'],
      source: provider?.name || 'Unknown',
      locked: true
    });
  };

  const { chatHistory } = useStore();
  const providerMessages = chatHistory.filter(m => m.providerId === selectedProvider);

  if (!provider) {
    return (
      <div className="glass rounded-2xl p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Bot size={64} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">Select a provider to start chatting</p>
        </div>
      </div>
    );
  }

  if (!provider.enabled) {
    return (
      <div className="glass rounded-2xl p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Sparkles size={64} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">Configure and enable {provider.name} to start</p>
          <p className="text-sm mt-2">Add your API key in the provider settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="text-2xl w-12 h-12 flex items-center justify-center rounded-xl"
            style={{ backgroundColor: `${provider.color}20` }}
          >
            {provider.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{provider.name}</h2>
            <p className="text-sm text-gray-400">
              {knowledge.filter(k => k.locked).length} knowledge entries available
            </p>
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-3 h-3 rounded-full bg-green-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 mb-4">
        <AnimatePresence>
          {providerMessages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500"
            >
              <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
              <p>Start a conversation with {provider.name}</p>
              <p className="text-sm mt-2">Your locked knowledge will be available across all providers</p>
            </motion.div>
          ) : (
            providerMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${provider.color}40` }}
                  >
                    <Bot size={16} style={{ color: provider.color }} />
                  </div>
                )}

                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-purple-600/80 text-white'
                      : 'bg-gray-800/60 text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {message.role === 'assistant' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLockMessage(message.content)}
                      className="mt-3 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs flex items-center gap-2 transition-colors"
                    >
                      <Lock size={12} />
                      Lock to Knowledge Base
                    </motion.button>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <User size={16} />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${provider.color}40` }}
            >
              <Bot size={16} style={{ color: provider.color }} />
            </div>
            <div className="bg-gray-800/60 p-4 rounded-2xl">
              <Loader2 className="animate-spin text-gray-400" size={20} />
            </div>
          </motion.div>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="w-full bg-gray-800/60 text-white px-6 py-4 pr-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          disabled={isLoading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  );
}
