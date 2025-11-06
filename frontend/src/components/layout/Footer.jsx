import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaWhatsapp, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <motion.footer 
      className="w-full p-6 border-t border-white/20 bg-white/10 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left Side */}
        <p className="text-sm text-gray-300 text-center md:text-left mb-4 md:mb-0">
          © {new Date().getFullYear()} IntelliDoc-Lite. All rights reserved. | Made with <FaHeart className="inline text-pink-500" /> in India
        </p>
        
        {/* Right Side: Social Icons */}
        <div className="flex space-x-3">
          <a href="#" className="p-2 bg-black/20 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white transition-colors">
            <FaWhatsapp size={20} />
          </a>
          <a href="#" className="p-2 bg-black/20 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white transition-colors">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="p-2 bg-black/20 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white transition-colors">
            <FaLinkedin size={20} />
          </a>
          <a href="#" className="p-2 bg-black/20 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white transition-colors">
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;