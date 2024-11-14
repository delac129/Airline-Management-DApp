import web3 from "./web3";
import AirlineManagement from "./build/AirlineManagement.json";

const instance = new web3.eth.Contract(
  AirlineManagement.abi,
  "0xc3d413d0Dd4606CdA9d02CAE0124bF4e546bE818"
);

export default instance;
