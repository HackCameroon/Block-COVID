# Block-COVID
Decentralized supply chain app implementing a blockchain network for regional-asset tracking and fund allocation during the COVID-19 pandemic.

Follow the steps below to download, install, and run this project.

Dependencies

NPM: https://nodejs.org

Truffle: https://github.com/trufflesuite/truffle

Ganache: http://truffleframework.com/ganache/

Metamask: https://metamask.io/

Step 1. Clone the project


Step 2. Install dependencies using $npm install

Step 3. Start Ganache
Open the Ganache GUI client that you downloaded and installed. This will start your local blockchain instance.

Step 4. Compile & Deploy Smart Contract
$ truffle migrate --reset You must migrate the Marketplace smart contract each time you restart ganache.

Step 5. Configure Metamask

Connect metamask to your local Etherum blockchain provided by Ganache.
Import an account provided by ganache.

Step 6. Run the Front End Application
$ npm run dev to run the Marketplace Application

$ npm run start to run CryptoSwap or Areas Application

Visit this URL in your browser: http://localhost:3000
