import React, { Component } from 'react';
import reactLogo from './logo-react.svg';
import djangoLogo from './logo-django.svg';
import CalendarBlock from './components/CalendarBlock';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <CalendarBlock />
      </div>
    );
  }
}

export default App;
