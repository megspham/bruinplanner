/**
 * @file Aggregates multiple CalendarBlocks to form the full calendar.
 * @author Megan Pham, Andy Goh
 */
import React from "react";
import CalendarBlock from "./CalendarBlock";
import { useLocation } from "react-router-dom";
import Login from "../Login";

function CalendarList({ classMappings }) {
  const location = useLocation();
  const data = location.state ? location.state.data : null;
  const id = location.state ? location.state.id : null;
  const calendarState = classMappings;

  console.log(id);
  const parse_json = () => {
    let parsedInput = data;

    // TODO: get the start year from the user (add a form on the DARs page?)
    let start_year = new Date().getFullYear();

    if (parsedInput !== null) {
      start_year = parsedInput.calendar.quarters[0].quarter.year;
    }
    let default_calendar = [];
    let default_courses = ["DROP HERE", "DROP HERE", "DROP HERE", "DROP HERE"];
    for (let row_idx = 0; row_idx < 4; row_idx++) {
      let fall = {
        'name': "Fall",
        'year': start_year + row_idx,
        'courses': default_courses
      }
      let winter = {
        'name': "Winter",
        'year': start_year + 1 + row_idx,
        'courses': default_courses
      }
      let spring = {
        'name': "Spring",
        'year': start_year + 1 + row_idx,
        'courses': default_courses
      }
      let summer = {
        'name': "Summer",
        'year': start_year + 1 + row_idx,
        'courses': default_courses
      }

      let default_year = [fall, winter, spring, summer];
      default_calendar.push(default_year);
    }

    if (parsedInput !== null) {
      const quarter_name_dict = {
        "FA": "Fall",
        "WI": "Winter",
        "SP": "Spring",
        "SU": "Summer"
      };
      const quarter_id_dict = {
        "FA": 0,
        "WI": 1,
        "SP": 2,
        "SU": 3
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
          'name': quarter_name,
          'year': year,
          'courses': courses
        }
        let row_num = year - start_year - 1;
        if (quarter_name === "Fall") {
          row_num += 1;
        }
        if (row_num < 0) {
          continue;
        }
        default_calendar[row_num][quarter_id] = quarter;
      }
      // 0 1 1 1
      // 1 2 2 2
    } else {
      let dc_json = require('./default_calendar.json');
      let year_offset = [
        0, 1, 1, 1,
        1, 2, 2, 2,
        2, 3, 3, 3,
        3, 4, 4, 4
      ]
      for (let i = 0; i < dc_json.calendar.quarters.length; i++) {
        dc_json.calendar.quarters[i].quarter.year = start_year + year_offset[i]
      }
      console.log(dc_json)
      const requestBody = {
        "id": id,
        "calendar": dc_json
      }
      fetch("http://127.0.0.1:8000/api/updateCalendar", {
        crossDomain: true,
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }).then(res => console.log(res))
        .catch(err => console.log(err));
    }
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
    let block_ids = Object.keys(calendarState).slice(0 + 4 * row_idx, 4 + 4 * row_idx);
    let rows = []
    for (let i = 0; i < 4; i++) {
      rows.push(<CalendarBlock color={color_dict[row_idx]}
        blockId={block_ids[i]}
        calendarDate={row[i].name + " " + row[i].year}
        courses={row[i].courses}>
      </CalendarBlock>)
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
