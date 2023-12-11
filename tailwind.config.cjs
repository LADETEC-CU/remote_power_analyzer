const config = {
    content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  
    plugins: [require('flowbite/plugin')],
  
    darkMode: 'class',
  
    theme: {
      extend: {
        colors: {
          // flowbite-svelte
          primary: {
            50: '#EBF5FF',
            100: '#E1EFFE',
            200: '#C3DDFD',
            300: '#A4CAFE',
            400: '#76A9FA',
            500: '#3F83F8',
            600: '#1C64F2',
            700: '#1A56DB',
            800: '#1E429F',
            900: '#233876'
          }
        }
      }
    }
  };
  
  module.exports = config;