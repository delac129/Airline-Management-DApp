const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());
const compiledFactory = require("../ethereum/build/AirlineManagement.json");

let accounts;
let airlineManagement;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // Deploy the AirlineManagement contract with parameters ("Miami", "70")
  airlineManagement = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ 
      data: compiledFactory.evm.bytecode.object, 
      arguments: ["Miami", "70"] // Passing "Miami" and "70" to constructor
    })
    .send({ from: accounts[0], gas: "8000000" });  // Increased gas limit

  // Log the contract address to confirm it's deployed
  console.log("AirlineManagement contract deployed at: ", airlineManagement.options.address);
});

describe("AirlineManagement Contract", () => {

  it("deploys the AirlineManagement contract", async () => {
    // Confirm contract deployment
    assert.ok(airlineManagement.options.address);
  });

});
