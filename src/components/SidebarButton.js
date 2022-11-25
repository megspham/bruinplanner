/**
 * @file File for the SidebarButton component, which is the button used for the sidebar
 * @author Ian Galvez
 */

import React from "react"; 
// import "./CustomizedButton.css"; 

/**
 * Create a CustomizedButton
 * @param {string} text What to write on the button
 * @param {function} onClick Defines what function to call when the button is clicked
 * @returns CustomizedButton HTML div object
 */
export function SidebarButton({ text, onClick }) {
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
    return (
        <div className="myButton">
            <button type="button" style={style} onClick={onClick}>
                {text}
            </button>
        </div>
    )
}

