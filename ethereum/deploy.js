const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const compiledProgram = require("./build/AirlineManagement.json");

const provider = new HDWalletProvider(
  "solid reform royal calm canal regular defy hope useful element lake corn",
  // remember to change this to your own phrase!
  "https://sepolia.infura.io/v3/e489198de3ac46e683413abc4201fea7"
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledProgram.abi)
    .deploy({ data: compiledProgram.evm.bytecode.object, arguments: ["Cuba", 10] })
    .send({ gas: "2000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
