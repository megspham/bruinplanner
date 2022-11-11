/**
 * @file Defines the individual calendar block used for a single quarter
 * @author Andy Goh, Megan Pham
 */

import React, {useState} from "react";
import "./CalendarBlock.css";
import {DndContext} from '@dnd-kit/core';
import Draggable from '../Draggable';
import {Droppable} from '../Droppable';

/**
 * @param {string} color Defines the color of the block
 * @param {string} calendarDate The name of the quarter (e.g., Fall 2022) 
 * @returns CalendarBlock HTML div object
 */
function CalendarBlock({ color, calendarDate }) {
  const [isDropped, setIsDropped] = useState(null); 
  const draggable = (
    <Draggable id ="draggable"> 
    DRAG ME
    </Draggable>
  );

  return (
    <div className="BackgroundBlock" style={{backgroundColor: color}}>
      <div className="CalendarTitle">{calendarDate}</div>
      <div className="DisplayBlock">
        <Droppable id={calendarDate+" Slot 1"}>
          {isDropped === calendarDate+" Slot 1" ? draggable : 'DROP HERE'}
        </Droppable>
        <Droppable id={calendarDate+" Slot 2"}>
          {isDropped === calendarDate+" Slot 2" ? draggable : 'DROP HERE'}
        </Droppable>
        <Droppable id={calendarDate+" Slot 3"}>
          {isDropped === calendarDate+" Slot 3" ? draggable : 'DROP HERE'}
        </Droppable>
        <Droppable id={calendarDate+" Slot 4"}>
          {isDropped === calendarDate+" Slot 4" ? draggable : 'DROP HERE'}
        </Droppable>
       </div>
     </div>
  );

  function handleDragEnd({over}) {
    setIsDropped(over ? over.id : null);
  }
}

export default CalendarBlock;
