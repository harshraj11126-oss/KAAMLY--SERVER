import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Phone,
  User as UserIcon,
  Check,
  CheckCheck,
  ArrowLeft,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { User, Message } from '../types';
import { KaamlyStore } from '../db/kaamlyStore';

interface MessagesScreenProps {
  currentUser: User | null;
  activeChatPartnerId?: string | null;
  activeChatPartnerName?: string | null;
  onRequireAuth: () => void;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({
  currentUser,
  activeChatPartnerId,
  activeChatPartnerName,
  onRequireAuth
}) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(activeChatPartnerId || null);
  const [selectedPartnerName, setSelectedPartnerName] = useState<string>(activeChatPartnerName || '');
  const [inputText, setInputText] = useState('');
  const [conversations, setConversations] = useState<{
    partnerId: string;
    partnerName: string;
    lastMessage: string;
    lastTimestamp: string;
    unreadCount: number;
  }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync partner props
  useEffect(() => {
    if (activeChatPartnerId) {
      setSelectedPartnerId(activeChatPartnerId);
      if (activeChatPartnerName) {
        setSelectedPartnerName(activeChatPartnerName);
      }
    }
  }, [activeChatPartnerId, activeChatPartnerName]);

  // Load conversations
  useEffect(() => {
    if (currentUser) {
      const rawConvos = KaamlyStore.getConversations(currentUser.id);
      const mapped = rawConvos.map((c) => {
        const partner = c.participantDetails?.find((p) => p.id !== currentUser.id) || {
          id: c.participantIds.find((id) => id !== currentUser.id) || '',
          name: 'Contact'
        };
        return {
          partnerId: partner.id,
          partnerName: partner.name,
          lastMessage: c.lastMessage,
          lastTimestamp: c.lastMessageTimestamp,
          unreadCount: c.unreadCount?.[currentUser.id] || 0
        };
      });
      setConversations(mapped);
      if (!selectedPartnerId && mapped.length > 0) {
        setSelectedPartnerId(mapped[0].partnerId);
        setSelectedPartnerName(mapped[0].partnerName);
      }
    }
  }, [currentUser, selectedPartnerId]);

  // Messages in active chat
  const activeMessages = (currentUser && selectedPartnerId)
    ? KaamlyStore.getChatHistory(currentUser.id, selectedPartnerId)
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Sign In to Chat</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Communicate directly with local workers and employers without sharing private details or paying platform charges.
        </p>
        <button
          onClick={onRequireAuth}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-md cursor-pointer"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedPartnerId) return;

    KaamlyStore.sendMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: selectedPartnerId,
      receiverName: selectedPartnerName || 'Contact',
      content: inputText.trim()
    });

    setInputText('');

    // Refresh conversation list
    const rawConvos = KaamlyStore.getConversations(currentUser.id);
    const mapped = rawConvos.map((c) => {
      const partner = c.participantDetails?.find((p) => p.id !== currentUser.id) || {
        id: c.participantIds.find((id) => id !== currentUser.id) || '',
        name: 'Contact'
      };
      return {
        partnerId: partner.id,
        partnerName: partner.name,
        lastMessage: c.lastMessage,
        lastTimestamp: c.lastMessageTimestamp,
        unreadCount: c.unreadCount?.[currentUser.id] || 0
      };
    });
    setConversations(mapped);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 pb-20 h-[calc(100vh-80px)] min-h-[500px] flex flex-col">
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex shadow-xl">
        {/* Left: Conversations List */}
        <div
          className={`w-full sm:w-80 md:w-96 border-r border-slate-800 flex flex-col bg-slate-950/60 ${
            selectedPartnerId ? 'hidden sm:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-white text-base">Direct Messages</h2>
            </div>
            <span className="text-xs text-slate-400">{conversations.length} chats</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-700 mx-auto" />
                <p>No active conversations yet.</p>
                <p className="text-[11px] text-slate-600">
                  Contact any worker or respond to a job proposal to start chatting.
                </p>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.partnerId}
                  onClick={() => {
                    setSelectedPartnerId(c.partnerId);
                    setSelectedPartnerName(c.partnerName);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                    selectedPartnerId === c.partnerId
                      ? 'bg-amber-500/15 border border-amber-500/30'
                      : 'hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {c.partnerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs truncate">{c.partnerName}</h4>
                      <span className="text-[10px] text-slate-500">
                        {new Date(c.lastTimestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center shrink-0">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <div
          className={`flex-1 flex flex-col bg-slate-900 ${
            !selectedPartnerId ? 'hidden sm:flex' : 'flex'
          }`}
        >
          {selectedPartnerId ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedPartnerId(null)}
                    className="sm:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm">
                    {selectedPartnerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{selectedPartnerName}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Active on KAAMLY</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="tel:+919876543210"
                    title="Direct Call"
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl transition-colors border border-slate-700"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-center text-xs text-slate-400 max-w-sm mx-auto flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct connection. Never pay advance without verifying work.</span>
                </div>

                {activeMessages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                          isMine
                            ? 'bg-amber-500 text-slate-950 font-medium rounded-br-xs shadow-md'
                            : 'bg-slate-800 text-white rounded-bl-xs border border-slate-700'
                        }`}
                      >
                        <p>{msg.content || msg.text}</p>
                        <div
                          className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                            isMine ? 'text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          <span>
                            {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {isMine && <CheckCheck className="w-3 h-3 text-slate-900" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${selectedPartnerName}...`}
                  className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-xl transition-all font-bold cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-700" />
              <h3 className="text-base font-bold text-slate-300">Select a Conversation</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Pick a chat from the left panel or contact a worker to negotiate rates directly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
