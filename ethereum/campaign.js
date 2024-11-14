import web3 from "./web3";
import Airline from "./build/AirlineManagement.json";

const airline = (address) => {
  return new web3.eth.Contract(Airline.abi, address);
};
export default airline;
