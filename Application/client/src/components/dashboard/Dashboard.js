import React, { useState } from "react";
import useAuth from "../../hooks/useAuth.js";
import useApi from "../../hooks/useApi.js";
import Nav from "../Nav.js";
import Search from "../search/Search.js";
import { BrowserRouter, Route, Switch } from "react-router-dom";

function Dashboard({ code }) {
  //custom hooks
  const accessToken = useAuth(code);
  const spotify = useApi(accessToken);
  //states

  return (
    <>
      <BrowserRouter>
        <Nav spotify={spotify}/>
        <Switch>
          <Route path="/">
            <Search
              spotify={spotify}
            />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default Dashboard;
