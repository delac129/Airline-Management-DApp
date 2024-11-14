const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const compiledProgram = require("./build/AirlineManagement.json");

const provider = new HDWalletProvider(
  "pipe pave armed used genre famous crash also audit bone donate divert",
  // remember to change this to your own phrase!
  "https://sepolia.infura.io/v3/af93f37f51c0453397d3cb70f2cc4c9d"
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledProgram.abi)
    .deploy({ data: compiledProgram.evm.bytecode.object, arguments: ["Cuba", 10] })
    .send({ gas: "8000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
