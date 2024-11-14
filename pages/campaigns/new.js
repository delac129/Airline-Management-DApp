import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
import airline from "../../ethereum/campaign.js"

class AirlineNew extends Component {
  state = {
    destination: "",
    basePrice: "",
    errorMessage: "",
  };

  onSubmit = async (event) => {
    event.preventDefault();

    if(!this.state.destination || !this.state.basePrice){
      this.setState({errorMessage: "Both fields are required!"});
      return;
    }
    this.setState({errorMessage: ""});

    
    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await airline.methods
        .createDestination(this.state.destination, this.state.basePrice)
        .send({
          from: accounts[0],
        });

      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: "we" });
    }
    this.setState({ loading: false });
  };

  render() {
    const { destination, basePrice, errorMessage } = this.state;
    return (
      <Layout>
        <h3>Add Flight</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Destination</label>
            <Input
              placeholder = "Enter destination"
              value = {destination}
              onChange={(event) =>
                this.setState({ destination: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Base Price</label>
            <Input
              placeholder="Enter base price"
              type="number"
              value={basePrice}
              onChange={(event) =>
                this.setState({ basePrice: event.target.value })
              }
            />
          </Form.Field>
          {errorMessage && (
            <Message error content = {errorMessage} />
          )}
          <Button 
            primary
            type = "submit"
            disabled = {!destination || !basePrice}>
            Create Destination
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default AirlineNew;