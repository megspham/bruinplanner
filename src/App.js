import React, { Component } from 'react';
import './App.css';
import CalendarList from './components/CalendarPage/CalendarList.js';
import LandingPage from './components/LandingPage/LandingPage.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path = "/" element={<LandingPage />}/>
          <Route path = "/calendar" element={<CalendarList />}/>
          {/* add in your DARS oage */}
          {/* <Route path = "/" component={DARS PAGE}/> */}
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
