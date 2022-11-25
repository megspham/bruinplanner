import React from "react";
import { render } from "react-dom";
import { DropdownButton } from "../DropdownButton";
import { useState } from "react";
import Select from "react-select";
import "./GE-AH.css"

const options = [
    { value: 'GE-AH-LC', label: 'Literary and Cultural Analysis' },
    { value: 'GE-AH-VP', label: 'Visual and Performance Arts Analysis and Practice' },
    { value: 'GE-AH-PL', label: 'Philosophic and Linguistic Analysis' }
]

const display_text = {
    'GE-AH-LC': "LCA",
    'GE-AH-VP': "VPA",
    'GE-AH-PL': "PLA"
}

let ge1_options = options;
let ge2_options = options;

export function GEAH() {
    const [ge1Category, _setge1Category] = useState(null);
    const [ge1selectedOption, ge1setSelectedOption] = useState(null);

    const [ge2Category, _setge2Category] = useState(null);
    const [ge2selectedOption, ge2setSelectedOption] = useState(null);

    const setge1Category = (newOption) => {
        _setge1Category(newOption)
        ge2_options = options.filter(function(item) {
            return item !== newOption
        })
    }

    const setge2Category = (newOption) => {
        _setge2Category(newOption);
        ge1_options = options.filter(function(item) {
            return item !== newOption
        })
    }

    return (
        <div className="ge-ah-list">
            <Select
                onChange={(newOption) => setge1Category(newOption)}
                name="colors"
                options={ge1_options}
            />
            <DropdownButton text={ge1Category ? "A&H GE #1: " + display_text[ge1Category.value] : "Select a category"}
                type_list={ge1Category ? [ge1Category.value] : null}
                setSelectedOption={ge1setSelectedOption}>
            </DropdownButton>
            <Select
                onChange={(newOption) => setge2Category(newOption)}
                name="colors"
                options={ge2_options}
            />
            <DropdownButton text={ge2Category ? "A&H GE #2: " + display_text[ge2Category.value] : "Select a category"}
                type_list={ge2Category ? [ge2Category.value] : null}
                setSelectedOption={ge2setSelectedOption}>
            </DropdownButton>
            {console.log(ge1selectedOption)}
            {console.log(ge2selectedOption)}
        </div>
    )
}