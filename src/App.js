import React, { Component } from 'react';
import './App.css';
import CalendarList from './components/CalendarPage/CalendarList.js';
import Background from './components/LandingPage/LandingPage.js';

class App extends Component {
  render() {
    return (
      <div className="BruinPlanner">
        <Background />        
      </div>
    );
  }
}

export default App;
