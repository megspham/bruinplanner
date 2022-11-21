import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

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
        <input name="year" type="number" min="1919" max="2022" step="1" onChange={(e) => state.start_quarter = e.target.year.value} />
      </label>
      <br></br>
      <label>What is your starting quarter?
        <select name="cars" id="cars" form="carform">
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

// export class UploadFileForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       file: null,
//       start_quarter: null,
//       start_year: null
//     };

//     this.id = this.props.id;

//     this.uploadFile = this.uploadFile.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   async uploadFile(event) {
//     this.state.file = await event.target.files[0].text();
//   }

//   handleSubmit(event) {
//     const requestBody = {
//       "id": this.id,
//       "start_quarter": "Fall",
//       "start_year": "2019",
//       "dars_file": this.state.file
//     }
//     console.log(JSON.stringify(requestBody));
//     if (this.state.file) {
//     // if (true) {
//       fetch("http://127.0.0.1:8000/api/importDars", {
//         crossDomain: true,
//         mode: 'cors',
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(requestBody)
//       }).then(res => res.json())
//         .then(json => <Navigate to="/calendar" replace={true} /> )
//         .catch(err => console.log(err));
//     }
//     //  console.log(this.state.start_year);
//     event.preventDefault();
//   }

//   render() {
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <label>Upload your DARS HTML file:
//           <input type="file" id="myfile" name="myfile" onChange={this.uploadFile} />
//         </label>
//         <br></br>
//         <label>What is your starting year?
//           <input name="year" type="number" min="1919" max="2022" step="1" onChange={(e) => this.state.start_quarter = e.target.year.value} />
//         </label>
//         <br></br>
//         <label>What is your starting quarter?
//           <select name="cars" id="cars" form="carform">
//             <option value="Fall">Fall</option>
//             <option value="Winter">Winter</option>
//             <option value="Spring">Spring</option>
//             <option value="Summer">Summer</option>
//           </select>
//         </label>
//         <br></br>
//         <input type="submit" value="Submit" />
//       </form>
//     );
//   }
// }