import React from 'react';
import { Col, Button, Form, FormGroup, Label, Input, Media, ButtonGroup, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import "./announcementsPage.css"

export default class EventManager extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        activeTab: '1',
        
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
    }

    toggle = (tab) => {
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
      }
    }

    onChange_eventName = (e) => {
      this.setState({
        eventName: e.target.value,
      });
    }

    onChange_eventDescription = (e) => {
      this.setState({
        eventDescription: e.target.value,
      });
    } 
    onChange_eventDate= (e) => {
      this.setState({
        eventDate: e.target.value,
      });
    } 
    
    onChange_eventTime = (e) => {
      this.setState({
        eventTime: e.target.value,
      });
    } 

    onChange_eventLocation = (e) => {
      this.setState({
        eventLocation: e.target.value,
      });
    }

    onChange_eventHost = (e) => {
      this.setState({
        eventHost: e.target.value,
      });
    }

    onChange_eventContact = (e) => {
      this.setState({
        eventContact: e.target.value,
      });
    }

    // when user clicks submit in post tab
    onClickPost = (e) => {
      e.preventDefault(); // Prevent reloading page 

      // Store the state of current data into form
      const submitData = {
        isPublished: false,
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
        console.log(res.data); // Log data onto console

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

    // when user clicks publish in Drafts tab
    onClickPublish = (id) => {
      console.log("clicked publish with id: " + id);
      axios.post('http://localhost:5000/api/form/update/' + id, {status: "published"})
      .then(result => {
        console.log("successfully published:");
        console.dir(result.data);

        const event = result.data.form;
        const filteredDrafts = this.state.draftedEvents.filter(form => form._id != id);
        const newState = {...this.state, draftedEvents: filteredDrafts};
        newState.publishedEvents.unshift(event);
        this.setState(newState);
      })
      .catch (err => {
        console.log("error publishing with:" + err);
      });


    } // End onClickPublish

    // Clear form when user hits "clear" in form
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
    }

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

    render() {
      return (
        <div className>
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
                Publish
              </NavLink>
            </NavItem>
          </Nav>


          {/*The following will handle what happens when we click it*/}
          <TabContent activeTab={this.state.activeTab}>

            {/*Will POST new events through a form*/}
            <TabPane tabId="1" style = {{paddingLeft: 100}}>
              <Row>
                <Col sm="10">
                  <h4 align = "center" style = {{paddingTop: 5}}>Post New announcements</h4> <br></br>

                  <Form>
                  <FormGroup row>
                    <Label for="EventName" sm={2}>Event Name</Label>
                    <Col sm={10}>
                      <Input type="text" value={this.state.eventName} onChange={this.onChange_eventName}name="EventName" id="EventName" placeholder="fundraiser" />
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
                      <Button color = "success" onClick={this.onClickClear}block> Post </Button>
                      <Button color = "danger" onClick={this.onClickPost}block> Clear </Button>
                      </Col>
                    </Col>
                  </FormGroup>
                 

                  
                  </Form>     
                  </Col>
              </Row>
            </TabPane>
          
            {/*Will show DRAFTS which will have list of events
                        saved but not published.
                        Each events panel will have buttons to publish or 
                        edit*/}
            <TabPane tabId="2" >
              <Row>
                <Col sm="12" style = {{paddingTop: 10}}> 

                    {this.state.draftedEvents.map((event) => (  
                      <Card body>
                        <CardTitle>{event.eventName}</CardTitle>
                        <CardText>{event.eventDescription}</CardText>
                        <ButtonGroup>
                            <Button color="primary" onClick = {()=>this.onClickPublish(event._id)}>Publish</Button>
                            <Button color="secondary">Edit</Button>
                            <Button color="danger">Delete</Button>
                        </ButtonGroup>
                      </Card>
                    ))}
                </Col>
              </Row>
            </TabPane>
            
            {/*Will show PUBLISHED events i.e. events shown on announcements page*/}
            <TabPane tabId="3">
            {this.state.publishedEvents.map( (event) => (
              <Card body className="text-center">
                <CardTitle>{event.eventName}</CardTitle>
                <CardText>{event.eventDescription}</CardText>
              </Card>
            ))}

            </TabPane>

          </TabContent>
        </div>
      );
    }
  }