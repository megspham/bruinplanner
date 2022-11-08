import React, {useState} from "react";
import "./CalendarBlock.css";
import {DndContext} from '@dnd-kit/core';
import Draggable from '../Draggable';
import {Droppable} from '../Droppable';
import { CustomizedButton } from "../CustomizedButton";

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
          {/*!isDropped ? draggable : null*/}
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
