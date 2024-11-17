const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/AirlineManagement.json'); // Updated path

let accounts;
let airlineManagement;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // Deploy the AirlineManagement contract with arguments
  airlineManagement = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
      arguments: ["Miami", "70"]
    })
    .send({ from: accounts[0], gas: "8000000" });

  console.log("AirlineManagement contract deployed at: ", airlineManagement.options.address);
});

describe("AirlineManagement Contract", () => {
  it("should deploy the contract", async () => {
    assert.ok(airlineManagement.options.address);
  });

  it("should initialize with the correct destination and price", async () => {
    const destinations = await airlineManagement.methods.destinations(0).call();
    const price = await airlineManagement.methods.destinationPrices(0).call();

    assert.strictEqual(destinations, "Miami");
    assert.strictEqual(price, "70");
  });

  // Add more tests as needed
});
