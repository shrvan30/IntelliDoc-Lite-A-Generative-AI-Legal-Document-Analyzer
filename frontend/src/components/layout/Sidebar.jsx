import React, { useState } from 'react';
// --- FIX 1: Import useLocation ---
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTachometerAlt, FaCommentDots, FaFileAlt, 
  FaBalanceScale, FaShieldAlt, FaCircle 
} from 'react-icons/fa';

// --- Logo Component ---
const Logo = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" fill="currentColor" className="text-gray-800" />
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" className="text-gray-500" />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500" />
    <path d="M12 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500" />
  </svg>
);

// --- List of Navigation Links ---
const navItems = [
  { to: "/app", icon: <FaTachometerAlt />, label: "Dashboard" },
  { to: "/app/chat", icon: <FaCommentDots />, label: "Q&A" },
  { to: "/app/summarize", icon: <FaFileAlt />, label: "Summarize" },
  { to: "/app/compare", icon: <FaBalanceScale />, label: "Compare" },
];

const Sidebar = () => {
  // --- FIX 2: Use the useLocation hook ---
  const location = useLocation();
  const currentPath = location.pathname;
  
  // --- FIX 3: Reverse the list to find the *most specific* match first ---
  // This makes sure "/app/chat" is matched before "/app"
  const activeItem = [...navItems].reverse().find(item => currentPath.startsWith(item.to))?.to || "/app";
  
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <nav className="w-64 flex-shrink-0 bg-gray-800 text-gray-200 p-6 flex flex-col shadow-lg border-r border-gray-700 h-screen sticky top-0">
      
      {/* 1. Header with Animated Logo */}
      <motion.div 
        className="flex items-center space-x-3 mb-12"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ rotate: [0, 15, -10, 0], scale: 1.1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Logo className="w-9 h-9 text-blue-500" />
        </motion.div>
        <span className="text-2xl font-bold text-white">IntelliDoc-Lite</span>
      </motion.div>
      
      {/* 2. Navigation with Sliding Pill */}
      <ul 
        className="space-y-3 flex-grow"
        onMouseLeave={() => setHoveredItem(null)} // Reset hover on leave
      >
        {navItems.map((item) => (
          <li key={item.label} className="relative" onMouseEnter={() => setHoveredItem(item.to)}>
            <NavLink
              to={item.to}
              className={`relative z-10 flex items-center space-x-4 text-lg p-3 rounded-md transition-colors duration-200
                          ${activeItem === item.to ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>

            {/* The sliding "active" pill */}
            {activeItem === item.to && (
              <motion.div
                layoutId="activePill" // This ID links all the pills
                className="absolute inset-0 bg-blue-600 rounded-lg shadow-lg z-0"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            
            {/* The "hover" pill (only shows when not active) */}
            {activeItem !== item.to && hoveredItem === item.to && (
              <motion.div
                layoutId="hoverPill" // A separate ID for the hover effect
                className="absolute inset-0 bg-gray-700 rounded-lg z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </li>
        ))}
      </ul>

      {/* 3. Proactive Footer Status */}
      <motion.div 
        className="flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 text-center">
          <div className="flex items-center justify-center space-x-2 text-green-400">
            <FaShieldAlt />
            <span className="font-semibold">100% Local & Secure</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Your data never leaves this device.
          </p>
        </div>
      </motion.div>

    </nav>
  );
};

export default Sidebar;

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaTachometerAlt, FaCommentDots, FaFileAlt, FaBalanceScale } from 'react-icons/fa';

// const Sidebar = () => {
//   return (
//     <nav className="w-64 flex-shrink-0 bg-gray-800 text-gray-200 p-6 flex flex-col shadow-lg border-r border-gray-700 h-screen sticky top-0">
//       <h3 className="text-3xl font-bold text-blue-500 mb-10">
//         IntelliDoc-Lite
//       </h3>
//       <ul className="space-y-4">
//         <li>
//           <Link to="/app" className="flex items-center space-x-3 text-lg p-2 rounded-md hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200">
//             <FaTachometerAlt />
//             <span>Dashboard</span>
//           </Link>
//         </li>
//         <li>
//           <Link to="/app/chat" className="flex items-center space-x-3 text-lg p-2 rounded-md hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200">
//             <FaCommentDots />
//             <span>Q&A</span>
//           </Link>
//         </li>
//         <li>
//           <Link to="/app/summarize" className="flex items-center space-x-3 text-lg p-2 rounded-md hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200">
//             <FaFileAlt />
//             <span>Summarize</span>
//           </Link>
//         </li>
//         <li>
//           <Link to="/app/compare" className="flex items-center space-x-3 text-lg p-2 rounded-md hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200">
//             <FaBalanceScale />
//             <span>Compare</span>
//           </Link>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Sidebar;