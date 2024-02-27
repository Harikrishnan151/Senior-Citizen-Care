//1) automatically load dotenv file in the application
require('dotenv').config()

//2) import express
const express=require('express')

//6) Import cors
 const cors=require('cors')

//9) Import connection.js file for connecting mongoDB
  require('./connection')

//10)  Import router
const router=require('./routes/router')


//3) Create a application using express
const server=express()

//4) define port
  const PORT=5000

//5) Run application
server.listen(PORT,()=>{
    console.log('Server listening to port' +PORT);
})

//7) Use cors
 server.use(cors())
 server.use(express.json())//express.json method is used to convert object data to array
 server.use(router)

 //8) define routes
  server.get('/',(req,res)=>{
    res.status(200).json('senior citizen care service started')
  })

