import React, {useState} from "react";
import "./Sidebar.css";
import {DndContext} from '@dnd-kit/core';
import Draggable from '../Draggable';
import {Droppable} from '../Droppable';
import {CustomizedButton} from "../CustomizedButton"

function Sidebar() {
  const [isDropped, setIsDropped] = useState(null); 
//   const draggable = (
//     <Draggable id ="draggable"> 
//     DRAG ME
//     </Draggable>
//   );

  return (
    <div className="Sidebar">
      <div className="BackgroundBlock">
          {/*!isDropped ? draggable : null*/}
            <div className="ClassList">
                {Array(20)
                .fill(null)
                .map((_, index) => (
                <Draggable key={index+1} id={index+1}>
                    <CustomizedButton text={"CS "+(index+1)} />                    
                </Draggable>
                ))}
            </div>
       </div>
     </div>
  );


}

// emit change?

export default Sidebar;