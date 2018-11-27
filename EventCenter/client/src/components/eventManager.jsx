/*
eventManager.jsx -> 
Main component for managing events
 */

import React from 'react';
import { Col, Button, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Modal, ModalHeader, ModalBody} from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import "./announcementsPage.css"
import "./announcementsPage"
import NavBarTop from "./navBarTop.jsx";

import EventForm from './form';


export default class EventManager extends React.Component {
    constructor(props) {
      super(props);
      console.log('Constructor props:');
      console.dir(props);
      console.log("Local storage:");
      console.dir(localStorage);

      this.state = {
        activeTab: '1',
        modal: false,

        publishedEvents: [],
        draftedEvents: []
      };
    };

    ///////////////////////////////////////////////
    // componentDidMount -> 
    // Loads all events upon component load
    ///////////////////////////////////////////////
    componentDidMount = () => {
      console.log("componentDidMount");
      console.dir(this.state);
      console.dir(this.state.history);

      let token = localStorage.getItem('jwtToken');

      if (!token) {
        this.props.history.push("/login");
        console.dir(this.state.history);
      }

      axios.defaults.headers.common["Authorization"] = token;
      
      this.loadPublishedEventsFromServer();
      this.loadDraftedEventsFromServer();
    }

    ///////////////////////////////////////////////
    // componentDidUpdate -> 
    // Displays updated component
    ///////////////////////////////////////////////
    componentDidUpdate = () => {
      console.log("componentDidUpdate");
      console.dir(this.state);
    }
  
    ///////////////////////////////////////////////////////////////
    // loadPublishedEventsFromServer -> 
    // Loads all published events from  DB into the "published" tab
    ///////////////////////////////////////////////////////////////
    loadPublishedEventsFromServer = () => {
      axios.get('http://localhost:5000/api/form?status=published')
      .then(res => {
        //console.log(res.data);
        if (res.data.status == false) {
          // do nothing
          // or show an alert to the user
          return;
        }
        // Load new state
        let newState = {...this.state, publishedEvents: res.data.data };
        this.setState(newState);
        //console.log(this.state);
      });
    }

    ///////////////////////////////////////////////////
    // loadDraftedEventsFromServer-> 
    // Loads all drafts from DB into the "draft" tab
    ///////////////////////////////////////////////////
    loadDraftedEventsFromServer = () => {
      axios.get('http://localhost:5000/api/form?status=draft')
      .then(res => {
        //console.log(res.data);
        if (res.data.status == false) {
          // do nothing
          // or show an alert to the user
          return;
        }
        // Load new state
        let newState = {...this.state, draftedEvents: res.data.data };
        this.setState(newState);
        //console.log(this.state);
      });
    }
    
    ///////////////////////////////////////////////////
    // toggle() -> 
    // selects which tab is being used
    ///////////////////////////////////////////////////
    toggle = (tab) => {
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
      }
    }

    ///////////////////////////////////////////////////
    // onClickPost -> 
    // submits the form as a draft event
    // when the user clicks "submit"
    ///////////////////////////////////////////////////
    onClickPost = (postData) => {      
      // Store the state of current data into form
      const submitData = {
        status: 'draft',
        eventName: postData.eventName,
        eventDescription: postData.eventDescription,
        eventDate: postData.eventDate,
        eventTime: postData.eventTime,
        eventLocation: postData.eventLocation,
        eventHost: postData.eventHost,
        eventContact: postData.eventContact
      }

      // Post to DB with the current state
      axios.post('http://localhost:5000/api/form', submitData)
      .then((res) => {
        console.log("Data written to DB: "); // Log data onto console
        console.dir(res);
        if (res.data.status == false) {
          // do nothing
          // or show an alert to the user
          return;
        }
        const form = res.data.data; // Get data from the response
        
        // Create a copy of published and drafted arrays and store
        // Push it to the top of the page
        const newDrafts = this.state.draftedEvents.slice();
        newDrafts.unshift(form);

        this.setState ({ 
          activeTab: this.state.activeTab,
          modal: this.state.modal,
          draftedEvents: newDrafts
        });
      });
    }

    ///////////////////////////////////////////////////
    // onEditedEvent -> 
    // This function updates the event when the user
    // clicks 'update' in editing modal
    ///////////////////////////////////////////////////
    onEditedEvent = (updatedEvent) => {
      console.log("onEditedEvent");
      console.dir(updatedEvent);
      let {eventID, ...eventDict} = updatedEvent;
      // Post to DB with the current state
      axios.post('http://localhost:5000/api/form/update/' + eventID, eventDict)
      .then((res) => {
        console.log("Data written to DB: "); // Log data onto console
        console.dir(res.data);
        const form = res.data.form; // Get data from the response
        
        // Create a copy of published and drafted arrays and store
        // Push it to the top of the page

        if (updatedEvent.status === "published")
        {
          var newPublished = this.state.publishedEvents.slice();
          newPublished[this.state.selectedPublishedIndex] = form;
          this.setState ({ 
            activeTab: this.state.activeTab,
            modal: !this.state.modal,
            draftedEvents: this.state.draftedEvents,
            publishedEvents: newPublished,
            selectedPublishedIndex: -1,
            selectedDraftIndex: this.state.index
          });
          
        }
        else if (updatedEvent.status === "draft")
        {
          var newDrafts = this.state.draftedEvents.slice();
          newDrafts[this.state.selectedDraftIndex] = form;
  
          this.setState ({ 
            activeTab: this.state.activeTab,
            modal: !this.state.modal,
            draftedEvents: newDrafts,
            publishedEvents: this.state.publishedEvents,
            selectedPublishedIndex: this.state.index,
            selectedDraftIndex: -1
          });
        }
      });
    }
    
    ////////////////////////////////////////////////////////////
    // onClickEdit ->
    // Called whenever user clicks 'edit'. 
    // All fields are repopulated with the target event to be 
    // edited
    ////////////////////////////////////////////////////////////
    onClickEdit = (event, index) => {
      console.log ("clicked edit button on event: " );
      console.dir(event); 
      var new_state;
      if (event.status === "published"){
          new_state =  {...this.state,
                        modal: !this.state.modal,
                        selectedPublishedIndex: index,
                        };
          this.setState(new_state);
      }
      else if (event.status === "draft")
      {
        new_state =  {...this.state,
          modal: !this.state.modal,
          selectedDraftIndex: index,
          };
        this.setState(new_state);
      }
    }

    ////////////////////////////////////////////////////////////
    // edit_modal_toggle ->
    // Called whenever user clicks 'edit'. 
    // Toggles the modal to be displayed to screen
    ////////////////////////////////////////////////////////////
    edit_modal_toggle = () => {
      this.setState({
        modal: !this.state.modal,
        selectedDraftIndex: -1,
        selectedPublishedIndex: -1
      });
      console.log("toggle called");
      console.dir(this.state);
    }

    ////////////////////////////////////////////////////
    // onClickDelete ->
    // This function deletes the event from the database
    ////////////////////////////////////////////////////
    onClickDelete = (id) => {
      console.log("onClickDelete: clicked delete with id: "+ id);

      // Post to DB with the current state
      axios.get('http://localhost:5000/api/form/remove/' + id)
      .then((result) => {
        console.log("Successfully deleted");
        console.dir(result.data); // Log data onto console

        // Update arrays of drafts and published events
        const filteredDrafts = this.state.draftedEvents.filter(form => form._id !== id);
        const filteredPublishedEvents = this.state.publishedEvents.filter(form => form._id !== id);
        
        // Update state
        const newState = {...this.state,publishedEvents: filteredPublishedEvents ,draftedEvents: filteredDrafts};

        this.setState(newState);
      })
      .catch(err => {
        console.log(err);
      });
    }

    ////////////////////////////////////////////////////////////
    // moveToPublished ->
    // This function changes the status of the event
    // from "draft" to "published"
    // Occurs when the user clicks on "move to published" button
    ////////////////////////////////////////////////////////////
    moveToPublished = (id) => {
      console.log("clicked publish with id: " + id);
      axios.post('http://localhost:5000/api/form/update/' + id, {status: "published"})
      .then(result => {
        console.log("successfully published:");
        console.dir(result.data);
        console.dir(this.state.draftedEvents);

        const event = result.data.form;
        const filteredDrafts = this.state.draftedEvents.filter(form => form._id !== id);
        const newState = {...this.state, draftedEvents: filteredDrafts};
        newState.publishedEvents.unshift(event);
        this.setState(newState);
        
        console.dir(this.state.draftedEvents);
      })
      .catch (err => {
        console.log( err);
      });
    }

    ////////////////////////////////////////////////////////////
    // moveToDrafts ->
    // This function changes the status of the event
    // from "published" to "draft"
    // Occurs when the user clicks on "move to draft" button
    ////////////////////////////////////////////////////////////
    moveToDrafts = (id) => {
      console.log("clicked 'move to drafts with id: " + id);
      axios.post('http://localhost:5000/api/form/update/' + id, {status: "draft"})
      .then(result => {
        console.log("successfully moved:");
        console.dir(result.data);

        const event = result.data.form;
        const filteredPublishedEvents = this.state.publishedEvents.filter(form => form._id !== id);
        const newState = {...this.state, publishedEvents: filteredPublishedEvents};
        newState.draftedEvents.unshift(event);
        this.setState(newState);
      })
      .catch (err => {
        console.log(err);
      });
    }


  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
    this.props.history.push("/login");
  }

    ///////////////////////////////////////////////////
    // All the rendering of eventManager is here
    ///////////////////////////////////////////////////
    render() {
      return (
        <div className = "body">
        <NavBarTop /> {/*import navigation bar script*/}
        
      {/*the following will display the tabs*/}
      <Nav tabs>
      
      <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '1' })}
            onClick={() => { this.toggle('1'); }}
          >
            Post
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '2' })}
            onClick={() => { this.toggle('2'); }}
          >
            Drafts
          </NavLink>
        </NavItem>
        
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '3' })}
            onClick={() => { this.toggle('3'); }}
          >
            Published
          </NavLink>
        </NavItem>
      </Nav>

      {/*The following will handle what happens when we click it*/}
      <TabContent activeTab={this.state.activeTab}>

        {/*Will POST new events through a form*/}
        <TabPane tabId="1" style = {{paddingLeft: 100}} className = "form">
          <Row>
            <Col sm="10" style = {{paddingTop: 35}}>
                <EventForm
                        status = {'draft'}
                        onPostSubmit = {this.onClickPost}
                />
            </Col>
          </Row>
        </TabPane>
      
        {/*Will show DRAFTS which will have list of events
                    saved but not published.
                    Each events panel will have buttons to publish or 
                    edit*/}
        <TabPane tabId="2" >
            <Col sm="12" style = {{paddingTop: 10}}> 
                {this.state.draftedEvents.map( (event, index) => (
                  <Card body className="text-center" key={event._id}>
                    <CardTitle>{event.eventName}</CardTitle>
                    <CardText>{event.eventDescription}</CardText>
                      
                      <div className = "button_center">
                        <Button color="primary" onClick = {()=>this.moveToPublished(event._id)}>Move to Published events</Button> {' '}
                        <Button color="secondary" onClick = {()=>this.onClickEdit(event, index)}>Edit</Button> {' '}
                              <div className="modal">
                              <Modal isOpen={ this.state.modal && index === this.state.selectedDraftIndex } toggle={this.edit_modal_toggle}>
                                <ModalHeader toggle={this.edit_modal_toggle}>Edit your event</ModalHeader>
                                <ModalBody>
                                    <div>
                                      <EventForm // Call the event form component for editing
                                                isEditing = {true}
                                                status = {event.status}
                                                eventID = {event._id}
                                                eventName = {event.eventName}
                                                eventDescription = {event.eventDescription}
                                                eventDate = {event.eventDate}
                                                eventTime = {event.eventTime}
                                                eventLocation = {event.eventLocation}
                                                eventHost = {event.eventHost}
                                                eventContact = {event.eventContact}
                                                
                                                onEditEvent={this.onEditedEvent}
                                                />
                                  </div>
                                </ModalBody>
                              </Modal>
                              </div>
                        <Button color="danger" onClick = {()=>this.onClickDelete(event._id)}>Delete</Button>
                      </div>
                  </Card>
                ))}
            </Col>
        </TabPane>

        {/*Will show PUBLISHED events i.e. events shown on announcements page*/}
        <TabPane tabId="3">
        <Col sm="12" style = {{paddingTop: 10}}>
          {this.state.publishedEvents.map( (event, index) => ( 
            <Card body className="text-center" key={event._id}>
              <CardTitle>{event.eventName}</CardTitle>
              <CardText>{event.eventDescription}</CardText>

              <div className = "button_center">
                <Button color="primary" onClick = {()=>this.moveToDrafts(event._id)}>Move to Drafts</Button> {' '}
                <Button color="secondary" onClick = {()=>this.onClickEdit(event, index)}>Edit</Button> {' '}
                  <div className="modal">
                  <Modal isOpen={ this.state.modal && index === this.state.selectedPublishedIndex } toggle={this.edit_modal_toggle}>
                    <ModalHeader toggle={this.edit_modal_toggle}>Edit your event</ModalHeader>
                    <ModalBody>
                        <div>
                        <EventForm // call the event form component for editing
                                  isEditing = {true}
                                  status = {event.status}
                                  eventID = {event._id}
                                  eventName = {event.eventName}
                                  eventDescription = {event.eventDescription}
                                  eventDate = {event.eventDate}
                                  eventTime = {event.eventTime}
                                  eventLocation = {event.eventLocation}
                                  eventHost = {event.eventHost}
                                  eventContact = {event.eventContact}
                                  
                                  onEditEvent={this.onEditedEvent}
                                  />
                      </div>
                    </ModalBody>
                  </Modal>
                  </div>
                <Button color="danger" onClick = {()=>this.onClickDelete(event._id)}>Delete</Button>
              </div>
            </Card>
        ))}
        </Col>
        </TabPane>
      </TabContent>
    </div>
      );
    }
  }
