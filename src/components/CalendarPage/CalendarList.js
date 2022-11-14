/**
 * @file Aggregates multiple CalendarBlocks to form the full calendar.
 * @author Megan Pham, Andy Goh
 */
import React, { Component } from "react";
import CalendarBlock from "./CalendarBlock";

class CalendarList extends Component {
  currYear = new Date().getFullYear();

  example = {
    "calendar": {
      "quarters": [
        {
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
          "quarter": {
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

  parse_json(json) {
    let stringInput = JSON.stringify(json);
    let parsedInput = JSON.parse(stringInput);

    let start_year = parsedInput.calendar.quarters[0].quarter.year;
    if (parsedInput.calendar.quarters[0].quarter.name != "FA") {
      start_year = start_year - 1;
    }
    let default_calendar = [];
    let default_courses =["DROP HERE", "DROP HERE", "DROP HERE", "DROP HERE"];
    for (let row_idx = 0; row_idx < 4; row_idx ++) {
      let fall = {
        'name' : "Fall",
        'year' : start_year + row_idx,
        'courses' : default_courses
      }
      let winter = {
        'name' : "Winter",
        'year' : start_year + 1 + row_idx,
        'courses' : default_courses
      }
      let spring = {
        'name' : "Spring",
        'year' : start_year + 1 + row_idx,
        'courses' : default_courses
      }
      let summer = {
        'name' : "Summer",
        'year' : start_year + 1 + row_idx,
        'courses' : default_courses
      }

      let default_year = [fall, winter, spring, summer];
      default_calendar.push(default_year);
    }

    const quarter_name_dict = {
      "FA" : "Fall",
      "WI" : "Winter",
      "SP" : "Spring",
      "SM" : "Summer"
    };
    const quarter_id_dict = {
      "FA" : 0,
      "WI" : 1,
      "SP" : 2,
      "SM" : 3
    }

    let json_quarters = parsedInput.calendar.quarters;
    for (let i = 0; i < json_quarters.length; i++) {
      const q = json_quarters[i];
      const year = q.quarter.year;
      const quarter_name = quarter_name_dict[q.quarter.quarter_name];
      const quarter_id = quarter_id_dict[q.quarter.quarter_name];
      let courses = ["DROP HERE", "DROP HERE", "DROP HERE", "DROP HERE"];
      for (let j = 0; j < q.quarter.courses.length; j++) {
        courses[j] = q.quarter.courses[j].course.course_name;
      }
      const quarter = {
        'name' : quarter_name,
        'year' : year,
        'courses' : courses
      }
      default_calendar[Math.floor(i / 4)][quarter_id] = quarter;
    }
    return default_calendar;
  }

  parsed = this.parse_json(this.example);

  get_row(row_idx) {
    const row = this.parsed[row_idx];
    const color_dict = {
      0: "#005587",
      1: "#8BB8E8",
      2: "#FFE9AD",
      3: "#005587"
    };

    let rows = []
    for (const quarter of row) {
      rows.push(<CalendarBlock color={color_dict[row_idx]}
        calendarDate = {quarter.name + " " + quarter.year}
        courses = {quarter.courses}>
      </CalendarBlock>)
    }
    return <div className="CalendarRow">{rows}</div>;
  }

  render() {
    return (
      <div>
        {this.get_row(0)}
        {this.get_row(1)}
        {this.get_row(2)}
        {this.get_row(3)}
      </div>
    );
  }
}

export default CalendarList; 
