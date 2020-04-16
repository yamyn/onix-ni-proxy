const http = require('http');
const httpProxy = require('http-proxy');
const Proxy = require('./proxy');

httpProxy
    .createProxyServer({
        target: 'http://localhost:3000',
        changeOrigin: true,
        // toProxy: true,
        pathRewrite: {
            'http://localhost:3000/': 'https://www.google.com.ua/',
        },
    })
    .listen(8000);

http.createServer((req, res) => {
    Proxy.getPage(req, res);
}).listen(3000);
