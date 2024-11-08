import web3 from "./web3";
import AirlineManagement from "./build/AirlineManagement.json";

const instance = new web3.eth.Contract(
  AirlineManagement,
  "0x7baF49Cb62c8d41f12cCB822dE40f261b469b719"
);

export default instance;
