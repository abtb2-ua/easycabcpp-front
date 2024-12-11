import {useEffect, useRef, useState} from 'react'
import {Parallax, ParallaxLayer, IParallax} from '@react-spring/parallax'
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons'
import './App.css'
import './tailwind-output.css'
import {ImageLayer, url, NavigationArrow, StarsBackground} from "./BackgroundUtils.tsx";

export default function App() {
    const parallaxRef = useRef<IParallax>(null!)
    let index = useRef(0);
    let [lastScroll, setLastScroll] = useState(false); // true = down, false = up
    // let setLastScrollRef = useRef(setLastScroll) // So that we can use it inside the event listener
    // let [moving, setMoving] = useState(false);

    const scrollToPrevious = () => {
        index.current = (index.current - 1 + 3) % 3
        setLastScroll(index.current === 2);
        parallaxRef.current.scrollTo(index.current)
    }

    const scrollToNext = () => {
        index.current = (index.current + 1) % 3
        setLastScroll(index.current !== 0);
        parallaxRef.current.scrollTo(index.current)
    }

    useEffect(() => {
        // let lastScroll = 0
        const handleWheelEvent = (event: WheelEvent) => {
            event.preventDefault()
            // if (parallaxRef.current.current > lastScroll) {
            //     setLastScrollRef.current(true)
            // } else if (parallaxRef.current.current < lastScroll) {
            //     setLastScrollRef.current(false)
            // }
            // lastScroll = parallaxRef.current.current
        };

        window.addEventListener('wheel', handleWheelEvent, {passive: false});
        return () => {
            window.removeEventListener('wheel', handleWheelEvent);
        };
    }, []);

    return (
        <div style={{width: '100%', height: '100%', background: '#253237'}}>
            <Parallax ref={parallaxRef} pages={3}>
                <StarsBackground factor={3}/>

                <NavigationArrow onClick={scrollToPrevious} transition={lastScroll ? .15 : .05}
                                 left={.05} top={.4} icon={faChevronUp}></NavigationArrow>
                <NavigationArrow onClick={scrollToNext} transition={lastScroll ? .05 : .15}
                                 left={.05} top={.6} icon={faChevronDown}></NavigationArrow>

                <NavigationArrow onClick={scrollToPrevious} transition={lastScroll ? .2 : .1}
                                 left={.95} top={.4} icon={faChevronUp}></NavigationArrow>
                <NavigationArrow onClick={scrollToNext} transition={lastScroll ? .1 : .2}
                                 left={.95} top={.6} icon={faChevronDown}></NavigationArrow>

                <ImageLayer src={url('satellite3')} offset={0} speed={.5} width={'15%'} marginLeft={'10%'}></ImageLayer>
                <ImageLayer src={url('satellite4')} offset={1.2} speed={.5} width={'15%'}
                            marginLeft={'72.5%'}></ImageLayer>
                <ImageLayer src={url('satellite2')} offset={2.7} speed={1.3} width={'15%'} marginLeft={'40%'}
                            extraStyles={{transform: 'rotate(-43deg)'}}></ImageLayer>

                <ParallaxLayer offset={1} speed={0.8} style={{opacity: 0.1}}>
                    <img src={url('cloud')} style={{width: '20%', marginLeft: '55%'}}/>
                    <img src={url('cloud')} style={{width: '10%', marginLeft: '15%'}}/>
                </ParallaxLayer>

                <ParallaxLayer offset={1.75} speed={0.5} style={{opacity: 0.1}}>
                    <img src={url('cloud')} style={{width: '20%', marginLeft: '70%'}}/>
                    <img src={url('cloud')} style={{width: '20%', marginLeft: '15%'}}/>
                </ParallaxLayer>

                <ParallaxLayer offset={1} speed={0.2} style={{opacity: 0.2}}>
                    <img src={url('cloud')} style={{width: '10%', marginLeft: '10%', marginBottom: '40%'}}/>
                    <img src={url('cloud')} style={{width: '20%', marginLeft: '-10%', opacity: .3, marginTop: '30%'}}/>
                </ParallaxLayer>

                <ParallaxLayer offset={1.6} speed={-0.1} style={{opacity: 0.4}}>
                    <img src={url('cloud')} style={{width: '20%', marginLeft: '60%'}}/>
                    <img src={url('cloud')} style={{width: '25%', marginLeft: '30%'}}/>
                    <img src={url('cloud')} style={{width: '10%', marginLeft: '80%'}}/>
                </ParallaxLayer>

                <ParallaxLayer offset={2.6} speed={.5} style={{opacity: 0.6}}>
                    <img src={url('cloud')} style={{width: '20%', marginLeft: '5%'}}/>
                </ParallaxLayer>
                <ParallaxLayer offset={2.75} speed={.2} style={{opacity: 0.6}}>
                    <img src={url('cloud')} style={{width: '15%', marginLeft: '75%'}}/>
                </ParallaxLayer>

                <ParallaxLayer offset={1.1} speed={.5}>
                    <div className={'log-container'}>
                        <div className={'logs-background'}></div>
                        <div className={'logs'}>
                            <div role="alert" className="alert alert-success" style={{boxShadow: '2px 2px 5px black'}}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Your purchase has been confirmed!</span>
                            </div>
                            <div role="alert" className="alert alert-success" style={{boxShadow: '2px 2px 5px black'}}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Your purchase has been confirmed!</span>
                            </div>
                            <div role="alert" className="alert alert-success" style={{boxShadow: '2px 2px 5px black'}}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Your purchase has been confirmed!</span>
                            </div>
                            <div role="alert" className="alert alert-success" style={{boxShadow: '2px 2px 5px black'}}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Your purchase has been confirmed!</span>
                            </div>
                            <div role="alert" className="alert alert-success" style={{boxShadow: '2px 2px 5px black'}}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Your purchase has been confirmed!</span>
                            </div>
                            <div role="alert" className="alert alert-success" style={{boxShadow: '2px 2px 5px black'}}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Your purchase has been confirmed!</span>
                            </div>
                            <div role="alert" className="alert alert-success" style={{boxShadow: '2px 2px 5px black'}}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Your purchase has been confirmed!</span>
                            </div>
                            <div role="alert" className="alert alert-success" style={{boxShadow: '2px 2px 5px black'}}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Your purchase has been confirmed!</span>
                            </div>
                            <div role="alert" className="alert alert-success" style={{boxShadow: '2px 2px 5px black'}}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Your purchase has been confirmed!</span>
                            </div>
                            <div role="alert" className="alert alert-success" style={{boxShadow: '2px 2px 5px black'}}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>Your purchase has been confirmed!</span>
                            </div>
                        </div>
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>
    )
}
