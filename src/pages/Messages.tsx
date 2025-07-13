import React, { useState } from 'react';
import { MessageSquare, Send, Bot } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { messagesData } from '../data/mockData';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<'ai' | string>('ai');
  const [messageInput, setMessageInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hello! I\'m your AI Health Assistant. How can I help you today?' }
  ]);

  // Group messages by conversation
  const conversations = messagesData.reduce((acc, message) => {
    const otherId = message.senderId === user?.id ? message.receiverId : message.senderId;
    const otherName = message.senderId === user?.id ? message.receiverName : message.senderName;
    
    if (!acc[otherId]) {
      acc[otherId] = {
        id: otherId,
        name: otherName,
        messages: [],
        lastMessage: message,
      };
    }
    acc[otherId].messages.push(message);
    
    // Update last message if this one is more recent
    if (new Date(message.timestamp) > new Date(acc[otherId].lastMessage.timestamp)) {
      acc[otherId].lastMessage = message;
    }
    
    return acc;
  }, {} as Record<string, { id: string; name: string; messages: typeof messagesData; lastMessage: typeof messagesData[0] }>);

  // Sort conversations by latest message
  const sortedConversations = Object.values(conversations).sort((a, b) => 
    new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
  );
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    if (selectedChat === 'ai') {
      // Handle AI chat
      setAiMessages(prev => [...prev, { role: 'user', content: messageInput }]);
      
      // Simulate AI response
      setTimeout(() => {
        setAiMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I understand your concern. Let me help you with that...'
        }]);
      }, 1000);
    } else {
      // Add new message to the conversation
      const newMessage = {
        id: `m${Date.now()}`,
        senderId: user?.id || '',
        receiverId: selectedChat,
        senderName: user?.name || '',
        content: messageInput,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      if (conversations[selectedChat]) {
        conversations[selectedChat].messages.push(newMessage);
        conversations[selectedChat].lastMessage = newMessage;
      }
    }
    
    setMessageInput('');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Messages</h1>
        <p className="text-neutral-600 mt-1">Chat with your healthcare providers and AI assistant</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat list */}
        <div className="lg:col-span-1">
          <Card>
            <div className="space-y-4">
              {/* AI Chat Option */}
              <button
                className={`w-full flex items-start p-3 rounded-lg transition-colors ${
                  selectedChat === 'ai' ? 'bg-primary-50 border border-primary-200' : 'hover:bg-neutral-50'
                }`}
                onClick={() => setSelectedChat('ai')}
              >
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-600" />
                </div>
                <div className="ml-3 flex-1 text-left">
                  <p className="font-medium text-neutral-900">AI Health Assistant</p>
                  <p className="text-sm text-neutral-600 truncate">Always here to help</p>
                </div>
              </button>

              {/* Human Chats */}
              {sortedConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`w-full flex items-start p-3 rounded-lg transition-colors ${
                    selectedChat === conversation.id ? 'bg-primary-50 border border-primary-200' : 'hover:bg-neutral-50'
                  }`}
                  onClick={() => setSelectedChat(conversation.id)}
                >
                  <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-neutral-500" />
                  </div>
                  <div className="ml-3 flex-1 text-left">
                    <p className="font-medium text-neutral-900">{conversation.name}</p>
                    <p className="text-sm text-neutral-600 truncate">
                      {conversation.lastMessage.content}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {conversation.messages.some(m => !m.read && m.receiverId === user?.id) && (
                    <span className="h-2 w-2 bg-primary-500 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Chat window */}
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-12rem)]">
            <div className="h-full flex flex-col">
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-neutral-200">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    {selectedChat === 'ai' ? (
                      <Bot className="h-5 w-5 text-primary-600" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-neutral-500" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-neutral-900">
                      {selectedChat === 'ai' ? 'AI Health Assistant' : conversations[selectedChat]?.name}
                    </p>
                    <p className="text-sm text-neutral-500">Online</p>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat === 'ai' ? (
                  // AI Chat Messages
                  aiMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary-500 text-white'
                            : 'bg-neutral-100 text-neutral-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Human Chat Messages
                  conversations[selectedChat]?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === user?.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-neutral-100 text-neutral-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === user?.id ? 'text-primary-100' : 'text-neutral-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t border-neutral-200">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    placeholder={selectedChat === 'ai' ? 'Ask me anything about your health...' : 'Type your message...'}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    rightIcon={<Send className="h-4 w-4" />}
                  >
                    Send
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;