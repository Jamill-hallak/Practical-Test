// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";




contract stakingpool  {

    // Declare a variable to store the staked token
IERC20 public token;

// Declare a variable to store the interest rate
uint256 public constant interestRate = 2;

// Declare a mapping to store the balance of each staker
mapping(address => uint256) public balances;

// Declare a mapping to store the reward balance of each staker
mapping(address => uint256) public Rewardbalances;

// Declare a mapping to store the last block each staker interacted with the contract
mapping(address => uint256) public lastBlock;

// Declare a variable to prevent reentrant calls
bool private locked = false;

// Define a constructor function that initializes the contract with a staking token
constructor(IERC20 _token) {
    token = _token;
}

// Define a modifier to prevent reentrant calls
modifier nonReentrant() {
    require(!locked, "Reentrant call");
    locked = true;
    _;
    locked = false;
}

// Declare events to emit when users stake, withdraw, or claim rewards
event Staked(address indexed user, uint256 amount);
event Withdrawn(address indexed user, uint256 amount);
event RewardClaimed(address indexed user, uint256 amount);

// Define the stake function that allows users to stake tokens
function stake(uint256 amount) external {

    // Require that the amount is greater than 0
    require(amount > 0, "Amount must be greater than 0");

    // Transfer the staked token from the user to the contract
    require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

    // Calculate and update the reward balance of the user
    uint256 reward = calculateReward(msg.sender);
    if (reward > 0) {
        Rewardbalances[msg.sender] += reward;
    }

    // Update the balance of the user
    balances[msg.sender] += amount;

    // Update the last block the user interacted with the contract
    lastBlock[msg.sender] = block.number;

    // Emit an event to signal that the user has staked tokens
    emit Staked(msg.sender, amount);
}

// Define the withdraw function that allows users to withdraw tokens
function withdraw(uint256 amount) external nonReentrant {

    // Require that the amount is greater than 0
    require(amount > 0, "Amount must be greater than 0");

    // Require that the user has sufficient balance
    require(amount <= balances[msg.sender], "Insufficient balance");

    // Calculate and update the reward balance of the user
    uint256 reward = calculateReward(msg.sender);
    if (reward > 0) {
        Rewardbalances[msg.sender] += reward;
    }

    // Update the balance of the user
    balances[msg.sender] -= amount;

    // Transfer the withdrawn token from the contract to the user
    require(token.transfer(msg.sender, amount), "Token transfer failed");

    // Update the last block the user interacted with the contract
    lastBlock[msg.sender] = block.number;

    // Emit an event to signal that the user has withdrawn tokens
    emit Withdrawn(msg.sender, amount);
}

 function claimRewards() external nonReentrant {
        uint256 reward = calculateReward(msg.sender); // Calculate reward for the user
        Rewardbalances[msg.sender] += reward; // Add the reward to the user's Reward balance
        require(Rewardbalances[msg.sender] > 0 ,"NO Reward to claim") ; // Ensure the user has a non-zero Reward balance
        require(token.transfer(msg.sender, Rewardbalances[msg.sender]), "Reward transfer failed"); // Transfer the reward tokens to the user
        uint256 Claim = Rewardbalances[msg.sender]; // Store the claimed reward amount
        Rewardbalances[msg.sender] = 0 ; // Reset the user's Reward balance
        lastBlock[msg.sender] = block.number; // Update the last block the user claimed rewards
        emit RewardClaimed(msg.sender,Claim) ; // Emit an event to indicate that the user has claimed their reward
    }

    function calculateReward(address user) public view returns (uint256) {
        uint256 t = (block.number - lastBlock[user]) / 10; // Calculate the number of 10-block periods that have passed since the user last claimed rewards

        if (t == 0) { // If no 10-block periods have passed, return 0 reward
            return 0;
        }

        uint256 reward = (balances[user] * interestRate * t) / 100; // Calculate the reward amount based on the user's staked balance, interest rate, and time since last claim
        return reward;
    }

    // public View 
    function getStakedAmount(address user) public view returns (uint256) {
        return balances[user]; // Get the staked balance of a user
    }
    
    function getRewardAmount(address user) public view returns (uint256) {
        return calculateReward(user); // Get the calculated reward amount for a user
    }
    
    function getRewaredbalance(address user) public view returns(uint256) {
        return Rewardbalances[user]; // Get the Reward balance of a user
    }

}
