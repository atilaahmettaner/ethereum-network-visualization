var api = require('etherscan-api').init('7ECHSQBN5X133MMHU5JJWKUBR8CDKW3243');
var balance = api.account.txlist("0x85464B207D7C1FCe8Da13d2F3d950c796E399A9C", 1, 89999999)
let  transaction={}
//var balance = api.account.txlist("0x85464B207D7C1FCe8Da13d2F3d950c796E399A9C",	"15853368","15883915"  )
balance.then(function (balanceData) {
    let transaction=JSON.stringify(balanceData)
    let  parsing=    JSON.parse(transaction)

    const tranactionMapping = parsing.result.map(item => {
        const mapping = {};
        mapping["target"]=item.to;
        mapping["source"]=item.from;

        return mapping;
    })
    console.log(JSON.stringify({node:tranactionMapping}))

}).catch(function (err) {
    console.log(err)
})

