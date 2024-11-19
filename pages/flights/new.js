import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout.js";
import web3 from "../../ethereum/web3.js";
import { Router } from "../../routes.js";
import airline from "../../ethereum/management.js"

class AirlineNew extends Component {
  //state variables to update after certain interactions
  state = {
    destination: "",
    basePrice: "",
    errorMessage: "",
    worth: "",
    canPay: false,
    payment: "",
  };

  async componentDidMount() {
    const worth = (await web3.eth.getBalance(airline.options.address)).toString();
    const canPay = await airline.methods.canPayout().call();
    const payment = (await airline.methods.payAmount().call() * BigInt(9) / BigInt(10)).toString();
    //initializing the state at the start with the correct information
    this.setState({ worth, canPay, payment });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    //get the index of the current destination from our contract
    const index = await airline.methods.indexes(this.state.destination).call();
    const length = await airline.methods.count().call();
    let name = ""
    
    if (index < length)
      name = await airline.methods.destinations(index).call();

    const exists = (name == this.state.destination);
    //if the destination exists, it displays the proper message and does not duplicate the same destination
    if (exists) {
      this.setState({ errorMessage: "The destination already exixsts!" });
      return;
    }

    //making sure the baseprice is greater than 30 wei
    const basePrice = Number(this.state.basePrice);
    if (basePrice <= 30) {
      this.setState({ errorMessage: "The base price must be greater than 30 Wei!" });
      return;
    }
    //make sure all boxes are filled in
    if (!this.state.destination || !this.state.basePrice) {
      this.setState({ errorMessage: "Both fields are required!" });
      return;
    }
    this.setState({ errorMessage: "" });

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();

      //attempting to create destination
      await airline.methods
        .createDestination(this.state.destination, this.state.basePrice)
        .send({
          from: accounts[0],
        });

      alert("Destination Created Succesfully!");

      //automatically take user to home page after the destination is created
      Router.pushRoute("/");
    } catch (err) {
      let errorMessage = "An error occurred.";
      //display proper error message if the destination was not created
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

      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  };

  payOut = async (event) => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      await airline.methods.payCEO().send({ from: accounts[0] });
      
      //reset values after CEO is paid
      const worth = (await web3.eth.getBalance(airline.options.address)).toString();
      const canPay = await airline.methods.canPayout().call();
      const payment = (await airline.methods.payAmount().call() * BigInt(7) / BigInt(10)).toString();
      //reset state values
      this.setState({ worth, canPay, payment });

      //properly alert the CEO that the payment has gone through
      alert("You were payed Succesfully!");
    }
    catch (err) {
      alert("Error paying you!");
    }
  }

  render() {
    const { destination, basePrice, errorMessage, worth, canPay, payment } = this.state;
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
        <div class="thang">You may receive: {payment} Wei</div>
        <div className="payout-container">
          <Button
            content="🤑 Payout"
            primary
            type="button"
            onClick={this.payOut}
            style={{ marginBottom: "20px" }}
            disabled={!canPay}
          />
        </div>
      </Layout>
    );
  }
}

export default AirlineNew;