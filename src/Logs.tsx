import {ReactNode, useEffect, useRef, useState} from "react";
import './Logs.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faFilter} from "@fortawesome/free-solid-svg-icons";
import {
    useSpring,
    useChain,
    config,
    animated,
    useSpringRef,
} from "@react-spring/web";

interface LogProps {
    type: 'success' | 'warning' | 'error';
    content: string
}

export function Log(props: LogProps) {
    let d = props.type == 'success' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' :
        props.type == 'warning' ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' :
            'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
    let color = props.type == 'success' ? '#002d00' : props.type == 'warning' ? '#321700' : '#210000';

    const domRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={domRef} role="alert" className={`alert alert-${props.type}`}
             style={{boxShadow: '2px 2px 5px black', transition: '.5s'}}>
            <svg style={{color: color}}
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={d}/>
            </svg>
            <span style={{fontWeight: 500}}>
                <span style={{marginLeft: '-5px', textDecoration: "2px underline"}}>[102]</span>
                &nbsp;&nbsp;&nbsp;
                {props.content}
            </span>
            <span style={{fontWeight: 500}}>23 seconds ago</span>
        </div>
    )
}

interface LogContainerProps {
    children: ReactNode
}

export function LogContainer(props: LogContainerProps) {
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleWheelEvent = (event: WheelEvent) => {
            if (!domRef.current) return;
            const scrollTop = domRef.current.scrollTop;
            const scrollHeight = domRef.current.scrollHeight;
            const clientHeight = domRef.current.clientHeight;

            const atTop = scrollTop === 0 && event.deltaY < 0;
            const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight && event.deltaY > 0;

            if (atTop || atBottom) {
                event.preventDefault();
            }
        };

        let element = document.getElementById('logs')
        if (element) console.log(element)

        element?.addEventListener('wheel', handleWheelEvent, {passive: false});
    }, []);

    return (
        <div className={'log-container'}>
            <div className={'logs-background'}></div>
            <div ref={domRef} id={'logs'} className={'logs'}>
                {props.children}
            </div>
        </div>
    )
}

interface FilterButtonProps {

}

export function FilterButton(props: FilterButtonProps) {
    const [open, setOpen] = useState(false);

    const springApi = useSpringRef();
    const {size, className, ...rest} = useSpring({
        ref: springApi,
        config: config.gentle,
        from: {
            size: "125px",
            background: "gainsboro",
            className: "container mask mask-hexagon",
            opacity: 0.7,
            marginLeft: "-1150px",
            marginBottom: '600px',
            backdropFilter: 'blur(0px)',
        },
        to: {
            className: open ? "container mask mask-squircle" : "container mask mask-hexagon",
            size: open ? "500px" : "125px",
            background: open ? "#0d181c8a" : "gainsboro",
            marginLeft: open ? "0" : "-1150px",
            marginBottom: open ? '0' : '600px',
            opacity: open ? 1 : 0.7,
            backdropFilter: open ? 'blur(10px)' : 'blur(0px)',
        },
    });

    const transApi = useSpringRef();

    // This will orchestrate the two animations above, comment the last arg and it creates a sequence
    useChain(open ? [springApi, transApi] : [transApi, springApi], [
        0,
        -.1,
    ]);

    return (
        <div className={'wrapper'}>
            <animated.div
                style={{...rest, width: size, height: size, justifyContent: "center"}}
                className={className}
                onClick={() => {
                    if (!open) {
                        setOpen(true)
                    }
                }}
            >
                {/*{transition((style, item) => (*/}
                {/*    <animated.div*/}
                {/*        className={'item'}*/}
                {/*        style={{ ...style }}*/}
                {/*    />*/}
                {/*))}*/}
                {!open ? <FontAwesomeIcon icon={faFilter} size={"4x"}
                                          style={{color: 'rgb(37, 50, 55)'}}></FontAwesomeIcon> :
                    <Filters close={() => setOpen(false)}/>}
            </animated.div>
        </div>
    );
    // <div className={"mask mask-squircle"} style={{
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     height: '125px',
    //     width: '125px',
    //     backgroundColor: 'gainsboro',
    //     marginLeft: '12.5%',
    //     opacity: 0.7,
    // }}>
}

interface FiltersProps {
    close: () => void
}

function Filters(props: FiltersProps) {
    return (
        <div style={{
            width: '95%',
            height: '95%',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            gap: '10px',
            flexDirection: 'column',
        }}
             className={"mask mask-squircle bg-neutral"}>
            <div style={{
                width: '80%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '10px',
            }}>
                <input type="checkbox" className="toggle toggle-success" defaultChecked/>
                <Dropdown items={["All", '[102]', '[188]','[188]','[188]','[184]']} header={true} title={'Dropdown'}
                          type={'success'}></Dropdown>
            </div>
            <div style={{
                width: '80%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '10px',
            }}>
                <input type="checkbox" className="toggle toggle-warning" defaultChecked/>
                <Dropdown items={["Hola", "hoola", "afdHolaaaaaaaaaaaaaaaaaa"]} header={true} title={'Dropdown'}
                          type={'warning'}></Dropdown>
            </div>
            <div style={{
                width: '80%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '10px',
            }}>
                <input type="checkbox" className="toggle toggle-error" defaultChecked/>
                <Dropdown items={["Hola", "hoola", "afdHolaaaaaaaaaaaaaaaaaa"]} header={true} title={'Dropdown'}
                          type={'error'}></Dropdown>
            </div>
            <div className={'divider'} style={{opacity: 0, marginTop: 0, marginBottom: '.5rem'}}></div>
            <div style={{
                display: 'flex',
                width: '85%',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>

                <label className="input input-bordered flex items-center gap-2">
                    <input type="text" className="grow" placeholder="Keyword"/>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd"/>
                    </svg>
                </label>
                <button className="btn btn-primary">Apply</button>
            </div>
            <div className={'divider'} style={{opacity: 0, marginTop: 0, marginBottom: '.5rem'}}></div>
            <div role="button" className="btn btn-outline btn-primary m-1" onClick={props.close}>
                Back
            </div>
        </div>
    )
}

interface DropdownProps {
    header: boolean,
    items: string[],
    title: string,
    type: 'success' | 'warning' | 'error',
}

function Dropdown(props: DropdownProps) {
    return (
        <div className="dropdown dropdown-right">
            <div tabIndex={0} role="button" className={`btn btn-${props.type} m-1`}>{props.title}
                <FontAwesomeIcon icon={faCaretDown} size={"1x"}></FontAwesomeIcon>
            </div>

            <div tabIndex={0} className="dropdown-content menu rounded-box z-[1] w-52 p-2 shadow bg-primary">
                {
                    props.items.map((item, index) =>
                        <>
                            <div className={'dropdown-item'}>
                                <label className="hamburger">
                                    <input type="checkbox"/>
                                    <svg viewBox="0 0 32 32">
                                        <path className="line line-top-bottom"
                                              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                                        <path className="line" d="M7 16 27 16"></path>
                                    </svg>
                                </label>
                                <span style={{fontSize: '1.15em', fontWeight: 500}}>{item}</span>
                            </div>

                            {index == 0 && props.header ? <div className="divider" style={{margin: '0'}}></div> : null}
                        </>
                    )
                }
            </div>
        </div>
    );
}