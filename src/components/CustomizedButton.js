/**
 * @file File for the CustomizedButton component, which is the button used throughout
 * the Bruin Planner website
 * @author Megan Pham
 */

import React from "react"; 

/**
 * Create a CustomizedButton
 * @param {string} text What to write on the button
 * @param {function} onClick Defines what function to call when the button is clicked
 * @returns CustomizedButton HTML div object
 */
export function CustomizedButton({ text, onClick }) {
    const style = {
        width: '38vw',
        height: '88px',
        background: '#FFFFFF',
        color: '#757575',
        boxShadow: '0px 0px 13.1034px #8BB8E8',
        border: 'none',
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '25px',
        lineHeight: '37px',
        
    }
    return (
        <div className="myButton">
            <button type="button" style={style} onClick={onClick}>
                {text}
            </button>
        </div>
    )
}

