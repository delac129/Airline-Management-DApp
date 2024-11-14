import web3 from "./web3";
import AirlineManagement from "./build/AirlineManagement.json";

const instance = new web3.eth.Contract(
  AirlineManagement.abi,
  "0x7a975C320a7d5BbdB961FDB4c2BFd15869DD2155"
);

export default instance;
