import {ParallaxLayer} from "@react-spring/parallax";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CSSProperties} from "react";
import './BackgroundUtils.css'

export function url(name: string, wrap = false) {
    return `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`
}

interface StarsBackgroundProps {
    offset?: number;
    speed?: number;
    factor: number;
}

export function StarsBackground({offset = 0, speed = 0, factor}: StarsBackgroundProps) {
    return (
        <ParallaxLayer
            offset={offset}
            speed={speed}
            factor={factor}
            style={{
                backgroundImage: url('stars', true),
                backgroundSize: 'cover',
                zIndex: -1,
            }}
        />
    )
}

interface NavigationArrowProps {
    onClick: () => void;
    transition: number;
    left: number;
    top: number;
    icon: IconDefinition;
    speed?: number;
    size?: number;
}

export function NavigationArrow({onClick, transition, left, top, icon, speed = -1, size = 110}: NavigationArrowProps) {
    return (
        <ParallaxLayer
            offset={0}
            speed={speed}
            style={{userSelect: 'none', transition: `${transition}s`, zIndex: 1, pointerEvents: 'none'}}
        >
            <div className={'nav-arrow'} onClick={onClick}
                 style={{
                     '--size': `${size}px`,
                     '--left': left,
                     '--top': top,
                     zIndex: 1,
                     pointerEvents: 'auto',
                 } as CSSProperties}>
                <FontAwesomeIcon icon={icon}/>
            </div>
        </ParallaxLayer>
    )
}

interface ImageLayerProps {
    src: string;
    offset: number;
    speed: number;
    width: string;
    marginLeft: string;
    opacity?: number;
    extraStyles?: CSSProperties;
}

export function ImageLayer({src, offset, speed, width, marginLeft, extraStyles, opacity = 1}: ImageLayerProps) {
    return (
        <ParallaxLayer offset={offset} speed={speed} style={{pointerEvents: 'none'}}>
            <img alt={src} src={src} style={{display: 'block', width: width, marginLeft: marginLeft, opacity: opacity, ...extraStyles}}/>
        </ParallaxLayer>
    )
}