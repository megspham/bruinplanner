/**
 * @file Defines the individual calendar block used for a single quarter
 * @author Andy Goh, Megan Pham
 */

import React from "react";
import "./CalendarBlock.css";
import Container from "./Container";
/**
 * @param {string} color Defines the color of the block
 * @param {string} calendarDate The name of the quarter (e.g., Fall 2022) 
 * @returns CalendarBlock HTML div object
 */

function CalendarBlock({ color, calendarDate, blockId, courses, blockState, classInfo }) {

  return (
    <div className="BackgroundBlock" style={{backgroundColor: color}}>
      <div className="CalendarTitle">{calendarDate}</div>
      <div className="DisplayBlock">
        <Container id={blockId} items={blockState} classInfo={classInfo}/>
       </div>
     </div>
  );
}

export default CalendarBlock;
