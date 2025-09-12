/**
 * Real-time chat component for interviews and collaboration
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  message_type: 'text' | 'system' | 'file';
  timestamp: string;
  isOwn?: boolean;
}

interface RealTimeChatProps {
  roomId: string;
  userId: string;
  userName: string;
  messages: ChatMessage[];
  onSendMessage: (message: string, type?: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
  maxHeight?: string;
}

export const RealTimeChat: React.FC<RealTimeChatProps> = ({
  roomId,
  userId,
  userName,
  messages,
  onSendMessage,
  onTyping,
  disabled = false,
  placeholder = "Type a message...",
  maxHeight = "400px"
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicators
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      onTyping?.(true);
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping?.(false);
      }, 2000);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, onTyping]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || disabled) return;

    onSendMessage(inputMessage.trim());
    setInputMessage('');
    setIsTyping(false);
    onTyping?.(false);
    
    // Focus back to input
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    
    if (e.target.value.trim() && !isTyping) {
      setIsTyping(true);
    } else if (!e.target.value.trim() && isTyping) {
      setIsTyping(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ChatMessage) => {
    const isOwn = message.sender_id === userId;
    const isSystem = message.message_type === 'system';

    if (isSystem) {
      return (
        <div key={message.id} className="flex justify-center my-2">
          <div className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
            {message.message}
          </div>
        </div>
      );
    }

    return (
      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
          <div className={`px-4 py-2 rounded-lg ${
            isOwn 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}>
            {!isOwn && (
              <div className="text-xs font-semibold mb-1 opacity-75">
                {message.sender_name}
              </div>
            )}
            <div className="text-sm">{message.message}</div>
            <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-3 border-b bg-gray-50 rounded-t-lg">
        <h3 className="font-semibold text-sm">Chat - Room {roomId}</h3>
        {typingUsers.length > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div 
        className="flex-1 p-3 overflow-y-auto"
        style={{ maxHeight }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm mt-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-gray-50 rounded-b-lg">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Chat disabled" : placeholder}
            disabled={disabled}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={disabled || !inputMessage.trim()}
            size="sm"
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Hook for managing chat state
export const useRealTimeChat = (roomId: string, userId: string, wsService: any) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!wsService) return;

    // Set up WebSocket callbacks for chat
    wsService.setCallbacks({
      onChatMessage: (data: any) => {
        const newMessage: ChatMessage = {
          id: `${data.sender_id}-${data.timestamp}`,
          sender_id: data.sender_id,
          sender_name: data.sender_name || 'Unknown User',
          message: data.message,
          message_type: data.message_type || 'text',
          timestamp: data.timestamp,
          isOwn: data.sender_id === userId
        };
        
        setMessages(prev => [...prev, newMessage]);
      },
      onSystemAlert: (data: any) => {
        if (data.action === 'user_joined' || data.action === 'user_left') {
          const systemMessage: ChatMessage = {
            id: `system-${Date.now()}`,
            sender_id: 'system',
            sender_name: 'System',
            message: data.message,
            message_type: 'system',
            timestamp: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, systemMessage]);
        }
      }
    });

    // Join the chat room
    wsService.joinRoom(roomId);

    return () => {
      wsService.leaveRoom(roomId);
    };
  }, [wsService, roomId, userId]);

  const sendMessage = (message: string, type: 'text' | 'system' | 'file' = 'text') => {
    if (wsService) {
      wsService.sendChatMessage(roomId, message);
      
      // Add message to local state immediately for better UX
      const newMessage: ChatMessage = {
        id: `${userId}-${Date.now()}`,
        sender_id: userId,
        sender_name: 'You',
        message,
        message_type: type,
        timestamp: new Date().toISOString(),
        isOwn: true
      };
      
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    // In a real implementation, you would send typing indicators via WebSocket
    console.log(`User ${userId} is ${isTyping ? 'typing' : 'stopped typing'}`);
  };

  return {
    messages,
    typingUsers,
    sendMessage,
    handleTyping
  };
};

export default RealTimeChat;