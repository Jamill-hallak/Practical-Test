# Practical-Test
Staking Dapp.
# description :
This is a React component written in JavaScript that allows users to interact with an Ethereum staking pool. The component is using the ethers.js library to interact with the Ethereum network and the Web3Provider to connect to the user's Ethereum wallet. The component initializes the staking contract and staking token contract, gets the staking token balance, the staking data, the claim balance and the reward amount. Users can stake tokens, unstake tokens and claim rewards. There is also a function that calculates the Annual Percentage Yield (APY) based on the user's input.

The component uses the useState hook to store various state variables such as the provider, wallet, staking contract, staking token contract, staking token balance, the reward balance and the amount to stake. The useEffect hook is used to initialize the component, refetch data, and update data every 10 seconds. The useCallback hook is used to create a memoized callback for handling changes to the APY input field and button click event.

Overall, this component provides an easy-to-use interface for users to interact with the Ethereum staking pool, stake and unstake tokens, claim rewards and calculate their APY.


# Installation
To get started with this project, follow these steps:

Download the project files by clicking on the "Download ZIP" button or by cloning the repository using Git.
Unzip the downloaded file if you chose to download the ZIP file.
Open the project in Visual Studio Code or any other code editor of your choice.
In the terminal, run npm i to install the project's dependencies.
Once the dependencies are installed, run npm start to start the development server.
That's it! You should now be able to run the project on your local machine. If you encounter any issues during the installation process, feel free to raise an issue in the project's GitHub repository.

# Aquick paragraph :
There are several ways to generate rewards for users, but two possible methods are sending staking tokens as a reward and allowing users to mint their own tokens. While sending staking tokens as a reward involves sending previously minted and staked tokens to users, allowing users to mint their own tokens enables them to create tokens based on their contribution to the network. Ultimately, the choice of method depends on the specific use case and the desired outcome of the reward system. It's important to thoroughly consider the benefits and drawbacks of each method and ensure that the reward system is transparent, fair, and aligned with the overall goals of the network. 
The task was long and the time was short, which made completing it a challenge. Bugs and missed elements added to the complexity. To overcome these obstacles, I prioritized critical elements and broke the task down into manageable components. Taking breaks and working methodically helped me maintain focus and avoid burnout. Despite the challenges, the limited time frame motivated me to work efficiently and productively.
