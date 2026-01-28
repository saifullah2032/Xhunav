import web3 from './web3';
import ElectionFactory from './build/ElectionFact.json';

const instance = new web3.eth.Contract(
	JSON.parse(ElectionFactory.interface),
        '0xf3b75785467B5f629f1F915ACD504B20F7b48618'
);

export default instance;