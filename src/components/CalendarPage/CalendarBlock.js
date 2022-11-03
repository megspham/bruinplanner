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
        <DndContext onDragEnd={handleDragEnd}>
          {!isDropped ? draggable : null}
          <Droppable id="dropppedcourse1">
            {isDropped === "dropppedcourse1" ? draggable : 'DROP HERE'}
          </Droppable>
          <Droppable id="dropppedcourse2">
            {isDropped === "dropppedcourse2" ? draggable : 'DROP HERE'}
          </Droppable>
          <Droppable id="dropppedcourse3">
            {isDropped === "dropppedcourse3" ? draggable : 'DROP HERE'}
          </Droppable>
          <Droppable id="dropppedcourse4">
            {isDropped === "dropppedcourse4"? draggable : 'DROP HERE'}
          </Droppable>
        </DndContext>
       </div>
     </div>
  );

  function handleDragEnd({over}) {
    setIsDropped(over ? over.id : null);
  }
}

export default CalendarBlock;
