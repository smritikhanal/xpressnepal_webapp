'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Mail, Send as SendIcon, Package, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    email: string;
    shopName?: string;
  } | null;
  receiverId?: {
    _id: string;
    name: string;
    email: string;
    shopName?: string;
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
  isSent?: boolean; // Flag to identify sent messages
}

interface Conversation {
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Redirect sellers to their messages page
    if (user?.role === 'seller') {
      router.push('/seller/messages');
      return;
    }

    fetchAllMessages();
  }, [isAuthenticated, user, router]);

  const fetchAllMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch both inbox and sent messages
      const [inboxRes, sentRes] = await Promise.all([
        fetch('http://localhost:5000/api/messages/inbox', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/messages/sent', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const inboxData = await inboxRes.json();
      const sentData = await sentRes.json();

      if (inboxData.success && sentData.success) {
        const inboxMessages: Message[] = (inboxData.data.messages || []).map((msg: Message) => ({
          ...msg,
          isSent: false,
        }));
        
        const sentMessages: Message[] = (sentData.data || []).map((msg: Message) => ({
          ...msg,
          isSent: true,
        }));

        // Combine and group messages by conversation
        const allMessages = [...inboxMessages, ...sentMessages];
        const conversationMap = new Map<string, Conversation>();

        allMessages.forEach((msg) => {
          // Determine the other user (not the current customer)
          const otherUserId = msg.isSent 
            ? msg.receiverId?._id || ''
            : msg.senderId?._id || '';
          const otherUserName = msg.isSent
            ? msg.receiverId?.shopName || msg.receiverId?.name || 'Seller'
            : msg.senderId?.shopName || msg.senderId?.name || 'Seller';
          const otherUserEmail = msg.isSent
            ? msg.receiverId?.email || ''
            : msg.senderId?.email || '';

          if (!otherUserId) return;

          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              userId: otherUserId,
              userName: otherUserName,
              userEmail: otherUserEmail,
              lastMessage: msg.message,
              lastMessageTime: msg.createdAt,
              unreadCount: 0,
              messages: [],
            });
          }

          const conversation = conversationMap.get(otherUserId)!;
          conversation.messages.push(msg);
          
          // Update unread count
          if (!msg.isSent && !msg.isRead) {
            conversation.unreadCount++;
          }

          // Update last message if this message is newer
          if (new Date(msg.createdAt) > new Date(conversation.lastMessageTime)) {
            conversation.lastMessage = msg.message;
            conversation.lastMessageTime = msg.createdAt;
          }
        });

        // Sort conversations by last message time
        const conversationList = Array.from(conversationMap.values()).sort(
          (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );

        // Sort messages within each conversation by time
        conversationList.forEach((conv) => {
          conv.messages.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });

        setConversations(conversationList);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageIds: string[]) => {
    try {
      const token = localStorage.getItem('token');
      await Promise.all(
        messageIds.map((id) =>
          fetch(`http://localhost:5000/api/messages/${id}/read`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setReplyText('');

    // Mark unread messages as read
    const unreadMessageIds = conversation.messages
      .filter((msg) => !msg.isSent && !msg.isRead)
      .map((msg) => msg._id);

    if (unreadMessageIds.length > 0) {
      markAsRead(unreadMessageIds);
      
      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.userId === conversation.userId
            ? {
                ...conv,
                unreadCount: 0,
                messages: conv.messages.map((msg) => ({ ...msg, isRead: true })),
              }
            : conv
        )
      );
    }
  };

  const sendReply = async () => {
    if (!selectedConversation || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const token = localStorage.getItem('token');
      
      // Get the last message to determine subject and product
      const lastMessage = selectedConversation.messages[selectedConversation.messages.length - 1];
      
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedConversation.userId,
          subject: lastMessage.subject.startsWith('Re:') 
            ? lastMessage.subject 
            : `Re: ${lastMessage.subject}`,
          message: replyText,
          productId: lastMessage.productId?._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReplyText('');
        toast({
          title: 'Success',
          description: 'Message sent successfully!',
          variant: 'default',
        });
        
        // Refresh messages
        fetchAllMessages();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send message',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Error sending message',
        variant: 'destructive',
      });
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Messages</h1>
          {totalUnread > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
              {totalUnread} unread
            </span>
          )}
        </div>
        <p className="text-muted-foreground ml-14">
          Chat with sellers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white">Conversations</h2>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.userId}
                    onClick={() => handleConversationClick(conversation)}
                    className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedConversation?.userId === conversation.userId ? 'bg-blue-50 dark:bg-blue-950' : ''
                    } ${conversation.unreadCount > 0 ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                          {conversation.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {conversation.userName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {conversation.userEmail}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conversation.lastMessageTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
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

        {/* Chat View */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                      {selectedConversation.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        {selectedConversation.userName}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.userEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          message.isSent
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                        }`}
                      >
                        {message.productId && (
                          <Link
                            href={`/products/${message.productId.slug}`}
                            className={`block mb-2 p-2 rounded-lg ${
                              message.isSent
                                ? 'bg-blue-700 hover:bg-blue-800'
                                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                            } transition-colors`}
                          >
                            <div className="flex items-center gap-2 text-xs">
                              <Package className="w-3 h-3" />
                              <span className="font-medium">{message.productId.title}</span>
                            </div>
                          </Link>
                        )}
                        <p className="text-sm font-medium mb-1">{message.subject}</p>
                        <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.isSent ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex gap-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your message..."
                      rows={2}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendReply();
                        }
                      }}
                    />
                    <button
                      onClick={sendReply}
                      disabled={!replyText.trim() || sendingReply}
                      className="px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <SendIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                <div>
                  <Mail className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
