import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0x7baF49Cb62c8d41f12cCB822dE40f261b469b719"
);

export default instance;
