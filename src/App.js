import React, { Component, useState} from 'react';
import './App.css';
import Sidebar from "./components/CalendarPage/Sidebar.js";
import CalendarList from './components/CalendarPage/CalendarList.js';
import {DndContext} from '@dnd-kit/core';

export default function App() {
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
