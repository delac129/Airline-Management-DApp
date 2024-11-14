import web3 from "./web3";
import AirlineManagement from "./build/AirlineManagement.json";

const instance = new web3.eth.Contract(
  AirlineManagement.abi,
  "0x4CA4F9E386284Cd15A39FdF41F7Bbd6b91E2ab76"
);

export default instance;
