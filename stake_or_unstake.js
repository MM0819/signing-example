const ethers = require('ethers');
const Web3 = require('web3');
const vestingABI = require('./vesting_abi.js');

const INFURA_TOKEN = 'your infura token'; // replace with api token from infura.io
const PRIVATE_KEY = 'your private key'; // replace with your ethereum private key (hex string)
const VEGA_PUBLIC_KEY = 'your vega public key'; // replace with your vega public key (hex string)

const VESTING_CONTRACT_ADDRESS = '0x23d1bFE8fA50a167816fBD79D7932577c06011f4';
const PROVIDER_URL = `https://mainnet.infura.io/v3/${INFURA_TOKEN}`;

const web3 = new Web3(PROVIDER_URL);
const vestingContract = new web3.eth.Contract(vestingABI, VESTING_CONTRACT_ADDRESS);

const ethWallet = new ethers.Wallet(PRIVATE_KEY);
const ethAddress = ethWallet.address;

const go = async (unstake, amount) => {
  let data = vestingContract.methods.stake_tokens(web3.utils.toWei(String(amount)), VEGA_PUBLIC_KEY).encodeABI();
  if(unstake) {
    data = vestingContract.methods.remove_stake(web3.utils.toWei(String(amount)), VEGA_PUBLIC_KEY).encodeABI();
  }
  const nonce = await web3.eth.getTransactionCount(ethAddress);
  const gasPrice = await web3.eth.getGasPrice();
  const gas = (await web3.eth.getBlock("latest")).gasLimit;
  const tx = { nonce, gasPrice, gas, ethAddress, VESTING_CONTRACT_ADDRESS, value:0, data };
  const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  const result = await web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
  console.log(result);
};

const UNSTAKE = true;
const AMOUNT = 100

go(UNSTAKE, AMOUNT);
