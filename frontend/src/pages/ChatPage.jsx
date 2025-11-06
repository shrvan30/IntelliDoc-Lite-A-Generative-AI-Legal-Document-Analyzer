import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocuments } from '../context/DocumentContext.jsx';
import { 
  FaUser, FaRobot, FaPaperPlane, FaSpinner, 
  FaFilePdf, FaFileWord, FaFileAlt, FaBrain, FaLightbulb, FaCommentDots // Added FaCommentDots
} from 'react-icons/fa';

// --- Reusable Document Selector ---
const DocumentSelector = ({ documents, onSelect, disabled }) => (
  <div className="mb-6">
    <label htmlFor="doc-select" className="block text-sm font-medium text-gray-300 mb-2">
      Select a document to analyze:
    </label>
    <select
      id="doc-select"
      onChange={(e) => onSelect(e.target.value)}
      defaultValue=""
      disabled={disabled}
      className="w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      <option value="" disabled>-- Select a document --</option>
      {documents.map((doc) => (
        <option key={doc.id} value={doc.id}>
          {doc.name}
        </option>
      ))}
    </select>
  </div>
);

// --- Chat Window ---
const ChatWindow = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-grow p-6 space-y-6 overflow-y-auto">
      <AnimatePresence>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            layout // Ensures smooth animation
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }} // Bouncier animation
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start max-w-lg ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 p-3 rounded-full shadow-lg ${msg.sender === 'user' ? 'bg-blue-600 ml-3' : 'bg-gray-700 mr-3'}`}>
                {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
              </div>
              <div className={`px-4 py-3 rounded-lg shadow-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};

// --- Chat Input ---
const ChatInput = ({ onSend, disabled }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSend(query.trim());
      setQuery('');
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="p-4 border-t border-white/20 bg-white/5" // Frosted glass style
    >
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={disabled ? "Please select a document first" : "Ask a question about the document..."}
          disabled={disabled}
          className="flex-grow p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <motion.button
          type="submit"
          disabled={disabled || !query.trim()}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPaperPlane />
        </motion.button>
      </div>
    </motion.form>
  );
};

// --- NEW: DYNAMIC Suggested Queries Component ---
const SuggestedQueries = ({ onSuggestionClick, disabled }) => {
  const allSuggestions = [
    "Summarize this document",
    "What is the 'Governing Law'?",
    "List all parties involved",
    "What are the key deadlines?",
    "Identify any risks or liabilities",
    "Compare this to [another doc]"
  ];

  const [suggestions, setSuggestions] = useState([]);

  // This effect cycles the suggestions to make the AI feel "alive"
  useEffect(() => {
    // Pick 3 random suggestions initially
    setSuggestions([...allSuggestions].sort(() => 0.5 - Math.random()).slice(0, 3));

    const interval = setInterval(() => {
      setSuggestions([...allSuggestions].sort(() => 0.5 - Math.random()).slice(0, 3));
    }, 6000); // Change suggestions every 6 seconds

    return () => clearInterval(interval);
  }, []); // Runs once on mount

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <FaLightbulb className="text-yellow-400 mr-3" />
        AI Suggestions
      </h3>
      <div className="flex flex-col space-y-3">
        <AnimatePresence>
          {suggestions.map((q, i) => (
            <motion.button
              key={q} // Use query as key to force re-animation
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              onClick={() => onSuggestionClick(q)}
              disabled={disabled}
              className="text-left p-3 bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              "{q}"
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Document Info Component ---
const DocumentInfo = ({ doc }) => {
  if (!doc) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/20 text-center">
        <FaFileAlt className="text-gray-500 text-4xl mx-auto mb-3" />
        <p className="text-gray-400">No document selected</p>
      </div>
    );
  }

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) return <FaFilePdf className="text-red-500 text-5xl" />;
    if (fileName.endsWith('.docx')) return <FaFileWord className="text-blue-400 text-5xl" />;
    return <FaFileAlt className="text-gray-400 text-5xl" />;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Document Info</h3>
      <div className="flex flex-col items-center">
        {getFileIcon(doc.name)}
        <p className="text-lg font-semibold text-white mt-4 text-center">{doc.name}</p>
        <div className="flex space-x-6 mt-4 text-gray-300">
          <div>
            <p className="text-sm text-gray-400">Size (Mock)</p>
            <p className="font-semibold">2.4 MB</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Pages (Mock)</p>
            <p className="font-semibold">32</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Chat Page ---
const ChatPage = () => {
  const { state, askQuestion, clearChat } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState('');

  useEffect(() => {
    if (selectedDocId) {
      clearChat();
      // Auto-send a greeting
      const docName = state.documents.find(d => d.id === selectedDocId)?.name || 'this document';
      askQuestion(`Analyze this document: ${docName}`, selectedDocId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocId]); 
  
  const handleSend = (query) => {
    if (query && selectedDocId) {
      askQuestion(query, selectedDocId);
    } else if (!selectedDocId) {
      alert("Please select a document to chat with first.");
    }
  };

  const selectedDoc = state.documents.find(d => d.id === selectedDocId);

  return (
    <motion.div 
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* --- NEW: Innovative Title --- */}
      <motion.h1 
        className="text-4xl font-extrabold text-white mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4">
          <FaCommentDots className="text-blue-500 text-4xl" />
          <span className="bg-gradient-to-r from-white via-blue-400 to-cyan-400 bg-[length:300%_300%] bg-clip-text text-transparent animate-aurora-shift">
            Smart Q&A
          </span>
        </div>
      </motion.h1>
      
      {/* --- Two-column layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Left Column (Chat) --- */}
        <motion.div 
          className="lg:col-span-2 flex flex-col h-[calc(100vh-10rem)]" // Fixed height
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <DocumentSelector 
            documents={state.documents} 
            onSelect={setSelectedDocId}
            disabled={state.isLoading}
          />
          
          <div className="flex-grow bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 overflow-hidden flex flex-col mt-6">
            {state.chatMessages?.length === 0 && !state.isLoading && (
              <div className="flex-grow flex items-center justify-center text-gray-400 p-6 text-center">
                <p>Select a document to automatically begin analysis.</p>
              </div>
            )}
            <ChatWindow messages={state.chatMessages} />
            {state.isLoading && (
              <div className="p-4 flex items-center text-gray-400 animate-pulse">
                <FaBrain className="text-blue-500 mr-3" />
                <span>IntelliDoc is thinking...</span>
              </div>
            )}
            <ChatInput 
              onSend={handleSend} 
              disabled={state.isLoading || !selectedDocId} 
            />
          </div>
        </motion.div>

        {/* --- Right Column (Context) --- */}
        <motion.div 
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <DocumentInfo doc={selectedDoc} />
          <SuggestedQueries 
            onSuggestionClick={handleSend}
            disabled={state.isLoading || !selectedDocId} 
          />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default ChatPage;

// import React, { useState, useEffect } from 'react';
// import { useDocuments } from '../context/DocumentContext.jsx';
// import DocumentSelector from '../components/common/DocumentSelector.jsx';
// import ChatWindow from '../components/chat/ChatWindow.jsx';
// import ChatInput from '../components/chat/ChatInput.jsx';

// const ChatPage = () => {
//   const { state, askQuestion, clearChat } = useDocuments();
//   const [selectedDocId, setSelectedDocId] = useState('');

//   // When the selected doc changes, clear the old chat
//   useEffect(() => {
//     if (selectedDocId) {
//       clearChat();
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedDocId]);
  
//   const handleSend = (query) => {
//     if (query && selectedDocId) {
//       askQuestion(query, selectedDocId);
//     } else if (!selectedDocId) {
//       alert("Please select a document to chat with first.");
//     }
//   };

//   return (
//     // Full height minus padding (p-8 in AppLayout.jsx)
//     <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto"> 
//       <h1 className="text-4xl font-extrabold text-gray-100 mb-6">Smart Q&A</h1>
      
//       <div className="mb-4">
//         <DocumentSelector 
//           documents={state.documents} 
//           onSelect={setSelectedDocId}
//         />
//       </div>

//       <div className="flex-grow bg-gray-800 rounded-lg shadow-inner border border-gray-700 overflow-hidden flex flex-col">
//         <ChatWindow 
//           messages={state.chatMessages} 
//           isLoading={state.isLoading} 
//         />
//         <ChatInput 
//           onSend={handleSend} 
//           disabled={state.isLoading || !selectedDocId} 
//         />
//       </div>
//     </div>
//   );
// };

// export default ChatPage;