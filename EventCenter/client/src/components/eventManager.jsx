//TODO: 
// 1. form doesnt automatically clear when we hit submit
// 2. When we hit clear, the page reloads

import React from 'react';
import { Col, Button, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Modal, ModalHeader , ModalFooter, ModalBody} from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import "./announcementsPage.css"
import "./announcementsPage"
import "./form"
import EventForm from './form';


export default class EventManager extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        activeTab: '1',
        modal: false,
        
        status: 'draft',
        eventName: '',
        eventDescription: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        eventHost: '',
        eventContact: '',

        publishedEvents: [],
        draftedEvents: []
      };
    };

    componentDidMount = () => {
      console.log("componentDidMount");
      this.loadPublishedEventsFromServer();
      this.loadDraftedEventsFromServer();
    }
  
    loadPublishedEventsFromServer = () => {
      axios.get('http://localhost:5000/api/form?status=published')
      .then(res => {
        console.log(res.data);

        // Load new state
        let newState = {...this.state, publishedEvents: res.data.data };
        this.setState(newState);
        console.log(this.state);
      });
    }

    loadDraftedEventsFromServer = () => {
      axios.get('http://localhost:5000/api/form?status=draft')
      .then(res => {
        console.log(res.data);

        // Load new state
        let newState = {...this.state, draftedEvents: res.data.data };
        this.setState(newState);
        console.log(this.state);
      });
    }
    
    toggle = (tab) => {
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
      }
    }

    edit_modal_toggle = () => {
      this.setState({
        modal: !this.state.modal
      });
    }

    ///////////////////////////////////////////////////
    // This function submits the form as a draft event
    // when the user clicks "submit"
    ///////////////////////////////////////////////////
    onClickPost = (e) => {
      e.preventDefault(); // Prevent reloading page 
      console.log(e);
      // Store the state of current data into form
      const submitData = {
        status: 'draft',
        eventName: this.state.eventName,
        eventDescription: this.state.eventDescription,
        eventDate: this.state.eventDate,
        eventTime: this.state.eventTime,
        eventLocation: this.state.eventLocation,
        eventHost: this.state.eventHost,
        eventContact: this.state.eventContact,
      }

      // Post to DB with the current state
      axios.post('http://localhost:5000/api/form', submitData)
      .then((res) => {
        console.log("Data written to DB: " + res.data); // Log data onto console

        const form = res.data.data; // Get data from the response
        
        // Create a copy of published and drafted arrays and store
        // Push it to the top of the page
        const newPublished = this.state.publishedEvents.slice();  
        newPublished.unshift(form); 

        const newDrafts = this.state.draftedEvents.slice();
        newDrafts.unshift(form);

        this.setState ({   
          status: 'draft',     
          eventName: '',
          eventDescription: '',
          eventDate: '',
          eventTime: '',
          eventLocation: '',
          eventHost: '',
          eventContact: '',
  
          publishedEvents: newPublished,
          draftedEvents: newDrafts
        });
      });
    } // End onClickPost

    ////////////////////////////////////////////////////////////
    // This function clears the event 
    // when user clicks "clear" on the form
    ////////////////////////////////////////////////////////////
    onClickClear = () => {
      this.setState ({   
        status: 'draft',     
        eventName: '',
        eventDescription: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        eventHost: '',
        eventContact: '',

        publishedEvents: [],
        draftedEvents: []
      })
    } // End onClickClear
    
    ////////////////////////////////////////////////////////////
    // This function edits the event
    // Occurs when the user clicks on 'edit'
    ////////////////////////////////////////////////////////////
    editEvent = (event) => {
      console.log ("clicked edit button on event: " );
      console.log(event.eventName);

      // Repopulate form
      const new_state = {...this.state,
                         status: this.state.status,
                         eventName: this.state.eventName,
                         eventDescription: this.state.eventDescription,
                         eventDate: this.state.eventDate,
                         eventTime: this.state.eventTime,
                         eventLocation: this.state.eventLocation,
                         eventHost: this.state.eventHost,
                         eventContact: this.state.eventContact,

                         publishedEvents: this.state.publishedEvents,
                         draftedEvents: this.state.draftedEvents
                         };
        this.setState(new_state);
    } // End editEvent

    ////////////////////////////////////////////////////
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
    } // End onClickDelete

    ////////////////////////////////////////////////////////////
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
    } // End onClickPublish

    ////////////////////////////////////////////////////////////
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
    } // End moveToDrafts

    ///////////////////////////////////////////////////
    // Functions to set the state for the form fields
    ///////////////////////////////////////////////////
    onChange_eventName = (e)=>{
      this.setState({eventName: e });
    }

    onChange_eventDescription = (e)=>{
      this.setState({eventDescription: e });
    }

    onChange_eventDate = (e)=>{
      this.setState({eventDate: e });
    }
    
    onChange_eventTime = (e)=>{
      this.setState({eventTime: e });
    }
    
    onChange_eventLocation = (e)=>{
      this.setState({eventLocation: e });
    }

    onChange_eventHost = (e)=>{
      this.setState({eventHost: e });
    }

    onChange_eventContact = (e)=>{
      this.setState({eventContact: e });
    }

    ///////////////////////////////////////////////////
    // All the rendering of eventManager is here //////
    ///////////////////////////////////////////////////
    render() {
      return (
        <div >
                <Nav className = "NavBar">
                <h1 align = "center">Event Manager Page</h1>
                <NavItem>
                    <NavLink activestyle = {{
                    fontWeight: "bold", 
                    color: "white" 
                    }}
                    >Home
                    </NavLink>
                </NavItem>
                
                <NavItem>
                    <NavLink activestyle = {{
                    fontWeight: "bold", 
                    color: "white" 
                    }}
                    >Event Manager
                    </NavLink> 
                </NavItem>
                </Nav>

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
                <Col sm="10">
                  <h4 align = "center" style = {{paddingTop: 5}}>Post New announcements</h4> <br></br>
                    <EventForm postEvent = {(e) => this.onClickPost(e)}  clearEvent = {() => this.onClickClear()}
                               onEventNameChange = {this.state.onChange_eventName}
                               onEventDescriptionChange = {this.onChange_eventDescription}
                               onEventDateChange = {this.onChange_eventDate}
                               onEventTimeChange = {this.onChange_eventTime}
                               onEventLocationChange = {this.onChange_eventLocation}
                               onEventHostChange = {this.onChange_eventHost}
                               onEventContactChange = {this.onChange_eventContact}
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
                    {this.state.draftedEvents.map( (event) => (
                      <Card body className="text-center" key={event._id}>
                        <CardTitle>{event.eventName}</CardTitle>
                        <CardText>{event.eventDescription}</CardText>
                         
                          <div className = "button_center">
                            <Button color="primary" onClick = {()=>this.moveToPublished(event._id)}>Move to Published events</Button> {' '}
                            <Button color="secondary" onClick = {() => this.edit_modal_toggle()}>Edit</Button> {' '}
                                  <div className="modal">
                                  <Modal isOpen={this.state.modal} toggle={this.edit_modal_toggle}>
                                    <ModalHeader toggle={this.edit_modal_toggle}>Edit your event</ModalHeader>
                                    <ModalBody>
                                       <div>
                                         <EventForm postEvent = {(e) => this.editEvent(e)}  clearEvent = {() => this.onClickClear()}
                                                    event = {event.eventName}
                                                    onEventNameChange = {this.onChange_eventName}
                                                    onEventDescriptionChange = {this.onChange_eventDescription}
                                                    onEventDateChange = {this.onChange_eventDate}
                                                    onEventTimeChange = {this.onChange_eventTime}
                                                    onEventLocationChange = {this.onChange_eventLocation}
                                                    onEventHostChange = {this.onChange_eventHost}
                                                    onEventContactChange = {this.onChange_eventContact}
                                                    />/>
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
              {this.state.publishedEvents.map( (event) => ( 
                <Card body className="text-center" key={event._id}>
                  <CardTitle>{event.eventName}</CardTitle>
                  <CardText>{event.eventDescription}</CardText>

                  <div className = "button_center">
                    <Button color="primary" onClick = {()=>this.moveToDrafts(event._id)}>Move to Drafts</Button> {' '}
                    <Button color="secondary">Edit</Button> {' '}
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
