import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [passcode, setPassCode] = useState(undefined);
  const [passCodeCount, setPassCodeCount] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }
  const getPassCode = async() => {
    if (atm) {
      setPassCode((await atm.getPassCode()));
    }
  }
  const getPassCodeCount = async() => {
    if (atm) {
      setPassCodeCount((await atm.getPassCodeChangeCount()).toNumber());
    }
  }
  const changePassCode = async() =>{
    if (atm) {
      let pw = document.getElementById("passcode");
      let n_pw = document.getElementById("newPassCode");
      let tx = await atm.changePassCode(pw.value,n_pw.value);
      await tx.wait()
      getPassCode();
      getPassCodeCount();
    }
  }
  const deposit = async() => {
    if (atm) {
      let val = parseInt(document.getElementById("deposit_txt").value);
      let pw = document.getElementById("passcode");
      let tx = await atm.deposit(val,pw.value);
      await tx.wait()
      getBalance();
      pw.value = " ";
    }
  }

  const withdraw = async() => {
    if (atm) {
      let val = parseInt(document.getElementById("withdraw_txt").value);
      let pw = document.getElementById("passcode");
      let tx = await atm.withdraw(val,pw.value);
      await tx.wait()
      getBalance();
      pw.value = " ";
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }
    if(passcode == undefined) {
      getPassCode();
    }
    if(passCodeCount == undefined){
      getPassCodeCount();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <input type="text" name = "deposit_txt" id = "deposit_txt" placeholder="AMT"/>
        <button onClick={deposit}>Deposit ETH</button><br/>
        <input type="text" name = "withdraw_txt" id = "withdraw_txt" placeholder="AMT"/>
        <button onClick={withdraw}>Withdraw ETH</button><br/>
        <input type="text" name = "passcode" id = "passcode" placeholder="PASSCODE"/><br/>
        <input type="text" name = "newPassCode" id = "newPassCode" placeholder="NEW PASSCODE"/>
        <button onClick={changePassCode}>Change Passcode</button><br/>
        <p>Number of Changes: {passCodeCount}</p>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
