import React, { useState } from 'react';
import Select from 'react-select';

import './DropdownButton.css';

export function DropdownButton({text, options}) {
    const [selectedOption, setSelectedOption] = useState(null);

    const style = {
        width: '38vw',
        height: '88px',
        background: '#FFFFFF',
        color: '#757575',
        boxShadow: '0px 0px 13.1034px #8BB8E8',
        border: 'none',
        fontFamily: 'Montserrat',
        fontStyle: 'normal',        
    }
    return (
        <div className="dropdown-button" style={style}>
            <div className="name">{text}</div>
            <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
                placeholder="Choose a class..."
                isSearchable
                className='dropdown'
            />
        </div>
    );
}