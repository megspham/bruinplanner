/**
 * @file Defines the individual calendar block used for a single quarter
 * @author Andy Goh, Megan Pham
 */

import React, {useState} from "react";
import "./CalendarBlock.css";
import {DndContext} from '@dnd-kit/core';
import Draggable from '../Draggable';
import {Droppable} from '../Droppable';
import {SidebarButton} from "../SidebarButton"
/**
 * @param {string} color Defines the color of the block
 * @param {string} calendarDate The name of the quarter (e.g., Fall 2022) 
 * @returns CalendarBlock HTML div object
 */
function CalendarBlock({ color, calendarDate, blockId, blockState }) {
  const [isDropped, setIsDropped] = useState(null); 
  const draggable = (index) => (
    <Draggable key={index} id={index}>
      <SidebarButton text={"CS "+(index)} />                    
    </Draggable>
  );

  return (
    <div className="BackgroundBlock" style={{backgroundColor: color}}>
      <div className="CalendarTitle">{calendarDate}</div>
      <div className="DisplayBlock">
        <Droppable id={blockId+" 1"}>
          {blockState[0] ? draggable(blockState[0]) : 'DROP HERE'}
        </Droppable>
        <Droppable id={blockId+" 2"}>
          {blockState[1] ? draggable(blockState[1]) : 'DROP HERE'}
        </Droppable>
        <Droppable id={blockId+" 3"}>
          {blockState[2] ? draggable(blockState[2]) : 'DROP HERE'}
        </Droppable>
        <Droppable id={blockId+" 4"}>
          {blockState[3] ? draggable(blockState[3]) : 'DROP HERE'}
        </Droppable>
       </div>
     </div>
  );

  function handleDragEnd({over}) {
    setIsDropped(over ? over.id : null);
  }
}

export default CalendarBlock;
