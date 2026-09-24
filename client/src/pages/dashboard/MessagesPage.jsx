import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { messageService, connectionService, userService } from '../../services/api';
import {
  MessageSquare,
  Send,
  Search,
  User,
  GraduationCap,
  Sparkles,
  Phone,
  Video,
  Clock,
  CheckCheck,
} from 'lucide-react';
import MessageBubble from '../../components/cards/MessageBubble';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const MessagesPage = () => {
  const { user: currentUser } = useAuth();
  const { success, error: toastError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const targetUserIdFromQuery = searchParams.get('user');

  const [conversations, setConversations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  // Initial load: Fetch conversations and connections
  useEffect(() => {
    loadInbox();
  }, []);

  // Handle auto-selection when URL has ?user=
  useEffect(() => {
    if (targetUserIdFromQuery) {
      selectUserById(targetUserIdFromQuery);
    }
  }, [targetUserIdFromQuery]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Periodic polling for active conversation (every 4s)
  useEffect(() => {
    if (!selectedUser) return;
    const interval = setInterval(() => {
      fetchMessagesForUser(selectedUser._id, false);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  const loadInbox = async () => {
    setLoading(true);
    try {
      const [convosRes, connsRes] = await Promise.allSettled([
        messageService.getConversations(),
        connectionService.getConnections(),
      ]);

      if (convosRes.status === 'fulfilled' && convosRes.value.data.success) {
        setConversations(convosRes.value.data.conversations || []);
      }
      if (connsRes.status === 'fulfilled' && connsRes.value.data.success) {
        setConnections(connsRes.value.data.connections || []);
      }

      // If no query param and conversations exist, select the first one
      if (!targetUserIdFromQuery && convosRes.status === 'fulfilled' && convosRes.value.data.conversations?.length > 0) {
        const firstConvo = convosRes.value.data.conversations[0];
        setSelectedUser(firstConvo.partner);
        fetchMessagesForUser(firstConvo.partner._id, true);
      }
    } catch (err) {
      console.error('Failed to load inbox:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectUserById = async (userId) => {
    try {
      const res = await userService.getUserById(userId);
      if (res.data.success) {
        setSelectedUser(res.data.user);
        fetchMessagesForUser(userId, true);
      }
    } catch (err) {
      console.error('Failed to select user:', err);
    }
  };

  const fetchMessagesForUser = async (userId, shouldSetLoading = false) => {
    try {
      const res = await messageService.getMessagesWithUser(userId);
      if (res.data.success) {
        setMessages(res.data.messages || []);
        if (res.data.partner) {
          setSelectedUser(res.data.partner);
        }
      }
    } catch (err) {
      console.error('Failed to load messages for user:', err);
    }
  };

  const handleSelectConversation = (partner) => {
    setSelectedUser(partner);
    setSearchParams({ user: partner._id });
    fetchMessagesForUser(partner._id, true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedUser) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    try {
      const res = await messageService.sendMessage(selectedUser._id, messageText);
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        // Refresh conversations list to update last message
        const convosRes = await messageService.getConversations();
        if (convosRes.data.success) {
          setConversations(convosRes.data.conversations);
        }
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your direct messages..." size="lg" />;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[500px]">
      {/* Left Sidebar: Conversations & Connections */}
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50 flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <span>Messages & Chats</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Direct peer communications</p>
        </div>

        {/* Scrollable chat list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 && connections.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No conversations yet. Connect with matches to chat!
            </div>
          ) : (
            <>
              {/* Active Conversations */}
              {conversations.map((convo) => {
                const isSelected = selectedUser?._id === convo.partner._id;
                return (
                  <div
                    key={convo.partner._id}
                    onClick={() => handleSelectConversation(convo.partner)}
                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white shadow-sm border border-slate-200/80 ring-1 ring-brand-500/20'
                        : 'hover:bg-slate-100/70 border border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                      {convo.partner.profileImage ? (
                        <img
                          src={convo.partner.profileImage}
                          alt={convo.partner.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{convo.partner.name?.charAt(0)}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {convo.partner.name}
                        </h4>
                        {convo.unreadCount > 0 && (
                          <span className="text-[10px] font-extrabold bg-brand-600 text-white px-1.5 py-0.2 rounded-full">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {convo.lastMessage.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Other Connections who haven't messaged yet */}
              {connections.length > 0 && (
                <div className="pt-3 px-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Other Connected Peers
                  </span>
                  {connections
                    .filter((c) => !conversations.some((cv) => cv.partner._id === c.partner._id))
                    .map((c) => {
                      const isSelected = selectedUser?._id === c.partner._id;
                      return (
                        <div
                          key={c.partner._id}
                          onClick={() => handleSelectConversation(c.partner)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-white shadow-xs border border-slate-200'
                              : 'hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {c.partner.name?.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {c.partner.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">Start conversation</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/20">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center overflow-hidden ring-2 ring-brand-50">
                  {selectedUser.profileImage ? (
                    <img
                      src={selectedUser.profileImage}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{selectedUser.name?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedUser.name}</h4>
                  <p className="text-xs text-slate-400">{selectedUser.college || 'Peer Student'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/users/${selectedUser._id}`}
                  className="text-xs font-semibold text-brand-600 hover:underline px-2 py-1"
                >
                  View Profile
                </a>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No messages yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Say hello to {selectedUser.name} and propose a skill topic to learn together!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isCurrent =
                    msg.sender?._id === currentUser?._id || msg.sender === currentUser?._id;
                  return (
                    <MessageBubble
                      key={msg._id}
                      message={msg}
                      isCurrentUser={isCurrent}
                    />
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Type a message to ${selectedUser.name}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-100 outline-none"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Send}
                disabled={!inputMessage.trim()}
                isLoading={sending}
                className="px-5 font-bold"
              >
                Send
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
            <h4 className="text-base font-bold text-slate-700">Select a peer to start messaging</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Pick an existing conversation from the left or connect with a peer from the smart matching tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
