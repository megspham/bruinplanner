import React, { useEffect, useState } from 'react';
import './Calendar.css';
import CalendarList from './CalendarList';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SidebarButton } from "../SidebarButton"
import Container from "./Container";
import { arrayMove } from '@dnd-kit/sortable';
import { useLocation } from "react-router-dom";
import { VariableClasses } from "../SidebarGroups/VariableClasses"

async function sendRequest(apiName, requestBody) {
  const response = await fetch("http://127.0.0.1:8000/api/" + apiName, {
    crossDomain: true,
    mode: 'cors',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  const responseJson = await response.json();
  return responseJson["classes"];
}

async function getClasses(type_list = null, department_list = null, min_units = null, max_units = null, classes_taken = null) {
  const requestBody = {
    "type_list": type_list,
    "department_list": department_list,
    "min_units": min_units,
    "max_units": max_units,
    "classes_taken": classes_taken
  }
  return sendRequest("getClasses", requestBody);
}

async function saveAndCheck(start_year, classes, id) {
  async function classes_to_json() {
    let return_json = {
      calendar: {
        quarters: []
      }
    };
    const encoding_to_nameyear = (quarter_name) => {
      const name = quarter_name.split("_")[0].toUpperCase();
      let year = start_year + parseInt(quarter_name.split("_")[1]) - 1
      if (name !== "FA") {
        year += 1;
      }
      return { quarter: name , year : year }
    }
    const expand_quarter_info = async (quarter_courses) => {
      let expanded_courses = [];
      for (const course_name of quarter_courses) {
        expanded_courses.push({ course : { name : course_name }});
      }
      return expanded_courses;
    }
    for (const [quarter_name, quarter_courses] of Object.entries(classes)) {
      let return_quarter = null;
      if (quarter_name === "sidebar" || quarter_name === "variableClasses") {
        continue;
      } else if (quarter_name === "extra_credit") {
        console.log('extra')
        return_quarter = {
          quarter: {
            year: start_year - 1,
            quarter: "FA",
            courses: await expand_quarter_info(quarter_courses)
          }
        }
      } else {
        return_quarter = {
          quarter: {
            year: encoding_to_nameyear(quarter_name).year,
            quarter: encoding_to_nameyear(quarter_name).quarter,
            courses: await expand_quarter_info(quarter_courses)
          }
        }
      }
      return_json.calendar.quarters.push(return_quarter);
    }
    return return_json;
  }
  const return_json = await classes_to_json();
  console.log(return_json)
  const requestBody = {
    "id": id,
    "calendar": return_json
  }
  const res = await fetch("http://127.0.0.1:8000/api/updateCalendar", {
    crossDomain: true,
    mode: 'cors',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  return res.json();
}

function Calendar() {
  const [hasParsed, setHasParsed] = useState(false);
  const [loadedSidebar, setloadedSidebar] = useState(false);
  const [unsatisfiedPreReqs, setunsatisfiedPreReqs] = useState("")
  const [startYear, setStartYear] = useState(2022);
  const [classInfo, setClassInfo] = useState({});
  const [classes, setClasses] = useState({
    sidebar: [],
    fa_1: [],
    wi_1: [],
    sp_1: [],
    su_1: [],
    fa_2: [],
    wi_2: [],
    sp_2: [],
    su_2: [],
    fa_3: [],
    wi_3: [],
    sp_3: [],
    su_3: [],
    fa_4: [],
    wi_4: [],
    sp_4: [],
    su_4: [],
    extra_credit: [],
    variableClasses: ["CS Elective 1", "CS Elective 2", "CS Elective 3"]
  });

  const parsed_to_block_id = [
    ["fa_1", "wi_1", "sp_1", "su_1"],
    ["fa_2", "wi_2", "sp_2", "su_2"],
    ["fa_3", "wi_3", "sp_3", "su_3"],
    ["fa_4", "wi_4", "sp_4", "su_4"]
  ];
  const location = useLocation();
  const data = location.state.data;
  const id = location.state.id;
  const calendarState = classes;

  const display_unsatisfied_prereqs = async (start_year, classes, id) => {
    const targetDiv = document.getElementById("status");
    targetDiv.style.display = "none";
    const returned_calendar = await saveAndCheck(start_year, classes, id);
    console.log(returned_calendar)
    let display_string = 'Saved successfully.\n The following courses have unmet pre-requisities: \n'
    for (let i = 0; i < returned_calendar.calendar.quarters.length; i++) {
      let quarter = returned_calendar.calendar.quarters[i]
      let courses = quarter.quarter.courses
      for (let j = 0; j < courses.length; j++) {
        if ("unsatisfied_pre_requisites" in courses[j].course) {
          display_string = display_string + courses[j].course.name + ' needs: '
          for (const unmet_req of courses[j].course.unsatisfied_pre_requisites) {
            display_string = display_string + unmet_req.name + ', ';
          }
          display_string = display_string.slice(0, -2) + '\n'
        }
      }
    }
    if (display_string === 'Saved successfully.\n The following courses have unmet pre-requisities: \n') {
      setunsatisfiedPreReqs("Saved successfully. All pre-requisites satisfied.")
    } else {
      setunsatisfiedPreReqs(display_string);
    }
    targetDiv.style.display = "block";
  }

  useEffect(() => {
    let inCalendar = [];
    const fetchData = async () => {
      const result = await getClasses(["lower-cs", "lower-math", "lower-physics", "req-cs"], ["COM SCI", "MATH", "PHYSICS"], 1, 5, null);
      let classNames = [];
      const extractedClassInfo = {};
      for (const c of result) {
        classNames.push(c[1])

        let units = c[5];
        let prereqs = c[6] == null ? "" : c[6];
        let hist = c[7] == null ? "" : c[7];

        if (!extractedClassInfo[c[1]]) {
          extractedClassInfo[c[1]] = units + "|" + prereqs + "|" + hist;
        }
      }
      let filtered_classNames = classNames.filter(course => !(inCalendar.includes(course.split(' ').join(''))));
      setClassInfo(extractedClassInfo);
      setClasses(prev => ({
        ...prev,
        sidebar: filtered_classNames
      }));
    }
    
    const parseData = async () => {
      let parsedInput = data;
      let return_json = {
        "calendar": {
          "quarters": []
        }
      }
      // TODO: get the start year from the user (add a form on the DARs page?)
      let start_year = new Date().getFullYear();

      if (parsedInput !== null) {
        start_year = parsedInput.calendar.quarters[0].quarter.year;
      }

      setStartYear(start_year);
  
      if (parsedInput !== null) {
        const quarter_name_dict = {
          "FA": "Fall",
          "WI": "Winter",
          "SP": "Spring",
          "SU": "Summer"
        };
        const quarter_id_dict = {
          "FA": 0,
          "WI": 1,
          "SP": 2,
          "SU": 3
        }

        let json_quarters = parsedInput.calendar.quarters;
        for (let i = 0; i < json_quarters.length; i++) {
          const q = json_quarters[i];
          const year = q.quarter.year;
          const quarter_name = quarter_name_dict[q.quarter.quarter];
          const quarter_id = quarter_id_dict[q.quarter.quarter];
          let courses = [];
          for (let j = 0; j < q.quarter.courses.length; j++) {
            courses[j] = q.quarter.courses[j].course.name;
          }
          const quarter = {
            'name': quarter_name,
            'year': year,
            'courses': courses
          }
          let row_num = year - start_year - 1;
          if (quarter_name === "Fall") {
            row_num += 1;
          }
          for (const course of quarter.courses) {
            inCalendar.push(course.split(' ').join(''));
            if (row_num >= 0) {
              if (classes[parsed_to_block_id[row_num][quarter_id]].indexOf(course) === -1) {
                setClasses(prev => ({
                  ...prev,
                  [[parsed_to_block_id[row_num][quarter_id]]]: [
                    ...prev[parsed_to_block_id[row_num][quarter_id]],
                    course
                  ],
                }));
              }
            } else {
              if (classes['extra_credit'].indexOf(course) === -1) {
                setClasses(prev => ({
                  ...prev,
                  [["extra_credit"]]: [
                    ...prev['extra_credit'],
                    course
                  ],
                }));
              }
            }
          }
        }
      } else {
        let dc_json = require('./default_calendar.json');
        let year_offset = [
          0, 1, 1, 1,
          1, 2, 2, 2,
          2, 3, 3, 3,
          3, 4, 4, 4
        ]
        for (let i = 0; i < dc_json.calendar.quarters.length; i++) {
          dc_json.calendar.quarters[i].quarter.year = start_year + year_offset[i]
        }
        const requestBody = {
          "id": id,
          "calendar": dc_json
        }
        fetch("http://127.0.0.1:8000/api/updateCalendar", {
          crossDomain: true,
          mode: 'cors',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }).then(res => console.log(res))
          .catch(err => console.log(err));
      }
    }

    const load_and_parse = async () => {
      if (!loadedSidebar) {
        setloadedSidebar(true);
        if (!hasParsed) {
          setHasParsed(true);
          parseData().then(() => {
            // console.log(inCalendar)
            fetchData();
          })
        } else {
          return
        }
      } else {
        return;
      }
    }
    load_and_parse();
  });

  const [activeId, setActiveId] = useState(null);
  return (
    <div className="BruinPlanner">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        collisionDetection={closestCorners}
      >
        <CalendarList classMappings={classes} startYear={startYear} classInfo={classInfo} />
        <div className="Sidebar">
          <div className='display-linebreak'>
            <button id='save-button' className="save-button" onClick={() => display_unsatisfied_prereqs(startYear, classes, id)}>Click to Save and Check Calendar</button>
            <p id='status'>{unsatisfiedPreReqs}</p>
          </div>
          <div className="ClassList">
            <Container id="sidebar" items={classes.sidebar} classInfo={classInfo} />
            <Container id="variable" items={classes.variableClasses} kind="dropdown" classInfo={classInfo} />
          </div>
        </div>
        <DragOverlay>
          {activeId ? (
            <SidebarButton className="sidebar-button" text={activeId} classInfo={classInfo[activeId]} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );

  function findContainer(id) {
    if (id in classes) {
      return id;
    }

    return Object.keys(classes).find((key) => classes[key].includes(id));
  }

  function handleDragStart({ active }) {
    setActiveId(active ? active.id : null);
    console.log(activeId);
  }

  function handleDragEnd({ active, over }) {
    if (!active || !over) {
      return;
    }
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = classes[activeContainer].indexOf(active.id);
    const overIndex = classes[overContainer].indexOf(overId);

    if (activeIndex !== overIndex) {
      setClasses((classes) => ({
        ...classes,
        [overContainer]: arrayMove(classes[overContainer], activeIndex, overIndex)
      }));
    }

    setActiveId(null);
  }

  function handleDragOver({ active, over }) {
    if (!active || !over) {
      return;
    }

    const { id } = active;
    const { id: overId } = over;

    console.log("id " + id);
    console.log("overId " + overId);

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    console.log("activeContainer " + activeContainer);
    console.log("overContainer " + overContainer);
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setClasses((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;
        const modifier = isBelowLastItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      console.log("inside set classes");
      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id)
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          classes[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length)
        ]
      };
    });
    console.log(classes);
  }
}

export default Calendar;
