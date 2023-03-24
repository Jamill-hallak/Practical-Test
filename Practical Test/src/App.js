import { ethers } from "ethers";
import React, { useState, useCallback, useEffect } from "react";
import "./styles/Home.css";
import abi from "./contracts/stakingpool.sol/stakingpool.json";
import Tabi from "./contracts/stakingToken.sol/StakingToken.json";

const stakingContractAddress = "0x52568eD609B1622a5eE7f0c37761Ff4F9A796f35";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [stakingTokenContract, setStakingTokenContract] = useState(null);
  const [stakingTokenBalance, setStakingTokenBalance] = useState(null);
  const [WstakingTokenBalance, WsetStakingTokenBalance] = useState(null);
  const [claimbalance, setclaimbalance] = useState(null);
  const [RewardToclaim, setRewardToclaim] = useState(null);

  const [amountToStake, setAmountToStake] = useState(0);
  const [inAPY, setInAPY] = useState("0");
  const [APY, setAPY] = useState(null);
  async function init() {
    // Connect to Ethereum provider
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Listen for account change events
    window.ethereum.on("accountsChanged", (accounts) => {
      setWallet(provider.getSigner(accounts[0]));
      setProvider(provider);
    });

    // Connect to the user's Ethereum wallet
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWallet(signer);

    // Initialize staking contract
    const stakingContract = new ethers.Contract(
      stakingContractAddress,
      abi.abi,
      signer
    );
    setStakingContract(stakingContract);

    // Initialize staking token contract
    const stakingTokenAddress = "0xb13D9d30C94ba134937A0ABa036Cb8CE9668eCf4";
    const stakingTokenContract = new ethers.Contract(
      stakingTokenAddress,
      Tabi.abi,
      signer
    );
    setStakingTokenContract(stakingTokenContract);

    // Get staking token balance
    const stakingTokenBalance = await stakingContract.getStakedAmount(address);
    setStakingTokenBalance(stakingTokenBalance);
    const WstakingTokenBalance = await stakingTokenContract.balanceOf(address);
    WsetStakingTokenBalance(WstakingTokenBalance);
    // Get staking data
    const calimbalacne = await stakingContract.getRewaredbalance(address);
    setclaimbalance(calimbalacne);
    const RewardToclaim = await stakingContract.getRewardAmount(address);
    setRewardToclaim(RewardToclaim);
  }

  useEffect(() => {
    if (!window.ethereum) {
      init();
    }
  });

  const stakeTokens = async () => {
    const parsedAmount = ethers.utils.parseEther(amountToStake);
    
    // Check allowance
    const allowance = await stakingTokenContract.allowance(wallet.getAddress(), stakingContractAddress);
    if (allowance.lt(parsedAmount)) {
      // Approve staking contract to spend tokens
      await stakingTokenContract.approve(stakingContractAddress, parsedAmount);
    }
  
    // Stake tokens
    const tx = await stakingContract.stake(parsedAmount);
    await tx.wait();
    // refetchData();
  
    alert("Tokens staked successfully!");
  };

  const unstakeTokens = async () => {
    const parsedAmount = ethers.utils.parseEther(amountToStake);
    const tx = await stakingContract.withdraw(parsedAmount);
    await tx.wait();
    // refetchData();
    alert("Tokens unstaked successfully!");
  };

  const claimRewards = async () => {
    const tx = await stakingContract.claimRewards();
    await tx.wait();
    // refetchData();
    alert("Rewards claimed successfully!");
  };

  useEffect(() => {
    setInterval(() => {
      init();
    }, 10000);
  }, []);

  // const refetchData = async () => {
  //   // Get staking token balance

  //   // Get staking data
  //   const stakeInfo = await stakingContract.getRewaredbalance(wallet.getAddress());
  //   setStakeInfo(stakeInfo);

  //   const calimbalacne = await stakingContract.getRewaredbalance(wallet.getAddress());
  //   setclaimbalance(calimbalacne);
  // };
  const calculateAPY = useCallback(() => {
    const principal = parseFloat(inAPY);
    const blocksPerYear = 365 * 24 * 6; // assuming 6 second block time
    const interestRate = 0.02; // 2% interest rate
    const apy = Math.pow(1 + interestRate / blocksPerYear, blocksPerYear) - 1;
    const APY = (apy * 100) * principal;
    setAPY(APY);
  }, [inAPY]);
  
  const handleInputChange = useCallback((e) => {
    setInAPY(e.target.value);
  }, []);
  
  const handleButtonClick = useCallback(() => {
    calculateAPY();

  }, [calculateAPY]);
  
  
  return (
    <div className="home">
      <main className="home_container">
        <div className="caption">
          <h1 className="title">Welcome to VAI staking app!</h1>

          <p className="description">
            Stake certain amount and get reward tokens back!
          </p>
          <div className="action">
            {!wallet && (
              <button className="button" onClick={() => init()}>
                Connect to MetaMask
              </button>
            )}
          </div>
        </div>

        <div className="section1">
          <h2>Stake Tokens</h2>
          <p>
            Current staking token balance:{" "}
            {stakingTokenBalance
              ? ethers.utils.formatEther(stakingTokenBalance)
              : "loading..."}{" "}
            STK
          </p>
<div className="action_container">
<input className="input"
            type="number"
            placeholder="Enter amount to stake"
            value={amountToStake}
            onChange={(e) => setAmountToStake(e.target.value)}
          />
         <div className="actions">
        
          <button className="button" onClick={stakeTokens}>Stake Tokens</button>
        
          <button className="button" onClick={unstakeTokens}>Unstake Tokens withdraw</button>
      
          <button className="button" onClick={claimRewards}>Claim Rewards</button>
         </div>
</div>
        </div>

        <div className={"section2"}>
          <h2>Stake Info</h2>
          <p>
            Wallet Balance :{" "}
            {WstakingTokenBalance
              ? ethers.utils.formatEther(WstakingTokenBalance)
              : "loading..."}
          </p>
          <p>
            Reward balance:{" "}
            {claimbalance
              ? ethers.utils.formatEther(claimbalance)
              : "loading..."}
          </p>
          <p>
            Reward To Claim:{" "}
            {RewardToclaim
              ? ethers.utils.formatEther(RewardToclaim)
              : "loading..."}
          </p>
          <p>APY Estimated </p>
         <div className="action_container">
         <input
        type="number"
        placeholder="Enter amount to APY"
        value={inAPY}
        onChange={handleInputChange}
      />
      <br />
      <button onClick={handleButtonClick}>Calculate APY</button>
      <p>Estimated APY: {APY ? APY : "0"}</p>         </div>
         
        </div>
      </main>
    </div>
  );
}
