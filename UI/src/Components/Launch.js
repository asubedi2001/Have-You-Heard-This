import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./Header.js"

function Launch(){
    return (
        <>
        <BrowserRouter>
           <Header />

        </BrowserRouter>
        </>
    )
}
export default Launch;