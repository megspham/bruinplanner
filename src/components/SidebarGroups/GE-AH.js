import React from "react";
import { render } from "react-dom";
import { DropdownButton } from "../DropdownButton";
import { useState } from "react";
import Select from "react-select";

const options = [
    { value: 'GE-AH-LC', label: 'Literary and Cultural Analysis' },
    { value: 'GE-AH-VP', label: 'Visual and Performance Arts Analysis and Practice' },
    { value: 'GE-AH-PL', label: 'Philosophic and Linguistic Analysis'}
]

const display_text = {
    'GE-AH-LC': "LCA",
    'GE-AH-VP': "VPA",
    'GE-AH-PL': "PLA"   
}

export function GEAH() {
    const [selectedOption, setSelectedOption] = useState([null, null]);

    return (
        <div className="ge-ah-list">
            <Select
                isMulti
                onChange={(newOption) => setSelectedOption(newOption)}
                name="colors"
                options={options}
            />
            <DropdownButton text={selectedOption[0] ? "A&H GE #1: " + display_text[selectedOption[0].value] : "Select a category"}
                type_list={selectedOption[0] ? [selectedOption[0].value] : null}></DropdownButton>
            <DropdownButton text={selectedOption[1] ? "A&H GE #2: " + display_text[selectedOption[0].value] : "Select a category"}
                type_list={['req-cs']}></DropdownButton>
        </div>
    )
}