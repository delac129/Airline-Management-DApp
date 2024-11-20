import web3 from "./web3";
import AirlineManagement from "./build/AirlineManagement.json";

const instance = new web3.eth.Contract(
  AirlineManagement.abi,
  "0x65BF8F6DDcBA42273b65e576f6B024C7E3eC6c59"
);

export default instance;
