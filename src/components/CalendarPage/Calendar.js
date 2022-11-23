import React, { useState } from 'react';
import './Calendar.css';
import Sidebar from "./Sidebar";
import CalendarList from './CalendarList';
import {DndContext, DragOverlay} from '@dnd-kit/core';
import Draggable from '../Draggable';
import {SidebarButton} from "../SidebarButton"

export default function Calendar() {
  const [classMappings, setClassMappings] = useState({
    'fa22': ['', '', '', ''],
    'wi23': ['', '', '', ''],
    'sp23': ['', '', '', ''],
    'su23': ['', '', '', ''],
    'fa23': ['', '', '', ''],
    'wi24': ['', '', '', ''],
    'sp24': ['', '', '', ''],
    'su24': ['', '', '', ''],
    'fa24': ['', '', '', ''],
    'wi25': ['', '', '', ''],
    'sp25': ['', '', '', ''],
    'su25': ['', '', '', ''],
    'fa25': ['', '', '', ''],
    'wi26': ['', '', '', ''],
    'sp26': ['', '', '', ''],
    'su26': ['', '', '', '']
  });
  const [activeId, setActiveId] = useState(null);
  return (
      <div className="BruinPlanner">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
          <CalendarList classMappings={classMappings}/>        
          <div className="Sidebar">
            <div className="ClassList">
                {Array(50)
                .fill(null)
                .map((_, index) => (
                <Draggable key={index+1} id={index+1}>
                    <SidebarButton text={"CS "+(index+1)} />                    
                </Draggable>
                ))}
            </div>
          </div>
          <DragOverlay>
            {activeId ? (
              <SidebarButton text={`CS ${activeId}`} /> 
            ): null}
          </DragOverlay>
        </DndContext>
      </div>
  );

  function handleDragStart({active}) {
    setActiveId(active ? active.id : null);
    console.log(activeId);
  }

  function handleDragEnd({over}) {
    const overId = (over ? over.id.split(" ") : null);
    console.log(over);
    console.log(overId);
    if (!overId) {
      return;
    }
    const [qtr, slot] = overId;
    if (!qtr || !slot) {
      return;
    }
    console.log(qtr);
    console.log(parseInt(slot)-1);
    console.log(activeId);
    const newArr = classMappings[qtr];
    newArr[parseInt(slot)-1] = activeId;
    console.log(newArr);
    //let newClassMappings = classMappings;
    //newClassMappings[qtr] = newArr;
    //console.log(newClassMappings);
    setActiveId(null);
    setClassMappings(prevMapping =>
      ({
        ...prevMapping,
        qtr: newArr
      }));
    console.log(classMappings);
  }

  function handleDragOver({over}) {
    console.log(over);
  }
}
