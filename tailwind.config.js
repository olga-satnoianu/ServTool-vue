/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5867dd',
        secondary:'#5d78ff',
        third:'#64b5f6',
        accent:'#0046AD',
        pagebg:'#F2F3F8',
        text:'#6c7293',
        border:"#BDBDBD",
        borderLight:"#EAEAEA",
        error:"#d52525",
        light:'#a2a3b7',
        dark:'#1E1E2D',
        dark2:'#1b1b28',
        hoverthird:'#bbdefb'
      },
      fontSize: {
        'md':'15px'
      },
      boxShadow:{
        'md':'0px 12px 12px rgba(50, 143, 254, 0.15)'
      }
    },
  },
  plugins: [],
}

