import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlay, FaShieldAlt, FaCloudUploadAlt, FaBrain, FaCommentDots,
  FaFileContract, FaRegLightbulb, FaExchangeAlt, FaArrowRight,
  FaLaptopCode, FaCloud, FaLink, FaDatabase, FaCode, FaLock,
  FaHeart, FaWhatsapp, FaTwitter, FaLinkedin, FaInstagram
} from 'react-icons/fa';
import { motion, useInView, useAnimation } from 'framer-motion';

// 1.1. SVG Logo Component
const Logo = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" fill="currentColor" className="text-gray-800" />
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" className="text-gray-500" />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500" />
    <path d="M12 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500" />
  </svg>
);

// 1.2. Typing Effect Component
const TypingEffect = ({ text, speed = 50, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    if (isTyping && displayedText.length < text.length) {
      timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
    } else if (displayedText.length === text.length) {
      setIsTyping(false);
    }
    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, text, speed]);

  useEffect(() => {
    const startTyping = setTimeout(() => {
      setDisplayedText('');
      setIsTyping(true);
    }, delay);
    return () => clearTimeout(startTyping);
  }, [text, delay]);

  return <>{displayedText}<span className="animate-blink">|</span></>;
};

// 1.3. Tech Stack Logos
const techStackLogos = [
  { name: 'Ollama', icon: <FaLaptopCode /> },
  { name: 'Llama 3', icon: <FaBrain /> },
  { name: 'LangChain', icon: <FaLink /> },
  { name: 'ChromaDB', icon: <FaDatabase /> },
  { name: 'FastAPI', icon: <FaCode /> },
];

// 2. Reusable Animate-on-Scroll Wrapper
const AnimateOnScroll = ({ children, delay = 0, duration = 0.5, y = 20 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: y },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: duration, delay: delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// 3. Reusable Feature Card (for Bento Box)
const FeatureCard = ({ icon, title, description, className = "", children, delay = 0 }) => (
  <AnimateOnScroll delay={delay} y={30}>
    <motion.div
      whileHover={{ scale: 1.03, y: -5, boxShadow: '0px 10px 30px rgba(59, 130, 246, 0.2)' }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 h-full flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="text-blue-500 text-4xl mb-4">{icon}</div>
        <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
      {children}
    </motion.div>
  </AnimateOnScroll>
);

// --- NEW: Helper component for dummy text lines ---
const DummyLine = ({ w = 'w-full' }) => (
  <div className={`h-3 bg-gray-600 rounded ${w} opacity-40`} />
);

// 4. Main HomePage Component
const HomePage = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('secure'); // 'secure' or 'warning'
  
  const handleGetStarted = () => {
    navigate('/app');
  };

  // State for the dynamic hero demo
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [highlightedSection, setHighlightedSection] = useState('preamble'); // Start by highlighting preamble

  // **** CHANGED: Simplified the demo sequence ****
  const heroDemoSequence = [
    { chat: { sender: 'user', text: "What is this document about?" }, highlight: 'preamble', delay: 0 },
    { chat: { sender: 'ai', text: "This is a standard contract preamble." }, highlight: 'preamble', delay: 3000 },
    { chat: { sender: 'user', text: "What is the 'Governing Law'?" }, highlight: 'gov', delay: 6000 },
    { chat: { sender: 'ai', text: "The agreement is governed by the laws of the State of Delaware." }, highlight: 'gov', delay: 9000 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentChatIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % heroDemoSequence.length;
        setHighlightedSection(heroDemoSequence[nextIndex].highlight);
        return nextIndex;
      });
    }, 4500); // This timing should be adjusted
    return () => clearInterval(timer);
  }, [heroDemoSequence.length]);

  const currentChat = heroDemoSequence[currentChatIndex].chat;

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center overflow-x-hidden">
      
      {/* 1. Header (Not Sticky, Animated Entry) */}
      <motion.nav 
        className="w-full z-10 backdrop-blur-lg bg-gray-700/30 border-b border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Logo className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">IntelliDoc-Lite</span>
          </div>
          <motion.button
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:inline-flex items-center bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>


      {/* 2. UPGRADED: Hero Section */}
      <section className="relative w-full py-20 md:py-32 flex items-center justify-center overflow-hidden mt-[-88px] pt-[88px]">
        
        {/* === Aurora Blob Background (Unchanged) === */}
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${theme === 'secure' ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-[500px] md:h-[500px] bg-blue-800 rounded-full filter blur-3xl opacity-30 animate-blob-float-1" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-[500px] md:h-[500px] bg-green-800 rounded-full filter blur-3xl opacity-20 animate-blob-float-2" />
        </div>
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${theme === 'warning' ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-[500px] md:h-[500px] bg-red-800 rounded-full filter blur-3xl opacity-30 animate-blob-float-1" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-[500px] md:h-[500px] bg-yellow-800 rounded-full filter blur-3xl opacity-20 animate-blob-float-2" />
        </div>
        
        {/* === Digital Shimmering Grid Overlay (Unchanged) === */}
        <div 
          className="absolute inset-0 z-0
                     bg-[image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]
                     bg-[size:40px_40px]
                     [mask-image:radial-gradient(circle_at_center,white,transparent_70%)]
                     animate-grid-shimmer"
        />

        <div className="container mx-auto px-6 z-10">
          
          {/* === Hero Text Content (No transitions) === */}
          <div className="max-w-3xl text-center mx-auto">
            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold leading-tight text-white mb-6"
            >
              <span className="bg-gradient-to-r from-white via-blue-400 to-cyan-400 bg-[length:300%_300%] bg-clip-text text-transparent animate-aurora-shift">
                Offline AI for an
                <br />
                Online World.
              </span>
            </motion.h1>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-semibold text-gray-200 mb-10"
            >
              Your Documents. Your AI. <span className="text-blue-500">100% Private.</span>
            </motion.h2>

            <motion.p 
              className="text-xl md:text-2xl text-gray-400 mb-10"
            >
              IntelliDoc-Lite transforms your contracts and reports into intelligent, conversational partners. No cloud. No leaks. No compromises.
            </motion.p>
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center bg-blue-600 text-white text-2xl font-bold py-4 px-12 rounded-full 
                         shadow-xl"
            >
              <FaPlay className="mr-3" />
              Get Started Now
            </motion.button>
          </div>

          {/* === Dynamic Demo (No transitions) === */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Side: Chat Window */}
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl p-6 w-full max-w-lg mx-auto border border-gray-700">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                <span className="text-lg font-semibold text-blue-400">IntelliDoc Chat</span>
                <span className="text-sm text-green-400 flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Online</span>
              </div>
              <div className="h-48 space-y-4">
                <div className={`flex ${currentChat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg max-w-[80%] ${currentChat.sender === 'user' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-200'}`}>
                    <TypingEffect text={currentChat.text} speed={40} delay={currentChat.delay} />
                  </div>
                </div>
              </div>
            </div>

            {/* **** CHANGED: "Live" Document now has only 2 sections **** */}
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-lg mx-auto border border-gray-700 h-64 p-6 relative overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-400 mb-4 border-b border-gray-700 pb-2">Contract_Final_v2.pdf</h3>
              
              {/* "Fake Document" content with 2 sections */}
              <div className="space-y-5 text-gray-500 text-sm h-full pr-2">
                
                {/* Section 1: Preamble */}
                <div className="relative">
                  {/* Highlight Box for Preamble */}
                  <motion.div 
                    className="absolute -inset-2 bg-blue-900/30 border-2 border-blue-500 rounded-lg z-0"
                    animate={{ opacity: highlightedSection === 'preamble' ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <h4 className="font-semibold text-gray-400 mb-2 z-10 relative">1. Preamble</h4>
                  <div className="space-y-2 z-10 relative">
                    <DummyLine w="w-3/4" />
                    <DummyLine />
                  </div>
                </div>
                
                {/* Section 2: Governing Law */}
                <div className="relative">
                  {/* Highlight Box for Governing Law */}
                  <motion.div 
                    className="absolute -inset-2 bg-blue-900/30 border-2 border-blue-500 rounded-lg z-0"
                    animate={{ opacity: highlightedSection === 'gov' ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <h4 className="font-semibold text-gray-400 mb-2 z-10 relative">2. Governing Law</h4>
                  <div className="space-y-2 z-10 relative">
                    <DummyLine w="w-full" />
                    <DummyLine w="w-1/2" />
                  </div>
                </div>

                {/* Section 3: Removed */}

              </div>
            </div>
            {/* **** END OF CHANGED SECTION **** */}

          </div>
        </div>
      </section>

      {/* 3. UPGRADED: Privacy First Section (Unchanged) */}
      <section className="w-full py-24 bg-gray-800 text-gray-100 text-center">
        <div className="container mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-5xl font-bold text-white mb-6">Your Data. Your Control.</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Click the cards to see the difference. IntelliDoc-Lite ensures your data never leaves your device.
            </p>
          </AnimateOnScroll>

          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-12">
            
            <motion.div
              onClick={() => setTheme('secure')}
              animate={{ 
                opacity: theme === 'secure' ? 1 : 0.4, 
                scale: theme === 'secure' ? 1.05 : 0.95,
                filter: theme === 'secure' ? 'blur(0px)' : 'blur(3px)'
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-gray-700 p-8 rounded-xl shadow-2xl w-full md:w-1/3 border border-gray-600 relative cursor-pointer"
            >
              <motion.div 
                animate={{ opacity: theme === 'secure' ? 0.4 : 0 }}
                className="absolute -inset-px bg-blue-500 rounded-xl blur-lg"
              />
              <FaLaptopCode className="text-blue-400 text-7xl mx-auto mb-6 relative z-10" />
              <h3 className="text-3xl font-semibold mb-4 text-white relative z-10">IntelliDoc-Lite</h3>
              <p className="text-gray-300 text-lg relative z-10">
                <span className="text-green-400 font-bold">Everything stays on your machine.</span> 100% private.
              </p>
            </motion.div>
            
            <motion.div
              onClick={() => setTheme('warning')}
              animate={{ 
                opacity: theme === 'warning' ? 1 : 0.4, 
                scale: theme === 'warning' ? 1.05 : 0.95,
                filter: theme === 'warning' ? 'blur(0px)' : 'blur(3px)'
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-gray-700 p-8 rounded-xl shadow-2xl w-full md:w-1/3 border border-gray-600 relative cursor-pointer"
            >
              <motion.div 
                animate={{ opacity: theme === 'warning' ? 0.4 : 0 }}
                className="absolute -inset-px bg-red-500 rounded-xl blur-lg"
              />
              <FaCloud className="text-gray-400 text-7xl mx-auto mb-6 relative z-10" />
              <h3 className="text-3xl font-semibold mb-4 text-gray-300 relative z-10">Cloud-Based AI</h3>
              <p className="text-gray-300 text-lg relative z-10">
                Your data is uploaded, processed, and stored by a third party.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. "Bento Box" Feature Grid (Unchanged) */}
      <section className="w-full py-24 bg-gray-900 text-gray-100">
        <div className="container mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-5xl font-bold text-white text-center mb-16">Document Intelligence, Reimagined</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <FeatureCard
              className="md:col-span-2 md:row-span-2"
              icon={<FaCommentDots />}
              title="Smart Q&A"
              description="Stop scanning. Start asking. Get plain-English answers from your documents instantly, complete with context."
              delay={0.1}
            >
              <div className="bg-gray-700 p-4 rounded-lg mt-6">
                <p className="text-gray-400 text-sm font-mono">&gt; What is the effective date?</p>
                <p className="text-blue-300 text-sm font-mono animate-pulse">&gt; Thinking...</p>
              </div>
            </FeatureCard>

            <FeatureCard
              icon={<FaFileContract />}
              title="AI Summaries"
              description="Distill 100-page reports into one-page summaries."
              delay={0.2}
            />

            <FeatureCard
              icon={<FaExchangeAlt />}
              title="Doc Comparison"
              description="Instantly spot differences between two document versions."
              delay={0.3}
            />

            <FeatureCard
              icon={<FaLock className="text-green-500" />}
              title="100% Offline & Secure"
              description="Your files never leave your computer. Period."
              delay={0.1}
            />

            <FeatureCard
              icon={<FaBrain />}
              title="Powered by Llama 3"
              description="Runs the latest local models for state-of-the-art reasoning."
              delay={0.2}
            />

            <FeatureCard
              icon={<FaCloudUploadAlt />}
              title="Supports Your Files"
              description="Works with PDF, DOCX, TXT, and more."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* 5. Tech Stack Trust Builder (Unchanged) */}
      <section className="w-full py-16 bg-gray-800 text-gray-100 text-center">
        <div className="container mx-auto px-6">
          <AnimateOnScroll>
            <h2 className="text-4xl font-bold text-white mb-10">Powered By Cutting-Edge Open Source</h2>
          </AnimateOnScroll>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
            {techStackLogos.map((tech, index) => (
              <AnimateOnScroll key={index} delay={index * 0.1} y={20}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex flex-col items-center opacity-70 hover:opacity-100"
                >
                  {React.cloneElement(tech.icon, { className: "text-blue-500 text-6xl mb-3" })}
                  <span className="text-gray-300 text-lg font-semibold">{tech.name}</span>
                </motion.div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final Call to Action (Unchanged) */}
      <section className="w-full py-20 bg-gray-900 text-gray-100 text-center">
        <AnimateOnScroll>
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-bold text-white mb-8">Take Back Control of Your Documents.</h2>
            <p className="text-xl text-gray-300 mb-12">
              Start analyzing securely, for free, in the next 30 seconds.
            </p>
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center bg-blue-600 text-white text-2xl font-bold py-4 px-12 rounded-full 
                         shadow-lg"
            >
              <FaArrowRight className="mr-3" />
              Get Started Now
            </motion.button>
          </div>
        </AnimateOnScroll>
      </section>

      {/* 7. Footer (Simple Text Version) */}
      <footer className="w-full py-8 bg-gray-900 text-gray-500 text-center text-sm border-t border-gray-800">
        <p>&copy; {new Date().getFullYear()} IntelliDoc-Lite. All rights reserved. Your privacy is guaranteed.</p>
        <p className="mt-2">Built with <FaHeart className="inline text-pink-500" /> and open source technologies.</p>
      </footer>
    </div>
  );
};

export default HomePage;
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   FaPlay, FaShieldAlt, FaCloudUploadAlt, FaBrain, FaCommentDots,
//   FaFileContract, FaRegLightbulb, FaExchangeAlt, FaArrowRight,
//   FaLaptopCode, FaCloud, FaLink, FaDatabase, FaCode, FaLock
// } from 'react-icons/fa';
// // 1. Import Framer Motion
// import { motion, useInView, useAnimation } from 'framer-motion';

// // 1.1. SVG Logo Component (Unchanged)
// const Logo = ({ className = "w-10 h-10" }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" fill="currentColor" className="text-gray-800" />
//     <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" className="text-gray-500" />
//     <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500" />
//     <path d="M12 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500" />
//   </svg>
// );

// // 1.2. Typing Effect Component (Unchanged)
// const TypingEffect = ({ text, speed = 50, delay = 0 }) => {
//   const [displayedText, setDisplayedText] = useState('');
//   const [isTyping, setIsTyping] = useState(true);

//   useEffect(() => {
//     let timeout;
//     if (isTyping && displayedText.length < text.length) {
//       timeout = setTimeout(() => {
//         setDisplayedText(text.slice(0, displayedText.length + 1));
//       }, speed);
//     } else if (displayedText.length === text.length) {
//       setIsTyping(false);
//     }
//     return () => clearTimeout(timeout);
//   }, [displayedText, isTyping, text, speed]);

//   useEffect(() => {
//     const startTyping = setTimeout(() => {
//       setDisplayedText('');
//       setIsTyping(true);
//     }, delay);
//     return () => clearTimeout(startTyping);
//   }, [text, delay]);

//   return <>{displayedText}<span className="animate-blink">|</span></>;
// };

// // 1.3. Tech Stack Logos (Unchanged)
// const techStackLogos = [
//   { name: 'Ollama', icon: <FaLaptopCode /> },
//   { name: 'Llama 3', icon: <FaBrain /> },
//   { name: 'LangChain', icon: <FaLink /> },
//   { name: 'ChromaDB', icon: <FaDatabase /> },
//   { name: 'FastAPI', icon: <FaCode /> },
// ];

// // 2. NEW: Reusable Animate-on-Scroll Wrapper
// const AnimateOnScroll = ({ children, delay = 0, duration = 0.5, y = 20 }) => {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, amount: 0.3 });
//   const controls = useAnimation();

//   useEffect(() => {
//     if (isInView) {
//       controls.start("visible");
//     }
//   }, [isInView, controls]);

//   return (
//     <motion.div
//       ref={ref}
//       variants={{
//         hidden: { opacity: 0, y: y },
//         visible: { opacity: 1, y: 0 },
//       }}
//       initial="hidden"
//       animate={controls}
//       transition={{ duration: duration, delay: delay, ease: "easeOut" }}
//     >
//       {children}
//     </motion.div>
//   );
// };

// // 3. NEW: Reusable Feature Card (for Bento Box)
// const FeatureCard = ({ icon, title, description, className = "", children, delay = 0 }) => (
//   <AnimateOnScroll delay={delay} y={30}>
//     <motion.div
//       whileHover={{ scale: 1.03, y: -5, boxShadow: '0px 10px 30px rgba(59, 130, 246, 0.2)' }}
//       transition={{ type: "spring", stiffness: 300, damping: 15 }}
//       className={`bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 h-full flex flex-col justify-between ${className}`}
//     >
//       <div>
//         <div className="text-blue-500 text-4xl mb-4">{icon}</div>
//         <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
//         <p className="text-gray-300">{description}</p>
//       </div>
//       {children}
//     </motion.div>
//   </AnimateOnScroll>
// );


// // 4. Main HomePage Component (Upgraded)
// const HomePage = () => {
//   const navigate = useNavigate();
  
//   // Using your original 'theme' state
//   const [theme, setTheme] = useState('secure'); // 'secure' or 'warning'

//   const handleGetStarted = () => {
//     navigate('/app');
//   };

//   // State for the dynamic hero demo (Unchanged)
//   const [currentChatIndex, setCurrentChatIndex] = useState(0);
//   const [highlightedSection, setHighlightedSection] = useState('none');

//   const heroDemoSequence = [
//     { chat: { sender: 'user', text: "What is the 'Governing Law' for this agreement?" }, highlight: 'gov', delay: 0 },
//     { chat: { sender: 'ai', text: "The agreement is governed by the laws of the State of Delaware." }, highlight: 'gov', delay: 3000 },
//     { chat: { sender: 'user', text: "Summarize the 'Confidentiality' clause." }, highlight: 'conf', delay: 6000 },
//     { chat: { sender: 'ai', text: "Both parties must keep proprietary information secret for 5 years." }, highlight: 'conf', delay: 9000 },
//   ];

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentChatIndex((prevIndex) => {
//         const nextIndex = (prevIndex + 1) % heroDemoSequence.length;
//         setHighlightedSection(heroDemoSequence[nextIndex].highlight);
//         return nextIndex;
//       });
//     }, 4500);
//     return () => clearInterval(timer);
//   }, [heroDemoSequence.length]);

//   const currentChat = heroDemoSequence[currentChatIndex].chat;

//   return (
//     <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center overflow-x-hidden">
      
//       {/* 1. Sticky Header with Logo (Unchanged) */}
//       <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-gray-900/70 border-b border-gray-800">
//         <div className="container mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <Logo className="w-8 h-8 text-blue-500" />
//             <span className="text-2xl font-bold text-white">IntelliDoc-Lite</span>
//           </div>
//           <motion.button
//             onClick={handleGetStarted}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="hidden md:inline-flex items-center bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
//           >
//             Get Started
//           </motion.button>
//         </div>
//       </nav>

//       {/* 2. UPGRADED: Hero Section */}
//       <section className="relative w-full py-20 md:py-32 flex items-center justify-center overflow-hidden">
        
//         {/* === NEW AURORA BLOB BACKGROUND === */}
        
//         {/* Secure Theme Blobs (Blue/Green) */}
//         <div 
//           className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${theme === 'secure' ? 'opacity-100' : 'opacity-0'}`}
//         >
//           <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-[500px] md:h-[500px] bg-blue-800 rounded-full filter blur-3xl opacity-30 animate-blob-float-1" />
//           <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-[500px] md:h-[500px] bg-green-800 rounded-full filter blur-3xl opacity-20 animate-blob-float-2" />
//         </div>

//         {/* Warning Theme Blobs (Red/Yellow) */}
//         <div 
//           className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${theme === 'warning' ? 'opacity-100' : 'opacity-0'}`}
//         >
//           <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-[500px] md:h-[500px] bg-red-800 rounded-full filter blur-3xl opacity-30 animate-blob-float-1" />
//           <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-[500px] md:h-[500px] bg-yellow-800 rounded-full filter blur-3xl opacity-20 animate-blob-float-2" />
//         </div>
        
//         {/* === END NEW BACKGROUND === */}


//         <div className="container mx-auto px-6 z-10">
//           {/* NEW: Hero Text Content with Framer Motion stagger */}
//           <div className="max-w-3xl text-center mx-auto">
//             <motion.h1 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//               className="text-5xl md:text-7xl font-extrabold leading-tight text-white mb-6"
//             >
//               Your Documents.<br />Your AI. <span className="text-blue-500">100% Private.</span>
//             </motion.h1>
//             <motion.p 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
//               className="text-xl md:text-2xl text-gray-300 mb-10"
//             >
//               IntelliDoc-Lite transforms your contracts and reports into intelligent, conversational partners. No cloud. No leaks. No compromises.
//             </motion.p>
//             <motion.button
//               onClick={handleGetStarted}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
//               whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(59, 130, 246, 0.3)" }}
//               whileTap={{ scale: 0.95 }}
//               className="inline-flex items-center justify-center bg-blue-600 text-white text-2xl font-bold py-4 px-12 rounded-full 
//                          shadow-xl"
//             >
//               <FaPlay className="mr-3" />
//               Get Started Now
//             </motion.button>
//           </div>

//           {/* Dynamic Demo - Wrapped in AnimateOnScroll */}
//           <AnimateOnScroll delay={0.6}>
//             <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
//               {/* Left Side: Chat Window */}
//               <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg mx-auto border border-gray-700">
//                 <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
//                   <span className="text-lg font-semibold text-blue-400">IntelliDoc Chat</span>
//                   <span className="text-sm text-green-400 flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Online</span>
//                 </div>
//                 <div className="h-48 space-y-4">
//                   <div className={`flex ${currentChat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//                     <div className={`p-3 rounded-lg max-w-[80%] ${currentChat.sender === 'user' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-200'}`}>
//                       <TypingEffect text={currentChat.text} speed={40} delay={currentChat.delay} />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Side: "Live" Document (Unchanged logic) */}
//               <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-auto border border-gray-700 h-64 p-6 relative overflow-hidden">
//                 <h3 className="text-lg font-semibold text-gray-400 mb-4 border-b border-gray-700 pb-2">Contract_Final_v2.pdf</h3>
//                 <div className="space-y-3 opacity-30">
//                   <div className="h-4 bg-gray-600 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-600 rounded w-full"></div>
//                   <div className="h-4 bg-gray-600 rounded w-1/2"></div>
//                 </div>
//                 <div className={`absolute left-4 right-4 p-4 border-2 border-blue-500 bg-blue-900/30 rounded-lg transition-all duration-500 ease-in-out
//                   ${highlightedSection === 'gov' ? 'opacity-100 top-20' : 'opacity-0 top-16'}`}>
//                   <div className="h-3 bg-blue-400/50 rounded w-1/3 mb-2"></div>
//                   <div className="h-3 bg-blue-400/50 rounded w-full"></div>
//                 </div>
//                 <div className={`absolute left-4 right-4 p-4 border-2 border-blue-500 bg-blue-900/30 rounded-lg transition-all duration-500 ease-in-out
//                   ${highlightedSection === 'conf' ? 'opacity-100 top-36' : 'opacity-0 top-32'}`}>
//                   <div className="h-3 bg-blue-400/50 rounded w-1/3 mb-2"></div>
//                   <div className="h-3 bg-blue-400/50 rounded w-full"></div>
//                 </div>
//               </div>

//             </div>
//           </AnimateOnScroll>
//         </div>
//       </section>

//       {/* 3. UPGRADED: Privacy First Section */}
//       <section className="w-full py-24 bg-gray-800 text-gray-100 text-center">
//         <div className="container mx-auto px-6">
//           <AnimateOnScroll>
//             <h2 className="text-5xl font-bold text-white mb-6">Your Data. Your Control.</h2>
//             <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
//               Click the cards to see the difference. IntelliDoc-Lite ensures your data never leaves your device.
//             </p>
//           </AnimateOnScroll>

//           {/* Using 'theme' state and 'onClick' handlers */}
//           <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-12">
            
//             {/* Your App - Local */}
//             <motion.div
//               onClick={() => setTheme('secure')} // onClick handler
//               animate={{ 
//                 opacity: theme === 'secure' ? 1 : 0.4, 
//                 scale: theme === 'secure' ? 1.05 : 0.95,
//                 filter: theme === 'secure' ? 'blur(0px)' : 'blur(3px)'
//               }}
//               transition={{ duration: 0.5, ease: "easeInOut" }}
//               className="bg-gray-700 p-8 rounded-xl shadow-2xl w-full md:w-1/3 border border-gray-600 relative cursor-pointer"
//             >
//               {/* Glow Effect */}
//               <motion.div 
//                 animate={{ opacity: theme === 'secure' ? 0.4 : 0 }}
//                 className="absolute -inset-px bg-blue-500 rounded-xl blur-lg"
//               />
//               <FaLaptopCode className="text-blue-400 text-7xl mx-auto mb-6 relative z-10" />
//               <h3 className="text-3xl font-semibold mb-4 text-white relative z-10">IntelliDoc-Lite</h3>
//               <p className="text-gray-300 text-lg relative z-10">
//                 <span className="text-green-400 font-bold">Everything stays on your machine.</span> 100% private.
//               </p>
//             </motion.div>
            
//             {/* Cloud-Based Apps */}
//             <motion.div
//               onClick={() => setTheme('warning')} // onClick handler
//               animate={{ 
//                 opacity: theme === 'warning' ? 1 : 0.4, 
//                 scale: theme === 'warning' ? 1.05 : 0.95,
//                 filter: theme === 'warning' ? 'blur(0px)' : 'blur(3px)'
//               }}
//               transition={{ duration: 0.5, ease: "easeInOut" }}
//               className="bg-gray-700 p-8 rounded-xl shadow-2xl w-full md:w-1/3 border border-gray-600 relative cursor-pointer"
//             >
//               {/* Glow Effect */}
//               <motion.div 
//                 animate={{ opacity: theme === 'warning' ? 0.4 : 0 }}
//                 className="absolute -inset-px bg-red-500 rounded-xl blur-lg"
//               />
//               <FaCloud className="text-gray-400 text-7xl mx-auto mb-6 relative z-10" />
//               <h3 className="text-3xl font-semibold mb-4 text-gray-300 relative z-10">Cloud-Based AI</h3>
//               <p className="text-gray-400 text-lg relative z-10">
//                 Your data is uploaded, processed, and stored by a third party.
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* 4. "Bento Box" Feature Grid - Using new FeatureCard component */}
//       <section className="w-full py-24 bg-gray-900 text-gray-100">
//         <div className="container mx-auto px-6">
//           <AnimateOnScroll>
//             <h2 className="text-5xl font-bold text-white text-center mb-16">Document Intelligence, Reimagined</h2>
//           </AnimateOnScroll>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
//             <FeatureCard
//               className="md:col-span-2 md:row-span-2"
//               icon={<FaCommentDots />}
//               title="Smart Q&A"
//               description="Stop scanning. Start asking. Get plain-English answers from your documents instantly, complete with context."
//               delay={0.1}
//             >
//               <div className="bg-gray-700 p-4 rounded-lg mt-6">
//                 <p className="text-gray-400 text-sm font-mono">> What is the effective date?</p>
//                 <p className="text-blue-300 text-sm font-mono animate-pulse">> Thinking...</p>
//               </div>
//             </FeatureCard>

//             <FeatureCard
//               icon={<FaFileContract />}
//               title="AI Summaries"
//               description="Distill 100-page reports into one-page summaries."
//               delay={0.2}
//             />

//             <FeatureCard
//               icon={<FaExchangeAlt />}
//               title="Doc Comparison"
//               description="Instantly spot differences between two document versions."
//               delay={0.3}
//             />

//             <FeatureCard
//               icon={<FaLock className="text-green-500" />}
//               title="100% Offline & Secure"
//               description="Your files never leave your computer. Period."
//               delay={0.1}
//             />

//             <FeatureCard
//               icon={<FaBrain />}
//               title="Powered by Llama 3"
//               description="Runs the latest local models for state-of-the-art reasoning."
//               delay={0.2}
//             />

//             <FeatureCard
//               icon={<FaCloudUploadAlt />}
//               title="Supports Your Files"
//               description="Works with PDF, DOCX, TXT, and more."
//               delay={0.3}
//             />
//           </div>
//         </div>
//       </section>

//       {/* 5. Tech Stack Trust Builder - Upgraded with motion */}
//       <section className="w-full py-16 bg-gray-800 text-gray-100 text-center">
//         <div className="container mx-auto px-6">
//           <AnimateOnScroll>
//             <h2 className="text-4xl font-bold text-white mb-10">Powered By Cutting-Edge Open Source</h2>
//           </AnimateOnScroll>
//           <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
//             {techStackLogos.map((tech, index) => (
//               <AnimateOnScroll key={index} delay={index * 0.1} y={20}>
//                 <motion.div
//                   whileHover={{ y: -10, scale: 1.1 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                   className="flex flex-col items-center opacity-70 hover:opacity-100"
//                 >
//                   {React.cloneElement(tech.icon, { className: "text-blue-500 text-6xl mb-3" })}
//                   <span className="text-gray-300 text-lg font-semibold">{tech.name}</span>
//                 </motion.div>
//               </AnimateOnScroll>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* 6. Final Call to Action - Upgraded with motion */}
//       <section className="w-full py-20 bg-gray-900 text-gray-100 text-center">
//         <AnimateOnScroll>
//           <div className="container mx-auto px-6">
//             <h2 className="text-5xl font-bold text-white mb-8">Take Back Control of Your Documents.</h2>
//             <p className="text-xl text-gray-300 mb-12">
//               Start analyzing securely, for free, in the next 30 seconds.
//             </p>
//             <motion.button
//               onClick={handleGetStarted}
//               whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(59, 130, 246, 0.3)" }}
//               whileTap={{ scale: 0.95 }}
//               className="inline-flex items-center justify-center bg-blue-600 text-white text-2xl font-bold py-4 px-12 rounded-full 
//                          shadow-lg"
//             >
//               <FaArrowRight className="mr-3" />
//               Get Started Now
//             </motion.button>
//           </div>
//         </AnimateOnScroll>
//       </section>

//       {/* 7. Footer (Unchanged) */}
//       <footer className="w-full py-8 bg-gray-900 text-gray-500 text-center text-sm border-t border-gray-800">
//         <p>&copy; {new Date().getFullYear()} IntelliDoc-Lite. All rights reserved. Your privacy is guaranteed.</p>
//         <p className="mt-2">Built with ❤️ and open source technologies.</p>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;

// import React, { useState, useEffect } from 'react'; // 'useState' is now used
// import { useNavigate } from 'react-router-dom';
// import {
//   FaPlay, FaShieldAlt, FaCloudUploadAlt, FaBrain, FaCommentDots,
//   FaFileContract, FaRegLightbulb, FaExchangeAlt, FaArrowRight,
//   FaLaptopCode, FaCloud, FaLink, FaDatabase, FaCode, FaLock
// } from 'react-icons/fa';

// // 1. SVG Logo Component
// const Logo = ({ className = "w-10 h-10" }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" fill="currentColor" className="text-gray-800" />
//     <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" className="text-gray-500" />
//     <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500" />
//     <path d="M12 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500" />
//   </svg>
// );

// // 2. Helper component for the typing effect
// const TypingEffect = ({ text, speed = 50, delay = 0 }) => {
//   const [displayedText, setDisplayedText] = useState('');
//   const [isTyping, setIsTyping] = useState(true);

//   useEffect(() => {
//     let timeout;
//     if (isTyping && displayedText.length < text.length) {
//       timeout = setTimeout(() => {
//         setDisplayedText(text.slice(0, displayedText.length + 1));
//       }, speed);
//     } else if (displayedText.length === text.length) {
//       setIsTyping(false);
//     }
//     return () => clearTimeout(timeout);
//   }, [displayedText, isTyping, text, speed]);

//   useEffect(() => {
//     const startTyping = setTimeout(() => {
//       setDisplayedText('');
//       setIsTyping(true);
//     }, delay);
//     return () => clearTimeout(startTyping);
//   }, [text, delay]);

//   return <>{displayedText}<span className="animate-blink">|</span></>;
// };

// // 3. Tech stack logos
// const techStackLogos = [
//   { name: 'Ollama', icon: <FaLaptopCode /> },
//   { name: 'Llama 3', icon: <FaBrain /> },
//   { name: 'LangChain', icon: <FaLink /> },
//   { name: 'ChromaDB', icon: <FaDatabase /> },
//   { name: 'FastAPI', icon: <FaCode /> },
// ];

// // Main HomePage Component
// const HomePage = () => {
//   const navigate = useNavigate();
  
//   // NEW: State to manage the active theme
//   const [theme, setTheme] = useState('secure'); // 'secure' or 'warning'

//   const handleGetStarted = () => {
//     navigate('/app');
//   };

//   // 4. State for the dynamic hero
//   const [currentChatIndex, setCurrentChatIndex] = useState(0);
//   const [highlightedSection, setHighlightedSection] = useState('none');

//   const heroDemoSequence = [
//     { chat: { sender: 'user', text: "What is the 'Governing Law' for this agreement?" }, highlight: 'gov', delay: 0 },
//     { chat: { sender: 'ai', text: "The agreement is governed by the laws of the State of Delaware." }, highlight: 'gov', delay: 3000 },
//     { chat: { sender: 'user', text: "Summarize the 'Confidentiality' clause." }, highlight: 'conf', delay: 6000 },
//     { chat: { sender: 'ai', text: "Both parties must keep proprietary information secret for 5 years." }, highlight: 'conf', delay: 9000 },
//   ];

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentChatIndex((prevIndex) => {
//         const nextIndex = (prevIndex + 1) % heroDemoSequence.length;
//         setHighlightedSection(heroDemoSequence[nextIndex].highlight);
//         return nextIndex;
//       });
//     }, 4500);
//     return () => clearInterval(timer);
//   }, [heroDemoSequence.length]);

//   const currentChat = heroDemoSequence[currentChatIndex].chat;

//   return (
//     <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center">
      
//       {/* 1. Sticky Header with Logo */}
//       <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-gray-900/70 border-b border-gray-800">
//         <div className="container mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <Logo className="w-8 h-8 text-blue-500" />
//             <span className="text-2xl font-bold text-white">IntelliDoc-Lite</span>
//           </div>
//           <button
//             onClick={handleGetStarted}
//             className="hidden md:inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300"
//           >
//             Get Started
//           </button>
//         </div>
//       </nav>

//       {/* 2. UPGRADED: Hero Section */}
//       <section className="relative w-full py-20 md:py-32 flex items-center justify-center overflow-hidden">
        
//         {/* NEW: Two stacked gradients for crossfading */}
        
//         {/* Secure Theme Gradient (Blue/Green) */}
//         <div 
//           className={`absolute inset-0 bg-gradient-to-br from-blue-800 via-gray-900 to-green-800
//                      bg-[length:200%_200%] animate-gradient-shift
//                      transition-opacity duration-1000 ease-in-out
//                      ${theme === 'secure' ? 'opacity-70' : 'opacity-0'}`} // CHANGED: Conditional opacity
//         />
        
//         {/* Warning Theme Gradient (Red/Yellow) */}
//         <div 
//           className={`absolute inset-0 bg-gradient-to-br from-red-900 via-gray-900 to-yellow-800
//                      bg-[length:200%_200%] animate-gradient-shift
//                      transition-opacity duration-1000 ease-in-out
//                      ${theme === 'warning' ? 'opacity-70' : 'opacity-0'}`} // CHANGED: Conditional opacity
//         />

//         <div className="container mx-auto px-6 z-10">
//           {/* Hero Text Content */}
//           <div className="max-w-3xl text-center mx-auto">
//             <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white mb-6 animate-fade-in-up">
//               Your Documents.<br />Your AI. <span className="text-blue-500">100% Private.</span>
//             </h1>
//             <p className="text-xl md:text-2xl text-gray-300 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
//               IntelliDoc-Lite transforms your contracts and reports into intelligent, conversational partners. No cloud. No leaks. No compromises.
//             </p>
//             <button
//               onClick={handleGetStarted}
//               className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-4 px-12 rounded-full 
//                          shadow-xl transition-transform transform hover:scale-105 duration-300 animate-fade-in-up
//                          animate-pulse-shadow"
//               style={{ animationDelay: '0.4s' }}
//             >
//               <FaPlay className="mr-3" />
//               Get Started Now
//             </button>
//           </div>

//           {/* Dynamic Demo */}
//           <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            
//             {/* Left Side: Chat Window */}
//             <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg mx-auto border border-gray-700">
//               <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
//                 <span className="text-lg font-semibold text-blue-400">IntelliDoc Chat</span>
//                 <span className="text-sm text-green-400 flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Online</span>
//               </div>
//               <div className="h-48 space-y-4">
//                 <div className={`flex ${currentChat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//                   <div className={`p-3 rounded-lg max-w-[80%] ${currentChat.sender === 'user' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-200'}`}>
//                     <TypingEffect text={currentChat.text} speed={40} delay={currentChat.delay} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Side: "Live" Document */}
//             <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-auto border border-gray-700 h-64 p-6 relative overflow-hidden">
//               <h3 className="text-lg font-semibold text-gray-400 mb-4 border-b border-gray-700 pb-2">Contract_Final_v2.pdf</h3>
//               <div className="space-y-3 opacity-30">
//                 <div className="h-4 bg-gray-600 rounded w-3/4"></div>
//                 <div className="h-4 bg-gray-600 rounded w-full"></div>
//                 <div className="h-4 bg-gray-600 rounded w-1/2"></div>
//               </div>
//               {/* Dynamic Highlight Boxes */}
//               <div className={`absolute left-4 right-4 p-4 border-2 border-blue-500 bg-blue-900/30 rounded-lg transition-all duration-500 ease-in-out
//                 ${highlightedSection === 'gov' ? 'opacity-100 top-20' : 'opacity-0 top-16'}`}>
//                 <div className="h-3 bg-blue-400/50 rounded w-1/3 mb-2"></div>
//                 <div className="h-3 bg-blue-400/50 rounded w-full"></div>
//               </div>
//               <div className={`absolute left-4 right-4 p-4 border-2 border-blue-500 bg-blue-900/30 rounded-lg transition-all duration-500 ease-in-out
//                 ${highlightedSection === 'conf' ? 'opacity-100 top-36' : 'opacity-0 top-32'}`}>
//                 <div className="h-3 bg-blue-400/50 rounded w-1/3 mb-2"></div>
//                 <div className="h-3 bg-blue-400/50 rounded w-full"></div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* 3. Privacy First Section */}
//       <section className="w-full py-20 bg-gray-800 text-gray-100 text-center">
//         <div className="container mx-auto px-6">
//           <h2 className="text-5xl font-bold text-white mb-12">Your Data. Your Control.</h2>
//           <div className="flex flex-col md:flex-row justify-center items-center space-y-12 md:space-y-0 md:space-x-20">
            
//             {/* Your App - Local */}
//             <div 
//               className={`bg-gray-700 p-8 rounded-xl shadow-2xl w-full md:w-1/3 border border-gray-600 
//                          transform hover:-translate-y-2 transition-all duration-300 cursor-pointer
//                          ${theme === 'warning' ? 'opacity-50' : 'opacity-100'}`} // CHANGED: Conditional opacity
//               onClick={() => setTheme('secure')} // NEW: OnClick handler
//             >
//               <FaLaptopCode className="text-blue-400 text-7xl mx-auto mb-6" />
//               <h3 className="text-3xl font-semibold mb-4 text-white">IntelliDoc-Lite</h3>
//               <p className="text-gray-300 text-lg">
//                 <span className="text-green-400 font-bold">Everything stays on your machine.</span> 100% private.
//               </p>
//             </div>
            
//             <FaArrowRight className="text-blue-500 text-5xl hidden md:block" />
//             <FaArrowRight className="text-blue-500 text-5xl md:hidden rotate-90" />
            
//             {/* Cloud-Based Apps */}
//             <div 
//               className={`bg-gray-700 p-8 rounded-xl shadow-2xl w-full md:w-1/3 border border-gray-600 
//                          transform hover:-translate-y-2 transition-all duration-300 cursor-pointer
//                          ${theme === 'secure' ? 'opacity-50' : 'opacity-70'}`} // CHANGED: Conditional opacity
//               onClick={() => setTheme('warning')} // NEW: OnClick handler
//             >
//               <FaCloud className="text-gray-400 text-7xl mx-auto mb-6" />
//               <h3 className="text-3xl font-semibold mb-4 text-gray-300">Cloud-Based AI</h3>
//               <p className="text-gray-400 text-lg">
//                 Your data is uploaded, processed, and stored by a third party.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 4. "Bento Box" Feature Grid */}
//       <section className="w-full py-24 bg-gray-900 text-gray-100">
//         <div className="container mx-auto px-6">
//           <h2 className="text-5xl font-bold text-white text-center mb-16">Document Intelligence, Reimagined</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
//             <div className="md:col-span-2 md:row-span-2 bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 flex flex-col justify-between transform hover:scale-[1.02] transition-transform duration-300">
//               <div>
//                 <FaCommentDots className="text-blue-500 text-5xl mb-4" />
//                 <h3 className="text-3xl font-semibold text-white mb-3">Smart Q&A</h3>
//                 <p className="text-gray-300 text-lg mb-6">
//                   Stop scanning. Start asking. Get plain-English answers from your documents instantly, complete with context.
//                 </p>
//               </div>
//               <div className="bg-gray-700 p-4 rounded-lg">
//                 <p className="text-gray-400 text-sm font-mono">> What is the effective date?</p>
//                 <p className="text-blue-300 text-sm font-mono animate-pulse">> Thinking...</p>
//               </div>
//             </div>

//             <div className="md:col-span-1 bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 transform hover:scale-[1.02] transition-transform duration-300">
//               <FaFileContract className="text-blue-500 text-4xl mb-4" />
//               <h3 className="text-2xl font-semibold text-white mb-3">AI Summaries</h3>
//               <p className="text-gray-300">
//                 Distill 100-page reports into one-page summaries.
//               </p>
//             </div>

//             <div className="md:col-span-1 bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 transform hover:scale-[1.02] transition-transform duration-300">
//               <FaExchangeAlt className="text-blue-500 text-4xl mb-4" />
//               <h3 className="text-2xl font-semibold text-white mb-3">Doc Comparison</h3>
//               <p className="text-gray-300">
//                 Instantly spot differences between two document versions.
//               </p>
//             </div>

//             <div className="md:col-span-1 bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 transform hover:scale-[1.02] transition-transform duration-300">
//               <FaLock className="text-green-500 text-4xl mb-4" />
//               <h3 className="text-2xl font-semibold text-white mb-3">100% Offline & Secure</h3>
//               <p className="text-gray-300">
//                 Your files never leave your computer. Period.
//               </p>
//             </div>

//             <div className="md:col-span-1 bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 transform hover:scale-[1.02] transition-transform duration-300">
//               <FaBrain className="text-blue-500 text-4xl mb-4" />
//               <h3 className="text-2xl font-semibold text-white mb-3">Powered by Llama 3</h3>
//               <p className="text-gray-300">
//                 Runs the latest local models for state-of-the-art reasoning.
//               </p>
//             </div>

//              <div className="md:col-span-1 bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 transform hover:scale-[1.02] transition-transform duration-300">
//               <FaCloudUploadAlt className="text-blue-500 text-4xl mb-4" />
//               <h3 className="text-2xl font-semibold text-white mb-3">Supports Your Files</h3>
//               <p className="text-gray-300">
//                 Works with PDF, DOCX, TXT, and more.
//               </p>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* 5. Tech Stack Trust Builder */}
//       <section className="w-full py-16 bg-gray-800 text-gray-100 text-center">
//         <div className="container mx-auto px-6">
//           <h2 className="text-4xl font-bold text-white mb-10">Powered By Cutting-Edge Open Source</h2>
//           <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
//             {techStackLogos.map((tech, index) => (
//               <div key={index} className="flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity duration-300">
//                 {React.cloneElement(tech.icon, { className: "text-blue-500 text-6xl mb-3" })}
//                 <span className="text-gray-300 text-lg font-semibold">{tech.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* 6. Final Call to Action */}
//       <section className="w-full py-20 bg-gray-900 text-gray-100 text-center">
//         <div className="container mx-auto px-6">
//           <h2 className="text-5xl font-bold text-white mb-8">Take Back Control of Your Documents.</h2>
//           <p className="text-xl text-gray-300 mb-12">
//             Start analyzing securely, for free, in the next 30 seconds.
//           </p>
//           <button
//             onClick={handleGetStarted}
//             className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-4 px-12 rounded-full 
//                        shadow-lg transition-transform transform hover:scale-105 duration-300
//                        animate-pulse-shadow"
//           >
//             <FaArrowRight className="mr-3" />
//             Get Started Now
//           </button>
//         </div>
//       </section>

//       {/* 7. Footer */}
//       <footer className="w-full py-8 bg-gray-900 text-gray-500 text-center text-sm border-t border-gray-800">
//         <p>&copy; {new Date().getFullYear()} IntelliDoc-Lite. All rights reserved. Your privacy is guaranteed.</p>
//         <p className="mt-2">Built with ❤️ and open source technologies.</p>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;