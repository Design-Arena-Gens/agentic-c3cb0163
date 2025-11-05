import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KnowledgeEntry {
  id: string;
  content: string;
  tags: string[];
  source: string;
  timestamp: number;
  locked: boolean;
}

export interface Provider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'google' | 'mistral' | 'custom';
  apiKey: string;
  enabled: boolean;
  color: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  providerId: string;
  content: string;
  timestamp: number;
  role: 'user' | 'assistant';
}

interface AppState {
  providers: Provider[];
  knowledge: KnowledgeEntry[];
  chatHistory: ChatMessage[];
  selectedProvider: string | null;

  addProvider: (provider: Omit<Provider, 'id'>) => void;
  updateProvider: (id: string, updates: Partial<Provider>) => void;
  removeProvider: (id: string) => void;

  addKnowledge: (entry: Omit<KnowledgeEntry, 'id' | 'timestamp'>) => void;
  updateKnowledge: (id: string, updates: Partial<KnowledgeEntry>) => void;
  removeKnowledge: (id: string) => void;
  lockKnowledge: (id: string) => void;

  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;

  setSelectedProvider: (id: string | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      providers: [
        {
          id: '1',
          name: 'OpenAI GPT-4',
          type: 'openai',
          apiKey: '',
          enabled: false,
          color: '#10A37F',
          icon: '🤖'
        },
        {
          id: '2',
          name: 'Claude (Anthropic)',
          type: 'anthropic',
          apiKey: '',
          enabled: false,
          color: '#D97706',
          icon: '🧠'
        },
        {
          id: '3',
          name: 'Google Gemini',
          type: 'google',
          apiKey: '',
          enabled: false,
          color: '#4285F4',
          icon: '✨'
        },
        {
          id: '4',
          name: 'Mistral AI',
          type: 'mistral',
          apiKey: '',
          enabled: false,
          color: '#FF6B35',
          icon: '🌊'
        }
      ],
      knowledge: [],
      chatHistory: [],
      selectedProvider: null,

      addProvider: (provider) =>
        set((state) => ({
          providers: [
            ...state.providers,
            { ...provider, id: Date.now().toString() }
          ]
        })),

      updateProvider: (id, updates) =>
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          )
        })),

      removeProvider: (id) =>
        set((state) => ({
          providers: state.providers.filter((p) => p.id !== id)
        })),

      addKnowledge: (entry) =>
        set((state) => ({
          knowledge: [
            ...state.knowledge,
            {
              ...entry,
              id: Date.now().toString(),
              timestamp: Date.now()
            }
          ]
        })),

      updateKnowledge: (id, updates) =>
        set((state) => ({
          knowledge: state.knowledge.map((k) =>
            k.id === id ? { ...k, ...updates } : k
          )
        })),

      removeKnowledge: (id) =>
        set((state) => ({
          knowledge: state.knowledge.filter((k) => k.id !== id)
        })),

      lockKnowledge: (id) =>
        set((state) => ({
          knowledge: state.knowledge.map((k) =>
            k.id === id ? { ...k, locked: !k.locked } : k
          )
        })),

      addMessage: (message) =>
        set((state) => ({
          chatHistory: [
            ...state.chatHistory,
            {
              ...message,
              id: Date.now().toString(),
              timestamp: Date.now()
            }
          ]
        })),

      clearHistory: () => set({ chatHistory: [] }),

      setSelectedProvider: (id) => set({ selectedProvider: id })
    }),
    {
      name: 'ai-control-center-storage'
    }
  )
);
