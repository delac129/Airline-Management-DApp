import web3 from "./web3";
import AirlineManagement from "./build/AirlineManagement.json";

const instance = new web3.eth.Contract(
  AirlineManagement.abi,
  "0x2BB6748CB9F7C5642B83712e76D4a6C92C674244"
);

export default instance;
