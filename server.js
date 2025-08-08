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

app.listen(port, () => {
    console.log(`Ethereum Network Visualization çalışıyor: http://localhost:${port}`);
    console.log(`Mevcut sayfalar:`);
    console.log(`- Ana sayfa: http://localhost:${port}/`);
    console.log(`- Ether görselleştirme: http://localhost:${port}/ether`);
    console.log(`- API test: http://localhost:${port}/api`);
    console.log(`- Visualizasyon: http://localhost:${port}/vis`);
});
