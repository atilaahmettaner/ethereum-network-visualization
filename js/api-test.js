const express = require("express")
const nodemon= require('nodemon')
const {graphqlHTTP} = require("express-graphql");
const schema = require("../Schemas");
const {response} = require("express");
const path = require("path");
const http = require("http")
const app=express();
var server = http.Server(app)
app.use(express.json());
let transaction={}
var api = require('etherscan-api').init('7ECHSQBN5X133MMHU5JJWKUBR8CDKW3243');

app.use(express.urlencoded({ extended: true }));
var PORT = 8080;
    app.get("/",(req,res)=>{
        res.sendFile(path.join(__dirname + '/../html/api.html'));

    })
app.get("/visual",(req
              ,res)=>{
    res.sendFile(path.join(__dirname + '/../html/directional.html'));
})

app.get("/a",(req
              ,res)=>{
    res.sendFile(path.join(__dirname + '/../html/ether.html'));

})
    app.post("/ethers",function(req, response){


            let blockId = req.body.startblock
            console.log(blockId)
            let adress = req.body.adress
            console.log(adress)
            var balance = api.account.txlist(adress, 1, 99999999)
            //var balance = api.account.txlist("0x85464B207D7C1FCe8Da13d2F3d950c796E399A9C",	"15853368","15883915"  )
            balance.then(function (balanceData) {
                 response.send(balanceData)
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
})

app.listen (PORT,function (err){
    if(err) console.log("server error")
    console.log("Server listening")
});
 