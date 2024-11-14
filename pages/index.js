import React, { Component } from "react";
import { Grid, Form, Input, Segment, Message, Button, Dropdown } from "semantic-ui-react";
import management from "../ethereum/management";
import web3 from "../ethereum/web3";
import Layout from "../components/Layout";
import { Link, Router } from "../routes";

class CampaignIndex extends Component {
  state = {
    destination: "",     // Stores the destination (string)
    monthIndex: "",      // Stores the selected month index (0-11)
    travelClassIndex: "", // Stores the selected travel class index (0: Economy, 1: Business, 2: First Class)
    roundTrip: false,    // Added state for round trip
    errorMessage: "",    // Error message state
    price: null,          // State to store the calculated price in wei
    destinations: [],    // Array to store available destinations
    loading: false,      // Added loading state for transaction
    isManager: false,    // State to track if the user is the manager
  };

  // Manager's address
  managerAddress = "0x8B76333F7AE33F5f998989EBBE7d1A3479Bc417E";

  // Fetch destinations when the component mounts
  async componentDidMount() {
    try {
      const totalDestinations = await management.methods.count().call();
      const destinations = [];
    
      for (let i = 0; i < totalDestinations; i++) {
        const destination = await management.methods.destinations(i).call();
        destinations.push(destination);
      }

      this.setState({ destinations });
    } catch (error) {
      console.error("Error fetching destinations:", error);
      this.setState({ errorMessage: "Failed to load destinations." });
    }
  }

  // Handle form submission (on "Check Price" button)
  onCheckPrice = async (event) => {
    event.preventDefault();
  
    const { destination, monthIndex, travelClassIndex, roundTrip, destinations } = this.state;
  
    if (!destination || monthIndex === "" || travelClassIndex === "") {
      this.setState({ errorMessage: "All fields are required!" });
      return;
    }
  
    if (!destinations.includes(destination)) {
      this.setState({
        errorMessage: "The entered destination is not available.",
        price: null,
      });
      return;
    }
  
    this.setState({ errorMessage: "", price: null });
  
    try {
      const priceInWei = await management.methods
        .getPrice(destination, monthIndex + 1, travelClassIndex + 1, roundTrip)
        .call();
  
      this.setState({ price: priceInWei });
    } catch (error) {
      console.error("Error fetching price:", error);
      this.setState({ errorMessage: "Failed to fetch price." });
    }
  };

  // Handle month dropdown change
  handleMonthChange = (e, { value }) => {
    this.setState({ monthIndex: value });
  };

  // Handle class dropdown change
  handleClassChange = (e, { value }) => {
    this.setState({ travelClassIndex: value });
  };

  onBookNow = async (event) => {
    event.preventDefault();
  
    const { destination, monthIndex, travelClassIndex, roundTrip, price, destinations } = this.state;
  
    if (!destination || monthIndex === "" || travelClassIndex === "" || price === null) {
      this.setState({ errorMessage: "All fields are required!", price: null });
      return;
    }
  
    if (!destinations.includes(destination)) {
      this.setState({
        errorMessage: "The entered destination is not available.",
        price: null,
      });
      return;
    }
  
    this.setState({ errorMessage: "", loading: true });
  
    try {
      const accounts = await web3.eth.getAccounts();
  
      await management.methods
        .bookFlight(destination, monthIndex + 1, travelClassIndex + 1, roundTrip)
        .send({
          from: accounts[0],
          value: price,
        });
  
      this.setState({ loading: false, errorMessage: "", price: null });
      alert("Flight booked successfully!");
    } catch (error) {
      console.error("Error booking flight:", error);
      this.setState({
        errorMessage: "Failed to book the flight. Please try again.",
        loading: false,
        price: null,
      });
    }
  };

  // Handle Manager Access Button click
  handleManagerAccess = async () => {
    const accounts = await web3.eth.getAccounts();
    const currentAccount = accounts[0];

    if (currentAccount.toLowerCase() !== this.managerAddress.toLowerCase()) {
      this.setState({ errorMessage: "You must be the manager to access this page." });
    } else {
      Router.pushRoute('/campaigns/new');
    }
  };

  render() {
    const { destination, monthIndex, travelClassIndex, roundTrip, errorMessage, price, destinations, loading } = this.state;

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

    const classOptions = [
      { key: 0, text: "Economy", value: 0 },
      { key: 1, text: "Business", value: 1 },
      { key: 2, text: "First Class", value: 2 },
    ];

    return (
      <Layout>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column width={8}>
              <h3>Book Flight</h3>
              <Form onSubmit={this.onCheckPrice} error={!!errorMessage}>
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
                  <Dropdown
                    placeholder="Select Month"
                    fluid
                    selection
                    options={monthOptions}
                    value={monthIndex}
                    onChange={this.handleMonthChange}
                  />
                </Form.Field>

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

                <Form.Field>
                  <Form.Checkbox
                    label="Round Trip"
                    checked={roundTrip}
                    onChange={() => this.setState({ roundTrip: !roundTrip })}
                  />
                </Form.Field>

                <Button
                  primary
                  type="submit"
                  disabled={!destination || monthIndex === "" || travelClassIndex === ""}
                >
                  Check Price
                </Button>

                <Button
                  primary
                  style={{ marginTop: "10px" }}
                  onClick={this.onBookNow}
                  loading={loading}
                  disabled={!destination || monthIndex === "" || travelClassIndex === "" || !price}
                >
                  Book Now
                </Button>
              </Form>

              {price !== null && (
                <Message success content={`The price for your selected flight is: ${price} Wei`} />
              )}
            </Grid.Column>

            <Grid.Column width={8}>
              <Segment style={{ height: "100%", padding: "20px" }}>
                <h4>Available Destinations</h4>
                <div style={{ height: "200px", overflowY: "scroll", paddingRight: "20px" }}>
                  {destinations.length > 0 ? (
                    <Grid>
                      {destinations.map((destination, index) => (
                        <Grid.Row key={index}>
                          <Grid.Column width={16}>
                            <p>{destination}</p>
                          </Grid.Column>
                        </Grid.Row>
                      ))}
                    </Grid>
                  ) : (
                    <p>No destinations available yet...</p>
                  )}
                </div>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Button
          floated="right"
          content="Manager Access"
          icon="lock"
          primary
          onClick={this.handleManagerAccess}
          style={{ marginBottom: "20px" }}
        />

        {errorMessage && (
          <Message
            error
            content={errorMessage}
            style={{
              position: "fixed",
              bottom: "50px", // 50px from the bottom
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              margin: 0,
              width: "90%", // Adjust width
              maxWidth: "500px", // Max width for better responsiveness
            }}
          />
        )}
      </Layout>
    );
  }
}

export default CampaignIndex;
