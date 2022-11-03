import React from "react"; 
import "./CustomizedButton.css"; 


export function CustomizedButton({ text }) {
    const style = {
        width: '524px',
        height: '88px',
        background: '#FFFFFF',
        color: '#757575',
        boxShadow: '0px 0px 13.1034px #8BB8E8',
        border: 'none',
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '30.6431px',
        lineHeight: '37px',
        
    }
    return (
        <div className="myButton">
            <button type="button" style={style}>
                {text}
            </button>
        </div>
    )
}

