///////////////////////////////////////////////////
// This component is responsible for displaying the
// event submission form and any state changes 
// Associated with it
///////////////////////////////////////////////////

import React  from 'react';
import { Col, Form, Button, FormGroup, Label, Input } from 'reactstrap';


export default class EventForm extends React.Component {
    
    initialState = {
        status: 'draft',
        eventID: '',
        eventName: '',
        eventDescription: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        eventHost: '',
        eventContact: '',
      };

    constructor(props) {
        super(props);
        console.log("Init with props:");
        console.dir(props);


        // Set state with parent
        this.state = {
            status: this.props.status || '',
            eventID: this.props.eventID || '',
            eventName: this.props.eventName || '',
            eventDescription: this.props.eventDescription || '',
            eventDate: this.props.eventDate || '',
            eventTime: this.props.eventTime || '',
            eventLocation: this.props.eventLocation || '',
            eventHost: this.props.eventHost || '',
            eventContact: this.props.eventContact || ''
        };

    } // End Constructor

    componentDidUpdate = () => {
        // console.log("form componentDidUpdate");
        // console.dir(this.state);
        // console.log("initial state:");
        // console.dir(this.initialState);
    }

    ///////////////////////////////////////////////////
    // Functions to set the state for the form fields
    ///////////////////////////////////////////////////
    onChange_eventName = (e) => {
        this.setState({...this.state,
            eventName: e.target.value });
    }

    onChange_eventDescription = (e) => {
        this.setState({...this.state,
            eventDescription: e.target.value });
    }

    onChange_eventDate = (e) => {
        this.setState({...this.state,
            eventDate: e.target.value });
    }
    
    onChange_eventTime = (e) => {
        this.setState({...this.state,
            eventTime: e.target.value });
    } 

    onChange_eventLocation = (e) => {
        this.setState({...this.state,
            eventLocation: e.target.value });
    }

    onChange_eventHost = (e) => {
        this.setState({...this.state,
            eventHost: e.target.value });
    }

    onChange_eventContact = (e) => {
        this.setState({...this.state,
            eventContact: e.target.value });
    }

    onClickSubmit = (e) => {
        e.preventDefault();
        console.log("on click submit in form");
        console.dir(this.state)
        this.props.onPostSubmit(this.state);

        this.setState(this.initialState);
    }

    onClickEdit = (e) => {
        e.preventDefault();
        console.log("on click edit in form");
        console.dir(this.state)
        this.props.onEditEvent(this.state);
        
        this.setState(this.initialState);
    }

    ////////////////////////////////////
    // onClickClear ->
    // Responsible for clearing the form
    ////////////////////////////////////
    onClickClear = () => {
        this.setState(this.initialState);
    }

    renderButtons() {
        if(this.props.isEditing) {
          return (
            <Col sm = {100} style = {{paddingTop:15}}>
                 <Button color = "primary" onClick = {(e) => this.onClickEdit(e)} block> Update </Button>
            </Col>
          );
        } else {
          return (
            <Col sm = {100} style = {{paddingTop:15}}>
                <Button color = "primary" onClick = {(e) => this.onClickSubmit(e)} block> Post to Drafts </Button>
                <Button color = "danger" onClick = {this.props.onClickClear} block> Clear </Button>
            </Col>
          );
        }
      }
    ///////////////////////////////////////////////////
    /////////////// Display form here
    ///////////////////////////////////////////////////    
    render () {

        
        return  (
        // Displays form to submit event
        <Form>
                <FormGroup row>
                <Label for="EventName" sm={2}>Event Name</Label>
                <Col sm={10}>
                    <Input type="text" value={this.state.eventName} onChange={this.onChange_eventName}name="EventName" id="EventName" placeholder="enter event name" />
                </Col>
                </FormGroup>
                
                <FormGroup row>
                <Label for="EventDescription" sm={2}>Event Description</Label>
                <Col sm={10}>
                    <Input type="textarea" value={this.state.eventDescription} onChange={this.onChange_eventDescription} name="text" id="EventDescription" placeholder="enter event description"/>
                </Col>
                </FormGroup>
                
                <FormGroup row>
                <Label for="EventDate" sm={2}>Event Date</Label>
                <Col sm={10}>
                <Input type="date" value={this.state.eventDate} onChange={this.onChange_eventDate} name="date" id="EventDate" />
                </Col>
                </FormGroup>

                <FormGroup row>
                <Label for="EventTime" sm={2}>Time</Label>
                <Col sm={10}>
                <Input type="time" value={this.state.eventTime} onChange={this.onChange_eventTime} name="time" id="EventTime" />
                </Col>
                </FormGroup>

                <FormGroup row>
                <Label for="EventLocation" sm={2}>Event Location</Label>
                <Col sm={10}>
                <Input type="text" value={this.state.eventLocation} onChange={this.onChange_eventLocation} name="text" id="EventLocation" placeholder="123 xyz street" />
                </Col>
                </FormGroup>

                <FormGroup row>
                <Label for="EventHost" sm={2}>Host?</Label>
                <Col sm={10}>
                    <Input type="text" value={this.state.eventHost} onChange={this.onChange_eventHost} name="EventHost" id="EventHost" placeholder="John Doe" />
                </Col>
                </FormGroup>

                <FormGroup row>
                <Label for="EventContactInfo" sm={2}>Host Email</Label>
                <Col sm={10}>
                    <Input type="email" value={this.state.eventContact} onChange={this.onChange_eventContact} name="EventContactInfo" id="EventContactInfo" placeholder="JohnDoe@sjsu.edu" />
                    <Col sm = {100} style = {{paddingTop:15}}>
                     {this.renderButtons()}
                    </Col>

                </Col>
                
                </FormGroup>
        </Form>
        )}
}
