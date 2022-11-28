import React, { useEffect } from "react";
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

let loaded_classes = {
    'GE-AH-LC': json_to_options(require("./class-info/GE-AH-LC.json")),
    'GE-AH-VP': json_to_options(require("./class-info/GE-AH-VP.json")),
    'GE-AH-PL': json_to_options(require("./class-info/GE-AH-PL.json")),
    'GE-SC-HA': json_to_options(require("./class-info/GE-SC-HA.json")),
    'GE-SC-SA': json_to_options(require("./class-info/GE-SC-SA.json")),
    'GE-SI-LS': json_to_options(require("./class-info/GE-SI-LS.json"))
}

let ge1_options = options;
let ge2_options = options;

export function GEs() {
    const [ge1Category, _setge1Category] = useState(null);
    const [ge1selectedOption, ge1setSelectedOption] = useState(null);

    const [ge2Category, _setge2Category] = useState(null);
    const [ge2selectedOption, ge2setSelectedOption] = useState(null);

    const [SCHA, setSCHA] = useState(null);
    const [SCSA, setSCSA] = useState(null);
    const [SILS, setSILS] = useState(null);

    const setge1Category = (newOption) => {
        _setge1Category(newOption)
        ge2_options = options.filter(function (item) {
            return item !== newOption
        })
    }

    const setge2Category = (newOption) => {
        _setge2Category(newOption);
        ge1_options = options.filter(function (item) {
            return item !== newOption
        })
    }

    return (
        <div className="ge-ah-list">
            {/* GE - Foundation of Arts and Humanities */}
            <Select
                className="ah-select"
                onChange={(newOption) => setge1Category(newOption)}
                name="colors"
                options={ge1_options}
            />
            <DropdownButton
                // text={ge1Category ? "A&H GE #1: " + display_text[ge1Category.value] : "Select a category"}
                // type_list={ge1Category ? [ge1Category.value] : null}
                options={ge1Category ? loaded_classes[ge1Category.value] : null}
                setSelectedOption={ge1setSelectedOption}>
            </DropdownButton>
            <Select
                className="ah-select"
                onChange={(newOption) => setge2Category(newOption)}
                name="colors"
                options={ge2_options}
            />
            <DropdownButton
                // text={ge2Category ? "A&H GE #2: " + display_text[ge2Category.value] : "Select a category"}
                // type_list={ge2Category ? [ge2Category.value] : null}
                options={ge2Category ? loaded_classes[ge2Category.value] : null}
                setSelectedOption={ge2setSelectedOption}>
            </DropdownButton>

            {/* GE - Foundations of Society and Culture */}
            <DropdownButton
                text={"S&C #1: Historical Analysis"}
                options={loaded_classes["GE-SC-HA"]}
                setSelectedOption={setSCHA}>
            </DropdownButton>
            <DropdownButton
                text={"S&C #1: Social Analysis"}
                options={loaded_classes["GE-SC-SA"]}
                setSelectedOption={setSCSA}>
            </DropdownButton>

            {/* GE - Foundations of Scientific Inquiry */}
            <DropdownButton
                text={"Scientific Inquiry #1: Life Sciences"}
                options={loaded_classes["GE-SI-LS"]}
                setSelectedOption={setSILS}>
            </DropdownButton>
        </div>
    )
}