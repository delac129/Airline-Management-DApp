import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
import airline from "../../ethereum/management.js"

class AirlineNew extends Component {
  state = {
    destination: "",
    basePrice: "",
    errorMessage: "",
    worth: "",
    canPay: "",
  };

  async componentDidMount(){
    const worth = (await web3.eth.getBalance(airline.options.address)).toString();

    this.setState({worth});
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const index = await airline.methods.indexes(this.state.destination).call();
    const length = await airline.methods.count().call();
    let name = ""

    if(index < length)
      name = await airline.methods.destinations(index).call();

    const exists = (name == this.state.destination);
    if(exists) {
      this.setState({ errorMessage: "The destination already exixsts!" });
      return;
    }

    const basePrice = Number(this.state.basePrice);
    if (basePrice <= 30) {
      this.setState({ errorMessage: "The base price must be greater than 30 Wei!" });
      return;
    }

    if (!this.state.destination || !this.state.basePrice) {
      this.setState({ errorMessage: "Both fields are required!" });
      return;
    }
    this.setState({ errorMessage: "" });


    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await airline.methods
        .createDestination(this.state.destination, this.state.basePrice)
        .send({
          from: accounts[0],
        });

      alert("Destination Created Succesfully!");
      Router.pushRoute("/");
    } catch (err) {
      let errorMessage = "An error occurred.";

      if (err.message.includes("revert")) {
        const revertMessage = err.message.split("revert ")[1];
        if (revertMessage) {
          errorMessage = revertMessage.trim();
        } else {
          errorMessage = "Transaction failed!";
        }
      } else {
        errorMessage = err.message;
      }

      // Display the error message
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  };

  payOut = async (event) => {
    console.log("testing");
  }

  render() {
    const { destination, basePrice, errorMessage, worth} = this.state;
    return (
      <Layout>
        <h3>Add Flight</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Destination</label>
            <Input
              placeholder="Enter destination"
              value={destination}
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
            <Message error content={errorMessage} />
          )}
          <Button
            primary
            type="submit"
            disabled={!destination || !basePrice}>
            Create Destination
          </Button>
        </Form>
        <div class="thang">Your company is worth: {worth} Wei</div>
        <div className="payout-container">
          <Button
            content="🤑 Payout"
            primary
            type="button"
            onClick={this.payOut}
            style={{ marginBottom: "20px" }}
          />
        </div>
      </Layout>
    );
  }
}

export default AirlineNew;