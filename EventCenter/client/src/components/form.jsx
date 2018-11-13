///////////////////////////////////////////////////
// This component is responsible for displaying the
// event submission form and any state changes 
// Associated with it
///////////////////////////////////////////////////

import React  from 'react';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';


export default class EventForm extends React.Component {
    constructor(props) {
        super(props);
        console.log("this is from parent");
        console.log(props.event);
        //console.dir( this.props.onEventNameChange);

    // Set state with parent state//
        this.state = {
            activeTab: this.props.activeTab,
            modal: this.props.modal,
            
            status: this.props.status,
            eventName: this.props.eventName,
            eventDescription: this.props.eventDescription,
            eventDate: this.props.eventDate,
            eventTime: this.props.eventTime,
            eventLocation: this.props.eventLocation,
            eventHost: this.props.eventHost,
            eventContact: this.props.eventContact,
    
            publishedEvents: this.props.publishedEvents,
            draftedEvents: this.props.draftedEvents
          };
    } // End Constructor

    ///////////////////////////////////////////////////
    // Functions to set the state for the form fields//
    ///////////////////////////////////////////////////
    onChange_eventName = (e) => {
        this.props.onEventNameChange(e.target.value);
    }

    onChange_eventDescription = (e) => {
    this.props.onEventDescriptionChange(e.target.value);
    }

    onChange_eventDate = (e) => {
    this.props.onEventDateChange(e.target.value);
    }
    
    onChange_eventTime = (e) => {
    this.props.onEventTimeChange(e.target.value);
    } 

    onChange_eventLocation = (e) => {
    this.props.onEventLocationChange(e.target.value);
    }

    onChange_eventHost = (e) => {
    this.props.onEventHostChange(e.target.value);
    }

    onChange_eventContact = (e) => {
    this.props.onEventContactChange(e.target.value);
    }

    ///////////////////////////////////////////////////
    /////////////// Display form here /////////////////
    ///////////////////////////////////////////////////    
    render () {
        return  (
        // Displays form to submit event
        <Form>
                <FormGroup row>
                <Label for="EventName" sm={2}>Event Name</Label>
                <Col sm={10}>
                    <Input type="text" value={this.eventName} onChange={this.onChange_eventName}name="EventName" id="EventName" placeholder="enter event name" />
                </Col>
                </FormGroup>
                
                <FormGroup row>
                <Label for="EventDescription" sm={2}>Event Description</Label>
                <Col sm={10}>
                    <Input type="textarea" value={this.eventDescription} onChange={this.onChange_eventDescription} name="text" id="EventDescription" placeholder="enter event description"/>
                </Col>
                </FormGroup>
                
                <FormGroup row>
                <Label for="EventDate" sm={2}>Event Date</Label>
                <Col sm={10}>
                <Input type="date" value={this.eventDate} onChange={this.onChange_eventDate} name="date" id="EventDate" />
                </Col>
                </FormGroup>

                <FormGroup row>
                <Label for="EventTime" sm={2}>Time</Label>
                <Col sm={10}>
                <Input type="time" value={this.eventTime} onChange={this.onChange_eventTime} name="time" id="EventTime" />
                </Col>
                </FormGroup>

                <FormGroup row>
                <Label for="EventLocation" sm={2}>Event Location</Label>
                <Col sm={10}>
                <Input type="text" value={this.eventLocation} onChange={this.onChange_eventLocation} name="text" id="EventLocation" placeholder="123 xyz street" />
                </Col>
                </FormGroup>

                <FormGroup row>
                <Label for="EventHost" sm={2}>Host?</Label>
                <Col sm={10}>
                    <Input type="text" value={this.eventHost} onChange={this.onChange_eventHost} name="EventHost" id="EventHost" placeholder="John Doe" />
                </Col>
                </FormGroup>

                <FormGroup row>
                <Label for="EventContactInfo" sm={2}>Host Email</Label>
                <Col sm={10}>
                    <Input type="email" value={this.eventContact} onChange={this.onChange_eventContact} name="EventContactInfo" id="EventContactInfo" placeholder="JohnDoe@sjsu.edu" />

                    <Col sm = {100} style = {{paddingTop:15}}>
                        <Button color = "primary" onClick = {(e) => this.props.postEvent(e)} block> Post to Drafts </Button>
                        <Button color = "danger" onClick = {this.props.onClickClear} block> Clear </Button>
                    </Col>
                </Col>
                </FormGroup>
        </Form>
        )}
}
