import React, { Component } from "react";
import {Segment, Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class bookedNew extends Component {
  render() {
    return (
      <Layout>
        <h3>Booked Flights</h3>

        {/* Displaying the "Booked Flights" box */}
        <Segment style={{ marginTop: "20px" }}>
          <h4>Booked Flights</h4>
          <p>No booked flights yet. This section will be filled once flights are added.</p>
          {/* This box can be later populated with dynamically loaded flight data */}
        </Segment>
      </Layout>
    );
  }
}
  

export default bookedNew;
