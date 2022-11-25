/**
 * @file Encapsulates all of the components and files for the website. Defines the 
 * urls and routings between pages.
 * @author Megan Pham, Andy Goh, Belle Lerdworatawee
 */

import React, { Component } from 'react';
import './App.css';
import Calendar from './components/CalendarPage/Calendar.js';
import DARSPage from './components/DARSPage/DARSPage';
import LandingPage from './components/LandingPage/LandingPage.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GEAH } from './components/SidebarGroups/GE-AH';
import { DropdownButton } from './components/DropdownButton';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path = "/" element={<GEAH />}/>
          <Route path = "/calendar" element={<Calendar />}/>
          <Route path = "/dars" element={<DARSPage />}/>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
