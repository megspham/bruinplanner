/**
 * @file Gets the DARS html file, starting quarter, and starting year
 * from users who wish to import in their DARS file into the calendar.
 * @author Andy Goh (JS), Megan Pham (CSS)
 */

import React from "react";
import { useNavigate } from "react-router-dom";

import "./UploadFileForm.css";

function UploadFileForm({ googleId }) {
  const navigate = useNavigate();

  let state = {
    file: null,
    start_quarter: null,
    start_year: null,
    id : googleId.googleId
  };

  async function uploadFile(event) {
    state.file = await event.target.files[0].text();
  }

  async function handleSubmit(event) {
    const requestBody = {
      "id": state.id,
      "start_quarter": document.getElementById('quarter').value,
      "start_year": document.getElementById('year').value,
      "dars_file": state.file
    }
    if (state.file) {
      fetch("http://127.0.0.1:8000/api/importDars", {
        crossDomain: true,
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }).then(res => res.json())
        .then(json => {
          if (Object.keys(json).length === 0) {
            console.error("Invalid DARS or unsuccesful parse");
            navigate('/dars/upload', { state: { user: googleId, error: true } });
          } else {
            navigate('/calendar', { state: { data: json, id: state.id } });
          }
        })
        .catch(err => {
          console.error(err);
          navigate('/dars/upload', { state: { user: googleId, error: true } });
        }
      );
    }
    event.preventDefault();
  }

  return (
    <form className="formInput" onSubmit={handleSubmit}>
      <label>Upload your DARS HTML file:
        <input type="file" className="fileInput" id="myfile" name="myfile" onChange={uploadFile} />
      </label>
      <br></br>
      <br></br>
      <div className="twoCol">
        <div className="col1">
      <label>What is your starting year?
        <input name="year" className="yearInput" type="number" min="1919" max="2022" step="1" id="year"/>
      </label>
      </div>
      <div className="col2">
      <label>What is your starting quarter?
        <select name="quarter" id="quarter" className="yearInput" form="carform">
          <option value="Fall">Fall</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
        </select>
      </label>
      </div>
      </div>
      <br></br>
      <input type="submit" className="submitInput" value="Submit" />
    </form>
  );
}

export default UploadFileForm;