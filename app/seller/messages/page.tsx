'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Mail, MailOpen, Trash2, Send as SendIcon, Package } from 'lucide-react';
import Link from 'next/link';

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    email: string;
  };
  productId?: {
    _id: string;
    title: string;
    slug: string;
  };
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function SellerMessagesPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user, activeTab]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = activeTab === 'inbox' ? 'inbox' : 'sent';
      
      const response = await fetch(`http://localhost:5000/api/messages/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        if (activeTab === 'inbox') {
          setMessages(data.data.messages || []);
          setUnreadCount(data.data.unreadCount || 0);
        } else {
          setMessages(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state
      setMessages(messages.map(msg =>
        msg._id === messageId ? { ...msg, isRead: true } : msg
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg._id !== messageId));
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (activeTab === 'inbox' && !message.isRead) {
      markAsRead(message._id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="mt-2 text-gray-600">
          Communicate with your customers
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {unreadCount} unread
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('inbox');
                  setSelectedMessage(null);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'inbox'
                    ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Inbox
              </button>
              <button
                onClick={() => {
                  setActiveTab('sent');
                  setSelectedMessage(null);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'sent'
                    ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <SendIcon className="w-4 h-4 inline mr-2" />
                Sent
              </button>
            </div>

            {/* Messages */}
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map((message) => (
                  <button
                    key={message._id}
                    onClick={() => handleMessageClick(message)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedMessage?._id === message._id ? 'bg-green-50' : ''
                    } ${!message.isRead && activeTab === 'inbox' ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {!message.isRead && activeTab === 'inbox' && (
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        )}
                        <p className="font-semibold text-gray-900 truncate">
                          {activeTab === 'inbox' ? message.senderId.name : 'To: Customer'}
                        </p>
                      </div>
                      {!message.isRead && activeTab === 'inbox' ? (
                        <Mail className="w-4 h-4 text-green-600" />
                      ) : (
                        <MailOpen className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-700 truncate mb-1">
                      {message.subject}
                    </p>
                    {message.productId && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <Package className="w-3 h-3" />
                        <span className="truncate">{message.productId.title}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[400px]">
            {selectedMessage ? (
              <div>
                <div className="flex items-start justify-between mb-6 pb-6 border-b">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        <strong>From:</strong> {selectedMessage.senderId.name}
                      </span>
                      <span>
                        <strong>Email:</strong> {selectedMessage.senderId.email}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMessage(selectedMessage._id)}
                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {selectedMessage.productId && (
                  <Link
                    href={`/products/${selectedMessage.productId.slug}`}
                    className="block mb-6 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Product:</span>
                      <span className="text-green-600 hover:underline">
                        {selectedMessage.productId.title}
                      </span>
                    </div>
                  </Link>
                )}

                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <div>
                  <Mail className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">Select a message to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
