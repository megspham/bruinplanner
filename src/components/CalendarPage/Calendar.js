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
    variableClasses: ["CS Elective 1","CS Elective 2","CS Elective 3"]
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
  const start_year = location.state.startYear;
  
  useEffect(() => {
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
    
    let default_calendar = [];
    let default_courses = [];
    let user_taken_courses = [];
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
          courses[j] = q.quarter.courses[j].course.name;
          user_taken_courses.push(courses[j])
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

    // Fill sidebar with rest of classes not in parsedInput
    const fetchData = async () => {
      const result = await getClasses(["req-cs", "lower-cs", "lower-math", "lower-physics"], ["COM SCI", "MATH", "PHYSICS"], 1, 5, null);
      const classNames = [];
      const extractedClassInfo = {};
      for (const c of result) {
        if (user_taken_courses.includes(c[1].replace(/\s/g, ''))) {
          continue;
        }

        classNames.push(c[1]);

        let units = c[5]; 
        let prereqs = c[6] == null ? "" : c[6];
        let hist = c[7] == null ? "" : c[7];

        if (!extractedClassInfo[c[1]]) {
          extractedClassInfo[c[1]] = units + "|" + prereqs + "|" + hist;
        }
      }

      setClassInfo(extractedClassInfo);
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
          <CalendarList classMappings={classes} startYear={start_year} classInfo={classInfo}/>        
          <div className="Sidebar">
            <div className="ClassList">
                <Container id="sidebar" items={classes.sidebar} classInfo={classInfo}/>
                <Container id="variable" items={classes.variableClasses} kind="dropdown" classInfo={classInfo}/>
            </div>
          </div>
          <DragOverlay>
            {activeId ? (
              <SidebarButton className= "sidebar-button" text={activeId} classInfo={classInfo[activeId]}/> 
            ): null}
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
