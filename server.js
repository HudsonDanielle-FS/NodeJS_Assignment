const http = require('http');
require('dotenv').config();
const app = require('./app/app');

// http.createServer(app).listen(process.env.port, () => {
//     console.log(`The server is running on port ${process.env.port}`);
// });

http.createServer(app).listen(process.env.port || 3000, () => {
    console.log(`The server is running on port ${process.env.port}`);
});
