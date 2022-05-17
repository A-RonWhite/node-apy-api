const solanaWeb3 = require("@solana/web3.js");
const assert = require("assert");
const util = require("util");
const BufferLayout = require("buffer-layout");
const BN = require("bn.js");
const bignumber_js_1 = require("bignumber.js");
const borsh_1 = require("@project-serum/borsh");

//BufferLayout.u8("threshold_1");
const LendingPoolLayout = BufferLayout.struct([
  BufferLayout.u8("version"),
  BufferLayout.nu64("last_update_slot"),
  BufferLayout.u8("last_update_stale"),
  (0, borsh_1.publicKey)("lending_market"),
  (0, borsh_1.publicKey)("liquidity_mint_pubkey"),
  BufferLayout.u8("liquidity_mint_decimals"),
  (0, borsh_1.publicKey)("liquidity_supply_pubkey"),
  (0, borsh_1.publicKey)("liquidity_fee_receiver"),
  BufferLayout.blob(36, "oracle"),
  BufferLayout.nu64("liquidity_available_amount"),
  BufferLayout.blob(16, "liquidity_borrowed_amount_wads"),
  BufferLayout.blob(16, "liquidity_cumulative_borrow_rate_wads"),
  BufferLayout.blob(8, "liquidity_market_price"),
  BufferLayout.blob(32, "share_mint_pubkey"),
  BufferLayout.blob(8, "share_mint_total_supply"),
  BufferLayout.blob(32, "share_supply_pubkey"),
  BufferLayout.blob(32, "credit_mint_pubkey"),
  BufferLayout.blob(8, "credit_mint_total_supply"),
  BufferLayout.blob(32, "credit_supply_pubkey"),
  BufferLayout.u8("threshold_1"),
  BufferLayout.u8("threshold_2"),
  BufferLayout.u8("base_1"),
  BufferLayout.u16("factor_1"),
  BufferLayout.u8("base_2"),
  BufferLayout.u16("factor_2"),
  BufferLayout.u8("base_3"),
  BufferLayout.u16("factor_3"),
  BufferLayout.u8("interest_reverse_rate"),
  BufferLayout.nu64("accumulated_interest_reverse"),
  BufferLayout.blob(108, "padding"),
]);

(async () => {
  const solana = new solanaWeb3.Connection(
    "https://api.mainnet-beta.solana.com"
  );

  // Token address
  const tokenAccount = new solanaWeb3.PublicKey(
    "3sBX8hj4URsiBCSRV26fEHkake295fQnM44EYKKsSs51"
  );

  const francTest = new solanaWeb3.PublicKey(
    "499SnZR7dFzLU6BF9v9obfSCsmgui3FBtYtFDakD89zQ"
  );
  const tulipTest = new solanaWeb3.PublicKey(
    "7wAiwRyM66qfDrDBZD9xLii95tX47xzRPAfQiomrqrsN"
  );

  const basisAccount = new solanaWeb3.PublicKey(
    "3sBX8hj4URsiBCSRV26fEHkake295fQnM44EYKKsSs51"
  );

  const account = await solana.getParsedAccountInfo(basisAccount);
  console.log(account.value.data.parsed.info.tokenAmount.uiAmount);
  //DGVp9vPzKgBxVbUg1kmUZwRKUYsAGpt8mKRAWwM1p9Hc - possible returned 0
  //7wAiwRyM66qfDrDBZD9xLii95tX47xzRPAfQiomrqrsN - association error

  //CtpeTmX4BKHZJA1DVJNy9FhwNb575epA3pmBM65K4UU2
  //4bcFeLv4nydFrsZqV5CgwCVrPhkQKsXtzfy2KyMz7ozM
  //CgTN1Ng2fzgQZxi1u6sEP8XKJ3GqCyJbmc9G6HACwJBZ
  //HbnyViMZsu5W1Y1xhbTaDM5BGqNVZ81jeYFHMMRgktw5
  /*   try {
    const account = await solana.getAccountInfo(tulipTest);
    //const account = await solana.getTokenAccountBalance(tokenAccount);

    //console.log(account);

    const buf = Buffer.from(account.data);
    const decodeData = LendingPoolLayout.decode(buf);

    console.log(decodeData);

    //Had to convert to string for tulip due to the value being too high for a number
    const avaliableAmount = new BN(
      decodeData.liquidity_available_amount.toString()
    );
    //const avaliableAmount = new BN(decodeData.liquidity_available_amount);
    const borrowedAmount = new BN(
      decodeData.liquidity_borrowed_amount_wads,
      "le"
    ).div(new BN(10).pow(new BN(18)));
    const totalShareMintSupply = new BN(
      decodeData.share_mint_total_supply,
      "le"
    );

    const totalAmount = avaliableAmount.add(borrowedAmount);
    const utilization = totalAmount.gtn(0)
      ? new bignumber_js_1.default(borrowedAmount.toString())
          .dividedBy(totalAmount.toString())
          .toNumber()
      : 0;

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

    const { borrowInterest, apr, apy } = getAprInfo(utilization, aprData);

    //console.log(utilization);
  } catch (error) {
    console.log(error);
  } */
})();

function getAprInfo(utilization, config) {
  const {
    threshold1,
    threshold2,
    base1,
    factor1,
    base2,
    factor2,
    base3,
    factor3,
  } = config;
  let borrowInterest = 0;
  if (utilization > 0 && utilization <= threshold1 / 100) {
    borrowInterest = base1 / 100 + (factor1 / 100) * utilization;
  } else if (
    utilization > threshold1 / 100 &&
    utilization <= threshold2 / 100
  ) {
    borrowInterest =
      base2 / 100 + (factor2 / 100) * (utilization - threshold1 / 100);
  } else if (utilization > threshold2 / 100) {
    borrowInterest =
      base3 / 100 + (factor3 / 100) * (utilization - threshold2 / 100);
  }
  const apr = utilization * borrowInterest * 100;
  const apy = aprToApy(apr / 100) * 100;
  return {
    borrowInterest: borrowInterest * 100,
    apr,
    apy,
  };
}

function aprToApy(apr, n = 365) {
  return Math.pow(1 + apr / n, n) - 1;
}

const test = {
  name: "BASIS-USDC",
  account: "E5dMKcCDK3K2FKMv9WWXByk8bzeVossBK5DWA9fAM1xN",
  account_nonce: 252,
  user_farm_address: "2544yaA5ed7Qt7oysYabogHY1rXHvYkNTLwZf9Y6zBZ4",
  user_farm_nonce: 255,
  farm_token_mint: "4yx2aHMa7N4m1uUaBRy9QPtpstw3HFPtvcCPJQaGFHKL",
  farm_token_account: "GxAvwgSfkVqxUuE8ZkiBaz3jKurafXbR8vdwFZSr9PK8",
  reward_token_mint: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
  reward_token_account: "8uriM8zt3rUQzQkUnrQiKJswtchCau1yhDTQSxtSt8V6",
  swap_pool_token_mint: "GoaAiajubRgeCFEz9L6mLnSmT2QFegoJDH5tpLfivpj",
  swap_pool_token_account: "7gZ3mUtF6d611bSFxB1cNr4p7GkRqR8WWEGHj7QrcfHx",
  swap_token_a_mint: "Basis9oJw9j8cw53oMV7iqsgo6ihi9ALw4QR31rcjUJa",
  swap_token_a_account: "2BHGv4dD4T6npYE7d9VkipYG8uRGZb3ixcoWMZkLoZdq",
  swap_token_b_mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  swap_token_b_account: "Cc3UUpJoAaf2aSdknmGoPcLpgY7hZD4x1hDQ4raj2oQZ",
  usdc_token_account: "Cc3UUpJoAaf2aSdknmGoPcLpgY7hZD4x1hDQ4raj2oQZ",
  compound_authority: "CXT9Kvn6VdhrmzviNfE5dForbA6PGMQK4HtF3NTGaozT",
  pdaAccount: "HHEdhxXSwWRUWyZdDnrpnWQr7mVEtDFUDXHHhPN6F7Um",
  pda_nonce: 253,
  controller_fee: 150,
  platform_fee: 250,
  farm_key: 18,
  fee_recipient: "4ZDfFTKU4CaAUidHP6vRnb7EYrTJvzAe2aJwZ4ZTqrkG",
  host_fee_recipient: "CiufCSLcb5ycYqLgQfSSkBtDKvUi1s6hBu5jMSojee8K",
  compound_swap_route: "ORCAUSDC",
  dd_user_farm_address: "zaKJqqtpcUB6cBVFbRAZrpYBRGGwEoVvWgYuaMTZppu",
  dd_user_farm_nonce: 255,
  dd_farm_token_mint: "8XtNSYBhLHa4cYzNsXd6yDAweMECumrxFJ7F2qxk2xN",
  dd_farm_token_account: "2Wpy1bw1iSqyKT9t2A7azV1ubBWTm4Ny4cUZmRZ591RX",
  dd_reward_token_mint: "Basis9oJw9j8cw53oMV7iqsgo6ihi9ALw4QR31rcjUJa",
  dd_reward_token_account: "2BHGv4dD4T6npYE7d9VkipYG8uRGZb3ixcoWMZkLoZdq",
  global_base_token_vault: "GtRcfta8aD8BbZqAZV2gaWELSZBe4qKvexTWqSRUvdYw",
  global_base_token_vault_dd: "DaHbgd7j9aCmWaidevgPw1YiwnvRt2Q7HYTWVXmeqGmF",
  global_farm: "A8CNiARq7zYMMGKYbqJVfByVyBzdMexhc5EEGzCN13dS",
  global_farm_dd: "DasaXe2Wqcks6csFv1bWwdW41mV8rMD5c27Uw9rFYVu4",
  orca_fee_account: "4FjEd37W9FExXq85nLeuNWuhUaTwkFdnqewt3E3qoYAh",
  global_reward_token_vault: "2CAFkxSUTSUhVDncagnRXooi6wfeakVhc3WB4bEZF8K7",
  global_reward_token_vault_dd: "8kmH4C6nek3hLgzVeb3xwXu4oF7zx8emoRnuGjwbwkgp",
  convert_authority: "37zeuhxH2ANPw1AQb8jQ8EkZDYoCftDV5qSXM5TGUd6M",
  convert_authority_dd: "EWXsQ5XMMn1tesDhtuMhgH5e5wg7hWgsQPZxGhaZdBaL",
  serumVaultSigner: "786ezhfHqkmJUBmjrWYGpzPnVWR8zhy2V71qNws7D89z",
};
