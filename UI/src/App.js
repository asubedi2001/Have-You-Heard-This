import logo from './logo.svg';
import './App.css';
import React from 'react';
import Login from "./Components/Login.js"
import Launch from "./Components/Launch.js"
import Nav from "./Components/Nav.js"

function App() {
  const code = new URLSearchParams(window.location.search).get("code");
  return (
    <div className="App">
      {code ? <Launch /> : <Login />}
    </div>
  );
}

export default App;
