const express = require('express');
const indexRouter = require('./routes/index');
const app = express();
const WebSocket = require('ws');
const cors = require('cors');
const fs = require('fs');
const sms = require('./services/smsService');
const env = require('./env')

const wss = new WebSocket.Server({ port: 8080 });
let clients = [];
const phones = env.PHONES;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use('/', indexRouter);

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error');
});

wss.on('listening' , () => console.log('Websocket listening on port 8080'));
wss.on('connection', function connection(ws) {
  console.log('New connection')
  clients.push(ws);
  ws.on('message', function incoming(message) {

    message = JSON.parse(message);

    if(message.sensor === 'motion' && message.value === true) {

      console.log("Motion Detected")
      let animal = fs.readFileSync("./animal.txt");
      animal = animal.toString();
      animal = animal.split('').map((letter,index) => index === 0 ? letter.toUpperCase() : letter).join('');

      clients.forEach(function each(client) {
        const newmessage = {type : 'wildlife',data : {animal}}
        client.send(JSON.stringify(newmessage));
      });

      phones.forEach(async (phone) => await sms.smsService.sendSms(phone,`${animal} has been spotted crossing the area at : ${new Date().toLocaleString()}.`));
    } 
    else if(message.sensor === 'fire' && message.value === true)
    {
      console.log('Fire detected');
      
      phones.forEach(async (phone) => await sms.smsService.sendSms(phone,`Fire has been detected in the area at : ${new Date().toLocaleString()}.`));
      
      clients.forEach(function each(client) {
        const newmessage = {type : 'fire', data:{}}
        client.send(JSON.stringify(newmessage));
      });
    }
    else if(message.sensor === 'fire' && message.value === false)
    {
      console.log('Fire extinguished');
      
      clients.forEach(function each(client) {
        const newmessage = {type : 'no-fire', data:{}}
        client.send(JSON.stringify(newmessage));
      });
    }
    else if(message.sensor === 'motion' && message.value === false)
    {
      console.log('No motion detected');
      
      clients.forEach(function each(client) {
        const newmessage = {type : 'no-wildlife', data:{}}
        client.send(JSON.stringify(newmessage));
      });
    }
  });
});

module.exports = app;
