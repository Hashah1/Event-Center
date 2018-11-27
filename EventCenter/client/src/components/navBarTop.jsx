import React from 'react';
import "./pageHeading.css";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  } from 'reactstrap';

export default class NavBarTop extends React.Component {
  constructor(props) {
    super(props);
    console.log("navBar top");
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({// className="navBar"  color = "dark"className="navbar navbar-dark bg-dark"href="/" style={{color:'white'}}
      isOpen: !this.state.isOpen
    });
  }

  renderLogOutButton  = () => {
    let token = localStorage.getItem('jwtToken');
    console.log("renderLog button");
    console.dir(this.state.history);
    if(!token) {
      return (
        <Nav className="ml-auto" navbar>
        <NavItem>
          <Button href="/login" color="secondary">Login</Button>
        </NavItem>
        </Nav>
      );
    } else if (token){
      return (
        <Nav className="ml-auto" navbar>
        <NavItem>
        {localStorage.getItem('jwtToken') &&
          <Button color = "secondary" onClick={this.logout}>Logout</Button>
        }
        </NavItem>
        </Nav>
      );
    }
  }

  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
    this.props.history.push("/login");
  }
  
  render() {
    return (
      <div class = "navbar navbar-dark" className = "navBar"> 
        <Navbar expand="md">
          <NavbarBrand style={{color:'white'}}><h1>Event Center</h1></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/eventManager" style={{color:'white'}}>Event Manager</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/announcementsPage" style={{color:'white'}}>Announcements</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="./about" style={{color:'white'}}>About</NavLink> {' '}
              </NavItem>
              {this.renderLogOutButton()}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}