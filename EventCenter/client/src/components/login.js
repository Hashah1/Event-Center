  import React, { Component } from 'react';
  import axios from 'axios';
  import { Link } from 'react-router-dom';
  import './login.css';

  class Login extends Component {
    constructor() {
      super();
      this.state = {
        username: '',
        password: '',
        message: ''
      };
    }

  ////////////////////////////////
  // componentDidMount ->
  // Makes sure a logged in user
  // stays on the eventManager page
  // if already logged in
  ////////////////////////////////
  componentDidMount = () => {
    console.log("componentDidMount");
    console.dir(this.state);

    let token = localStorage.getItem('jwtToken');

    if (token) {
      // Redirect to the event manager page
      this.props.history.push("/eventManager"); 
    }
  }


  ///////////////////////////////
  // onChange ->
  // Maintains state of text 
  // upon input
  ///////////////////////////////
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }
  
  ///////////////////////////////
  // onSubmit ->
  // Responsible for logging users
  // into the system
  ///////////////////////////////
  onSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;

    axios.post('/api/user/login', { username, password })
      .then((result) => {
        localStorage.setItem('jwtToken', result.data.token);
        this.setState({ message: '' });
        // Redirect to eventManager page
        // once login is succcessful
        this.props.history.push('/eventManager')
      })
      .catch((error) => {
        if(error.response.status === 401) {
          this.setState({ message: 'Login failed. Username or password not match' });
        }
      });
  }

  ///////////////////////////////
  // render ->
  // Responsible for displaying
  // the sign in form
  ///////////////////////////////
  render() {
    const { username, password, message } = this.state;
    return (
      <div class="container">
        <form class="form-signin" onSubmit={this.onSubmit}>
          {message !== '' &&
            <div class="alert alert-warning alert-dismissible" role="alert">
              { message }
            </div>
          }
          <h2 class="form-signin-heading">Please sign in</h2>
          <label for="inputEmail" class="sr-only">Email address</label>
          <input type="email" class="form-control" placeholder="Email address" name="username" value={username} onChange={this.onChange} required/>
          <label for="inputPassword" class="sr-only">Password</label>
          <input type="password" class="form-control" placeholder="Password" name="password" value={password} onChange={this.onChange} required/>
          <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>
          <p>
            Not a member? <Link to="/register"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Register here</Link>
          </p>
        </form>
      </div>
      );
    }
  }

  export default Login;