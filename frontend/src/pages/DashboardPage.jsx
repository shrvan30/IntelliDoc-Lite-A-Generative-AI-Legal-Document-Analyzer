import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// --- Icon Imports ---
import { 
  FaFilePdf, FaFileWord, FaFileAlt, FaFileUpload, FaCheckCircle, 
  FaFileArchive, FaSpinner, FaDatabase, FaListUl, FaShieldAlt, 
  FaSearch, FaExclamationTriangle, FaBrain 
} from 'react-icons/fa';
import { useDocuments } from '../context/DocumentContext.jsx';

// --- Page Animation Variants ---
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

// --- 1. Stat Card Component ---
const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    variants={itemVariants}
    className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex items-center space-x-4"
  >
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  </motion.div>
);

// --- 2. Upload Zone Component ---
const UploadZone = () => {
  const { uploadDocument, state } = useDocuments();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadDocument(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadDocument(e.dataTransfer.files[0]);
    }
  };

  return (
    <motion.label
      htmlFor="file-upload-dropzone"
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`flex flex-col items-center justify-center p-8 rounded-xl bg-gray-800 border-2 border-dashed h-full
                 cursor-pointer transition-all duration-300
                 ${isDragOver ? 'border-blue-500 bg-gray-700 scale-105' : 'border-gray-600'}`}
    >
      <motion.div
        animate={{ scale: isDragOver ? 1.2 : 1, y: isDragOver ? -10 : 0 }}
        className="flex flex-col items-center"
      >
        <FaFileUpload className={`text-5xl mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-500'}`} />
        <h3 className="text-lg font-semibold text-white">
          {isDragOver ? 'Drop your file!' : 'Drag & drop a document'}
        </h3>
        <p className="text-gray-400 text-sm mt-1">or click to select</p>
      </motion.div>
      <input
        id="file-upload-dropzone"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt"
        disabled={state.isLoading}
      />
    </motion.label>
  );
};

// --- 3. Document List Item ---
const DocumentItem = ({ doc, index }) => {
  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) return <FaFilePdf className="text-red-500 text-xl" />;
    if (fileName.endsWith('.docx')) return <FaFileWord className="text-blue-400 text-xl" />;
    return <FaFileAlt className="text-gray-400 text-xl" />;
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      className="flex items-center justify-between p-4 rounded-lg border border-transparent cursor-pointer"
    >
      <div className="flex items-center space-x-3 overflow-hidden">
        {getFileIcon(doc.name)}
        <span className="text-lg font-medium text-gray-200 truncate">{doc.name}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-green-400 flex-shrink-0">
        <FaCheckCircle />
        <span>{doc.status}</span>
      </div>
    </motion.li>
  );
};

// --- 4. Empty & Loading States ---
const LoadingSpinner = () => (
  <motion.div
    key="loading"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center h-full text-gray-500"
  >
    <FaSpinner className="text-4xl animate-spin text-blue-500" />
    <p className="mt-4 text-lg">Loading documents...</p>
  </motion.div>
);

const EmptyState = () => (
  <motion.div
    key="empty"
    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
    className="text-center h-full flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-700 rounded-lg"
  >
    <FaFileArchive className="text-6xl text-gray-600 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-400">No documents yet</h3>
    <p className="text-gray-500 mt-2">Upload your first document to get started!</p>
  </motion.div>
);

// --- 5. Global Clause Finder Card ---
const GlobalSearchCard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setResults([]);
    setTimeout(() => {
      setResults([
        { doc: 'Mock_Contract_v1.pdf', context: '...the laws of the State of Delaware shall govern...' },
        { doc: 'NDA_Template_Final.docx', context: '...this Agreement is governed by the laws of New York...' },
      ]);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <motion.div 
      className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700" 
      variants={itemVariants}
    >
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
        <FaSearch className="mr-3 text-blue-500" />
        Global Clause Finder
      </h2>
      <form onSubmit={handleSearch} className="flex space-x-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g., 'Governing Law'"
          className="flex-grow p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <motion.button
          type="submit"
          disabled={isSearching}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSearching ? <FaSpinner className="animate-spin" /> : <FaSearch />}
        </motion.button>
      </form>
      
      <div className="mt-6 h-32 overflow-y-auto">
        <AnimatePresence>
          {isSearching && (
            <motion.div key="searching" {...itemVariants} className="flex items-center justify-center text-gray-400">
              <FaSpinner className="animate-spin mr-3" />
              Searching all documents...
            </motion.div>
          )}
          {!isSearching && results.length > 0 && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {results.map((res, i) => (
                <div key={i} className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-blue-400 font-semibold">{res.doc}</p>
                  <p className="text-gray-300 text-sm truncate">{res.context}</p>
                </div>
              ))}
            </motion.div>
          )}
          {!isSearching && results.length === 0 && !searchTerm && (
            <p className="text-gray-500 text-center pt-8">Search for a clause to see results here.</p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// --- 6. AI Action Item Component ---
const ActionItem = ({ doc, action, index }) => (
  <motion.li
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ type: 'spring', stiffness: 200, damping: 20, delay: index * 0.05 }}
    whileHover={{ scale: 1.02, x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    className="flex items-center justify-between p-4 rounded-lg border border-transparent cursor-pointer"
  >
    <div className="flex items-center space-x-3 overflow-hidden">
      <FaExclamationTriangle className="text-yellow-400 text-xl flex-shrink-0" />
      <div className="overflow-hidden">
        <span className="text-lg font-medium text-gray-200 truncate block">{doc}</span>
        <span className="text-sm text-yellow-400">{action}</span>
      </div>
    </div>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="text-sm text-blue-400 font-semibold flex-shrink-0 ml-4"
    >
      Review
    </motion.button>
  </motion.li>
);

// --- 7. Document Workspace (with Tabs) ---
const DocumentWorkspace = () => {
  const { state } = useDocuments();
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'actions'

  // Mock data for action items
  const actionItems = [
    { id: 1, doc: 'Mock_Contract_v1.pdf', action: 'Missing termination clause' },
    { id: 2, doc: 'NDA_Template_Final.docx', action: 'Governing law is ambiguous' },
  ];

  const TabButton = ({ id, label, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative py-3 px-5 font-semibold transition-colors
                  ${activeTab === id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
    >
      {label}
      {count > 0 && (
        <span className={`absolute top-2 right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs
                          ${activeTab === id ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>
          {count}
        </span>
      )}
      {activeTab === id && (
        <motion.div 
          layoutId="underline" 
          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
        />
      )}
    </button>
  );

  return (
    <motion.div 
      className="bg-gray-800 rounded-xl shadow-xl border border-gray-700"
      variants={itemVariants}
    >
      {/* Tab Headers */}
      <div className="flex border-b border-gray-700">
        <TabButton id="all" label="All Documents" count={state.documents.length} />
        <TabButton id="actions" label="AI Action Items" count={actionItems.length} />
      </div>

      {/* Tab Content */}
      <div className="p-8 min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === 'all' && (
            <motion.div key="all">
              <AnimatePresence mode="wait">
                {state.isLoading && state.documents.length === 0 ? (
                  <LoadingSpinner />
                ) : !state.isLoading && state.documents.length === 0 ? (
                  <EmptyState />
                ) : (
                  <motion.ul 
                    key="list" 
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <AnimatePresence>
                      {state.documents.map((doc, index) => (
                        <DocumentItem key={doc.id} doc={doc} index={index} />
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'actions' && (
            <motion.div key="actions">
              <motion.ul 
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence>
                  {actionItems.map((item, index) => (
                    <ActionItem key={item.id} {...item} index={index} />
                  ))}
                </AnimatePresence>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading message for *new* uploads */}
      {state.isLoading && state.documents.length > 0 && (
        <div className="flex items-center text-blue-400 p-4 border-t border-gray-700 animate-pulse">
          <FaSpinner className="animate-spin mr-3" />
          Processing new document...
        </div>
      )}
    </motion.div>
  );
};


// --- 8. Main Dashboard Page ---
const DashboardPage = () => {
  return (
    <motion.div 
      className="max-w-7xl mx-auto" // Wider layout
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-4xl font-extrabold text-white mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-4">
          <FaBrain className="text-blue-500 text-4xl" />
          <span className="bg-gradient-to-r from-white via-blue-400 to-cyan-400 bg-[length:300%_300%] bg-clip-text text-transparent animate-aurora-shift">
            Your AI Command Center
          </span>
        </div>
      </motion.h1>
      
      {/* --- Stats Row --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<FaListUl />} 
          label="Total Documents" 
          value={useDocuments().state.documents.length} // Get length directly
          color="bg-blue-600"
        />
        <StatCard 
          icon={<FaDatabase />} 
          label="Storage Used" 
          value="14.5 MB" // Mock data
          color="bg-green-600"
        />
        <StatCard 
          icon={<FaShieldAlt />} 
          label="Security" 
          value="100% Local"
          color="bg-purple-600"
        />
      </div>

      {/* --- Re-organized Layout --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1: Upload Zone */}
        <div className="lg:col-span-1">
          <UploadZone />
        </div>

        {/* Col 2: Document Workspace (with tabs) */}
        <div className="lg:col-span-2">
          <DocumentWorkspace />
        </div>
      </div>

      {/* --- Bottom Row (Global Search only) --- */}
      <div className="mt-8">
        <GlobalSearchCard />
      </div>

    </motion.div>
  );
};

export default DashboardPage;
// import React from 'react';
// import FileUploader from '../components/common/FileUploader.jsx';
// import DocumentList from '../components/common/DocumentList.jsx';
// import { useDocuments } from '../context/DocumentContext.jsx';

// const DashboardPage = () => {
//   const { state } = useDocuments(); // Get state from context

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-4xl font-extrabold text-gray-100 mb-8">Document Dashboard</h1>
      
//       {/* Document Upload Section */}
//       <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-12 border border-gray-700">
//         <h2 className="text-2xl font-semibold text-gray-100 mb-6">Upload New Document</h2>
//         <FileUploader />
//         {state.isLoading && state.documents.length > 0 && (
//           <p className="text-blue-400 mt-4 animate-pulse">
//             Processing new document...
//           </p>
//         )}
//       </div>

//       {/* Uploaded Documents List */}
//       <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
//         <h2 className="text-2xl font-semibold text-gray-100 mb-6">
//           Your Documents ({state.documents.length})
//         </h2>
//         {state.isLoading && state.documents.length === 0 ? (
//           <p className="text-gray-400 animate-pulse">Loading documents...</p>
//         ) : (
//           <DocumentList documents={state.documents} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;