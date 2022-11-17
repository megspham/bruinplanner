/**
 * @file Aggregates multiple CalendarBlocks to form the full calendar.
 * @author Megan Pham
 */
import React, { Component } from "react";
import CalendarBlock from "./CalendarBlock";

class CalendarList extends Component {
  currYear = new Date().getFullYear();
  calendarState = this.props.classMappings;
  render() {
    return (
      <div className="CalendarList">
        <div className="CalendarRow">
          <CalendarBlock color="#005587" blockId="fa22" blockState={this.calendarState["fa22"]}
            calendarDate={"Fall " + new Date(new Date().setFullYear(this.currYear)).getFullYear()
            }>
          </CalendarBlock>
          <CalendarBlock color="#005587" blockId="wi23" blockState={this.calendarState["wi23"]}
            calendarDate={"Winter " + new Date(new Date().setFullYear(this.currYear + 1)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#005587" blockId="sp23" blockState={this.calendarState["sp23"]}
            calendarDate={"Spring " + new Date(new Date().setFullYear(this.currYear + 1)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#005587" blockId="su23" blockState={this.calendarState["su23"]}
            calendarDate={"Summer " + new Date(new Date().setFullYear(this.currYear + 1)).getFullYear()}
          ></CalendarBlock>
        </div>

        <div className="CalendarRow">
          <CalendarBlock color="#8BB8E8" blockId="fa23" blockState={this.calendarState["fa23"]}
            calendarDate={"Fall " + new Date(new Date().setFullYear(this.currYear + 1)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#8BB8E8" blockId="wi24" blockState={this.calendarState["wi24"]}
            calendarDate={"Winter " + new Date(new Date().setFullYear(this.currYear + 2)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#8BB8E8" blockId="sp24" blockState={this.calendarState["sp24"]}
            calendarDate={"Spring " + new Date(new Date().setFullYear(this.currYear + 2)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#8BB8E8" blockId="su24" blockState={this.calendarState["su24"]}
            calendarDate={"Summer " + new Date(new Date().setFullYear(this.currYear + 2)).getFullYear()}
          ></CalendarBlock>
        </div>

        <div className="CalendarRow">
          <CalendarBlock color="#FFE9AD" blockId="fa24" blockState={this.calendarState["fa24"]}
            calendarDate={"Fall " + new Date(new Date().setFullYear(this.currYear + 2)).getFullYear()}></CalendarBlock>
          <CalendarBlock color="#FFE9AD" blockId="wi25" blockState={this.calendarState["wi25"]}
            calendarDate={"Winter " + new Date(new Date().setFullYear(this.currYear + 3)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#FFE9AD" blockId="sp25" blockState={this.calendarState["sp25"]}
            calendarDate={"Spring " + new Date(new Date().setFullYear(this.currYear + 3)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#FFE9AD" blockId="su25" blockState={this.calendarState["su25"]}
            calendarDate={"Summer " + new Date(new Date().setFullYear(this.currYear + 3)).getFullYear()}
          ></CalendarBlock>
        </div>

        <div className="CalendarRow">
          <CalendarBlock color="#005587" blockId="fa25" blockState={this.calendarState["fa25"]}
            calendarDate={"Fall " + new Date(new Date().setFullYear(this.currYear + 3)).getFullYear()}></CalendarBlock>
          <CalendarBlock color="#005587" blockId="wi26" blockState={this.calendarState["wi26"]}
            calendarDate={"Winter " + new Date(new Date().setFullYear(this.currYear + 4)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#005587" blockId="sp26" blockState={this.calendarState["sp26"]}
            calendarDate={"Spring " + new Date(new Date().setFullYear(this.currYear + 4)).getFullYear()}
          ></CalendarBlock>
          <CalendarBlock color="#005587" blockId="su26" blockState={this.calendarState["su26"]}
            calendarDate={"Summer " + new Date(new Date().setFullYear(this.currYear + 4)).getFullYear()}
          ></CalendarBlock>
        </div>       
      </div>
    );
  }
}

export default CalendarList; 
