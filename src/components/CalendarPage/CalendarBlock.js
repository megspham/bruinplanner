/**
 * @file Defines the individual calendar block used for a single quarter
 * @author Andy Goh, Megan Pham
 */

import React, {useState} from "react";
import "./CalendarBlock.css";
import Draggable from '../Draggable';
import {Droppable} from '../Droppable';
import {SidebarButton} from "../SidebarButton";
import Container from "./Container";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {SortableItem} from '../SortableItem';
/**
 * @param {string} color Defines the color of the block
 * @param {string} calendarDate The name of the quarter (e.g., Fall 2022) 
 * @returns CalendarBlock HTML div object
 */

function CalendarBlock({ color, calendarDate, blockId, courses, blockState }) {
  const [isDropped, setIsDropped] = useState(null); 
  const draggable = (index) => (
    <Draggable key={index} id={index}>
      <SidebarButton text={index} />                    
    </Draggable>
  );

  const empty_draggable = (
    <SidebarButton text={"Drop Here"} />
  );
  
  return (
    <div className="BackgroundBlock" style={{backgroundColor: color}}>
      <div className="CalendarTitle">{calendarDate}</div>
      <div className="DisplayBlock">
        {/*<Droppable id={blockId+" 1"}>
          {courses[0] ? draggable(courses[0]) : empty_draggable}
        </Droppable>
        <Droppable id={blockId+" 2"}>
          {courses[1] ? draggable(courses[1]) : empty_draggable}
        </Droppable>
        <Droppable id={blockId+" 3"}>
          {courses[2] ? draggable(courses[2]) : empty_draggable}
        </Droppable>
        <Droppable id={blockId+" 4"}>
          {courses[3] ? draggable(courses[3]) : empty_draggable}
        </Droppable>*/}
        <Container id={blockId} items={blockState}/>
       </div>
     </div>
  );
}

export default CalendarBlock;
