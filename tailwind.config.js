/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          sage: '#586159',
          gray: '#AEB0A9',
          terra: '#A6685B',
          cream: '#E5E5DD',
          dark: '#171D26',
          charcoal: '#626265'
        }
      }
    }
  },
  plugins: [],
};
