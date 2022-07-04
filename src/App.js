import './App.scss';
import React from 'react'
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import BubbleChart from './components/BubbleChart';
import Header from './components/Header/Header';
import Landing from './components/Landing/Landing';




function App() {
  return (
    <div className="App container-fluid main-container" style={{ height: '100vh', backgroundColor: 'black' }} >


    {/* <BrowserRouter>
<nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/barchart">BarChart</Link> 
          </li>
          <li>
            <Link to="/bubblechart">BubbleChart</Link> 
          </li>
        </ul>
      </nav>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="home" element={<Home />} exact />
    <Route path="barchart" element={<BarChart />} exact />
    <Route path="bubblechart" element={<BubbleChart />} exact />
  </Routes>
</BrowserRouter> */}
      < Header />
      <div className='main-body'>
        <div className='body-content'>
          <Landing />
        </div>
      </div>
    </ div>
      );
}

      export default App
