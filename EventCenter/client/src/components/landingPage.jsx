import React, { Component } from 'react';
import "./landingPage.css"
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import { BrowserRouter, Route } from 'react-router-dom'
import { AvForm, AvGroup, AvInput, AvFeedback,  } from 'availity-reactstrap-validation';
import { Button , Label} from 'reactstrap';
import eventManager from './eventManager';

export default class LandingPage extends Component {
    state = {
        isLoggedIn: false,
        userID: '',
        name: '',
        email: '',
        picture: ''
    }
    responseFacebook = (response) => {
        console.log ("in responseFacebook:");
        console.dir(response);

        this.setState ({
            isLoggedIn: true,
            userID: response.userID,
            name: response.name,
            email: response.email,
            picture: response.picture.data.url
        });

        axios.post('/api/user/signup', {email: response.email, password: response.userID})
            .then((res) => {
                console.log("Got response from the login");
                console.log("successful");
                console.dir(res);
                localStorage.setItem('jwtToken', "JWT " + res.data.user.token);
                this.props.history.push('/eventManager');
            });

    };
    componentClicked = () => {
        console.log ("component clicked");
    }

    render() { 
        let fbContent;
        if (this.state.isLoggedIn) {
            // When we are logged in
            fbContent = (
                <div style = {{
                    width: 'auto',
                    margin: 'auto',
                    background: '#053779',
                    padding: '20px'
                }}>
                <img src={this.state.picture} alt={this.state.name} />
                <h2>Welcome {this.state.name}</h2>
                Email: {this.state.email}

                </div>

            );
        } else {
            fbContent = (
            <FacebookLogin
                appId = "549277225516748"
                autoLoad = {true}
                fields = "name,email,picture"
                onClick = {this.componentClicked}
                callback = {this.responseFacebook}
                />
            );
        }

        return (
            <div className = "login">
            {fbContent}
            </div>
        );
    }
}
