import React, { useState } from 'react';
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

import {SortableItem} from '../SortableItem';

export default function Calendar() {
  // const [classMappings, setClassMappings] = useState({
  //   'fa22': ['', '', '', ''],
  //   'wi23': ['', '', '', ''],
  //   'sp23': ['', '', '', ''],
  //   'su23': ['', '', '', ''],
  //   'fa23': ['', '', '', ''],
  //   'wi24': ['', '', '', ''],
  //   'sp24': ['', '', '', ''],
  //   'su24': ['', '', '', ''],
  //   'fa24': ['', '', '', ''],
  //   'wi25': ['', '', '', ''],
  //   'sp25': ['', '', '', ''],
  //   'su25': ['', '', '', ''],
  //   'fa25': ['', '', '', ''],
  //   'wi26': ['', '', '', ''],
  //   'sp26': ['', '', '', ''],
  //   'su26': ['', '', '', '']
  // });
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
                {/*Array(50)
                .fill(null)
                .map((_, index) => (
                <Draggable key={index+1} id={index+1}>
                    <SidebarButton text={"CS "+(index+1)} />                    
                </Draggable>
                ))*/}
                {/* <SortableContext 
                  items={classes.sidebar}
                  strategy={verticalListSortingStrategy}
                >
                  {classes.sidebar.map(id => <SortableItem key={id} id={id}>
                    <SidebarButton text={id} />  
                  </SortableItem>)}
                </SortableContext> */}
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
    // const overId = (over ? over.id.split(" ") : null);
    // console.log(over);
    // console.log(overId);
    // if (!overId) {
    //   return;
    // }
    // const [qtr, slot] = overId;
    // if (!qtr || !slot) {
    //   return;
    // }
    // console.log(qtr);
    // console.log(parseInt(slot)-1);
    // console.log(activeId);
    // const newArr = classMappings[qtr];
    // newArr[parseInt(slot)-1] = activeId;
    // console.log(newArr);
    // //let newClassMappings = classMappings;
    // //newClassMappings[qtr] = newArr;
    // //console.log(newClassMappings);
    // setActiveId(null);
    // setClassMappings(prevMapping =>
    //   ({
    //     ...prevMapping,
    //     qtr: newArr
    //   }));
    // console.log(classMappings);
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

  function handleDragOver({active, over, draggingRect}) {
    if (!active || !over) {
      return;
    }
    
    const { id } = active;
    const { id: overId } = over;

    console.log(id);
    console.log(overId);

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
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

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
