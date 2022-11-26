/**
 * @file File for the SidebarButton component, which is the button used for the sidebar
 * @author Ian Galvez
 */

import React from "react"; 
import ReactTooltip from "react-tooltip";
import ReactDOMServer from "react-dom/server";
import { Text } from "react-native";

/**
 * Create a CustomizedButton
 * @param {string} info Information on units, prerequisites, and historical course information
 * @param {string} text What to write on the button
 * @param {function} onClick Defines what function to call when the button is clicked
 * @returns CustomizedButton HTML div object
 */
export function SidebarButton({ info, text, onClick }) {

    const style = {
        width: '12vw',
        height: '26px',
        background: '#FFFFFF',
        color: '#757575',
        boxShadow: '0px 0px 13.1034px #8BB8E8',
        border: 'none',
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '15px',
        lineHeight: '37px',
        borderRadius: '3px'
        
    }

    const tooltipStyle = {
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '15px'
    }

    return (
        <div className="myButton">
            <a
                data-for={text}
                data-html={true}
                data-tip={ReactDOMServer.renderToString(
                    <div style={tooltipStyle}> 
                        <Text>{"\n"}</Text>
                        <b>Units: </b> {info.split("|")[0]} 
                        <Text>{"\n\n"}</Text>
                        <b>Prerequisites: </b> {info.split("|")[1]}
                        <Text>{"\n\n"}</Text>
                        <b>Historical Offerings: </b> {info.split("|")[2]}
                        <Text>{"\n\n"}</Text>
                    </div>)}
            >
                <button type="button" style={style} onClick={onClick}>
                    {text}
                </button>
            </a>
            <ReactTooltip
                id={text}
                place={"left"}
                type={"light"}
                effect={"solid"}
                // getContent={(dataTip) => 
                //     <div style={tooltipStyle}>
                //         <br />
                //         <b>Units: </b> {dataTip[0]} <br /><br />
                //         <b>Prerequisites: </b> <br /><br />
                //         <b>Historical Offerings: </b> <br /><br />
                //     </div> 
                // }
                multiline={true}
                textColor={"#005587"}
                backgroundColor={"#E5F1FF"}
                border={"true"}
                borderColor={"#0070E8"}
            />
        </div>
    )
}