const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "AirlineManagement.sol");
const source = fs.readFileSync(campaignPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "AirlineManagement.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const out = JSON.parse(solc.compile(JSON.stringify(input)));

// Log the output to inspect the structure
console.log(out);


const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "AirlineManagement.sol"
];

fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
