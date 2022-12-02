/**
 * @file Dropdown button for degree requirements that are variable, such as 
 * electives and GEs
 * @author Andy Goh
 */
import React from 'react';
import Select from 'react-select';
import './DropdownButton.css';

/**
 * 
 * @param {str} text Display text for button
 * @param {Array.<str>} type_list Requirement(s) that the returned classes should satisfy
 * @returns Dropdown button
 */
export function DropdownButton({ selectedOption, setSelectedOption, text, options, type_list}) {
    const style = {
        width: '19vw',
        height: '40px',
        background: '#FFFFFF',
        color: '#757575',
        boxShadow: '0px 0px 13.1034px #8BB8E8',
        border: 'none',
        borderRadius: '3.68431px',
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        margin: '0px'
    }

    const create_options = (type_list) => {
        let options = []
        const requestBody = {
            "type_list": type_list,
            "department_list": null,
            "min_units": 0,
            "max_units": 99,
            "classes_taken": null
        }
        fetch("http://127.0.0.1:8000/api/getClasses", {
            crossDomain: true,
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        }).then(res => res.json())
            .then(json => {
                let classes = json.classes;
                for (const c of classes) {
                    var dict = { value: c[1], label: c[1] };
                    options.push(dict);
                }
            }).catch(err => console.log(err))
        return options
    }
    
    const get_options = () => {
        console.log(text);
        if (type_list) {
            return create_options(type_list);
        } else {
            return options;
        }
    };

    return (
        <div className="dropdown-button" style={style}>
            {/* <div className="name">{text}</div> */}
            <Select
                defaultValue={selectedOption}
                onChange={newOption => setSelectedOption(text, newOption)}
                options={get_options()}
                placeholder="Choose a class..."
                isSearchable
                className='dropdown'
            />
        </div>
    );
}