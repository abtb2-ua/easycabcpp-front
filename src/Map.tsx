import './Map.css'
import {useEffect, useState} from "react";
import * as addon from "../addons/addon";

interface Item {
    className: 'taxi' | 'taxiStopped' | 'location' | 'customer' | '';
    content: string
}

export default function Map() {
    const [items, setItems] = useState<Item[]>(new Array(20 * 20).fill({className: '', content: ''}));

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');  // TODO: move to env

        ws.onopen = () => {
            console.log('Tables WebSocket connected')
        }

        ws.onmessage = (message) => {
            const data = JSON.parse(message.data)
            if (data.subject === 'map') {
                let map = data.value as addon.Map

                let newItems = new Array(20 * 20).fill({className: '', content: ''})
                map.locations.forEach(location => {
                    newItems[location.coord.x + location.coord.y * 20] = {className: 'location', content: location.id}
                })

                map.customers.forEach(customer => {
                    if (!customer.onboard) {
                        newItems[customer.coord.x + customer.coord.y * 20] = {
                            className: 'customer',
                            content: customer.id
                        }
                    }
                })

                map.taxis.forEach(taxi => {
                    const className = taxi.stopped || !taxi.connected || !taxi.ready ? 'taxiStopped' : 'taxi'
                    let content = taxi.id.toString().padStart(2, '0');

                    if (taxi.customer[0] >= 'a' && taxi.customer[0] <= 'z') {
                        content += taxi.customer
                    }
                    if (taxi.stopped || !taxi.connected || !taxi.ready) {
                        content += '!'
                    }

                    newItems[taxi.coord.x + taxi.coord.y * 20] = {className: className, content: content}
                })

                setItems(newItems)
            }
        }
    }, []);

    return (
        <div className={'map-container'}>
            <div className={'map-border'}>
                <div className={'map-item-borders'}>
                    {items.map((_, index) => (
                        <div className={'map-item-border'} key={index}/>
                    ))}
                </div>
                <div className={'map'}>
                    {
                        items.map((value, index) => (
                            <div className={'map-item font-mono ' + value.className} key={index}>
                                <span>
                                    {value.content}
                                </span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}