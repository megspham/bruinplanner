import React, { useState } from 'react';
import './Calendar.css';
import CalendarList from './CalendarList';
import {DndContext, DragOverlay, closestCorners} from '@dnd-kit/core';
import {SidebarButton} from "../SidebarButton"
import Container from "./Container";
import {
  arrayMove
} from '@dnd-kit/sortable';

export default function Calendar() {
  const [classes, setClasses] = useState({
    sidebar: ["CS 1", "CS 31", "CS 32", "CS 33", "CS 35L", "CS M51A",
              "CS 111", "CS 118", "CS 130", "CS 131", "CS M151B",
              "CS M152A", "CS 180", "CS 181",
              "MATH 31A", "MATH 31B", "MATH 32A", "MATH 32B",
              "MATH 33A", "MATH 33B", "MATH 61",
              "PHYSICS 1A", "PHYSICS 1B", "PHYSICS 1C"],
    fa_1: ['GE'],
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
                <Container id="sidebar" items={classes.sidebar}/>
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
