import React, { useState } from 'react';
import Select from 'react-select';

import './DropdownButton.css';

const example = 
`
{
    "classes": [
        ["req-cs", "COM SCI 118", "COM SCI", "0118", "14F", 4, "COM SCI0111", null],
        ["req-cs", "COM SCI 131", "COM SCI", "0131", "14F", 4, "COM SCI0033,COM SCI0035L", null],
        ["req-cs", "COM SCI 151B", "COM SCI", "0151B", "97W", 4, "COM SCI0051A", null],
        ["req-cs", "COM SCI M152A", "COM SCI", "0152A M", "18W", 2, "COM SCI0051A M", null],
        ["req-cs", "COM SCI 18", "COM SCI", "0180", "16F", 4, "COM SCI0032,MATH   0061", null],
        ["req-cs", "COM SCI 181", "COM SCI", "0181", "14F", 4, "COM SCI0180", null]
    ]
}
`

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

    const example_json = JSON.parse(example);

    const create_options = (json) => {
        let classes = json.classes;
        let options = [];
        for (const c of classes) {
            var dict = {value: c[1], label : c[1]};
            options.push(dict);
        }
        return options
    }

    return (
        <div className="dropdown-button" style={style}>
            <div className="name">{text}</div>
            <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={create_options(example_json)}
                placeholder="Choose a class..."
                isSearchable
                className='dropdown'
            />
        </div>
    );
}