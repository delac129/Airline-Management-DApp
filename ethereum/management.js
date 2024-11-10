import web3 from "./web3";
import AirlineManagement from "./build/AirlineManagement.json";

const instance = new web3.eth.Contract(
  AirlineManagement.abi,
  "0x822157A35DfFa3a1A6D8009909B10eDf6940B59E"
);

export default instance;
