import web3 from './web3';
import StakeU from './build/contracts/StakeU.json';

const instance = (address) => {
    return new web3.eth.Contract(StakeU.abi, address);
};

export default instance;