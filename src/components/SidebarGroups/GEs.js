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

let loaded_classes = {
    'GE-AH-LC': [],
    'GE-AH-VP': [],
    'GE-AH-PL': [],
    'GE-SC-HA': [],
    'GE-SC-SA': [],
    'GE-SI-LS': []
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

    setTimeout(function () {
        console.log("1");
        if (loaded_classes['GE-AH-LC'].length === 0) {
            console.log("loading")
            loaded_classes['GE-AH-LC'] = create_options(['GE-AH-LC'])
        }
    }, 1000);
    setTimeout(function () {
        console.log("2");
        if (loaded_classes['GE-AH-VP'].length === 0) {
            console.log("loading")
            loaded_classes['GE-AH-VP'] = create_options(['GE-AH-VP'])
        }
    }, 3000);
    setTimeout(function () {
        console.log("3");
        if (loaded_classes['GE-AH-PL'].length === 0) {
            console.log("loading")
            loaded_classes['GE-AH-PL'] = create_options(['GE-AH-PL'])
        }
    }, 5000);
    setTimeout(function () {
        console.log("4");
        if (loaded_classes['GE-SC-HA'].length === 0) {
            console.log("loading")
            loaded_classes['GE-SC-HA'] = create_options(['GE-SC-HA'])
        }
    }, 7000);
    setTimeout(function () {
        console.log("5");
        if (loaded_classes['GE-SC-SA'].length === 0) {
            console.log("loading")
            loaded_classes['GE-SC-SA'] = create_options(['GE-SC-SA'])
        }
    }, 9000);
    setTimeout(function () {
        console.log("6");
        if (loaded_classes['GE-SI-LS'].length === 0) {
            console.log("loading")
            loaded_classes['GE-SI-LS'] = create_options(['GE-SI-LS'])
        }
    }, 11000);

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