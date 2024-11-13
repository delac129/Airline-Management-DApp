import React, { Component } from "react";
import { Grid, Form, Input, Segment, Message, Card, Button } from "semantic-ui-react";
import management from "../ethereum/management";
import Layout from "../components/Layout";
import { Link } from "../routes";

class CampaignIndex extends Component {
  state = {
    destination: "",
    month: "",
    travelClass: "",
    roundTrip: false,  // Added state for round trip
    errorMessage: "",
  };

  onSubmit = (event) => {
    event.preventDefault();
    
    // Validate that all fields are filled
    if (!this.state.destination || !this.state.month || !this.state.travelClass) {
      this.setState({ errorMessage: "All fields are required!" });
      return;
    }

    // Reset error message
    this.setState({ errorMessage: "" });

    // Handle submit logic here
    console.log("Form submitted with:", this.state.destination, this.state.month, this.state.travelClass, this.state.roundTrip);
  };

  render() {
    const { destination, month, travelClass, roundTrip, errorMessage } = this.state;
    const backgroundImageUrl = "./SpongePlane.webp"; 

    return (
      <Layout>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            {/* Left Column: Text boxes for inputs */}
            <Grid.Column width={8}>
              <h3>Book Flight</h3>
              <Form onSubmit={this.onSubmit} error={!!errorMessage}>
                <Form.Field>
                  <label>Select Destination</label>
                  <Input
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => this.setState({ destination: e.target.value })}
                  />
                </Form.Field>

                <Form.Field>
                  <label>Select Month</label>
                  <Input
                    placeholder="Enter month"
                    value={month}
                    onChange={(e) => this.setState({ month: e.target.value })}
                  />
                </Form.Field>

                <Form.Field>
                  <label>Select Class</label>
                  <Input
                    placeholder="Enter class (e.g., Economy, Business)"
                    value={travelClass}
                    onChange={(e) => this.setState({ travelClass: e.target.value })}
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
                  disabled={!destination || !month || !travelClass} // Disable until all fields are filled
                >
                  Check Price
                </Button>

                <Button
                  primary
                  style={{ marginTop: "10px" }}
                  disabled={!destination || !month || !travelClass} // Disable until all fields are filled
                >
                  Book Now
                </Button>
              </Form>
            </Grid.Column>

            {/* Right Column: Empty box for Available Destinations */}
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
                  {/* This will be filled dynamically in the future */}
                  <p>No destinations available yet...</p>
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
