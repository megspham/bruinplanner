import React from "react";
import { render } from "react-dom";
import { DropdownButton } from "../DropdownButton";
import { useState } from "react";
import Select from "react-select";
import "./GEs.css"

const options = [
    { value: 'GE-AH-LC', label: 'A&H: Literary and Cultural Analysis' },
    { value: 'GE-AH-VP', label: 'A&H: Visual and Performance Arts Analysis and Practice' },
    { value: 'GE-AH-PL', label: 'A&H: Philosophic and Linguistic Analysis' }
]

const display_text = {
    'GE-AH-LC': "LCA",
    'GE-AH-VP': "VPA",
    'GE-AH-PL': "PLA"
}

const json_to_options = (json) => {
    let classes = json.classes;
    let options =[]
    for (const c of classes) {
        var dict = { value: c[1], label: c[1] };
        options.push(dict);
    }
    return options
}

let elective_options = json_to_options(require("./class-info/req-cs.json"))

export function Electives() {
    const [elective1, setelective1] = useState(null);
    const [elective2, setelective2] = useState(null);
    const [elective3, setelective3] = useState(null);
    const [elective4, setelective4] = useState(null);
    const [elective5, setelective5] = useState(null);
    
    return (
        <div className="ge-ah-list">
            <DropdownButton
                text={"COM SCI Elective #1"}
                options={elective_options}
                setSelectedOption={setelective1}>
            </DropdownButton>
            <DropdownButton
                text={"COM SCI Elective #2"}
                options={elective_options}
                setSelectedOption={setelective2}>
            </DropdownButton>
            <DropdownButton
                text={"COM SCI Elective #3"}
                options={elective_options}
                setSelectedOption={setelective3}>
            </DropdownButton>
            <DropdownButton
                text={"COM SCI Elective #4"}
                options={elective_options}
                setSelectedOption={setelective4}>
            </DropdownButton>
            <DropdownButton
                text={"COM SCI Elective #5"}
                options={elective_options}
                setSelectedOption={setelective5}>
            </DropdownButton>
        </div>
    )
};