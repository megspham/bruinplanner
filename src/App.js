/**
 * @file Encapsulates all of the components and files for the website. Defines the 
 * urls and routings between pages.
 * @author Megan Pham, Andy Goh, Belle Lerdworatawee
 */

import React, { Component } from 'react';
import './App.css';
import CalendarList from './components/CalendarPage/CalendarList.js';
import DARSPage from './components/DARSPage/DARSPage';
import LandingPage from './components/LandingPage/LandingPage.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path = "/" element={<LandingPage />}/>
          <Route path = "/calendar" element={<CalendarList />}/>
          <Route path = "/dars" element={<DARSPage />}/>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
