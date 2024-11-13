import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/af93f37f51c0453397d3cb70f2cc4c9d"
    // remember to change this to your own endpoint!"
  );
  web3 = new Web3(provider);
}

export default web3;
