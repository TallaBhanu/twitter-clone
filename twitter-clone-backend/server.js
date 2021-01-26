import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Pusher from 'pusher'
import dbModel from './dbModel.js'

//app config
const app=express();
const port=process.env.PORT || 8080;

const pusher = new Pusher({
  appId: "1144511",
  key: "9af87253d21d6772c946",
  secret: "944a1ae010dae09408ea",
  cluster: "ap2",
  usetls: true
});



//middlewares
app.use(express.json());
app.use(cors())

//DB config
const connection_url='mongodb+srv://twitter:D7itvVcYPcllVjlZ@cluster0.4jaki.mongodb.net/twitterDB?retryWrites=true&w=majority'
mongoose.connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.once('open',()=>{
    console.log('DB Connection')
    const changeStream =mongoose.connection.collection('posts').watch()
    changeStream.on('change',(change)=>{
        console.log('change triggered on pusher')
        console.log(change)
        console.log('End of change')

        if(change.operationType==='insert'){
            console.log('Image Upload')

            const postDetails=change.fullDocument;
            pusher.trigger('posts','inserted',{
                user : postDetails.user,
                caption : postDetails.caption,
                image : postDetails.image

            })
        }
        else{
            console.log('Unkown triggering Pusher')
        }
    })
})

//api rotues
app.get('/',(req,res)=>res.status(200).send('Hello World'))
app.post('/upload',(req,res)=>{
   const body=req.body;
   dbModel.create(body,(err,data)=>{
       if(err){
           res.status(500).send(err);
       }
       else{
           res.status(201).send(data);
       }
   });
   
});

app.get('/sync',(req,res)=>{
    dbModel.find((err,data)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);
        }
    })
})




//listen
app.listen(port,()=>console.log(`Local host :${port}`))