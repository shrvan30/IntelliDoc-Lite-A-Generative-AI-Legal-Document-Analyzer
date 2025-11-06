import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Add .jsx to the context import
import { useDocuments } from '../context/DocumentContext.jsx'; 
// Add new icons for the style selector and Next Actions
import { 
  FaFileAlt, FaSpinner, FaMagic, 
  FaListUl, FaParagraph, FaKey,
  FaShare, FaFileExport, FaLanguage // NEW: Icons for next actions
} from 'react-icons/fa';

// --- Re-usable Typing Effect (Optimized) ---
const TypingEffect = ({ text, speed = 15 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on new text
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);
    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <>{displayedText}<span className="animate-blink">|</span></>;
};


// --- Re-usable Document Selector ---
const DocumentSelector = ({ documents, onSelect, disabled }) => (
  <div>
    <label htmlFor="doc-select" className="block text-sm font-medium text-gray-300 mb-2">
      1. Select Document
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

// --- Summary Style Selector ---
const SummaryStyleSelector = ({ selectedStyle, onSelect, disabled }) => {
  const styles = [
    { id: 'concise', label: 'Concise', icon: <FaListUl /> },
    { id: 'detailed', label: 'Detailed', icon: <FaParagraph /> },
    { id: 'keywords', label: 'Key Terms', icon: <FaKey /> },
  ];

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        2. Select Summary Style
      </label>
      <div className="grid grid-cols-3 gap-3">
        {styles.map((style) => (
          <motion.button
            key={style.id}
            disabled={disabled}
            onClick={() => onSelect(style.id)}
            animate={selectedStyle === style.id ? { scale: 1.05 } : { scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors duration-200
                       ${selectedStyle === style.id 
                          ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/20'}
                       disabled:opacity-50`}
          >
            <div className="text-2xl">{style.icon}</div>
            <span className="mt-2 text-sm font-semibold">{style.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// --- Result Views for AnimatePresence ---
const LoadingView = () => (
  <motion.div
    key="loading"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center h-full text-gray-400"
  >
    <FaSpinner className="text-5xl text-blue-500 animate-spin" />
    <p className="mt-4 text-lg">Generating your summary...</p>
    <p className="text-sm text-gray-500">This may take a moment.</p>
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
    <FaMagic className="text-6xl text-gray-600 mb-4" />
    <p className="text-xl">Select a document and style to begin.</p>
  </motion.div>
);

// --- **** NEW: Next Actions Component **** ---
const NextActions = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }} // Appears just after the summary
    className="w-full lg:w-1/3 lg:pl-6 lg:border-l lg:border-gray-700 mt-6 lg:mt-0"
  >
    <h4 className="text-lg font-semibold text-white mb-4">Next Actions</h4>
    <div className="flex flex-col space-y-3">
      <motion.button 
        whileHover={{ scale: 1.05, x: 5 }}
        className="flex items-center p-3 bg-white/5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
      >
        <FaFileExport className="mr-3 text-blue-400" /> Export as TXT
      </motion.button>
      <motion.button 
        whileHover={{ scale: 1.05, x: 5 }}
        className="flex items-center p-3 bg-white/5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
      >
        <FaShare className="mr-3 text-blue-400" /> Share (Mock)
      </motion.button>
      <motion.button 
        whileHover={{ scale: 1.05, x: 5 }}
        className="flex items-center p-3 bg-white/5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
      >
        <FaLanguage className="mr-3 text-blue-400" /> Translate (Mock)
      </motion.button>
    </div>
  </motion.div>
);
// --- **** END OF NEW COMPONENT **** ---


// --- Main Page Component ---
const SummarizePage = () => {
  const { state, getSummary } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState('');
  const [summaryStyle, setSummaryStyle] = useState('concise');

  const handleSummarize = () => {
    if (selectedDocId) {
      // In a real app, you'd pass the style to your context/API
      // For the mock, we just tell it to generate *a* summary
      getSummary(selectedDocId, summaryStyle); 
    }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto" // Wider layout
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      <motion.h1 
        className="text-4xl font-extrabold text-white mb-8 flex items-center"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        <FaMagic className="mr-4 text-blue-500" />
        AI Document Summarizer
      </motion.h1>
      
      {/* --- Two-Column Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- Left Column: Controls --- */}
        <motion.div
          variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
          className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-white/20 h-full"
        >
          <DocumentSelector 
            documents={state.documents} 
            onSelect={setSelectedDocId}
            disabled={state.isLoading}
          />
          
          <SummaryStyleSelector
            selectedStyle={summaryStyle}
            onSelect={setSummaryStyle}
            disabled={state.isLoading}
          />

          <motion.button
            onClick={handleSummarize}
            disabled={!selectedDocId || state.isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]"
          >
            <AnimatePresence mode="wait">
              {state.isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center justify-center"
                >
                  <FaSpinner className="animate-spin mr-3" />
                  Generating...
                </motion.div>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  Generate Summary
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
        
        {/* --- Right Column: Result --- */}
        <motion.div
          variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
          className="lg:col-span-2 bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-white/20 min-h-[400px]"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <FaFileAlt className="text-blue-500 mr-3" />
            Generated Summary
          </h2>
          
          <div className="h-full">
            <AnimatePresence mode="wait">
              {state.isLoading ? (
                <LoadingView />
              ) : state.currentSummary ? (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col lg:flex-row" // NEW: Layout for summary + actions
                >
                  {/* Summary Text (2/3 width) */}
                  <div className="w-full lg:w-2/3 text-gray-300 whitespace-pre-wrap leading-relaxed">
                    <TypingEffect text={state.currentSummary} />
                  </div>
                  
                  {/* --- **** NEW: Next Actions Panel **** --- */}
                  <NextActions />

                </motion.div>
              ) : (
                <EmptyView />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SummarizePage;



// import React, { useState } from 'react';
// import { useDocuments } from '../context/DocumentContext.jsx';
// import DocumentSelector from '../components/common/DocumentSelector.jsx';
// import { FaFileAlt } from 'react-icons/fa';

// const SummarizePage = () => {
//   const { state, getSummary } = useDocuments();
//   const [selectedDocId, setSelectedDocId] = useState('');

//   const handleSummarize = () => {
//     if (selectedDocId) {
//       getSummary(selectedDocId);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-4xl font-extrabold text-gray-100 mb-8">Summarize Document</h1>
      
//       <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8 border border-gray-700">
//         <DocumentSelector 
//           documents={state.documents} 
//           onSelect={setSelectedDocId}
//         />
//         <button
//           onClick={handleSummarize}
//           disabled={!selectedDocId || state.isLoading}
//           className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {state.isLoading ? 'Generating...' : 'Generate Summary'}
//         </button>
//       </div>
      
//       {state.isLoading && !state.currentSummary && (
//         <div className="text-center p-10">
//           <FaFileAlt className="text-blue-500 text-5xl mx-auto animate-pulse" />
//           <p className="text-gray-400 mt-4">Generating summary...</p>
//         </div>
//       )}

//       {state.currentSummary && !state.isLoading && (
//         <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
//           <h2 className="text-2xl font-semibold text-gray-100 mb-4">Summary</h2>
//           <p className="text-gray-300 whitespace-pre-wrap">{state.currentSummary}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SummarizePage;