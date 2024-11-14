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
    price: null,          // State to store the calculated price in wei
    destinations: [],    // Array to store available destinations
    loading: false,      // Added loading state for transaction
  };

  // Fetch destinations when the component mounts
  async componentDidMount() {
    try {
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
    } catch (error) {
      console.error("Error fetching destinations:", error);
      this.setState({ errorMessage: "Failed to load destinations." });
    }
  }

  // Handle form submission (on "Check Price" button)
  onCheckPrice = async (event) => {
    event.preventDefault();
  
    const { destination, monthIndex, travelClassIndex, roundTrip, destinations } = this.state;
  
    // Validate that all fields are filled
    if (!destination || monthIndex === "" || travelClassIndex === "") {
      this.setState({ errorMessage: "All fields are required!" });
      return;
    }
  
    // Check if the destination exists in the list of available destinations
    if (!destinations.includes(destination)) {
      this.setState({
        errorMessage: "The entered destination is not available.",
        price: null, // Clear the price if destination is invalid
      });
      return;
    }
  
    // Reset error message and price state if the destination is valid
    this.setState({ errorMessage: "", price: null });
  
    try {
      // Call getPrice from the contract
      const priceInWei = await management.methods
        .getPrice(destination, monthIndex + 1, travelClassIndex + 1, roundTrip)
        .call();
  
      // Update the price state with the returned value (price in wei)
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
  
    // Validate that all fields are filled
    if (!destination || monthIndex === "" || travelClassIndex === "" || price === null) {
      this.setState({ errorMessage: "All fields are required!", price: null }); // Clear price
      return;
    }
  
    // Check if the destination exists in the list of available destinations
    if (!destinations.includes(destination)) {
      this.setState({
        errorMessage: "The entered destination is not available.",
        price: null, // Clear the price if the destination is invalid
      });
      return;
    }
  
    // Reset error message and set loading state
    this.setState({ errorMessage: "", loading: true });
  
    try {
      const accounts = await web3.eth.getAccounts();
  
      // Call bookFlight from the contract (paying the price in wei)
      await management.methods
        .bookFlight(destination, monthIndex + 1, travelClassIndex + 1, roundTrip)
        .send({
          from: accounts[0],
          value: price, // Sending the price (in wei) to complete the transaction
        });
  
      // On success, reset loading state and show success message
      this.setState({ loading: false, errorMessage: "", price: null });
      alert("Flight booked successfully!");
    } catch (error) {
      console.error("Error booking flight:", error);
      this.setState({
        errorMessage: "Failed to book the flight. Please try again.",
        loading: false,
        price: null, // Clear price if there is an error
      });
    }
  };
  


  render() {
    const { destination, monthIndex, travelClassIndex, roundTrip, errorMessage, price, destinations, loading } = this.state;

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
              <Form onSubmit={this.onCheckPrice} error={!!errorMessage}>
                
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
                  onClick={this.onBookNow}
                  loading={loading} // Show loading indicator while booking
                  disabled={!destination || monthIndex === "" || travelClassIndex === "" || !price} // Disable until all fields are filled and price is fetched
                >
                  Book Now
                </Button>
              </Form>

              {/* Display Price if available */}
              {price !== null && (
                <Message
                  success
                  content={`The price for your selected flight is: ${price} Wei`}
                />
              )}
            </Grid.Column>

            {/* Right Column: Display Available Destinations */}
            <Grid.Column width={8}>
              <Segment style={{ height: "100%", padding: "20px" }}>
                <h4>Available Destinations</h4>
                <div style={{ height: "200px", overflowY: "scroll", paddingRight: "20px" }}>
                  {/* Dynamically display destinations */}
                  {destinations.length > 0 ? (
                    <Grid>
                      {destinations.map((destination, index) => (
                        <Grid.Row key={index}>
                          <Grid.Column width={16}>
                            {/* Destination Name */}
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

        {/* Manager Access Button */}
        <Link route="/campaigns/new">
          <a>
            <Button floated="right" content="Manager Access" icon="lock" primary />
          </a>
        </Link>
      </Layout>
    );
  }
}

export default CampaignIndex;

