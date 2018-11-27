import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import login from './components/login';
import register from './components/register';

import eventManager from './components/eventManager';
import announcementsPage from './components/announcementsPage';
import about from './components/about';


ReactDOM.render(
    <Router>
        <div>
            <Route exact path='/' component={login}/>
            <Route path='/login' component={login} />
            <Route path='/about' component={about} />
            <Route path='/register' component={register} />
            <Route path='/eventManager' component={eventManager} />
            <Route path='/announcementsPage' component={announcementsPage} />
        </div>
    </Router>,
    document.getElementById('root')
);
