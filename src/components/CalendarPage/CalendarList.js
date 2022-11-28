/**
 * @file Aggregates multiple CalendarBlocks to form the full calendar.
 * @author Megan Pham, Andy Goh
 */
import React from "react";
import CalendarBlock from "./CalendarBlock";
import { useLocation } from "react-router-dom";
import Login from "../Login";

function CalendarList({ classMappings, startYear, classInfo }) {
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  const calendarState = classMappings;

  const get_row = (row_idx) => {
    const color_dict = {
      0: "#005587",
      1: "#8BB8E8",
      2: "#FFE9AD",
      3: "#005587"
    };
    let year_offset = [
      0, 1, 1, 1,
      1, 2, 2, 2,
      2, 3, 3, 3,
      3, 4, 4, 4
    ];
    let quarters = ["Fall", "Winter", "Spring", "Summer"];
    let block_ids = Object.keys(calendarState).slice(1 + 4 * row_idx, 5 + 4 * row_idx);
    let rows = []
    for (let i = 0; i < 4; i++) {
      rows.push(<CalendarBlock color={color_dict[row_idx]}
        blockId={block_ids[i]}
        blockState={calendarState[block_ids[i]]}
        calendarDate={quarters[i] + " " + (startYear + year_offset[4 * row_idx + i])}
        classInfo={classInfo}>
      </CalendarBlock>);
    }
    return <div className="CalendarRow">{rows}</div>;
  }

  return (
    <div>
      {id ?
        <div>
          {get_row(0)}
          {get_row(1)}
          {get_row(2)}
          {get_row(3)}
        </div>
        :
        <div>
          <h1 class="welcome-message">
            Please sign in again
          </h1>
          <div class="dars-button-container">
            <Login destination="/dars/upload"></Login>
          </div>
        </div>
      }
    </div>
  );
}

export default CalendarList; 
