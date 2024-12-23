import {
    ChangeEvent,
    MutableRefObject,
    ReactNode,
    SetStateAction,
    Dispatch,
    useState,
    CSSProperties,
    forwardRef, Fragment
} from "react";
import {animated, config, useChain, useSpring, useSpringRef} from "@react-spring/web";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import './Utils.css';


interface ExpandButtonProps {
    to: { background: string, marginLeft: string, marginBottom: string, size: string };
    from: { background: string, marginLeft: string, marginBottom: string, size: string };
    icon: IconDefinition;
    children: ReactNode;
    closeRef: MutableRefObject<() => void>;
}

export function ExpandButton(props: ExpandButtonProps) {
    const [open, setOpen] = useState(false);
    const springApi = useSpringRef();

    const {size, className, ...rest} = useSpring({
        ref: springApi,
        config: config.gentle,
        from: {
            size: props.from.size,
            background: props.from.background,
            className: "container mask mask-hexagon",
            opacity: 0.7,
            marginLeft: props.from.marginLeft,
            marginBottom: props.to.marginBottom,
            backdropFilter: 'blur(0px)',
        },
        to: {
            className: open ? "container mask mask-squircle" : "container mask mask-hexagon",
            size: open ? props.to.size : props.from.size,
            background: open ? props.to.background : props.from.background,
            marginLeft: open ? props.to.marginLeft : props.from.marginLeft,
            marginBottom: open ? props.to.marginBottom : props.from.marginBottom,
            opacity: open ? 1 : 0.7,
            backdropFilter: open ? 'blur(10px)' : 'blur(0px)',
        },
    });

    props.closeRef.current = () => {
        setOpen(false)
    };

    const transApi = useSpringRef();

    // This will orchestrate the two animations above, comment the last arg and it creates a sequence
    useChain(open ? [springApi, transApi] : [transApi, springApi], [0, 0]);

    return (
        <div className={'wrapper'}>
            <animated.div
                style={{...rest, width: size, height: size}}
                className={className}
                onClick={() => {
                    if (!open) {
                        setOpen(true)
                    }
                }}>
                {
                    !open ?
                        <FontAwesomeIcon icon={props.icon} size={"4x"} style={{color: 'rgb(37, 50, 55)'}}>
                        </FontAwesomeIcon> :

                        <div style={{
                            width: '95%',
                            height: '95%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            gap: '10px',
                            flexDirection: 'column',
                        }} className={"mask mask-squircle bg-neutral"}>
                            {props.children}
                        </div>
                }
            </animated.div>
        </div>
    );
}

type Setter = Dispatch<SetStateAction<string>>;

interface TextInputProps {
    onChange: (e: ChangeEvent<HTMLInputElement>, setter: Setter) => void,
    className?: string,
    defaultValue?: string,
    disabled?: boolean,
    icon?: IconDefinition
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    const [value, setValue] = useState(props.defaultValue ?? '');

    return (
        <label className="input input-bordered flex items-center gap-2">
            {props.icon ? <FontAwesomeIcon icon={props.icon}/> : null}
            <input value={value} disabled={props.disabled ?? false} className={props.className ?? '' + ' grow font-mono'}
                   onChange={(e) => props.onChange(e, setValue)} ref={ref}/>
        </label>
    );
})

export function TaxiIdOnChange(e: ChangeEvent<HTMLInputElement>, setter: Setter) {
    let res =
        e.target.value
            .match(/\d/g) // Just the digits
            ?.join('')
            .slice(-2)
        ?? '00';

    while (res.length < 2) {
        res = '0' + res;
    }

    setter(res);
}

export function CustomerIdOnChange(e: ChangeEvent<HTMLInputElement>, setter: Setter) {
    setter(e.target.value
            .toLowerCase()
            .match(/[a-z]/g)
            ?.join('')
            .slice(-1)
        ?? '_');
}

export function LocationIdOnChange(e: ChangeEvent<HTMLInputElement>, setter: Setter) {
    setter(e.target.value
            .toUpperCase()
            .match(/[A-Z]/g)
            ?.join('')
            .slice(-1)
        ?? '_');
}

// TODO: Improve this function
export function CoordinateOnChange(e: ChangeEvent<HTMLInputElement>, setter: Setter) {
    let numbers = e.target.value
            .match(/\d/g)
            ?.slice(-4)
        ?? ['0', '0', '0', '0'];

    while (numbers.length < 4) {
        numbers.unshift('0');
    }

    setter(`[${numbers[0]}${numbers[1]}, ${numbers[2]}${numbers[3]}]`);
}

interface VeilListProps {
    items: string[];
    containerStyle?: CSSProperties;
    onChange?: () => void;
    setIndex: Dispatch<SetStateAction<number>>
}

export function VeilList(props: VeilListProps) {
    const items = props.items.map((value, index) => {
        let id = value.replace(' ', '-')
        return (
            <Fragment key={index}>
                <input defaultChecked={index === 0} id={`radio-${id}`} name="radio"
                       type="radio" onChange={() => props.setIndex(index)}/>
                <label htmlFor={`radio-${id}`}>{value}</label>
            </Fragment>
        )
    })

    return (
        <div className={'radio-container'} style={{'--total-radio': props.items.length} as CSSProperties}>
            {items}

            <div className="glider-container">
                <div className="glider"></div>
            </div>
        </div>
    );
}