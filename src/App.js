import './App.scss';
import React, { useState } from 'react'
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import BubbleChart from './components/BubbleChart';
import Header from './components/Header/Header';
import Landing from './components/Landing/Landing';




function App() {
  const [headerClick, setHeaderClick] = useState(false)
  const onHeaderIconClick = () => {
    setHeaderClick(true)
  }

  const onResetHeaderClick = () => {
    setHeaderClick(false)
  }
  return (
    <div className="App container-fluid main-container" style={{ height: '100vh', backgroundColor: 'black' }} >
      < Header onHeaderIconClick={onHeaderIconClick} />
      <div className='main-body'>
        <div className='body-content'>
          <Landing headerClick={headerClick} onResetHeaderClick={onResetHeaderClick} />
        </div>
      </div>
    </ div>
  );
}

export default App
