import web3 from "./web3";
import AirlineManagement from "./build/AirlineManagement.json";

const instance = new web3.eth.Contract(
  AirlineManagement.abi,
  "0xBe59d480978f1A11A61CF06025035A095524b382"
);

export default instance;
