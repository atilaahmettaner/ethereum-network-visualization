const api = require('etherscan-api').init('7ECHSQBN5X133MMHU5JJWKUBR8CDKW3243');

// Ethereum adreslerini tanımlayan fonksiyon
function identifyAddress(address) {
    const knownAddresses = {
        '0xdac17f958d2ee523a2206206994597c13d831ec7': { name: 'Tether (USDT)', type: 'token_contract', color: '#26a17b' },
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { name: 'USD Coin (USDC)', type: 'token_contract', color: '#2775ca' },
        '0x6b175474e89094c44da98b954eedeac495271d0f': { name: 'MakerDAO (DAI)', type: 'defi_protocol', color: '#f5ac37' },
        '0x85464b207d7c1fce8da13d2f3d950c796e399a9c': { name: 'Target Wallet', type: 'main_wallet', color: '#ff6b6b' },
        '0xc333e80ef2dec2805f239e3f1e810612d294f771': { name: 'Exchange Wallet', type: 'exchange', color: '#4ecdc4' },
        '0xa833eb6333a866c1b1d15051f2cd7ce5cbf75ed6': { name: 'DeFi Protocol', type: 'defi_protocol', color: '#45b7d1' },
        '0x9d9a09db56c58a6619670b3926ab8351e94e78dd': { name: 'Trading Pool', type: 'pool', color: '#f9ca24' },
        '0x6e3ff0b219d77fe3e7029e3acc8210f1701d784c': { name: 'Staking Contract', type: 'staking', color: '#6c5ce7' },
        '0x75eea410d5f536c71eeeea64aae61a174c738cff': { name: 'Liquidity Pool', type: 'pool', color: '#fd79a8' },
        '0xa2328fa9a3a99e120ba9d4ef2ee5a989f8e00979': { name: 'Yield Farm', type: 'defi_protocol', color: '#00b894' },
        '0x3f69e5541c565db12de014a63cb88042406e3567': { name: 'NFT Market', type: 'marketplace', color: '#e17055' }
    };
    
    const addr = address.toLowerCase();
    if (knownAddresses[addr]) {
        return knownAddresses[addr];
    }
    
    // Bilinmeyen adresler için varsayılan
    return {
        name: `Wallet ${addr.substring(0, 8)}...`,
        type: 'wallet',
        color: '#95a5a6'
    };
}

// Veri formatını Force-Graph için düzenleyen fonksiyon
function formatEthereumData(rawData) {
    if (!rawData || !rawData.result) {
        return { nodes: [], links: [] };
    }
    
    const transactions = rawData.result;
    const addressMap = new Map();
    const links = [];
    
    // Tüm unique adresleri topla
    transactions.forEach(tx => {
        if (tx.from && tx.to) {
            addressMap.set(tx.from.toLowerCase(), identifyAddress(tx.from));
            addressMap.set(tx.to.toLowerCase(), identifyAddress(tx.to));
            
            // Link oluştur
            links.push({
                source: tx.from.toLowerCase(),
                target: tx.to.toLowerCase(),
                value: parseFloat(tx.value) / 1e18, // Wei'den ETH'ye
                type: tx.value > 0 ? 'ETH Transfer' : 'Contract Call',
                hash: tx.hash,
                timestamp: new Date(tx.timeStamp * 1000).toISOString(),
                gasUsed: tx.gasUsed,
                gasPrice: tx.gasPrice,
                blockNumber: tx.blockNumber
            });
        }
    });
    
    // Nodes array'ini oluştur
    const nodes = Array.from(addressMap.entries()).map(([address, info], index) => ({
        id: address,
        name: info.name,
        type: info.type,
        color: info.color,
        group: index % 10 + 1
    }));
    
    return { nodes, links };
}

// Ana fonksiyon
async function getLiveEthereumData(targetAddress = "0x85464B207D7C1FCe8Da13d2F3d950c796E399A9C") {
    try {
        const balance = await api.account.txlist(targetAddress, 1, 89999999);
        const formattedData = formatEthereumData(balance);
        
        console.log(`📊 Fetched ${formattedData.nodes.length} nodes and ${formattedData.links.length} transactions`);
        return formattedData;
    } catch (error) {
        console.error('Error fetching Ethereum data:', error);
        throw error;
    }
}

module.exports = { getLiveEthereumData, formatEthereumData };

// Eğer direkt çalıştırılırsa
if (require.main === module) {
    getLiveEthereumData()
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
        })
        .catch(console.error);
}
