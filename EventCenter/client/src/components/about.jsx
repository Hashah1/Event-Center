import React, { Component } from 'react';
import NavBarTop from "./navBarTop";
import "./pageHeading.css";
import "./about.css";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Col, Row
  } from 'reactstrap';



export default class About extends React.Component {
  render() {
    return (
        <div >
        <NavBarTop />
            <div class = "aboutText"> 
           
                <p> 
                    Event Center is a web application designed to make it easier for SJSU Engineering students
                    to create and effectively manage events hosted by themselves or any other organizations.
                </p>

                
                <br></br>
                <h1>Meet the author</h1>
            </div>
        </div>
    );
  }
}//style={{color:"#282c34"}}