import React, { useEffect, useState } from 'react';
import './Calendar.css';
import CalendarList from './CalendarList';
import {DndContext, DragOverlay, closestCorners} from '@dnd-kit/core';
import {SidebarButton} from "../SidebarButton"
import Container from "./Container";
import { arrayMove } from '@dnd-kit/sortable';
import { useLocation } from "react-router-dom";
import { VariableClasses } from "../SidebarGroups/VariableClasses"

async function sendRequest(apiName, requestBody){
  const response = await fetch("http://127.0.0.1:8000/api/" + apiName, {
		crossDomain:true,
		mode: 'cors',
		method: 'POST',
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify(requestBody)
	});
	const responseJson = await response.json();
	return responseJson["classes"];
}

async function getClasses(type_list=null, department_list=null, min_units=null, max_units=null, classes_taken=null){
  const requestBody = {
    "type_list": type_list,
    "department_list": department_list,
    "min_units": min_units,
    "max_units": max_units,
    "classes_taken": classes_taken
  }
  return sendRequest("getClasses", requestBody);
}

function Calendar() {
  const [hasParsed, setHasParsed] = useState(false);
  const [loadedSidebar, setloadedSidebar] = useState(false);
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
    variableClasses: [
      {
        trueId: "CS Elective 1",
        options: [],
        selected: "Choose a class...",
        type: "elective",
        status: "available"
      },
      {
        trueId: "CS Elective 2",
        options: [],
        selected: "Choose a class...",
        type: "elective",
        status: "available"
      },
      {
        trueId: "CS Elective 3",
        options: ["COMSCI143", "COMSCI161", "COMSCI174A"],
        selected: "COMSCI143",
        type: "elective",
        status: "available"
      }
    ]
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
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await getClasses(["req-cs", "lower-cs", "lower-math", "lower-physics"], ["COM SCI", "MATH", "PHYSICS"], 2, 4, null);
      const classNames = [];
      // Fetch classes and load into sidebar
      for (const c of result) {
        classNames.push(
          {
            trueId: c[1],
            options: [c[1]],
            selected: c[1],
            type: c[0],
            status: "available"
          }
        );
      }

      setClassInfo(result);
      console.log('setting')
      setClasses(prev => ({
        ...prev,
        sidebar : classNames
      }));
    }

    if (!loadedSidebar) {
      fetchData();
      setloadedSidebar(true);
    } else {
      return
    }

    if (!hasParsed) {
      setHasParsed(true);
    } else {
      return;
    }
    console.log("parsing", calendarState)
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
    let default_calendar = [];
    let default_courses = [];
    for (let row_idx = 0; row_idx < 4; row_idx++) {
      let fall = {
        'name': "Fall",
        'year': start_year + row_idx,
        'courses': default_courses
      }
      let winter = {
        'name': "Winter",
        'year': start_year + 1 + row_idx,
        'courses': default_courses
      }
      let spring = {
        'name': "Spring",
        'year': start_year + 1 + row_idx,
        'courses': default_courses
      }
      let summer = {
        'name': "Summer",
        'year': start_year + 1 + row_idx,
        'courses': default_courses
      }

      let default_year = [fall, winter, spring, summer];
      default_calendar.push(default_year);
    }

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
          // Populate course data from DARS
          courses[j] = {
            trueId: q.quarter.courses[j].course.name,
            options: [q.quarter.courses[j].course.name],
            selected: q.quarter.courses[j].course.name,
            type: q.quarter.courses[j].course.type,
            status: "taken"
          }
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
        if (row_num < 0) {
          continue;
        }
        for (const course of quarter.courses) {
          if (classes[parsed_to_block_id[row_num][quarter_id]].indexOf(course) === -1) {
            setClasses(prev => ({
              ...prev,
              [[parsed_to_block_id[row_num][quarter_id]]]: [
                ...prev[parsed_to_block_id[row_num][quarter_id]],
                course
              ]
            }));
          }
        }
        for (const course of classes[parsed_to_block_id[row_num][quarter_id]]) {
          if (quarter.courses.indexOf(course) === -1) {
            quarter.courses.push(course);
          }
        }
        default_calendar[row_num][quarter_id] = quarter;
        return_json.calendar.quarters.push(quarter);
      }
      console.log("parsed", classes);
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
          <CalendarList classMappings={classes} startYear={startYear}/>        
          <div className="Sidebar">
            <div className="ClassList">
                <Container id="sidebar" items={classes.sidebar}/>
                <Container id="variable" items={classes.variableClasses} kind="dropdown" onUpdate={updateDropdown}/>
                <VariableClasses/>
            </div>
          </div>
          <DragOverlay>
            {activeId ? (
              <SidebarButton className= "sidebar-button" text={activeId} /> 
            ): null}
          </DragOverlay>
        </DndContext>
      </div>
  );
  
  function updateDropdown(id, val) {
    console.log("updateDropdown");
    setClasses((classes) => {
      let updated = classes["variableClasses"].map(item => {
        if (item.trueId === id) {
          return {...item, selected: val}
        }
        return item;
      })
      return {
      ...classes,
      ["variableClasses"]: updated
      };
    });
  }

  function findContainer(id) {
    if (id in classes) {
      return id;
    }

    // return Object.keys(classes).find((key) => classes[key].includes(id)); - changed to work w new format
    return Object.keys(classes).find((key) => classes[key].find(e => (e ? e.trueId == id : false)));
  }

  function handleDragStart({active}) {
    setActiveId(active ? active.id : null);
    console.log(activeId);
  }

  function handleDragEnd({active, over}) {
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

  function handleDragOver({active, over}) {
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
      // changed to work with the new object format
      const activeItems = prev[activeContainer].flatMap(e => (e ? e.trueId : e));
      const overItems = prev[overContainer].flatMap(e => (e ? e.trueId : e));
      
      // Find the indexes for the items
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        // We're on top of an element inside the container
        const isBelowLastItem = over && overIndex === overItems.length - 1;
        const modifier = isBelowLastItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item.trueId !== active.id)
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
