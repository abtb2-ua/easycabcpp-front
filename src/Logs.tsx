import {
    createRef, Dispatch, MouseEventHandler, MutableRefObject,
    RefObject, SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import './Logs.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faFilter} from "@fortawesome/free-solid-svg-icons";
import {ParallaxLayer} from "@react-spring/parallax";
import {ExpandButton} from "./Utils.tsx";
import {Log as LogType} from "../addons/addon";

function handleWheelEvent(event: WheelEvent, domRef: RefObject<HTMLElement>) {
    if (!domRef.current) return;
    const scrollTop = domRef.current.scrollTop;
    const scrollHeight = domRef.current.scrollHeight;
    const clientHeight = domRef.current.clientHeight;

    const atTop = scrollTop === 0 && event.deltaY < 0;
    const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight && event.deltaY > 0;

    if (atTop || atBottom) {
        event.preventDefault();
    }
}

interface LogProps {
    type: 'success' | 'warning' | 'error';
    timestamp: string,
    code: number,
    content: string
}

export function Log(props: LogProps) {
    const d = props.type == 'success' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' :
        props.type == 'warning' ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' :
            'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
    const color = props.type == 'success' ? '#002d00' : props.type == 'warning' ? '#321700' : '#210000';

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
                <span style={{
                    marginLeft: '-5px',
                    textDecoration: "2px underline"
                }}>[{props.code.toString().padStart(3, '0')}]</span>
                &nbsp;&nbsp;&nbsp;
                {props.content}
            </span>
            <span style={{fontWeight: 500}}>{props.timestamp}</span>
        </div>
    )
}

function applyFilters(logs: LogType[], messages: boolean, warnings: boolean, errors: boolean,
                      bannedCodes: number[], keyword: string): LogType[] {
    return logs.filter(log => {
        if (!messages && log.code < 100) return false;
        if (!warnings && log.code < 200 && log.code >= 100) return false;
        if (!errors && log.code >= 200) return false;

        if (bannedCodes.includes(log.code)) return false;

        return keyword === '' || !log.message.includes(keyword);
    })
}

export function LogContainer() {
    const domRef = useRef<HTMLDivElement>(null);
    const closeRef: MutableRefObject<() => void> = useRef(() => {
    });
    const [logs, setLogs] = useState<LogType[]>([])

    // Filters
    const [messages, setMessages] = useState<boolean>(true);
    const [warnings, setWarnings] = useState<boolean>(true);
    const [errors, setErrors] = useState<boolean>(true);

    const [messageCodes, setMessageCodes] = useState<number[]>([]);
    const [warningCodes, setWarningCodes] = useState<number[]>([]);
    const [errorCodes, setErrorCodes] = useState<number[]>([]);

    const [bannedCodes, setBannedCodes] = useState<number[]>([]);

    const [keyword, setKeyword] = useState<string>('');

    const addLog = (log: LogType) => {
        setLogs((prevLogs) => [...prevLogs, log].slice(-50));
    };

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');  // TODO: move to env

        ws.onopen = () => ws.send(JSON.stringify({
            subject: 'getCodes'
        }))

        ws.onmessage = (message) => {
            const data = JSON.parse(message.data)
            if (data.subject === 'codes') {
                setMessageCodes(data.messageCodes);
                setWarningCodes(data.warningCodes);
                setErrorCodes(data.errorCodes);
            } else if (data.subject === 'log') {
                addLog(data.value)
            }
        }
    }, []);

    useEffect(() => {
        // parallaxRef.current.scrollTo(index.current)
        if (domRef.current) {
            if (domRef.current.scrollHeight - domRef.current.scrollTop < domRef.current.clientHeight + 100) {
                domRef.current.scrollTop = domRef.current.scrollHeight;
            }
        }
    }, [logs]);

    useEffect(() => {
        const element = document.getElementById('logs')

        element?.addEventListener('wheel', (event) => handleWheelEvent(event, domRef), {passive: false});
        return () => {
            element?.removeEventListener('wheel', (event) => handleWheelEvent(event, domRef));
        }
    }, []);

    return (
        <>
            <ParallaxLayer offset={1.1} speed={.5}>
                <div className={'log-container'}>
                    <div className={'logs-background'}></div>
                    <div ref={domRef} id={'logs'} className={'logs'}>
                        {applyFilters(logs, messages, warnings, errors, bannedCodes, keyword).map((log, index) =>
                            <Log key={index} timestamp={log.timestamp} code={log.code} content={log.message}
                                 type={log.code >= 200 ? 'error' : log.code >= 100 ? 'warning' : 'success'}></Log>)
                        }
                    </div>
                </div>
            </ParallaxLayer>


            <ParallaxLayer offset={1} speed={1.2} style={{pointerEvents: 'none'}}>
                <ExpandButton icon={faFilter} closeRef={closeRef}
                              from={{
                                  background: "gainsboro",
                                  marginLeft: "-1150px",
                                  marginBottom: '600px',
                                  size: '125px'
                              }}
                              to={{background: "#0d181c8a", marginLeft: "0", marginBottom: '0', size: '500px'}}>
                    <Filters close={closeRef.current}
                             messageCodes={messageCodes} warningCodes={warningCodes} errorCodes={errorCodes}
                             messages={messages} warnings={warnings} errors={errors}
                             setMessages={setMessages} setWarnings={setWarnings} setErrors={setErrors}
                             setBannedCodes={setBannedCodes} setKeyword={setKeyword}
                             resetScroll={() => {
                                 if (domRef.current) {
                                     domRef.current.scrollTop = domRef.current.scrollHeight
                                 }
                             }}/>
                </ExpandButton>
            </ParallaxLayer>
        </>
    )
}

interface FiltersProps {
    close: () => void;

    messages: boolean,
    warnings: boolean,
    errors: boolean;

    setMessages: Dispatch<SetStateAction<boolean>>;
    setWarnings: Dispatch<SetStateAction<boolean>>;
    setErrors: Dispatch<SetStateAction<boolean>>;

    setBannedCodes: Dispatch<SetStateAction<number[]>>;

    setKeyword: Dispatch<SetStateAction<string>>;

    resetScroll: () => void;

    messageCodes: number[]
    warningCodes: number[]
    errorCodes: number[]
}

export function Filters(props: FiltersProps) {
    const keywordInputRef = createRef<HTMLInputElement>();

    return (
        <>
            <div style={{
                width: '80%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '10px',
            }}>
                <input type="checkbox" className="toggle toggle-success" defaultChecked
                       onChange={() => {
                           props.setMessages(!props.messages)
                           setTimeout(() => {
                               props.resetScroll()
                           }, 100);
                       }}/>
                <Dropdown items={props.messageCodes} header={'All'} title={'Dropdown'} resetScroll={props.resetScroll}
                          type={'success'} disabled={!props.messages} setBannedCodes={props.setBannedCodes}></Dropdown>
            </div>
            <div style={{
                width: '80%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '10px',
            }}>
                <input type="checkbox" className="toggle toggle-warning" defaultChecked
                       onChange={() => {
                           props.setWarnings(!props.warnings)
                           setTimeout(() => {
                               props.resetScroll()
                           }, 100);
                       }}/>
                <Dropdown items={props.warningCodes} header={'All'} title={'Dropdown'} resetScroll={props.resetScroll}
                          type={'warning'} disabled={!props.warnings} setBannedCodes={props.setBannedCodes}></Dropdown>
            </div>
            <div style={{
                width: '80%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '10px',
            }}>
                <input type="checkbox" className="toggle toggle-error" defaultChecked
                       onChange={() => {
                           props.setErrors(!props.errors)
                           setTimeout(() => {
                               props.resetScroll()
                           }, 100);
                       }}/>
                <Dropdown items={props.errorCodes} header={'All'} title={'Dropdown'} resetScroll={props.resetScroll}
                          type={'error'} disabled={!props.errors} setBannedCodes={props.setBannedCodes}></Dropdown>
            </div>
            <div className={'divider'} style={{opacity: 0, marginTop: 0, marginBottom: '.5rem'}}></div>
            <div style={{
                display: 'flex',
                width: '85%',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>

                <label className="input input-bordered flex items-center gap-2">
                    <input type="text" className="grow" placeholder="Keyword" ref={keywordInputRef}/>
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
                <button className="btn btn-primary" onClick={() => {
                    props.setKeyword(keywordInputRef.current?.value ?? '');
                    console.log(keywordInputRef.current?.value)
                    setTimeout(() => {
                        props.resetScroll()
                    }, 100);
                }}>Apply
                </button>
            </div>
            <div className={'divider'} style={{opacity: 0, marginTop: 0, marginBottom: '.5rem'}}></div>
            <div role="button" className="btn btn-outline btn-primary m-1" onClick={() => {
                props.close()
            }}>
                Back
            </div>
        </>
    )
}

interface DropdownProps {
    header?: string | null,
    disabled?: boolean
    items: number[],
    title: string,
    type: 'success' | 'warning' | 'error',
    setBannedCodes: Dispatch<SetStateAction<number[]>>
    resetScroll: () => void;
}

let dropdownNextId = 0;

function Dropdown(props: DropdownProps) {
    const domRef = useRef<HTMLDivElement>(null);
    const id = `scroll-section-${dropdownNextId++}`;
    const [headerChecked, setHeaderChecked] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean[]>(new Array(props.items.length).fill(false));

    const header = !props.header ? null : (
        <>
            <DropdownItem checked={headerChecked} content={props.header} onClick={() => {
                if (headerChecked) {
                    props.setBannedCodes([]);
                    setTimeout(() => {
                        props.resetScroll()
                    }, 100);
                } else {
                    props.setBannedCodes(props.items);
                }
                setChecked(props.items.map(() => !headerChecked));
                setHeaderChecked(!headerChecked);
            }}></DropdownItem>
            <div className={'divider'} style={{margin: '.5rem'}}></div>
        </>
    )

    useEffect(() => {
        const element = document.getElementById(id)

        element?.addEventListener('wheel', (event) => handleWheelEvent(event, domRef), {passive: false});
        return () => {
            element?.removeEventListener('wheel', (event) => handleWheelEvent(event, domRef));
        }
    }, [id]);

    return (
        <div className="dropdown dropdown-right">
            <div tabIndex={0} role="button"
                 className={`btn btn-${props.type} m-1 ${props.disabled ?? false ? 'disabled' : ''}`}>{props.title}
                <FontAwesomeIcon icon={faCaretDown} size={"1x"}></FontAwesomeIcon>
            </div>

            <div tabIndex={0} className={"dropdown-content menu rounded-box z-[1] w-52 p-2 bg-primary"}>
                {header}
                <div id={id} className='scroll-section' ref={domRef}>
                    {
                        props.items.map((item, index) =>
                            <DropdownItem checked={checked[index]} content={item} key={index} onClick={() => {
                                if (!checked[index]) {
                                    props.setBannedCodes((prev: number[]) => {
                                        return [...prev, item]
                                    })
                                } else {
                                    props.setBannedCodes((prev) => prev.filter(code => code !== item))
                                    setTimeout(() => {
                                        props.resetScroll()
                                    }, 100);
                                }
                                setChecked((prev) => prev.map((value, i) => i === index ? !value : value));
                            }}/>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

interface DropdownItemProps {
    content: number | string,
    onClick?: MouseEventHandler<HTMLInputElement>
    checked: boolean
}

function DropdownItem(props: DropdownItemProps) {
    let content: string;
    if (typeof props.content === 'number') {
        content = props.content.toString().padStart(3, '0');
    } else {
        content = props.content;
    }

    return (
        <div className={'dropdown-item'}>
            <label className="hamburger">
                <input type="checkbox" onClick={props.onClick} checked={props.checked} readOnly={true}/>
                <svg viewBox="0 0 32 32">
                    <path className="line line-top-bottom"
                          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                    <path className="line" d="M7 16 27 16"></path>
                </svg>
            </label>
            <span style={{fontSize: '1.15em', fontWeight: 500}}>[{content}]</span>
        </div>
    )
}
