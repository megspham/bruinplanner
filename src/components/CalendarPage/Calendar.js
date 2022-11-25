import React, { componentDidMount, useEffect, useState } from 'react';
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
    su_4: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await getClasses(["req-cs", "lower-cs", "lower-math", "lower-physics"], ["COM SCI", "MATH", "PHYSICS"], 2, 4, null);
      const classNames = [];
      for (const c of result) {
        classNames.push(c[1])
      }
      
      setClasses({
        sidebar: classNames,
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
      })
    }

    fetchData()
  }, []);

  const [activeId, setActiveId] = useState(null);
  return (
      <div className="BruinPlanner">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          collisionDetection={closestCorners}
        >
          <CalendarList classMappings={classes}/>        
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
  }
}

export default Calendar;
