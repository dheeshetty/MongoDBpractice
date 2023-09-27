const express = require('express')
const app = express()

app.get('/',(req, res) => {
    res.json({message:'allgood'})
})

app.get('/venki',(req,res)=>{
    res.sendFile(__dirname + '/profile1.html')
})

app.get('/dhee',(req,res)=>{
    res.sendFile(__dirname + '/profile2.html')
})


app.listen(3000,()=>{
    console.log('server running in 3000')
})

