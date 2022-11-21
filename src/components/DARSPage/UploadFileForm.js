/**
 * @file Gets the DARS html file, starting quarter, and starting year
 * from users who wish to import in their DARS file into the calendar.
 * @author Andy Goh
 */

import React from "react";
import { useNavigate } from "react-router-dom";

function UploadFileForm({ googleId }) {
  const navigate = useNavigate();

  let state = {
    file: null,
    start_quarter: null,
    start_year: null,
    id : googleId
  };

  async function uploadFile(event) {
    state.file = await event.target.files[0].text();
  }

  async function handleSubmit(event) {
    // TODO: Update requestBody.start_quarter and requestBody.start_year
    //       with values submitted by the user via form
    const requestBody = {
      "id": state.id,
      "start_quarter": "Fall",
      "start_year": "2019",
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
        .then(json => navigate('/calendar', { state : json }))
        .catch(err => console.log(err));
    }
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Upload your DARS HTML file:
        <input type="file" id="myfile" name="myfile" onChange={uploadFile} />
      </label>
      <br></br>
      <label>What is your starting year?
        <input name="year" type="number" min="1919" max="2022" step="1" />
      </label>
      <br></br>
      <label>What is your starting quarter?
        <select name="quarter" id="quarter" form="carform">
          <option value="Fall">Fall</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
        </select>
      </label>
      <br></br>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default UploadFileForm;