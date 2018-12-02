import React, { Component } from 'react';
import NavBarTop from "./navBarTop";

import author_img from './me.jpeg'

import "./pageHeading.css";
import "./about.css";
import {
     Media
    } from 'reactstrap';

var {SocialIcon} = require('react-social-icons');

export default class About extends React.Component {
  render() {
    return (
        <div >
        <NavBarTop />
            <div class = "aboutText"> 
                <h1>About us</h1>
                <p> 
                    Event Center is a web application designed in 2018 to make it easier for SJSU Engineering students
                    to create and effectively manage events hosted by themselves or any other organizations. <br></br>
                    It was designed and created in order to help the SJSU students broaden their network by attending and thereafter 
                    broadening their network by meeting new people. <br></br>
                </p>

                
                <br></br>
                <h1>Author's story</h1>
                <img src={author_img}  width="600" height="550"></img> 
                
                <p><br></br>
                    Hashim Shah is a Computer Engineering Student in SJSU whose ambition and curiosity in learning new things
                    has made him dive into the web development world with this website as his first full-stack web application.
                    <br></br><br></br>
                    The process of making this website was a very humbling and worth-while experience. There was a lot of work 
                    that went into this application, and so, if there are any questions, please dont hesitate to connect with him
                    on LinkedIn or visit his GitHub to see more of his projects.</p>
                    <Media left href="#">
                      
                    </Media>
                    
                    <SocialIcon url="https://www.linkedin.com/in/mhashimshah/" /> {"  "}
                    <SocialIcon url = "https://github.com/Hashah1"   /> {" "}
                    <SocialIcon url = "https://www.facebook.com/mian.h.shah" /> {"  "}
                <br></br><br></br>
            </div>
        </div>
    );
  }
}//style={{color:"#282c34"}}