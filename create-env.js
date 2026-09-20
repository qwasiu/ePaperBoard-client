const fs = require('fs');

// Define default values
const defaultValues = {
  REACT_APP_SERVER_ADDR: 'http://localhost:4000',
  // Add other variables as needed
};

// Convert default values to .env format
const envContent = Object.entries(defaultValues)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n') + '\n';

// Write to .env.development file
fs.writeFileSync('.env.development', envContent);