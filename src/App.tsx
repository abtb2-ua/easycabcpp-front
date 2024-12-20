import {useEffect, useRef, useState} from 'react'
import {Parallax, ParallaxLayer, IParallax} from '@react-spring/parallax'
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons'
import {ImageLayer, url, NavigationArrow, StarsBackground, Cloud} from "./BackgroundUtils.tsx";
import {LogContainer} from "./Logs.tsx";
import './tailwind-output.css'
import './App.css'
import Tables from "./Tables.tsx";
import Map from './Map.tsx';

export default function App() {
    const parallaxRef = useRef<IParallax>(null!)
    let index = useRef(0);
    let [lastScroll, setLastScroll] = useState(false); // true = down, false = up
    let setLastScrollRef = useRef(setLastScroll) // So that we can use it inside the event listener

    const scrollToPrevious = () => {
        index.current = Math.ceil(index.current);
        index.current = (index.current - 1 + 3) % 3
        setLastScroll(index.current === 2);
        parallaxRef.current.scrollTo(index.current)
    }

    const scrollToNext = () => {
        index.current = Math.floor(index.current);
        index.current = (index.current + 1) % 3
        setLastScroll(index.current !== 0);
        parallaxRef.current.scrollTo(index.current)
    }

    useEffect(() => {
        let lastScroll = 0
        const handleWheelEvent = () => {
            if (parallaxRef.current.current > lastScroll) {
                setLastScrollRef.current(true)
            } else if (parallaxRef.current.current < lastScroll) {
                setLastScrollRef.current(false)
            }
            lastScroll = parallaxRef.current.current

            index.current = parallaxRef.current.current / (visualViewport?.height || 1);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault()
                if (event.key === 'ArrowUp') {
                    scrollToPrevious()
                } else {
                    scrollToNext()
                }
            }

        }

        window.addEventListener('wheel', handleWheelEvent, {passive: false});
        // keyboard events: arrow up
        window.addEventListener('keydown', handleKeyDown, {passive: false});
        return () => {
            window.removeEventListener('wheel', handleWheelEvent);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div style={{width: '100%', height: '100%', background: '#253237'}}>
            <Parallax ref={parallaxRef} pages={3}>
                <StarsBackground factor={3}/>

                <NavigationArrow onClick={scrollToPrevious} transition={lastScroll ? .15 : .05}
                                 left={.025} top={.4} icon={faChevronUp}></NavigationArrow>
                <NavigationArrow onClick={scrollToNext} transition={lastScroll ? .05 : .15}
                                 left={.025} top={.6} icon={faChevronDown}></NavigationArrow>

                <NavigationArrow onClick={scrollToPrevious} transition={lastScroll ? .2 : .1}
                                 left={.975} top={.4} icon={faChevronUp}></NavigationArrow>
                <NavigationArrow onClick={scrollToNext} transition={lastScroll ? .1 : .2}
                                 left={.975} top={.6} icon={faChevronDown}></NavigationArrow>

                <ImageLayer src={url('satellite3')} offset={0} speed={.5} width={'12.5%'} marginLeft={'4%'}></ImageLayer>
                <ImageLayer src={url('satellite4')} offset={1.2} speed={.5} width={'15%'}
                            marginLeft={'72.5%'}></ImageLayer>
                <ImageLayer src={url('earth')} offset={2.6} speed={1.3} width={'80%'} marginLeft={'10%'}
                            extraStyles={{animation: 'rotate 300s infinite linear'}}></ImageLayer>

                <ParallaxLayer offset={1} speed={0.8} style={{opacity: 0.1}}>
                    <Cloud width={'20%'} duration={'600s'} delay={'-300s'}/>
                    <Cloud width={'10%'} duration={'350s'} delay={'-40s'}/>
                </ParallaxLayer>

                <ParallaxLayer offset={1.75} speed={0.5} style={{opacity: 0.1}}>
                    <Cloud width={'20%'} duration={'500s'} delay={'-350s'}/>
                    <Cloud width={'20%'} duration={'450s'} delay={'-40s'}/>
                </ParallaxLayer>

                <ParallaxLayer offset={1} speed={0.2} style={{opacity: 0.2}}>
                    <Cloud width={'10%'} duration={'500s'} delay={'-50s'} extraStyles={{marginBottom: '40%'}}/>
                    <Cloud width={'20%'} duration={'200s'} delay={'-150s'}
                           extraStyles={{opacity: .3, marginTop: '30%'}}/>
                </ParallaxLayer>

                <ParallaxLayer offset={1.6} speed={-0.1} style={{opacity: 0.4}}>
                    <Cloud width={'20%'} duration={'400s'} delay={'-250s'}/>
                    <Cloud width={'25%'} duration={'300s'} delay={'-100s'}/>
                    <Cloud width={'10%'} duration={'350s'} delay={'-250s'}/>
                </ParallaxLayer>

                <ParallaxLayer offset={2.6} speed={.5} style={{opacity: 0.6}}>
                    <Cloud width={'20%'} duration={'150s'} delay={'-10s'}/>
                </ParallaxLayer>
                <ParallaxLayer offset={2.75} speed={.2} style={{opacity: 0.6}}>
                    <Cloud width={'15%'} duration={'125s'} delay={'-86s'}/>
                    {/*<img src={url('cloud')} style={{width: '15%', marginLeft: '75%'}}/>*/}
                </ParallaxLayer>

                <LogContainer/>

                <Tables/>

                <ParallaxLayer offset={0} speed={.4} style={{pointerEvents: 'none', justifyItems: 'center', alignContent: "center"}}>
                    <Map/>
                </ParallaxLayer>
            </Parallax>
        </div>
    )
}
