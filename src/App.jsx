// import TitleComponent from '/Users/mahesh/developer/FYP/fe_test/src/TitleComponent.tsx'
// import SearchComponent from '/Users/mahesh/developer/FYP/fe_test/src/SearchComponent.tsx'
// import LoginComponent from '/Users/mahesh/developer/FYP/fe_test/src/LoginComponent.tsx'

import TitleComponent from './TitleComponent.tsx'
import SearchComponent from './SearchComponent.tsx'
import LoginComponent from './LoginComponent.tsx'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import React from 'react';
import './App.css';

function App() {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  return (
    <Router>
    <div className="App">
      <Routes>
        <Route exact path="/login" element= {<LoginComponent/> } />
        <Route exact path="/search" element={<><TitleComponent /><SearchComponent /></> } />
        {/* Redirect from the root path to either login or search based on the authentication status */}
        <Route exact path="/" element={<Navigate replace to={isLoggedIn ? "/search" : "/login"} />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
