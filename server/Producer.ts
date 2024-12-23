import {Kafka, Producer, ProducerRecord,} from 'kafkajs'
import * as addon from "../addons/addon";

export default class ProducerWrapper {
    private producer: Producer

    constructor() {
        this.producer = this.createProducer()
    }

    public async start(): Promise<void> {
        try {
            await this.producer.connect()
        } catch (error) {
            console.log('Error connecting the producer: ', error)
        }
    }

    public async shutdown(): Promise<void> {
        await this.producer.disconnect()
    }

    public async send(topic: string, message: addon.Message): Promise<void> {
        // const kafkaMessage = { value: addon.serialize(message) }
        const kafkaMessage = {value: Buffer.from(addon.serializeMessage(message))}
        console.log('Sending message: ', kafkaMessage)

        const record: ProducerRecord = {
            topic: topic,
            messages: [kafkaMessage]
        }

        console.log('Sending record: ', record)
        await this.producer.send(record);
    }

    private createProducer(): Producer {
        const kafka = new Kafka({
            clientId: 'producer-client',
            brokers: ['192.168.0.16:9092'],
        })

        return kafka.producer()
    }
}