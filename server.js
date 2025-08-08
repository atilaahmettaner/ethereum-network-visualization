const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Statik dosyaları sunmak için
app.use(express.static('.'));
app.use('/html', express.static('html'));
app.use('/js', express.static('js'));

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// Ether visualizasyon sayfası
app.get('/ether', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'ether.html'));
});

// API test sayfası
app.get('/api', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'api.html'));
});

// Vis sayfası
app.get('/vis', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'vis.html'));
});

// Ethereum örnek verileri API endpoint'i
app.get('/ethereum-sample.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'ethereum-sample.json'));
});

// Miserables verileri API endpoint'i
app.get('/miserables.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'miserables.json'));
});

app.listen(port, () => {
    console.log(`🚀 Ethereum Network Visualization running at: http://localhost:${port}`);
    console.log(`📱 Available pages:`);
    console.log(`   • Main page: http://localhost:${port}/`);
    console.log(`   • Ethereum visualization: http://localhost:${port}/ether`);
    console.log(`   • API testing: http://localhost:${port}/api`);
    console.log(`   • Advanced visualization: http://localhost:${port}/vis`);
    console.log(`🔗 Sample Ethereum data includes: Vitalik Buterin, Binance, Uniswap, MakerDAO & more!`);
});
