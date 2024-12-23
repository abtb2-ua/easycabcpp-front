import {Consumer, ConsumerSubscribeTopics, EachMessagePayload, Kafka} from 'kafkajs'
import {v4 as uuid} from 'uuid'

export default class ConsumerWrapper {
    private kafkaConsumer: Consumer

    public constructor() {
        this.kafkaConsumer = this.createKafkaConsumer()
    }

    public async startConsumer(topics: string[], eachMessage: (messagePayload: EachMessagePayload) => Promise<void>): Promise<void> {
        const topic: ConsumerSubscribeTopics = {
            topics: topics,
            fromBeginning: true
        }

        try {
            await this.kafkaConsumer.connect()
            await this.kafkaConsumer.subscribe(topic)

            await this.kafkaConsumer.run({ eachMessage: eachMessage })
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    public async shutdown(): Promise<void> {
        await this.kafkaConsumer.disconnect()
    }

    private createKafkaConsumer(): Consumer {
        let id = uuid()
        const kafka = new Kafka({
            clientId: id,
            brokers: ['192.168.0.16:9092'], // TODO: Move to env
        })
        return kafka.consumer({groupId: id})
    }
}