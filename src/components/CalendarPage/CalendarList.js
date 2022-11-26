/**
 * @file Aggregates multiple CalendarBlocks to form the full calendar.
 * @author Megan Pham, Andy Goh
 */
import React, { useEffect, useState } from "react";
import CalendarBlock from "./CalendarBlock";
import { useLocation } from "react-router-dom";
// import Calendar from "./Calendar";

const parsed_to_block_id = [
  ["fa_1", "wi_1", "sp_1", "su_1"],
  ["fa_2", "wi_2", "sp_2", "su_2"],
  ["fa_3", "wi_3", "sp_3", "su_3"],
  ["fa_4", "wi_4", "sp_4", "su_4"]
];

function CalendarList({ classMappings, startYear }) {
  // const location = useLocation();
  // const data = location.state.data;
  // const id = location.state.id;
  const calendarState = classMappings;

  // const [newParsed, setNewParsed] = useState([
  //   [{name: "", year: 20, courses: []},
  //    {name: "", year: 20, courses: []},
  //    {name: "", year: 20, courses: []},
  //    {name: "", year: 20, courses: []}],
  //   [{name: "", year: 20, courses: []},
  //    {name: "", year: 20, courses: []},
  //    {name: "", year: 20, courses: []},
  //    {name: "", year: 20, courses: []}],
  //   [{name: "", year: 20, courses: []},
  //    {name: "", year: 20, courses: []},
  //    {name: "", year: 20, courses: []},
  //    {name: "", year: 20, courses: []}],
  //   [{name: "", year: 20, courses: []},
  //    {name: "", year: 20, courses: []},
  //    {name: "", year: 20, courses: []},
  //    {name: "", year: 20, courses: []}]
  // ]);
  // const [childState, setChildState] = useState(0);

  // const parse_json = () => {
  //   console.log("parsing", calendarState)
  //   let parsedInput = data;
  //   let return_json = {
  //     "calendar": {
  //       "quarters": []
  //     }
  //   }
    
  //   // TODO: get the start year from the user (add a form on the DARs page?)
  //   let start_year = new Date().getFullYear();

  //   if (parsedInput !== null) {
  //     start_year = parsedInput.calendar.quarters[0].quarter.year;
  //   }
  //   let default_calendar = [];
  //   let default_courses = [];
  //   for (let row_idx = 0; row_idx < 4; row_idx++) {
  //     let fall = {
  //       'name': "Fall",
  //       'year': start_year + row_idx,
  //       'courses': default_courses
  //     }
  //     let winter = {
  //       'name': "Winter",
  //       'year': start_year + 1 + row_idx,
  //       'courses': default_courses
  //     }
  //     let spring = {
  //       'name': "Spring",
  //       'year': start_year + 1 + row_idx,
  //       'courses': default_courses
  //     }
  //     let summer = {
  //       'name': "Summer",
  //       'year': start_year + 1 + row_idx,
  //       'courses': default_courses
  //     }

  //     let default_year = [fall, winter, spring, summer];
  //     default_calendar.push(default_year);
  //   }

  //   if (parsedInput !== null) {
  //     const quarter_name_dict = {
  //       "FA": "Fall",
  //       "WI": "Winter",
  //       "SP": "Spring",
  //       "SU": "Summer"
  //     };
  //     const quarter_id_dict = {
  //       "FA": 0,
  //       "WI": 1,
  //       "SP": 2,
  //       "SU": 3
  //     }

  //     let json_quarters = parsedInput.calendar.quarters;
  //     for (let i = 0; i < json_quarters.length; i++) {
  //       const q = json_quarters[i];
  //       const year = q.quarter.year;
  //       const quarter_name = quarter_name_dict[q.quarter.quarter];
  //       const quarter_id = quarter_id_dict[q.quarter.quarter];
  //       let courses = [];
  //       for (let j = 0; j < q.quarter.courses.length; j++) {
  //         courses[j] = q.quarter.courses[j].course.name;
  //       }
  //       const quarter = {
  //         'name': quarter_name,
  //         'year': year,
  //         'courses': courses
  //       }
  //       let row_num = year - start_year - 1;
  //       if (quarter_name === "Fall") {
  //         row_num += 1;
  //       }
  //       if (row_num < 0) {
  //         continue;
  //       }
  //       for (const course of quarter.courses) {
  //         if (calendarState[parsed_to_block_id[row_num][quarter_id]].indexOf(course) === -1) {
  //           calendarState[parsed_to_block_id[row_num][quarter_id]].push(course);
  //           // setCalendarState(prev => ({
  //           //   ...prev,
  //           //   [parsed_to_block_id[row_num][quarter_id]]: [
  //           //     ...prev[parsed_to_block_id[row_num][quarter_id]],
  //           //     course
  //           //   ]
  //           // }));
  //         }
  //       }
  //       for (const course of calendarState[parsed_to_block_id[row_num][quarter_id]]) {
  //         if (quarter.courses.indexOf(course) === -1) {
  //           quarter.courses.push(course);
  //         }
  //       }
  //       default_calendar[row_num][quarter_id] = quarter;
  //       return_json.calendar.quarters.push(quarter);
  //     }
  //     console.log(data, return_json);
  //     console.log(default_calendar);
  //   } else {
  //     let dc_json = require('./default_calendar.json');
  //     let year_offset = [
  //       0, 1, 1, 1,
  //       1, 2, 2, 2,
  //       2, 3, 3, 3,
  //       3, 4, 4, 4
  //     ]
  //     for (let i = 0; i < dc_json.calendar.quarters.length; i++) {
  //       dc_json.calendar.quarters[i].quarter.year = start_year + year_offset[i]
  //     }
  //     const requestBody = {
  //       "id": id,
  //       "calendar": dc_json
  //     }
  //     fetch("http://127.0.0.1:8000/api/updateCalendar", {
  //       crossDomain: true,
  //       mode: 'cors',
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(requestBody)
  //     }).then(res => console.log(res))
  //       .catch(err => console.log(err));
  //     console.log("Still fetching...");
  //   }
  //   // console.log(data, return_json)
  //   // console.log(default_calendar)
  //   // setHasParsed(true);
  //   return default_calendar;
  // }
  
  // let parsed = null;
  // parsed = parse_json();

  // console.log(parsed);
  // console.log(!parsed);
  // setParsed(2);
  // console.log(parsed);
  // if (!parsed) {
  //   console.log(parsed);
  //   setParsed((prev) => {
  //     console.log(prev);
  //     let parsed_json = parse_json();
  //     console.log(parsed_json);
  //     return parsed_json;
  //   });
  // }
  // console.log(parsed);

  const get_row = (row_idx) => {
    // console.log(parsed);
    // const row = parsed[row_idx];
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
        calendarDate={quarters[i] + " " + (startYear + year_offset[4 * row_idx + i])}>
      </CalendarBlock>);
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
