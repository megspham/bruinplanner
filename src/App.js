import React, { Component } from 'react';
import './App.css';
import CalendarList from './components/CalendarPage/CalendarList.js';

class App extends Component {
  render() {
    return (
      <div className="BruinPlanner">
        <CalendarList />        
      </div>
    );
  }
}

export default App;
