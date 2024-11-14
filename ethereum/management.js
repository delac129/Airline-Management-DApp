import web3 from "./web3";
import AirlineManagement from "./build/AirlineManagement.json";

const instance = new web3.eth.Contract(
  AirlineManagement.abi,
  "0x4f4C0758F0095Ff45de64D94aa0F718706D2C8C1"
);

export default instance;
