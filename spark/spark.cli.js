import { SparkWallet } from "@buildonspark/spark-sdk";
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

// load environment variables
import dotenv from 'dotenv';
dotenv.config();

// global variables
let receiverWallet = null;
let receiverMnemonic = process.env.SPARK_MNEMONIC ?? '';
let sparkAddress = process.env.SPARK_ADDRESS ?? '';
let receiverSparkAddress = "sp1pgssxc2ev5qgh6eajw232yj3qwjpa46e9zwjqkfm7dtymm9gdzvyz9kpkcppad";

// create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// save wallet info to .env file
function saveWalletToEnv(mnemonic, address) {
  try {
    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // update or add mnemonic and address
    envContent = envContent.replace(/SPARK_MNEMONIC=.*/g, `SPARK_MNEMONIC=${mnemonic}`);
    envContent = envContent.replace(/SPARK_ADDRESS=.*/g, `SPARK_ADDRESS=${address}`);

    // if not exists, add
    if (!envContent.includes('SPARK_MNEMONIC=')) {
      envContent += `\nSPARK_MNEMONIC=${mnemonic}`;
    }
    if (!envContent.includes('SPARK_ADDRESS=')) {
      envContent += `\nSPARK_ADDRESS=${address}`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log("💾 wallet info saved to .env file");
  } catch (error) {
    console.error("❌ save to .env file failed:", error);
  }
}

// wallet related functions
async function initializeWallet() {
  // check if there is already a mnemonic
  if (receiverMnemonic && receiverMnemonic.trim() !== '') {
    console.log("⚠️ wallet already initialized!");
    console.log("🔑 current mnemonic:", receiverMnemonic);
    console.log("💡 if you need to reinitialize, please clear the SPARK_MNEMONIC in the .env file");
    return false;
  }

  try {
    const { wallet, mnemonic } = await SparkWallet.initialize({
      options: {
        network: process.env.SPARK_NETWORK || "MAINNET",
      },
    });
    receiverWallet = wallet;
    receiverMnemonic = mnemonic;

    // get address and save
    const address = await wallet.getSparkAddress();
    sparkAddress = address;

    // save to .env file
    saveWalletToEnv(mnemonic, address);

    console.log("✅ initialize wallet success!");
    console.log("🔑 mnemonic:", receiverMnemonic);
    console.log("📧 address:", sparkAddress);
    return true;
  } catch (error) {
    console.error("❌ initialize wallet failed:", error);
    return false;
  }
}

// get spark address
async function getSparkAddress() {
  if (sparkAddress && sparkAddress.trim() !== '') {
    console.log("Spark address:", sparkAddress);
    return sparkAddress;
  }

  if (!receiverWallet) {
    console.log("❌ please initialize wallet (use 'init' command)");
    return;
  }

  try {
    const address = await receiverWallet.getSparkAddress();
    sparkAddress = address;
    console.log("Spark address:", sparkAddress);
    return sparkAddress;
  } catch (error) {
    console.error("❌ get address failed:", error);
  }
}

function checkMnemonic() {
  if (!receiverMnemonic) {
    console.log("❌ please initialize wallet (use 'init' command)");
    return false;
  }
  return true;
}

// show mnemonic
function showMnemonic() {
  if (checkMnemonic() == false) return;
  console.log("🔑 mnemonic:", receiverMnemonic);
}

// get balance
async function getBalance() {
  if (checkMnemonic() == false) return;
  const { wallet } = await SparkWallet.initialize({
    mnemonicOrSeed: receiverMnemonic,
    options: {
      network: "MAINNET",
    },
  });
  const balance = await wallet.getBalance();
  console.log(`💰 balance: ${balance.balance}`);
}

// clear wallet
function clearWallet() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    envContent = envContent.replace(/SPARK_MNEMONIC=.*/g, 'SPARK_MNEMONIC=');
    envContent = envContent.replace(/SPARK_ADDRESS=.*/g, 'SPARK_ADDRESS=');

    fs.writeFileSync(envPath, envContent);

    receiverMnemonic = '';
    sparkAddress = '';
    receiverWallet = null;

    console.log("🗑️ wallet info cleared!");
    console.log("💡 now you can initialize wallet again");
  } catch (error) {
    console.error("❌ clear wallet failed:", error);
  }
}

// mint
async function mint() {
  if (checkMnemonic() == false) return;

  const { wallet } = await SparkWallet.initialize({
    mnemonicOrSeed: receiverMnemonic,
    accountNumber: 1,
    options: {
      network: "MAINNET",
    },
  });
  try {
    const transfer = await wallet.transfer({
      receiverSparkAddress: receiverSparkAddress,
      amountSats: 2000,
    });
    console.log("Transfer details:", transfer);
  } catch (error) {
    if (error.message.includes("Total target amount exceeds available balance")) {
      console.error("❌ transfer failed: Insufficient balance");
      console.error("💡 You need at least 2000 sats to complete this transfer");
      console.error("💡 Check your balance with 'balance' command");
    } else {
      console.error("❌ transfer failed:", error);
    }
  }
}

function showHelp() {
  console.log(`🚀 Spark CLI tool - available commands:

  init                     - initialize wallet
  address                  - show spark address
  mnemonic                 - show mnemonic
  mint                     - mint
  balance                  - get balance
  token balance            - get token balance
  transfer                 - transfer sats
  transfer tokens          - transfer tokens
  batch transfer tokens    - batch transfer tokens
  clear wallet             - clear wallet
  help                     - show help
  exit                     - exit
 
  `);
}

async function handleCommand(input) {
  const command = input.trim().toLowerCase();
  switch (command) {
    case 'init':
      await initializeWallet();
      break;
    case 'address':
      await getSparkAddress();
      break;
    case 'mnemonic':
      showMnemonic();
      break;
    case 'mint':
      await mint();
      break;
    case 'balance':
      await getBalance();
      break;
    case 'token balance':
      console.log('❌ soon');
      break;
    case 'clear wallet':
      clearWallet();
      break;
    case 'transfer':
      console.log('❌ soon');
      break;
    case 'transfer tokens':
      console.log('❌ soon');
      break;
    case 'batch transfer tokens':
      console.log('❌ soon');
      break;
    case 'help':
      showHelp();
      break;
    case 'exit':
      console.log("👋");
      rl.close();
      process.exit(0);
      break;
    case '':
      break;
    default:
      console.log(`❌ wrong command: ${command}`);
      console.log("💡 input 'help' to see available commands");
  }
}

async function main() {
  console.log("🎉 welcome to Spark CLI tool!");
  console.log("💡 input 'help' to see available commands");

  rl.setPrompt('spark> ');
  rl.prompt();

  rl.on('line', async (input) => {
    await handleCommand(input);
    rl.prompt();
  });

  rl.on('close', () => {
    // console.log('\n👋');
    process.exit(0);
  });
}

main().catch(console.error);