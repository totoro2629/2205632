const express = require('express');//importing express framework
const axios = require('axios');//importing

const app = express();//initializing the express app
const PORT = 9876;//port number of local system

const window_size = 10;//size of sliding window
const test_server = "http://20.244.56.144/evaluation-service";
const TIMEOUT = 500;//in ms
//each type having a sliding window
const numberWindows = {
    'p':[],
    'f':[],
    'e':[],
    'r':[]
};
//mapping to api endpoints of the thrid-party server
const typeToEndpoint = {
    'p': 'primes',
    'f': 'fibo',
    'e': 'even',
    'r': 'rand'
};
//Function to fetch numbers from the external API 
async function getnums(numtype){
    try{//get request from 3rd party api
        const resp = await axios.get(`${test_server}/${typeToEndpoint[numtype]}`,{timeout:TIMEOUT});
        return resp.data.numbers || [];//returning numbers
    }
    catch(error){
        console.error('Failed to get numbers',error.message);
        return [];
    }//failed to get numbers
}
// Function to calculate the average of numbers in the sliding window
function avg(numbers){
    if(!numbers.length) return 0;
    const sum = numbers.reduce((total,num)=>total+num,0);
    return parseFloat((sum/numbers.length).toFixed(2));
}
// Route to handle requests for numbers of a specific
app.get('/numbers/:numberid',async(req,res)=>{
    const numtype = req.params.numberid;//extracting number type
    
    if(!['p','f','e','r'].includes(numtype))
    {
        return res.status(400).json({error: 'Invalid Number Type'});

    }//error response
    //sorting previous state of sliding window
    const prevwinstate = [...numberWindows[numtype]];
    const newNums = await getnums(numtype);//fetching new numbers
//updating sliding window
    newNums.forEach(num => {
        if(!numberWindows[numtype].length >= window_size){
            numberWindows[numtype].shift();//removing oldest entry in case of a full window
        }
        numberWindows[numtype].push(num);
    });
    //sending response
    res.json({
        windowPrevState: prevwinstate,
        windowCurrState: [...numberWindows[numtype]],
        numbers: newNums,
        avg: avg(numberWindows[numtype])
    });
});
//staring express server 
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
});