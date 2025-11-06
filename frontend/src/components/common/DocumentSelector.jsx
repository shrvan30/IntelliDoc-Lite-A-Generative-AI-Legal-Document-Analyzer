import React from 'react';

const DocumentSelector = ({ documents, onSelect }) => {
  return (
    <div>
      <label htmlFor="doc-select" className="block text-sm font-medium text-gray-300 mb-2">
        Select a document to analyze:
      </label>
      <select
        id="doc-select"
        onChange={(e) => onSelect(e.target.value)}
        defaultValue=""
        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
};

export default DocumentSelector;