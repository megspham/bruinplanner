import React from "react";
import "./CalendarBlock.css";

function CalendarBlock({ color, calendarDate }) {
  return (
    <div className="BackgroundBlock" style={{backgroundColor: color}}>
      <div className="CalendarTitle">{calendarDate}</div>
      <div className="DisplayBlock">
        <form>
          {/* temporary for now  */}
          <input type="text" name="class1" />
          <input type="text" name="class2" />
          <input type="text" name="class3" />
          <input type="text" name="class4" />
        </form>
      </div>
    </div>
  );
}

export default CalendarBlock;
