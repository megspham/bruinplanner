import React from "react";

export class UploadFileForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {file: null};
  
      this.uploadFile = this.uploadFile.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    uploadFile(event) {
      this.state.file = event.target.files[0].text();
      console.log(this.state.file);
  }
  
    handleSubmit(event) {
      if (this.state.file) {
        fetch("http://127.0.0.1:8000/api/sendDARS", {
          crossDomain: true,
          mode: 'cors',
          method: 'POST',
          headers: { 'Content-Type': 'text/html' }
        }).catch(err => console.log(err));
      }
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label for="myfile">Upload your DARS HTML file:</label>
          <input type="file" id="myfile" name="myfile" onChange={this.uploadFile}/>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }