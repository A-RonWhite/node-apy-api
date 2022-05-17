//import FranciumSDK from "francium-sdk";
/* import { Connection } from "@solana/web3.js";
import FranciumSDK from "francium-sdk"; */

const { Connection } = require("@solana/web3.js");
const FranciumSDK = require("francium-sdk");

//console.log(FranciumSDK);

//For some reason can't find it unless you add .default?
const fr = new FranciumSDK.default({
  connection: new Connection("https://free.rpcpool.com"),
});

fr.getLendingPoolInfo().then((res) => {
  //console.log(res);
  for (const pool in res) {
    //console.log(res[pool].pool);
    if (res[pool].pool === "BASIS") {
      console.log(res[pool]);
    }
  }
  // [
  //   {
  //     pool: 'USDC',
  //     scale: 6,
  //     avaliableAmount: BN,
  //     borrowedAmount: BN,
  //     totalAmount: BN,
  //     utilization: 0.9,
  //     totalShareMintSupply: BN,
  //     apr: 8.36,
  //     apy: 8.72,
  //   }
  // ]
});
