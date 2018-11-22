//import React, { Component } from 'react';
import './App.css'; //only to be imported here
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    axios.get('/api/book')
      .then(res => {
        this.setState({ users: res.data });
        console.log(this.state.users);
      })
      .catch((error) => {
       // if(error.status(401)) {
          this.props.history.push("/login");
        //}
      });
  }

  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
  }

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              {localStorage.getItem('jwtToken') &&
                <button class="btn btn-primary" onClick={this.logout}>Logout</button>
              }
            </h3>
          </div>
          <div class="panel-body">
            <table class="table table-stripe">
              <thead>
                <tr>
                  {/* <th>ISBN</th>
                  <th>Title</th>
                  <th>Author</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.users.map(book =>
                  <tr>
                    <td><Link to={`/show/${book._id}`}>{book.isbn}</Link></td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}


// class App extends Component {
//   render() {
//     return (

//       <div className="App">
//       </div>

//     );
//   }
// }

export default App;
