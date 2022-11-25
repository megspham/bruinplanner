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
import { DropdownButton } from './components/DropdownButton';
import { VariableClasses } from './components/SidebarGroups/VariableClasses';
import { Electives } from './components/SidebarGroups/Electives';
import { GEs } from './components/SidebarGroups/GEs';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path = "/" element={<VariableClasses />}/>
          <Route path = "/calendar" element={<Calendar />}/>
          <Route path = "/dars" element={<DARSPage />}/>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
