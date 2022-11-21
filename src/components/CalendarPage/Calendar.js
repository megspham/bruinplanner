import React, { useState } from 'react';
import './Calendar.css';
import Sidebar from "./Sidebar";
import CalendarList from './CalendarList';
import {DndContext} from '@dnd-kit/core';

export default function Calendar() {
  const [isDropped, setIsDropped] = useState(null);
  const [classMappings, setClassMappings] = useState([]);
  return (
      <div className="BruinPlanner">
        <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
          <CalendarList/>        
          <Sidebar />
        </DndContext>
      </div>
  );

  function handleDragEnd({over}) {
    setIsDropped(over ? over.id : null);
    setClassMappings()
    console.log(over);
  }

  function handleDragOver({over}) {
    console.log(over);
  }
}
