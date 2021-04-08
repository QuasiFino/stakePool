import web3 from './web3';
import IERC20 from './build/contracts/IERC20.json';

const instance = (address) => {
    return new web3.eth.Contract(IERC20.abi, address);
};

export default instance;