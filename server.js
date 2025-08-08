const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Etherscan API entegrasyonu
async function getLiveEthereumData(targetAddress = "0x85464B207D7C1FCe8Da13d2F3d950c796E399A9C") {
    try {
        const api = require('etherscan-api').init('7ECHSQBN5X133MMHU5JJWKUBR8CDKW3243');
        const balance = await api.account.txlist(targetAddress, 1, 89999999);
        
        if (!balance || !balance.result) {
            return { nodes: [], links: [] };
        }
        
        const transactions = balance.result;
        const addressMap = new Map();
        const links = [];
        
        // Bilinen adres tanımları
        const knownAddresses = {
            '0xdac17f958d2ee523a2206206994597c13d831ec7': { name: 'Tether (USDT)', type: 'token_contract', color: '#26a17b' },
            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { name: 'USD Coin (USDC)', type: 'token_contract', color: '#2775ca' },
            '0x6b175474e89094c44da98b954eedeac495271d0f': { name: 'MakerDAO (DAI)', type: 'defi_protocol', color: '#f5ac37' },
            '0x85464b207d7c1fce8da13d2f3d950c796e399a9c': { name: 'Target Wallet', type: 'main_wallet', color: '#ff6b6b' },
            '0xc333e80ef2dec2805f239e3f1e810612d294f771': { name: 'Exchange Wallet', type: 'exchange', color: '#4ecdc4' }
        };
        
        function identifyAddress(address) {
            const addr = address.toLowerCase();
            if (knownAddresses[addr]) {
                return knownAddresses[addr];
            }
            return {
                name: `Wallet ${addr.substring(0, 8)}...`,
                type: 'wallet',
                color: '#95a5a6'
            };
        }
        
        // İşlemleri işle
        transactions.forEach(tx => {
            if (tx.from && tx.to) {
                addressMap.set(tx.from.toLowerCase(), identifyAddress(tx.from));
                addressMap.set(tx.to.toLowerCase(), identifyAddress(tx.to));
                
                links.push({
                    source: tx.from.toLowerCase(),
                    target: tx.to.toLowerCase(),
                    value: parseFloat(tx.value) / 1e18,
                    type: tx.value > 0 ? 'ETH Transfer' : 'Contract Call',
                    hash: tx.hash,
                    timestamp: new Date(tx.timeStamp * 1000).toISOString(),
                    gasUsed: tx.gasUsed
                });
            }
        });
        
        const nodes = Array.from(addressMap.entries()).map(([address, info], index) => ({
            id: address,
            name: info.name,
            type: info.type,
            color: info.color,
            group: index % 10 + 1
        }));
        
        return { nodes, links };
        
    } catch (error) {
        console.error('Error fetching Ethereum data:', error);
        throw error;
    }
}

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

// Canlı Ethereum verileri API endpoint'i
app.get('/api/live-ethereum', async (req, res) => {
    try {
        console.log('🔴 Fetching live Ethereum data...');
        const data = await getLiveEthereumData();
        res.json(data);
    } catch (error) {
        console.error('Error fetching live data:', error);
        res.status(500).json({ 
            error: 'Failed to fetch live Ethereum data',
            message: error.message 
        });
    }
});

// Özel adres için canlı veriler
app.get('/api/live-ethereum/:address', async (req, res) => {
    try {
        const address = req.params.address;
        console.log(`🔍 Fetching data for address: ${address}`);
        const data = await getLiveEthereumData(address);
        res.json(data);
    } catch (error) {
        console.error('Error fetching address data:', error);
        res.status(500).json({ 
            error: 'Failed to fetch address data',
            message: error.message 
        });
    }
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
