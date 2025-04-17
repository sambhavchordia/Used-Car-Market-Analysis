const http = require('http');

// Simple server status check
const checkServerStatus = () => {
  console.log('Testing API connectivity...');
  
  // Options for the HTTP request
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/csv',
    method: 'GET'
  };
  
  // Make the request
  const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response Body:', data);
      console.log('API test completed.');
      console.log('\nIf you see a 200 status code, your server is running and the /api/csv endpoint is available.');
      console.log('Now try using the web interface to upload a CSV file.');
    });
  });
  
  // Handle errors
  req.on('error', (error) => {
    console.error(`Error testing API: ${error.message}`);
    console.log('Make sure the server is running on port 5000.');
  });
  
  // End the request
  req.end();
};

// Run the test
checkServerStatus(); 