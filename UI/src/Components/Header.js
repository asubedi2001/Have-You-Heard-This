import React from "react";
import { Link } from "react-router-dom";
import radar from './radarLogo.gif'

export default function Header() {
    return (
        <>
            <div className="header">
                <Link to="/">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <img className="headerLogo" src={radar} alt="logo" />
                            <p className="headerText">Haveyouheardthis?</p>
                        </div>
                    </div>
                </Link>
                
            </div>
        </>
    )
}