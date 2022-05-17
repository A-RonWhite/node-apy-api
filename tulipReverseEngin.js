
/* Function to get APR info */
/* Utils/Math.js */
function getAprInfo(utilization, config) {
    const { threshold1, threshold2, base1, factor1, base2, factor2, base3, factor3 } = config;
    let borrowInterest = 0;
    if (utilization > 0 && utilization <= threshold1 / 100) {
        borrowInterest = base1 / 100 + (factor1 / 100 * utilization);
    }
    else if (utilization > threshold1 / 100 && utilization <= threshold2 / 100) {
        borrowInterest = base2 / 100 + (factor2 / 100 * (utilization - threshold1 / 100));
    }
    else if (utilization > threshold2 / 100) {
        borrowInterest = base3 / 100 + (factor3 / 100 * (utilization - threshold2 / 100));
    }
    const apr = utilization * borrowInterest * 100;
    const apy = aprToApy(apr / 100) * 100;
    return {
        borrowInterest: borrowInterest * 100,
        apr,
        apy
    };
}

/* Changes APR to APY */
/* Utils/Math.js */
function aprToApy(apr, n = 365) {
    return Math.pow((1 + apr / n), n) - 1;
}


/* Where the APR descructure comes from */
/* Model/lend/index.js */
const aprData = {
    threshold1: decodeData.threshold_1,
    threshold2: decodeData.threshold_2,
    base1: decodeData.base_1,
    factor1: decodeData.factor_1,
    base2: decodeData.base_2,
    factor2: decodeData.factor_2,
    base3: decodeData.base_3,
    factor3: decodeData.factor_3,
};
const { borrowInterest, apr, apy } = (0, math_1.getAprInfo)(utilization, aprData);


/* Possible way to get apr decode data */

const accountInfos = yield connection.getMultipleAccountsInfo(lendingPoolPublicKeyList);

/* 
The below address is called to get the data from

lendingPoolInfoAccount: new web3_js_1.PublicKey('499SnZR7dFzLU6BF9v9obfSCsmgui3FBtYtFDakD89zQ'),

connection.getMultipleAccountsInfo(lendingPoolPublicKeyList);
*/

//Look at this package
//const BufferLayout = require("buffer-layout");

/* 
How to decode the data 
            const buf = Buffer.from(accountInfo.data);
            const decodeData = pools_1.LendingPoolLayout.decode(buf);
*/

/* 

    BufferLayout.u8("threshold_1"),
    BufferLayout.u8("threshold_2"),
    BufferLayout.u8("base_1"),
    BufferLayout.u16("factor_1"),
    BufferLayout.u8("base_2"),
    BufferLayout.u16("factor_2"),
    BufferLayout.u8("base_3"),
    BufferLayout.u16("factor_3"),
*/


// LINK TO TULIP APR UTILZATION
//https://tulip-protocol.gitbook.io/tulip-protocol/lending/apr-and-utilization




/* PULLED FROM TULIP JS

  name: "BASIS",
            account: "7wAiwRyM66qfDrDBZD9xLii95tX47xzRPAfQiomrqrsN",
            mintAddress: "Basis9oJw9j8cw53oMV7iqsgo6ihi9ALw4QR31rcjUJa",
            liquiditySupplyTokenAccount: "CtpeTmX4BKHZJA1DVJNy9FhwNb575epA3pmBM65K4UU2",
            liquidityFeeReceiver: "35miYa87bpPqXnaCLzjjzDLUHQ7bXMGvq1N5xazbFs8n",
            collateralTokenMint: "GNjwMCt8GmPwQHy45UDzeprHkSTsNQHddsWXADz1HE6H",
            collateralTokenSupply: "HbnyViMZsu5W1Y1xhbTaDM5BGqNVZ81jeYFHMMRgktw5",
            destinationCollateralTokenAccount: "CgTN1Ng2fzgQZxi1u6sEP8XKJ3GqCyJbmc9G6HACwJBZ",
            quoteTokenMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            decimals: N.b.BASIS.decimals,
            logo: L.a,
            visible: !0,
            borrowDisabled: !0

*/

/* BASIS: {
    programId: exports.lendProgramId,
    tokenMint: tokens_1.TOKENS.BASIS.mintAddress,
    marketInfoAccount: new web3_js_1.PublicKey("4XNif294wbrxj6tJ8K5Rg7SuaEACnu9s2L27i28MQB6E"),
    marketOwner: new web3_js_1.PublicKey("7MBLg6oV5phip11YBbJPuq7u38kdzSi9PM3BifKSpLaR"),
    lendingPoolInfoAccount: new web3_js_1.PublicKey('499SnZR7dFzLU6BF9v9obfSCsmgui3FBtYtFDakD89zQ'),
    lendingMarketAuthority: new web3_js_1.PublicKey("sCDiYj7X7JmXg5fVq2nqED2q1Wqjo7PnqMgH3casMem"),
    lendingPoolTknAccount: new web3_js_1.PublicKey('E85Eyi4NmBp2Der1ntoNNx3AH5FHmjp4gGoUPW7qYVJ8'),
    lendingPoolShareMint: new web3_js_1.PublicKey('9s2iRZBzSNCNTUtuzSRHcv3q4Q9SaFFhSFZVnFXGtHUp'),
    lendingPoolShareAccount: new web3_js_1.PublicKey('5phQAZCwdfbYqj1tsv4xYWREpLZuxhqnMaZ126RAfVNb'),
    lendingPoolCreditMint: new web3_js_1.PublicKey('AVRoCxDDfx525L1XJJ5JbKrPPbuHs1JL6Z17vWS3HpKc'),
    lendingPoolCreditAccount: new web3_js_1.PublicKey('FeMzBdYfGJtqeRAadiC4fStY13cjxe6GutTyFCFsP1vL'),
    lendingPoolFeeAccount: new web3_js_1.PublicKey('CtdMN3hrU9yq2GJpojbU1oQZbMXJyuVZYMfNkAPbgaZN'),
}, */