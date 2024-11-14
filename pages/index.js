import React, { Component } from "react";
import { Grid, Form, Input, Segment, Message, Button, Dropdown } from "semantic-ui-react";
import management from "../ethereum/management";
import web3 from "../ethereum/web3";
import Layout from "../components/Layout";
import { Link } from "../routes";

class CampaignIndex extends Component {
  state = {
    destination: "",     // Stores the destination (string)
    monthIndex: "",      // Stores the selected month index (0-11)
    travelClassIndex: "", // Stores the selected travel class index (0: Economy, 1: Business, 2: First Class)
    roundTrip: false,    // Added state for round trip
    errorMessage: "",
    destinations: [],    // Array to store available destinations
  };

  // Fetch destinations when the component mounts
  async componentDidMount() {
    // Get the total number of destinations from the contract
    const totalDestinations = await management.methods.count().call(); 
    const destinations = [];
    
    // Loop through all the destinations and fetch each one
    for (let i = 0; i < totalDestinations; i++) {
      const destination = await management.methods.destinations(i).call(); // Get destination by index
      
      destinations.push(destination);
    }

    // Update state with the fetched destinations
    this.setState({ destinations });
  }

  onSubmit = (event) => {
    event.preventDefault();
    
    // Validate that all fields are filled
    if (!this.state.destination || this.state.monthIndex === "" || this.state.travelClassIndex === "" || !this.state.travelClass) {
      this.setState({ errorMessage: "All fields are required!" });
      return;
    }

    // Reset error message
    this.setState({ errorMessage: "" });

    // Handle submit logic here
    console.log("Form submitted with:", this.state.destination, this.state.monthIndex, this.state.travelClassIndex, this.state.roundTrip);
  };

  handleMonthChange = (e, { value }) => {
    // Set the month index in state when a month is selected
    this.setState({ monthIndex: value });
  };

  handleClassChange = (e, { value }) => {
    // Set the travel class index in state when a class is selected
    this.setState({ travelClassIndex: value });
  };

  getMonthName(index) {
    // Helper method to convert index to month name
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    return months[index];
  }

  render() {
    const { destination, monthIndex, travelClassIndex, roundTrip, errorMessage, destinations } = this.state;

    // Dropdown options for months (January = index 0, December = index 11)
    const monthOptions = [
      { key: 0, text: "January", value: 0 },
      { key: 1, text: "February", value: 1 },
      { key: 2, text: "March", value: 2 },
      { key: 3, text: "April", value: 3 },
      { key: 4, text: "May", value: 4 },
      { key: 5, text: "June", value: 5 },
      { key: 6, text: "July", value: 6 },
      { key: 7, text: "August", value: 7 },
      { key: 8, text: "September", value: 8 },
      { key: 9, text: "October", value: 9 },
      { key: 10, text: "November", value: 10 },
      { key: 11, text: "December", value: 11 },
    ];

    // Dropdown options for travel class (Economy = index 0, Business = index 1, First Class = index 2)
    const classOptions = [
      { key: 0, text: "Economy", value: 0 },
      { key: 1, text: "Business", value: 1 },
      { key: 2, text: "First Class", value: 2 },
    ];

    return (
      <Layout>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            {/* Left Column: Text boxes for inputs */}
            <Grid.Column width={8}>
              <h3>Book Flight</h3>
              <Form onSubmit={this.onSubmit} error={!!errorMessage}>
                
                {/* Select Destination Text Box */}
                <Form.Field>
                  <label>Select Destination</label>
                  <Input
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => this.setState({ destination: e.target.value })}
                  />
                </Form.Field>

                {/* Dropdown for Select Month */}
                <Form.Field>
                  <label>Select Month</label>
                  <Dropdown
                    placeholder="Select Month"
                    fluid
                    selection
                    options={monthOptions}
                    value={monthIndex}
                    onChange={this.handleMonthChange}
                  />
                </Form.Field>

                {/* Dropdown for Select Class */}
                <Form.Field>
                  <label>Select Class</label>
                  <Dropdown
                    placeholder="Select Class"
                    fluid
                    selection
                    options={classOptions}
                    value={travelClassIndex}
                    onChange={this.handleClassChange}
                  />
                </Form.Field>

                {/* Round Trip Checkbox */}
                <Form.Field>
                  <Form.Checkbox
                    label="Round Trip"
                    checked={roundTrip}
                    onChange={() => this.setState({ roundTrip: !roundTrip })}
                  />
                </Form.Field>

                {errorMessage && <Message error content={errorMessage} />}

                {/* Buttons */}
                <Button
                  primary
                  type="submit"
                  disabled={!destination || monthIndex === "" || travelClassIndex === ""} // Disable until all fields are filled
                >
                  Check Price
                </Button>

                <Button
                  primary
                  style={{ marginTop: "10px" }}
                  disabled={!destination || monthIndex === "" || travelClassIndex === ""} // Disable until all fields are filled
                >
                  Book Now
                </Button>
              </Form>
            </Grid.Column>

            {/* Right Column: Display Available Destinations */}
            <Grid.Column width={8}>
              <Segment style={{ height: "100%", padding: "20px" }}>
                <h4>Available Destinations</h4>
                <div
                  style={{
                    height: "200px",
                    border: "1px solid #ddd",
                    textAlign: "center",
                    paddingTop: "50px",
                    color: "#aaa",
                  }}
                >
                  {/* Dynamically display destinations */}
                  {destinations.length > 0 ? (
                    <ul>
                      {destinations.map((destination, index) => (
                        <li key={index}>{destination}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No destinations available yet...</p>
                  )}
                </div>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {/* Manager Access Button */}
        <Link route="/campaigns/new">
          <a>
            <Button
              floated="right"
              content="Manager Access"
              icon="lock"
              primary
            />
          </a>
        </Link>
      </Layout>
    );
  }
}

export default CampaignIndex;
