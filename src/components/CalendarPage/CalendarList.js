/**
 * @file Aggregates multiple CalendarBlocks to form the full calendar.
 * @author Megan Pham, Andy Goh
 */
import React from "react";
import CalendarBlock from "./CalendarBlock";
import { useLocation } from "react-router-dom";


const CalendarList = () => {
  const location = useLocation();
  const data = location.state;

  const parse_json = () => {
    let parsedInput = data;

    let start_year = parsedInput.calendar.quarters[0].quarter.year;
    if (parsedInput.calendar.quarters[0].quarter.name !== "FA") {
      start_year = start_year - 1;
    }
    let default_calendar = [];
    let default_courses =["DROP HERE", "DROP HERE", "DROP HERE", "DROP HERE"];
    for (let row_idx = 0; row_idx < 4; row_idx++) {
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
    console.log(default_calendar);

    const quarter_name_dict = {
      "FA" : "Fall",
      "WI" : "Winter",
      "SP" : "Spring",
      "SU" : "Summer"
    };
    const quarter_id_dict = {
      "FA" : 0,
      "WI" : 1,
      "SP" : 2,
      "SU" : 3
    }

    let json_quarters = parsedInput.calendar.quarters;
    for (let i = 0; i < json_quarters.length; i++) {
      const q = json_quarters[i];
      const year = q.quarter.year;
      const quarter_name = quarter_name_dict[q.quarter.quarter];
      const quarter_id = quarter_id_dict[q.quarter.quarter];
      let courses = ["DROP HERE", "DROP HERE", "DROP HERE", "DROP HERE"];
      for (let j = 0; j < q.quarter.courses.length; j++) {
        courses[j] = q.quarter.courses[j].course.name;
      }
      const quarter = {
        'name' : quarter_name,
        'year' : year,
        'courses' : courses
      }
      let row_num = year - start_year - 2;
      if (quarter_name === "Fall") {
        row_num += 1;
      }
      console.log(quarter, row_num, quarter_id);
      default_calendar[row_num][quarter_id] = quarter;
    }
    console.log(default_calendar);
    return default_calendar;
  }

  const parsed = parse_json();

  const get_row = (row_idx) => {
    const row = parsed[row_idx];
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

  return (
    <div>
      {get_row(0)}
      {get_row(1)}
      {get_row(2)}
      {get_row(3)}
    </div>
  );
}

export default CalendarList; 
