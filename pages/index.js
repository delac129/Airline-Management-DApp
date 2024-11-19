import React, { Component } from "react";
import { Grid, Form, Input, Segment, Message, Button, Dropdown } from "semantic-ui-react";
import management from "../ethereum/management";
import web3 from "../ethereum/web3";
import Layout from "../components/Layout";
import { Router } from "../routes";
import Image from 'next/image';

import logo from '../assets/download.png';

class CampaignIndex extends Component {
  state = {
    destination: "",     
    monthIndex: "",      
    travelClassIndex: "", 
    roundTrip: false,    
    errorMessage: "",    
    price: null,          
    destinations: [],    
    seatsLeft: [],       
    loading: false,      
    isManager: false,    
    userTypeMessage: "",  // Add state to store the user type message
  };

  managerAddress = "0x8B76333F7AE33F5f998989EBBE7d1A3479Bc417E";  // Hardcoded manager address

  async componentDidMount() {
    try {
      const accounts = await web3.eth.getAccounts();
      
      // Check if the logged-in address matches the manager address
      const userTypeMessage = (accounts[0] === this.managerAddress) 
        ? "Ceo is logged in" 
        : "Customer is logged in";
      
      // Set the state with the message
      this.setState({ userTypeMessage });

      // Fetch destinations and seats information
      const totalDestinations = await management.methods.count().call();
      const destinations = [];
      const seatsLeft = [];

      for (let i = 0; i < totalDestinations; i++) {
        const destination = await management.methods.destinations(i).call();
        const seats = await management.methods.seats(i).call();
        destinations.push(destination);
        seatsLeft.push(seats.toString()); 
      }

      this.setState({ destinations, seatsLeft });
    } catch (error) {
      console.error("Error fetching destinations:", error);
      this.setState({ errorMessage: "Failed to load destinations." });
    }
  }

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

  handleMonthChange = (e, { value }) => {
    this.setState({ monthIndex: value });
  };

  handleClassChange = (e, { value }) => {
    this.setState({ travelClassIndex: value });
  };

  onBookNow = async (event) => {
    event.preventDefault();

    const { destination, monthIndex, travelClassIndex, roundTrip, price, destinations, seatsLeft } = this.state;

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

      const destinationIndex = destinations.indexOf(destination);
      const updatedSeats = parseInt(seatsLeft[destinationIndex]) - 1;

      const updatedSeatsFromContract = await management.methods.seats(destinationIndex).call();

      this.setState((prevState) => {
        const newSeatsLeft = [...prevState.seatsLeft];
        newSeatsLeft[destinationIndex] = updatedSeatsFromContract.toString(); 
        return { 
          loading: false, 
          errorMessage: "", 
          price: null,
          seatsLeft: newSeatsLeft, 
        };
      });

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

  handleManagerAccess = async () => {
    const accounts = await web3.eth.getAccounts();

    let isCeo = false;
    try {
      isCeo = await management.methods.isCeo(accounts[0]).call();
    } catch (error){} 
    

    if (!isCeo) {
      this.setState({ errorMessage: "You must be the manager to access this page." });
    } else {
      Router.pushRoute('/campaigns/new');
    }
  };

  render() {
    const { destination, monthIndex, travelClassIndex, roundTrip, errorMessage, price, destinations, seatsLeft, loading, userTypeMessage } = this.state;

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
        {/* Display the user type message at the top of the page */}
        <div style={{ textAlign: "center", fontSize: "1.2rem", margin: "10px 0", fontWeight: "bold" }}>
          {userTypeMessage}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
          <Image
            src={logo}
            alt="Logo"
            height={225}
            width={225}
          />

          <div style={{ fontSize: '4rem', fontWeight: 'bold', marginLeft: '20px', color: '#333' }}>
            Wi-Fly Airlines
          </div>
        </div>

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
                            <p>{destination} - {seatsLeft[index]} seats left</p>
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
              bottom: "50px", 
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              margin: 0,
              width: "90%", 
              maxWidth: "500px", 
            }}
          />
        )}
      </Layout>
    );
  }
}

export default CampaignIndex;
