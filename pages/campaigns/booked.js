import React, { Component } from "react";
import {Segment, Form, Button, Input, Message, Loader, Table} from "semantic-ui-react";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
import airline from "../../ethereum/management.js"

class BookedNew extends Component {
  state = {
    bookedFlights: [],
    loading: true,
    errorMessage: "",
  };

  monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // get booked flights for the logged in user
  async componentDidMount() {
    try {
      const accounts = await web3.eth.getAccounts();
      if (!accounts.length) {
        this.setState({ errorMessage: "There are no accounts" });
        return;
      }
      
      const bookedFlights = await airline.methods.getBookedFlights(accounts[0]).call();
      
      this.setState({ bookedFlights, loading: false });
    } catch (error) {
      console.error(error);
      this.setState({
        errorMessage: "Failed to load booked flights. Please try again later.",
        loading: false,
      });
    }
  }

  render() {
    const { bookedFlights, loading, errorMessage } = this.state;

    return (
      <Layout>
        <h3>Booked Flights</h3>

        {/* Displaying booked flights */}
        {loading && <Loader active inline='centered' />}
        
        {errorMessage && (
          <Message error content={errorMessage} />
        )}

        {bookedFlights.length === 0 && !loading && !errorMessage && (
          <Segment style={{ marginTop: "20px" }}>
            <h4>No booked flights yet.</h4>
            <p>This section will be filled once flights are booked.</p>
          </Segment>
        )}

        {bookedFlights.length > 0 && !loading && !errorMessage && (
          <Segment style={{ marginTop: "20px" }}>
            <h4>Booked Flights</h4>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Destination</Table.HeaderCell>
                  <Table.HeaderCell>Class</Table.HeaderCell>
                  <Table.HeaderCell>Round Trip</Table.HeaderCell>
                  <Table.HeaderCell>Month</Table.HeaderCell>
                  <Table.HeaderCell>Price Paid (Wei)</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {bookedFlights.map((flight, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{flight.destination}</Table.Cell>
                    <Table.Cell>{flight.class}</Table.Cell>
                    <Table.Cell>{flight.roundTrip ? "Yes" : "No"}</Table.Cell>
                    <Table.Cell>{this.monthNames[Number(flight.month) - 1]}</Table.Cell>
                    <Table.Cell>{web3.utils.fromWei(flight.price.toString(), 'wei')} Wei</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Segment>
        )}
      </Layout>
    );
  }
}

export default BookedNew;