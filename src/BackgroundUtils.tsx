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

export function StarsBackground(props: StarsBackgroundProps) {
    return (
        <ParallaxLayer
            offset={props.offset ?? 0}
            speed={props.speed ?? 0}
            factor={props.factor}
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

export function NavigationArrow(props: NavigationArrowProps) {
    return (
        <ParallaxLayer
            offset={0}
            speed={props.speed ?? -1}
            style={{userSelect: 'none', transition: `${props.transition}s`, zIndex: 1, pointerEvents: 'none'}}
        >
            <div className={'nav-arrow'} onClick={props.onClick}
                 style={{
                     '--size': `${props.size ?? 110}px`,
                     '--left': props.left,
                     '--top': props.top,
                     zIndex: 1,
                     pointerEvents: 'auto',
                     cursor: 'pointer',
                 } as CSSProperties}>
                <FontAwesomeIcon icon={props.icon}/>
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

export function ImageLayer(props: ImageLayerProps) {
    return (
        <ParallaxLayer offset={props.offset} speed={props.speed} style={{pointerEvents: 'none'}}>
            <img alt={props.src} src={props.src} className={'wobbly'}
                 style={{
                     display: 'block',
                     width: props.width,
                     marginLeft: props.marginLeft,
                     opacity: props.opacity ?? 1,
                     ...props.extraStyles
                 }}/>
        </ParallaxLayer>
    )
}

interface CloudProps {
    width: string;
    duration: string;
    delay: string;
    extraStyles?: CSSProperties;
}

export function Cloud(props: CloudProps) {
    return (
        <img alt={'cloud'} src={url('cloud')} className={'animate'}
             style={{
                 "--width": props.width,
                 animationDuration: props.duration,
                 animationDelay: props.delay,
                 ...props.extraStyles,
             } as CSSProperties}
        />
    )
}