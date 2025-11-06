import React, { useRef, useEffect } from 'react';
import { FaUser, FaRobot } from 'react-icons/fa';

const ChatWindow = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-grow p-6 space-y-4 overflow-y-auto">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 h-full flex items-center justify-center">
          <p>Select a document and ask a question to get started.</p>
        </div>
      )}
      
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex items-start max-w-lg ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Icon */}
            <div className={`flex-shrink-0 p-3 rounded-full ${msg.sender === 'user' ? 'bg-blue-600 ml-3' : 'bg-gray-700 mr-3'}`}>
              {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
            </div>
            {/* Message Bubble */}
            <div className={`px-4 py-3 rounded-lg shadow ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Loading Indicator */}
      {isLoading && messages.length > 0 && (
        <div className="flex justify-start">
          <div className="flex items-start max-w-lg">
            <div className="flex-shrink-0 p-3 rounded-full bg-gray-700 mr-3">
              <FaRobot />
            </div>
            <div className="px-4 py-3 rounded-lg shadow bg-gray-700 text-gray-200">
              <p className="animate-pulse">Thinking...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Dummy div to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;