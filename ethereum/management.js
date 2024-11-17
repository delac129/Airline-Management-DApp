import web3 from "./web3";
import AirlineManagement from "./build/AirlineManagement.json";

const instance = new web3.eth.Contract(
  AirlineManagement.abi,
  "0x225Acf66893d5cc94B54aC6ae761B8E37aE86810"
);

export default instance;
