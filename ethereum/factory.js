import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0xa6a39018d5B811C3b52D8C397680fbF89A53B7FA"
);

export default instance;
