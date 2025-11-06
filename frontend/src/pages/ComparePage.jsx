import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocuments } from '../context/DocumentContext.jsx';
import { 
  FaBalanceScale, FaFileAlt, FaSpinner, 
  FaPlusCircle, FaMinusCircle, FaExchangeAlt,
  FaFilePdf, FaFileWord, FaArrowDown // Added new icons
} from 'react-icons/fa';

// --- Re-usable Document Selector ---
const DocumentSelector = ({ documents, onSelect, disabled, label }) => (
  <div>
    <label htmlFor={`doc-select-${label}`} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <select
      id={`doc-select-${label}`}
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

// --- Stat Card for Diff Summary ---
const DiffStatCard = ({ icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gray-700 p-4 rounded-lg shadow-lg flex items-center space-x-3 border-l-4 ${color}`}
  >
    {icon}
    <div>
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  </motion.div>
);

// --- Result Views ---
const LoadingView = ({ text = "Comparing documents..." }) => (
  <motion.div
    key="loading"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center h-full text-gray-400"
  >
    <FaSpinner className="text-5xl text-blue-500 animate-spin" />
    <p className="mt-4 text-lg">{text}</p>
  </motion.div>
);

const EmptyView = () => (
  <motion.div
    key="empty"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center h-full text-gray-400"
  >
    <FaBalanceScale className="text-6xl text-gray-600 mb-4" />
    <p className="text-xl text-center">Select two different documents to compare.</p>
  </motion.div>
);

// --- NEW: Document Pane Component ---
const DocumentPane = ({ doc, diffs, highlightId, type }) => {
  const scrollRef = useRef(null);

  // This effect scrolls the pane to the highlighted diff
  useEffect(() => {
    if (highlightId !== null) {
      const element = document.getElementById(`diff-${type}-${highlightId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightId, type]);

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) return <FaFilePdf className="text-red-500" />;
    if (fileName.endsWith('.docx')) return <FaFileWord className="text-blue-400" />;
    return <FaFileAlt className="text-gray-400" />;
  };

  return (
    <div className="bg-gray-900/50 rounded-lg overflow-hidden h-full">
      <div className="flex items-center space-x-3 p-4 bg-gray-700 border-b border-gray-600">
        {getFileIcon(doc.name)}
        <span className="font-semibold text-white truncate">{doc.name}</span>
      </div>
      <div ref={scrollRef} className="p-4 h-[400px] overflow-y-auto font-mono text-sm space-y-2">
        {diffs.map((line, i) => {
          const isHighlighted = (highlightId === line.id);
          let style = "text-gray-400"; // 'same'
          if (line.type === 'added') style = "text-green-400 bg-green-900/30";
          if (line.type === 'removed') style = "text-red-400 bg-red-900/30";

          return (
            <p 
              key={i} 
              id={`diff-${type}-${line.id}`}
              className={`${style} rounded px-2
                ${isHighlighted ? 'ring-2 ring-yellow-400' : ''}` // Highlight effect
              }
            >
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
};


// --- Main Page Component ---
const ComparePage = () => {
  const { state } = useDocuments();
  const [docAId, setDocAId] = useState('');
  const [docBId, setDocBId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  // NEW: State to manage which diff to highlight
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0);
  const [highlightedDiffId, setHighlightedDiffId] = useState(null);

  // Mock data for the two document texts
  const mockDocAText = [
    { id: 1, type: 'same', text: 'This Agreement is made and entered into as of...' },
    { id: 2, type: 'removed', text: '- The laws of the State of New York.' },
    { id: 3, type: 'same', text: '...' },
    { id: 4, type: 'removed', text: 'The "Confidentiality Period" shall mean 3 years.' },
    { id: 5, type: 'same', text: 'All notices must be sent via certified mail.' },
    { id: 6, type: 'same', text: '...' },
    { id: 7, type: 'same', text: '...' },
    { id: 8, type: 'removed', text: '- The "Termination Date" is Dec 31, 2024.' },
  ];

  const mockDocBText = [
    { id: 1, type: 'same', text: 'This Agreement is made and entered into as of...' },
    { id: 2, type: 'added', text: '+ This Agreement is governed by the laws of the State of Delaware.' },
    { id: 3, type: 'same', text: '...' },
    { id: 4, type: 'added', text: 'The "Confidentiality Period" shall mean 5 years.' },
    { id: 5, type: 'same', text: 'All notices must be sent via certified mail.' },
    { id: 6, type: 'added', text: '+ A new clause regarding data privacy is added here.' },
    { id: 7, type: 'added', text: '+ This clause was not in the original.' },
    { id: 8, type: 'same', text: '...' },
  ];

  // The actual differences to iterate through
  const allDiffs = [
    { id: 2, label: 'Governing Law' },
    { id: 4, label: 'Confidentiality Period' },
    { id: 6, label: 'Data Privacy Clause (New)' },
    { id: 8, label: 'Termination Date (Removed)' },
  ];

  const handleCompare = () => {
    if (!docAId || !docBId || docAId === docBId) {
      alert("Please select two different documents to compare.");
      return;
    }
    
    setIsLoading(true);
    setResults(null);
    setCurrentDiffIndex(0);
    setHighlightedDiffId(null);
    
    setTimeout(() => {
      setResults({
        added: 3, // Total lines
        removed: 3, // Total lines
        changed: 2, // Total "diffs"
        docAText: mockDocAText,
        docBText: mockDocBText
      });
      setIsLoading(false);
    }, 2500);
  };
  
  // NEW: Functions to cycle through diffs
  const goToNextDiff = () => {
    const nextIndex = (currentDiffIndex + 1) % allDiffs.length;
    setCurrentDiffIndex(nextIndex);
    setHighlightedDiffId(allDiffs[nextIndex].id);
  };
  
  const goToPrevDiff = () => {
    const prevIndex = (currentDiffIndex - 1 + allDiffs.length) % allDiffs.length;
    setCurrentDiffIndex(prevIndex);
    setHighlightedDiffId(allDiffs[prevIndex].id);
  };
  
  const docA = state.documents.find(d => d.id === docAId);
  const docB = state.documents.find(d => d.id === docBId);

  return (
    <motion.div 
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-4xl font-extrabold text-white mb-8 flex items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FaBalanceScale className="mr-4 text-blue-500" />
        {/* --- NEW: Animated Gradient Title --- */}
        <span className="bg-gradient-to-r from-white via-blue-400 to-cyan-400 bg-[length:300%_300%] bg-clip-text text-transparent animate-aurora-shift">
          Document Comparison
        </span>
      </motion.h1>
      
      {/* --- Controls Column --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-white/20 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <DocumentSelector 
            label="1. Original Document (A)"
            documents={state.documents.filter(d => d.id !== docBId)}
            onSelect={setDocAId}
            disabled={isLoading}
          />
          <DocumentSelector 
            label="2. Modified Document (B)"
            documents={state.documents.filter(d => d.id !== docAId)}
            onSelect={setDocBId}
            disabled={isLoading}
          />
          <motion.button
            onClick={handleCompare}
            disabled={!docAId || !docBId || docAId === docBId || isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaBalanceScale className="mr-3" />}
            {isLoading ? "Comparing..." : "Compare"}
          </motion.button>
        </div>
      </motion.div>
        
      {/* --- Results Section --- */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 min-h-[500px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingView />
          ) : results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              {/* --- AI Summary Stats --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <DiffStatCard icon={<FaPlusCircle />} label="Lines Added" value={results.added} color="border-green-500" />
                <DiffStatCard icon={<FaMinusCircle />} label="Lines Removed" value={results.removed} color="border-red-500" />
                <DiffStatCard icon={<FaExchangeAlt />} label="Total Diffs" value={allDiffs.length} color="border-yellow-500" />
              </div>
              
              {/* --- NEW: Diff Navigation --- */}
              <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg mb-4">
                <motion.button 
                  onClick={goToPrevDiff}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                >
                  Previous
                </motion.button>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Showing Difference {currentDiffIndex + 1} of {allDiffs.length}</p>
                  <p className="text-lg font-semibold text-yellow-400">{allDiffs[currentDiffIndex].label}</p>
                </div>
                <motion.button 
                  onClick={goToNextDiff}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                >
                  Next
                </motion.button>
              </div>

              {/* --- NEW: Side-by-Side Panes --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentPane doc={docA} diffs={results.docAText} highlightId={highlightedDiffId} type="a" />
                <DocumentPane doc={docB} diffs={results.docBText} highlightId={highlightedDiffId} type="b" />
              </div>
              
            </motion.div>
          ) : (
            <EmptyView />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


export default ComparePage;
// import React from 'react';

// const ComparePage = () => {
//   return (
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-4xl font-extrabold text-gray-100 mb-8">Compare Documents</h1>
//       <div className="bg-gray-800 p-10 rounded-lg shadow-xl border border-gray-700 text-center">
//         <h2 className="text-2xl font-semibold text-gray-100 mb-4">Feature Coming Soon</h2>
//         <p className="text-gray-400">
//           This section will allow you to select two documents and highlight their differences.
//         </p> {/* <-- This is the corrected line */}
//       </div>
//     </div>
//   );
// };

// export default ComparePage;