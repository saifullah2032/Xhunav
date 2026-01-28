const Web3 = require('web3');
const eF = require('./build/ElectionFact.json'); // Make sure this path matches your actual file

// Connect directly to your local Ganache (No mnemonic needed)
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
const web3 = new Web3(provider);

const deploy = async () => {
    try {
        // Get the list of unlocked accounts from Ganache
        const accounts = await web3.eth.getAccounts();

        console.log('Attempting to deploy from account', accounts[0]);

        const result = await new web3.eth.Contract(JSON.parse(eF.interface))
            .deploy({ data: '0x' + eF.bytecode })
            .send({ gas: '3000000', from: accounts[0] });

        console.log('Contract deployed to:', result.options.address);
    } catch (error) {
        console.error("Deployment failed:", error);
    }
};
deploy();