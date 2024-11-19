const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider({
  gasLimit: 10000000000
}));

const compiledFactory = require('../ethereum/build/AirlineManagement.json'); // Updated path

let accounts;
let airlineManagement;

beforeEach(async () => {
  ogLog = console.log;    //To reduce
  console.log = () => {}; //info in termial
  accounts = await web3.eth.getAccounts();

  // Deploy the AirlineManagement contract with arguments
  airlineManagement = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
      arguments: ["Miami", "70"]
    })
    .send({ from: accounts[0], gas: "10000000000" });
    
  console.log = ogLog; //To reduce info in terminal
  console.log("AirlineManagement contract deployed at: ", airlineManagement.options.address);
});

describe("AirlineManagement Contract", () => {
  it("The contract is deployed", () => {
    assert.ok(airlineManagement.options.address);
  });

  it("The CEO can create a new destination", async () => {
    try {
      await airlineManagement.methods.createDestination("New York", "100").send({from: accounts[0], gas: 9000000});
      assert(true);
    } catch (err) {
      assert(false);
    }
  });
  it("A customer can book a flight", async () => {
    let price = await airlineManagement.methods.getPrice("Miami", 4, 1, true).call();
    try {
      await airlineManagement.methods.bookFlight("Miami", 4, 1, true).send({from: accounts[1], value: price, gas: 9000000});
    } catch (err) {
      assert(false);
    }
    let booked = await airlineManagement.methods.getBookedFlights(accounts[1]).call();
    assert(booked);
  });
});
