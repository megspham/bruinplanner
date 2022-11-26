import React, { useEffect, useState } from 'react';
import './Calendar.css';
import Sidebar from "./Sidebar";
import CalendarList from './CalendarList';
import {DndContext, DragOverlay, closestCorners} from '@dnd-kit/core';
import Draggable from '../Draggable';
import {SidebarButton} from "../SidebarButton"
import Container from "./Container";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useLocation } from "react-router-dom";

export default function Calendar() {
  const [hasParsed, setHasParsed] = useState(false);
  const [startYear, setStartYear] = useState(2022);
  // const wrapperSetHasParsed = useCallback(val => {
  //   setHasParsed(val);
  // }, [setHasParsed]);
  const [classes, setClasses] = useState({
    sidebar: ["CS 1", "CS 31", "CS 32", "CS 33", "CS 35L", "CS M51A",
              "CS 111", "CS 118", "CS 130", "CS 131", "CS M151B",
              "CS M152A", "CS 180", "CS 181",
              "MATH 31A", "MATH 31B", "MATH 32A", "MATH 32B",
              "MATH 33A", "MATH 33B", "MATH 61",
              "PHYSICS 1A", "PHYSICS 1B", "PHYSICS 1C"],
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
    su_4: []
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
      console.log(data, return_json);
      console.log(default_calendar);
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
            </div>
          </div>
          <DragOverlay>
            {activeId ? (
              <SidebarButton text={activeId} /> 
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
