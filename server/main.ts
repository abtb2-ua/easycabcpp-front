import Consumer from './Consumer'
import * as addon from "../addons/addon";
import Producer from "./Producer";
import { WebSocket } from 'ws'
import {EachMessagePayload} from "kafkajs";

const wss = new WebSocket.Server({ port: 8080 });

const messageCodes = addon.getMessageCodes()
const warningCodes = addon.getWarningCodes()
const errorCodes = addon.getErrorCodes()

let started = false
const producer = new Producer()
producer.start().then(() => {
    started = true
})
const send = (message: addon.Message) => {
    if (!started) {
        console.log('Producer not started yet')
        setTimeout(() => {
            send(message)
        }, 100)
    } else {
        void producer.send('requests', message)
    }
}

wss.on('headers', (headers: string[], request: any) => {
    headers.push(
        'Access-Control-Allow-Origin: *', // Replace '*' with your website's origin if possible for better security!
        'Access-Control-Allow-Headers: origin, x-requested-with, content-type',
        // 'Access-Control-Allow-Credentials: true' //If you need to send cookies
    )
});

const consumer = new Consumer()
void consumer.startConsumer(['logs', 'map'], async (messagePayload: EachMessagePayload) => {
    const { topic, partition, message } = messagePayload
    let f: Buffer = message.value
    const value = topic == 'logs' ? addon.deserializeLog(f) : addon.deserializeMap(f)

    if (topic !== 'logs') {
        console.log('########################################')
      console.log({topic: topic, value: value});
        let map = value as addon.Map
        map.locations.forEach((location) => console.log(location))
        map.customers.forEach((location) => console.log(location))
        map.taxis.forEach((location) => console.log(location))
    }

    wss.clients.forEach((client) => {
        client.send(JSON.stringify({
            subject: topic == 'logs' ? 'log' : 'map',
            value: value
        }))
    })
})

wss.on('connection', (ws) => {
    console.log('Client connected')

    ws.on('message', (message) => {
        const data = JSON.parse(message.toString())
        if (data.subject === 'getCodes') {
            ws.send(JSON.stringify({
                subject: 'codes',
                messageCodes: messageCodes,
                warningCodes: warningCodes,
                errorCodes: errorCodes
            }))
        } else if (data.subject === 'sendMessage') {
            console.log('Sending message', data.message)
            send(data.message)
        }
    })
})


//
// app.use(cors({ origin: 'http://localhost:5173' }));
//
// app.get('/codes/message', (req, res) => {
//     res.send(messages)
// })
//
// app.get('/codes/warning', (req, res) => {
//     res.send(warnings)
// })
//
// app.get('/codes/error', (req, res) => {
//     res.send(errors)
// })
//
// createServer(app).listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })
