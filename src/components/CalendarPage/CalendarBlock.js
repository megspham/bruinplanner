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
function CalendarBlock({ color, calendarDate, jsonInput }) {
  const [isDropped, setIsDropped] = useState(null); 
  const draggable = (
    <Draggable id ="draggable"> 
    DRAG ME
    </Draggable>
  );

  let example = {
    "calendar": {
      "quarters": [{
          "quarter": {
            "year": 2020,
            "quarter_name": "WI",
            "courses": [{
              "course": {
                "course_name": "CS 32",
                "course_department": "CS",
                "course_description": "Data Structures and Algorithms",
                "course_units": 4.0,
                "course_requirement": "CS",
                "course_pre_requisites": [
                                  {
                      "pre_requisite_name": "CS 31"
                    }
                              ]
              }
            }]
          }
        },
        {
          "quarter2": {
            "year": 2020,
            "quarter_name": "SP",
            "courses": [{
              "course": {
                "course_name": "CS 33",
                "course_department": "CS",
                "course_description": "Intro to Computer Architecture",
                "course_units": 4.0,
                "course_requirement": "CS",
                "course_pre_requisites": [
                                  {
                      "pre_requisite_name": "CS 31"
                    }
                              ]
              }
            }]
          }
        }
      ]
    }
  };

  let stringInput = JSON.stringify(example);
  let parsedInput = JSON.parse(stringInput);   
  
  return (
    <div className="BackgroundBlock" style={{backgroundColor: color}}>
      <div className="CalendarTitle">{calendarDate}</div>
      <div className="DisplayBlock">
        <Droppable id={calendarDate+" Slot 1"}>
          {isDropped === calendarDate+" Slot 1" ? draggable : parsedInput.calendar.quarters[0].quarter.courses[0].course.course_name}
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
