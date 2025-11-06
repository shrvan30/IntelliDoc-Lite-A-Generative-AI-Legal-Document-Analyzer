import React, { useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { FaFileUpload } from 'react-icons/fa';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadDocument, state } = useDocuments();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadDocument(selectedFile);
      setSelectedFile(null);
      document.getElementById('file-upload').value = null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label 
        htmlFor="file-upload" 
        className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700 cursor-pointer hover:border-blue-500 hover:bg-gray-600 transition-colors duration-200"
      >
        <FaFileUpload className="text-blue-500 text-4xl mb-3" />
        <p className="text-gray-300">
          {selectedFile ? selectedFile.name : 'Drag & drop or click to choose file'}
        </p>
        <p className="text-xs text-gray-400">PDF, DOCX, TXT</p>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
          disabled={state.isLoading}
        />
      </label>
      
      <button
        onClick={handleUpload}
        disabled={!selectedFile || state.isLoading}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state.isLoading ? 'Processing...' : 'Upload & Index'}
      </button>
    </div>
  );
};

export default FileUploader;