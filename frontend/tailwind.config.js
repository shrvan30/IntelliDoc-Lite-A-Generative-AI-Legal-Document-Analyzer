/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        // --- Your existing animations ---
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'pulse-shadow': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(59, 130, 246, 0.4)' },
          '50%': { 'box-shadow': '0 0 35px rgba(59, 130, 246, 0.7)' },
        },
        'blob-float-1': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(20px, 40px) scale(1.1)' },
        },
        'blob-float-2': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(-30px, -20px) scale(1.1)' },
        },

        // --- NEW: Shimmering grid animation ---
        'grid-shimmer': {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 0.2 },
        }
      },
      animation: {
        // --- Your existing animations ---
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'blink': 'blink 1s infinite',
        'pulse-shadow': 'pulse-shadow 3s ease-in-out infinite',
        'blob-float-1': 'blob-float-1 8s ease-in-out infinite',
        'blob-float-2': 'blob-float-2 10s ease-in-out infinite',
        
        // --- NEW: Shimmering grid animation ---
        'grid-shimmer': 'grid-shimmer 7s ease-in-out infinite'
      },
    },
  },
  plugins: [],
}

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       keyframes: {
//         // --- OLD ONES (keep if needed, but not for this new bg) ---
//         fadeInUp: {
//           '0%': { opacity: '0', transform: 'translateY(20px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//         blink: {
//           '0%, 100%': { opacity: '1' },
//           '50%': { opacity: '0' },
//         },
//         'pulse-shadow': {
//           '0%, 100%': { 
//             'box-shadow': '0 0 20px rgba(59, 130, 246, 0.4)',
//           },
//           '50%': { 
//             'box-shadow': '0 0 35px rgba(59, 130, 246, 0.7)',
//           },
//         },
        
//         // --- REMOVE THIS ---
//         // 'aurora-shift': { ... },

//         // --- ADD THESE NEW KEYFRAMES ---
//         'blob-float-1': {
//           '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
//           '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
//           '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
//         },
//         'blob-float-2': {
//           '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
//           '33%': { transform: 'translate(-50px, 30px) scale(1.1)' },
//           '66%': { transform: 'translate(40px, -20px) scale(0.9)' },
//         }
//       },
//       animation: {
//         // --- OLD ---
//         'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
//         'blink': 'blink 1s infinite',
//         'pulse-shadow': 'pulse-shadow 3s ease-in-out infinite',

//         // --- REMOVE THIS ---
//         // 'aurora-shift': 'aurora-shift 8s ease infinite',

//         // --- ADD THESE NEW ANIMATIONS ---
//         'blob-float-1': 'blob-float-1 20s ease-in-out infinite',
//         'blob-float-2': 'blob-float-2 18s ease-in-out infinite',
//       },
//     },
//   },
//   plugins: [],
// }

