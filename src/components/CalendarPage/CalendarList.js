/**
 * @file Aggregates multiple CalendarBlocks to form the full calendar.
 * @author Megan Pham, Andy Goh
 */
import React, { Component, startTransition } from "react";
import CalendarBlock from "./CalendarBlock";

class CalendarList extends Component {
  currYear = new Date().getFullYear();

  example = {
    "calendar": {
      "quarters": [{
        "quarter": {
          "year": 19,
          "quarter": "FA",
          "courses": [{
            "course": {
              "name": "COMSCI1",
              "requirement": "CS_LOWER_DIV",
              "department": "COM SCI",
              "description": "FRESHMAN CS SEMINAR",
              "units": 1.0
            }
          }, {
            "course": {
              "name": "MATH31A",
              "requirement": "MATH_LOWER_DIV",
              "department": "MATH",
              "description": "DIFF&INTGL CALCULUS",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "NEUROSC10",
              "requirement": "GE_SI_LS",
              "department": "NEUROSC",
              "description": "NEUROSCI-21ST CENT",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "COMSCI31",
              "requirement": "CS_LOWER_DIV",
              "department": "COM SCI",
              "description": "INTRO TO COM SCI 1",
              "units": 4.0
            }
          }]
        }
      }, {
        "quarter": {
          "year": 20,
          "quarter": "WI",
          "courses": [{
            "course": {
              "name": "MATH31B",
              "requirement": "MATH_LOWER_DIV",
              "department": "MATH",
              "description": "INTEGRTN&INF SERIES",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "COMSCI32",
              "requirement": "CS_LOWER_DIV",
              "department": "COM SCI",
              "description": "INTRO TO COM SCI 2",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "ISLMSTM20",
              "requirement": "GE_SC_HA",
              "department": "ISLM",
              "description": "INTRODUCTN TO ISLAM",
              "units": 5.0
            }
          }, {
            "course": {
              "name": "PHYSICS1A",
              "requirement": "PHYSICS_LOWER_DIV",
              "department": "PHYSICS",
              "description": "MECHANICS",
              "units": 5.0
            }
          }]
        }
      }, {
        "quarter": {
          "year": 20,
          "quarter": "SU",
          "courses": [{
            "course": {
              "name": "MATH31B",
              "requirement": "MATH_LOWER_DIV",
              "department": "MATH",
              "description": "INTEGRTN&INF SERIES",
              "units": 4.0
            }
          }]
        }
      }, {
        "quarter": {
          "year": 20,
          "quarter": "SP",
          "courses": [{
            "course": {
              "name": "MATH31B",
              "requirement": "MATH_LOWER_DIV",
              "department": "MATH",
              "description": "INTEGRTN&INF SERIES",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "COMSCI32",
              "requirement": "CS_LOWER_DIV",
              "department": "COM SCI",
              "description": "INTRO TO COM SCI 2",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "ISLMSTM20",
              "requirement": "GE_SC_HA",
              "department": "ISLM",
              "description": "INTRODUCTN TO ISLAM",
              "units": 5.0
            }
          }, {
            "course": {
              "name": "PHYSICS1A",
              "requirement": "PHYSICS_LOWER_DIV",
              "department": "PHYSICS",
              "description": "MECHANICS",
              "units": 5.0
            }
          }, {
            "course": {
              "name": "COMSCI33",
              "requirement": "CS_LOWER_DIV",
              "department": "COM SCI",
              "description": "COMPUTER ORGANIZATN",
              "units": 5.0
            }
          }]
        }
      }, {
        "quarter": {
          "year": 20,
          "quarter": "FA",
          "courses": [{
            "course": {
              "name": "MATH31B",
              "requirement": "MATH_LOWER_DIV",
              "department": "MATH",
              "description": "INTEGRTN&INF SERIES",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "COMSCI32",
              "requirement": "CS_LOWER_DIV",
              "department": "COM SCI",
              "description": "INTRO TO COM SCI 2",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "ISLMSTM20",
              "requirement": "GE_SC_HA",
              "department": "ISLM",
              "description": "INTRODUCTN TO ISLAM",
              "units": 5.0
            }
          }, {
            "course": {
              "name": "PHYSICS1A",
              "requirement": "PHYSICS_LOWER_DIV",
              "department": "PHYSICS",
              "description": "MECHANICS",
              "units": 5.0
            }
          }, {
            "course": {
              "name": "COMSCI33",
              "requirement": "CS_LOWER_DIV",
              "department": "COM SCI",
              "description": "COMPUTER ORGANIZATN",
              "units": 5.0
            }
          }]
        }
      }, {
        "quarter": {
          "year": 21,
          "quarter": "WI",
          "courses": [{
            "course": {
              "name": "MATH33B",
              "requirement": "MATH_LOWER_DIV",
              "department": "MATH",
              "description": "DIFFERNTL EQUATIONS",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "COMSCI111",
              "requirement": "CS_REQUIRED",
              "department": "COM SCI",
              "description": "OPERATNG SSTMS PRIN",
              "units": 5.0
            }
          }, {
            "course": {
              "name": "COMSCIM146",
              "requirement": "CS_TECHNICAL_BREADTH",
              "department": "COM SCI",
              "description": "MACHINE LEARNING",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "PHYSICS4AL",
              "requirement": "PHYSICS_LOWER_DIV",
              "department": "PHYSICS",
              "description": "LAB-MECHANICS",
              "units": 2.0
            }
          }]
        }
      }, {
        "quarter": {
          "year": 21,
          "quarter": "SP",
          "courses": [{
            "course": {
              "name": "MATH33B",
              "requirement": "MATH_LOWER_DIV",
              "department": "MATH",
              "description": "DIFFERNTL EQUATIONS",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "COMSCI111",
              "requirement": "CS_REQUIRED",
              "department": "COM SCI",
              "description": "OPERATNG SSTMS PRIN",
              "units": 5.0
            }
          }, {
            "course": {
              "name": "COMSCIM146",
              "requirement": "CS_TECHNICAL_BREADTH",
              "department": "COM SCI",
              "description": "MACHINE LEARNING",
              "units": 4.0
            }
          }]
        }
      }, {
        "quarter": {
          "year": 21,
          "quarter": "FA",
          "courses": [{
            "course": {
              "name": "MATH33B",
              "requirement": "MATH_LOWER_DIV",
              "department": "MATH",
              "description": "DIFFERNTL EQUATIONS",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "COMSCI111",
              "requirement": "CS_REQUIRED",
              "department": "COM SCI",
              "description": "OPERATNG SSTMS PRIN",
              "units": 5.0
            }
          }, {
            "course": {
              "name": "COMSCIM146",
              "requirement": "CS_TECHNICAL_BREADTH",
              "department": "COM SCI",
              "description": "MACHINE LEARNING",
              "units": 4.0
            }
          }]
        }
      }, {
        "quarter": {
          "year": 22,
          "quarter": "WI",
          "courses": [{
            "course": {
              "name": "COMSCIM225",
              "requirement": "CS_ELECTIVES",
              "department": "COM SCI",
              "description": "COMP GENOMIC METHOD",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "ECENGRC147",
              "requirement": "CS_TECHNICAL_BREADTH",
              "department": "EC ENGR",
              "description": "NEUR NET & DEEP LRN",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "COMSCICM121",
              "requirement": "CS_ST_ELECTIVES",
              "department": "COM SCI",
              "description": "INTR-BIOINFORMATICS",
              "units": 4.0
            }
          }]
        }
      }, {
        "quarter": {
          "year": 22,
          "quarter": "SP",
          "courses": [{
            "course": {
              "name": "COMSCIM225",
              "requirement": "CS_ELECTIVES",
              "department": "COM SCI",
              "description": "COMP GENOMIC METHOD",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "ECENGRC147",
              "requirement": "CS_TECHNICAL_BREADTH",
              "department": "EC ENGR",
              "description": "NEUR NET & DEEP LRN",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "COMSCICM121",
              "requirement": "CS_ST_ELECTIVES",
              "department": "COM SCI",
              "description": "INTR-BIOINFORMATICS",
              "units": 4.0
            }
          }]
        }
      }, {
        "quarter": {
          "year": 22,
          "quarter": "FA",
          "courses": [{
            "course": {
              "name": "COMSCIM225",
              "requirement": "CS_ELECTIVES",
              "department": "COM SCI",
              "description": "COMP GENOMIC METHOD",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "ECENGRC147",
              "requirement": "CS_TECHNICAL_BREADTH",
              "department": "EC ENGR",
              "description": "NEUR NET & DEEP LRN",
              "units": 4.0
            }
          }, {
            "course": {
              "name": "COMSCICM121",
              "requirement": "CS_ST_ELECTIVES",
              "department": "COM SCI",
              "description": "INTR-BIOINFORMATICS",
              "units": 4.0
            }
          }]
        }
      }]
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
      if (quarter_name == "Fall") {
        row_num += 1;
      }
      console.log(quarter, row_num, quarter_id);
      default_calendar[row_num][quarter_id] = quarter;
    }
    console.log(default_calendar);
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
