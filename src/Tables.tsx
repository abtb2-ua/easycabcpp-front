import {ParallaxLayer} from '@react-spring/parallax';
import {AgGridReact, CustomCellRendererProps} from 'ag-grid-react';
import {AllCommunityModule, ModuleRegistry, themeQuartz} from 'ag-grid-community';
import type {ColDef, GetRowIdParams, ValueFormatterParams} from "ag-grid-community";
import {useMemo, CSSProperties, useRef, useCallback, useState, useEffect, MutableRefObject} from "react";
import './Tables.css';
import {
    CoordinateOnChange,
    CustomerIdOnChange,
    ExpandButton,
    LocationIdOnChange,
    TaxiIdOnChange,
    TextInput, VeilList
} from "./Utils.tsx";
import {faCirclePlus, faTaxi, faUser, faLocationDot} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {animated} from "@react-spring/web";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {faCircleXmark} from "@fortawesome/free-solid-svg-icons/faCircleXmark";
import * as addon from "../addons/addon";
import {Toast} from 'primereact/toast';

const CheckBox = (params: CustomCellRendererProps) => {
    return (
        <>
            <input checked={params.value} disabled={true} type="checkbox" className='checkbox'/>
            <label className='tick-label'>
                <div id="tick-mark"></div>
            </label>
        </>
    )
}

const Countdown = (params: CustomCellRendererProps) => {
    return (
        <span className='countdown font-mono'>
            <span style={{'--value': params.value} as CSSProperties}/>
        </span>
    )
};

export default function Tables() {
    ModuleRegistry.registerModules([AllCommunityModule]);
    const closeRef = useRef(() => {
    });
    const [map, setMap] = useState<addon.Map>({locations: [], customers: [], taxis: []});
    const ws = useRef<WebSocket | null>(null);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');  // TODO: move to env

        ws.current.onopen = () => {
            console.log('Tables WebSocket connected')
        }

        ws.current.onmessage = (message) => {
            const data = JSON.parse(message.data)
            if (data.subject === 'map') {
                setMap(data.value)
            }
        }
    }, []);

    return (
        <>
            <ParallaxLayer offset={2} speed={1.5}
                           style={{
                               alignContent: 'center',
                               justifyItems: 'center',
                               pointerEvents: 'none',
                               height: '100vh',
                               width: '100vw',
                               position: 'absolute',
                               zIndex: 1,
                           }}>
                    <Toast ref={toast} position="top-right"/>
                    <ExpandButton icon={faCirclePlus} closeRef={closeRef}
                                  from={{
                                      background: "gainsboro",
                                      marginLeft: "-80vw",
                                      marginBottom: '70vh',
                                      size: '125px'
                                  }}
                                  to={{background: "#0d181c8a", marginLeft: "0", marginBottom: '0', size: '700px'}}>
                        <Actions map={map} ws={ws} toast={() => toast.current?.show({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Order sent successfully',
                            life: 300000
                        })}/>
                        <div
                            style={{position: "absolute", left: '12%', top: '12%', fontSize: '80px', color: '#253237'}}>
                            <FontAwesomeIcon style={{cursor: "pointer"}} onClick={closeRef.current}
                                             icon={faCircleXmark}/>
                        </div>
                    </ExpandButton>

            </ParallaxLayer>
            <ParallaxLayer offset={2} speed={.6}
                           style={{
                               alignContent: 'center',
                               justifyItems: 'center',
                               pointerEvents: 'none',
                               height: '50vh',
                               width: '100vw'
                           }}>
                <Table
                    width={1200} height={300}
                    lightColor={'#c9fec9'} mediumColor={'#77dd77'} darkColor={'#288e28'}
                    columnDefs={[
                        {headerName: 'ID', field: "id", flex: 7, valueFormatter: (p: ValueFormatterParams<number>) => p.value.toString().padStart(2, '0')},
                        {
                            headerName: 'Coords.',
                            field: "coord",
                            flex: 11,
                            valueFormatter: (p) => `[${p.value.x + 1}, ${p.value.y + 1}]`
                        },
                        {headerName: 'Customer', field: "customer", flex: 12},
                        {
                            headerName: 'Dest.',
                            field: "dest",
                            flex: 9,
                            valueFormatter: (p) => {
                                if (typeof p.value === 'string') {
                                    return p.value
                                }
                                const x = p.value.x == -1 ? '--' : (p.value.x + 1).toString()
                                const y = p.value.y == -1 ? '--' : (p.value.y + 1).toString()
                                return `[${x}, ${y}]`
                            }
                        },
                        {headerName: 'Connected', field: "connected", flex: 12, cellRenderer: CheckBox},
                        {headerName: 'Ready', field: "ready", flex: 9, cellRenderer: CheckBox},
                        {headerName: 'Stopped', field: "stopped", flex: 11, cellRenderer: CheckBox},
                        {headerName: 'Wait Time', field: "waitTime", flex: 12, cellRenderer: Countdown},
                    ]}
                    rowData={map.taxis}
                />
            </ParallaxLayer>
            <ParallaxLayer offset={2.3} speed={.9}
                           style={{
                               pointerEvents: 'none',
                               height: '70vh',
                               width: '100vw',
                               marginLeft: '0vw',
                               display: 'flex',
                               flexDirection: 'row',
                               alignItems: 'center',
                               justifyContent: 'space-evenly',
                           }}>
                <Table
                    width={950} height={300}
                    lightColor={'#ffffd2'} mediumColor={'#fdcc9b'} darkColor={'#af7138'}
                    columnDefs={[
                        {headerName: 'ID', field: 'id', flex: 3},
                        {
                            headerName: 'Coords.',
                            field: 'coord',
                            flex: 5,
                            valueFormatter: (p) => `[${p.value.x + 1}, ${p.value.y + 1}]`
                        },
                        {headerName: 'Location', field: "location", flex: 5},
                        {headerName: 'Next Request', field: "nextRequest", flex: 6, cellRenderer: Countdown},
                        {headerName: 'Onboard', field: "onboard", flex: 5, cellRenderer: CheckBox},
                        {headerName: 'In queue', field: "inQueue", flex: 5, cellRenderer: CheckBox},
                    ]}
                    rowData={map.customers}
                />
                <Table
                    width={300} height={300}
                    lightColor={'#c6e2ff'} mediumColor={'#84b6f4'} darkColor={'#336ca5'}
                    columnDefs={[
                        {headerName: 'ID', field: "id", flex: 2},
                        {
                            headerName: 'Coords.',
                            field: "coord",
                            flex: 3,
                            valueFormatter: (p) => `[${p.value.x}, ${p.value.y}]`
                        },
                    ]}
                    rowData={map.locations}/>
            </ParallaxLayer>
        </>
    )
}

interface LocationData {
    id: string,
    coordinates: [number, number],
}

interface TableProps {
    width: number,
    height: number,
    lightColor: string,
    mediumColor: string,
    darkColor: string,
    columnDefs: ColDef<any, any>[],
    rowData: any[],
}

let tableNextId = 0;

function Table(props: TableProps) {
    const gridRef = useRef<AgGridReact>(null);
    const theme = themeQuartz.withParams({
        backgroundColor: props.lightColor,
        foregroundColor: "#253237",
        headerTextColor: "gainsboro",
        fontSize: '1.1rem',
        headerBackgroundColor: props.darkColor,
        headerFontWeight: "800",
        borderColor: props.darkColor,
        headerColumnResizeHandleColor: props.lightColor,
        fontFamily: 'Rubik',
        headerFontFamily: 'Rubik',
        menuBackgroundColor: props.mediumColor,
    });

    const containerStyle = useMemo(() => ({width: props.width + 'px', height: props.height + 'px'}), []);
    const gridStyle = useMemo(() => ({height: "100%", width: "100%"}), []);
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            filter: true,
            sortable: true,
        };
    }, []);

    const getRowId = useCallback((params: GetRowIdParams) => {
        return params.data.id;
    }, []);

    let id = `table-${tableNextId++}`;

    return (
        <div id={id} style={{pointerEvents: 'auto', ...containerStyle}}>
            <div style={gridStyle} className="ag-theme-quartz">
                <AgGridReact<LocationData>
                    ref={gridRef}
                    rowData={props.rowData}
                    columnDefs={props.columnDefs}
                    theme={theme}
                    defaultColDef={defaultColDef}
                    getRowId={getRowId}
                />
            </div>
        </div>
    );
}

function LiquidButton(props: {
    open: number,
    type: string,
    targetOpen: number,
    onClick: () => void,
    icon: IconDefinition,
    animationDelay: string,
}) {
    return (
        <animated.button className={`liquid-button ${props.type}`} style={{
            pointerEvents: 'auto',
            animationDelay: props.animationDelay,
            color: props.open !== -1 ? 'transparent' : 'white',
            cursor: props.open !== -1 ? 'auto' : 'pointer',
            "--delay": props.open !== -1 ? '0s' : '.25s',
            zIndex: props.open === props.targetOpen ? 3 : 1,
            scale: props.open === props.targetOpen ? 9 : 1,
        } as CSSProperties} onClick={props.onClick}>
            <span><FontAwesomeIcon icon={props.icon}/></span>
        </animated.button>
    )
}

function Actions(props: { map: addon.Map, ws: MutableRefObject<WebSocket | null>, toast: () => void }) {
    const [open, setOpen] = useState(-1);
    const [lastOpen, setLastOpen] = useState(0);

    const [taxiIndex, setTaxiIndex] = useState(0);
    const [custIndex, setCustIndex] = useState(0);
    const [locIndex, setLocIndex] = useState(0);

    const taxiIdRef = useRef<HTMLInputElement>(null);
    const taxiCoordRef = useRef<HTMLInputElement>(null);
    const custIdRef = useRef<HTMLInputElement>(null);
    const locIdRef = useRef<HTMLInputElement>(null);
    const locCoordRef = useRef<HTMLInputElement>(null);


    const send = () => {
        let message: addon.Message

        const getCoord = (str: string) => {
            let [x, y] = str.slice(1, 7).split(', ').map(s => parseInt(s))
            return {x: x, y: y}
        }

        if (open === 0) {
            message = {
                code: taxiIndex,
                taxiId: parseInt(taxiIdRef.current?.value ?? '00'),
                id: '-',
                coord: getCoord(taxiCoordRef.current?.value ?? '[99, 99]')
            }
        } else if (open === 1) {
            message = {
                code: custIndex + 5,
                taxiId: 0,
                id: custIdRef.current?.value ?? '-',
                coord: {x: 0, y: 0}
            }
        } else {
            message = {
                code: locIndex + 7,
                taxiId: 0,
                id: locIdRef.current?.value ?? '-',
                coord: getCoord(locCoordRef.current?.value ?? '[99, 99]') // An invalid value, so that it will be ignored
            }
        }

        const sendMessage = () => {
            if (props.ws.current) {
                props.ws.current.send(JSON.stringify({
                    subject: 'sendMessage',
                    message: message
                }))
            } else {
                console.log('WebSocket not connected')
                setTimeout(sendMessage, 100)
            }
        }

        sendMessage()
    }

    return (
        <div style={{
            width: '80%',
            height: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                width: '100%',
                height: '65%',
                pointerEvents: 'none',
                position: "absolute",
                top: 0,
                justifyItems: 'center',
                alignContent: 'center'
            }}>
                <LiquidButton animationDelay={'0'} open={open} icon={faTaxi} type={'green'} targetOpen={0}
                              onClick={() => {
                                  setOpen(0)
                                  setLastOpen(0)
                              }}/>
            </div>

            <div style={{
                width: '100%',
                height: '65%',
                pointerEvents: 'none',
                position: "absolute",
                bottom: 0,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center'
            }}>

                <LiquidButton animationDelay={'-1s'} open={open} icon={faUser} type={'yellow'} targetOpen={1}
                              onClick={() => {
                                  setOpen(1)
                                  setLastOpen(1)
                              }}/>
                <LiquidButton animationDelay={'-2s'} open={open} icon={faLocationDot} type={'blue'} targetOpen={2}
                              onClick={() => {
                                  setOpen(2)
                                  setLastOpen(2)
                              }}/>
            </div>

            <animated.div className={'actions-container'}
                          style={{
                              scale: open !== -1 ? 1 : 0,
                              zIndex: 3,
                              pointerEvents: open !== -1 ? 'auto' : 'none',
                              transitionDelay: open !== -1 ? '.25s' : '0s'
                          }}>

                {lastOpen === 0 ?
                    <TextInput ref={taxiIdRef} icon={faTaxi} onChange={TaxiIdOnChange} defaultValue={'00'}/> : null}
                {lastOpen === 0 ?
                    <TextInput ref={taxiCoordRef} onChange={CoordinateOnChange} defaultValue={'[00, 00]'}/> : null}
                {lastOpen === 1 ?
                    <TextInput ref={custIdRef} icon={faUser} onChange={CustomerIdOnChange} defaultValue={'0'}/> : null}
                {lastOpen === 2 ? <TextInput ref={locIdRef} icon={faLocationDot} onChange={LocationIdOnChange}
                                             defaultValue={'0'}/> : null}
                {lastOpen === 2 ?
                    <TextInput ref={locCoordRef} onChange={CoordinateOnChange} defaultValue={'[00, 00]'}/> : null}


                {lastOpen == 0 ? <VeilList setIndex={setTaxiIndex}
                                           items={['Go to', 'Stop', 'Continue', 'Return to Base', 'Disconnect']}/> : null}
                {lastOpen == 1 ?
                    <VeilList setIndex={setCustIndex} items={['Disconnect', 'Set maximum priority']}/> : null}
                {lastOpen == 2 ? <VeilList setIndex={setLocIndex} items={['Move']}/> : null}

                <div style={{width: '70%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <button className={'btn btn-outline btn-primary'} onClick={() => setOpen(-1)}>
                        <span>Back</span>
                    </button>
                    <button className={'send-button'} onClick={() => {
                        send()
                        props.toast()
                    }}>
                        <div className="svg-wrapper-1">
                            <div className="svg-wrapper">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                >
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path
                                        fill="currentColor"
                                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <span>Send</span>
                    </button>
                </div>

            </animated.div>
        </div>
    )
}
