/**
 * @file Aggregates multiple CalendarBlocks to form the full calendar.
 * @author Megan Pham
 */
import React, { Component } from "react";
import CalendarBlock from "./CalendarBlock";

class CalendarList extends Component {
  currYear = new Date().getFullYear();
  render() {
    return (
      <div>
        <div className="CalendarRow">
          <CalendarBlock color="#005587"
            calendarDate={"Fall " + new Date(new Date().setFullYear(this.currYear)).getFullYear()
            }>
          </CalendarBlock>
          <CalendarBlock color="#005587"
            calendarDate={"Winter " + new Date(new Date().setFullYear(this.currYear + 1)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#005587"
            calendarDate={"Spring " + new Date(new Date().setFullYear(this.currYear + 1)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#005587"
            calendarDate={"Summer " + new Date(new Date().setFullYear(this.currYear + 1)).getFullYear()}
          ></CalendarBlock>
        </div>

        <div className="CalendarRow">
          <CalendarBlock color="#8BB8E8"
            calendarDate={"Fall " + new Date(new Date().setFullYear(this.currYear + 1)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#8BB8E8"
            calendarDate={"Winter " + new Date(new Date().setFullYear(this.currYear + 2)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#8BB8E8"
            calendarDate={"Spring " + new Date(new Date().setFullYear(this.currYear + 2)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#8BB8E8"
            calendarDate={"Summer " + new Date(new Date().setFullYear(this.currYear + 2)).getFullYear()}
          ></CalendarBlock>
        </div>

        <div className="CalendarRow">
          <CalendarBlock color="#FFE9AD"
            calendarDate={"Fall " + new Date(new Date().setFullYear(this.currYear + 2)).getFullYear()}></CalendarBlock>
          <CalendarBlock color="#FFE9AD"
            calendarDate={"Winter " + new Date(new Date().setFullYear(this.currYear + 3)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#FFE9AD"
            calendarDate={"Spring " + new Date(new Date().setFullYear(this.currYear + 3)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#FFE9AD"
            calendarDate={"Summer " + new Date(new Date().setFullYear(this.currYear + 3)).getFullYear()}
          ></CalendarBlock>
        </div>

        <div className="CalendarRow">
          <CalendarBlock color="#005587"
            calendarDate={"Fall " + new Date(new Date().setFullYear(this.currYear + 3)).getFullYear()}></CalendarBlock>
          <CalendarBlock color="#005587"
            calendarDate={"Winter " + new Date(new Date().setFullYear(this.currYear + 4)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#005587"
            calendarDate={"Spring " + new Date(new Date().setFullYear(this.currYear + 4)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#005587"
            calendarDate={"Summer " + new Date(new Date().setFullYear(this.currYear + 4)).getFullYear()}
          ></CalendarBlock>
        </div>
      </div>
    );
  }
}

export default CalendarList; 
