const ethers =require("ethers");
const  usdtAbi =require("C:\\Users\\Atila\\WebstormProjects\\visualtransaction\\abi.json")
require("dotenv").config;
    try{


    async function main(){
        const  usdtAdress="0xdAC17F958D2ee523a2206206994597C13D831ec7"
        const provider =new ethers.providers.Web3Provider(
            `wss://eth-mainnet.g.alchemy.com/v2/JhVI1zSfeDcCOY8E0SJHM_qedHS7NuNN`
        )   ;
        const contract = new ethers.Contract(usdtAdress, usdtAbi, provider);
        contract.on("Transfer" , (from, to, value, event) => {
            let info = {
                from: from,
                to: to,
                value: ethers.utils.formatUnits(value, 6),
            data: event,
        };
            console.log(JSON.stringify(info, null, 4));
        });
}
        main();
    }

catch (e){
    console.log(e)
}