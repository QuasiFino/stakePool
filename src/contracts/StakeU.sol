// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts/math/Math.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LPTokenWrapper {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public y;

    function setStakeToken(address _y) internal {
        y = IERC20(_y);
    }

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function stake(uint256 amount) public virtual {
        _totalSupply = _totalSupply.add(amount);
        _balances[msg.sender] = _balances[msg.sender].add(amount);
        y.safeTransferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) public virtual {
        _totalSupply = _totalSupply.sub(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
        y.safeTransfer(msg.sender, amount);
    }
}

contract StakeU is Ownable, LPTokenWrapper, ReentrancyGuard, Initializable {
    using Address for address;
    
    IERC20 public rewardToken;
    uint256 public duration;
    bool public poolEnabled;
    
    uint256 public initReward;
    uint256 public startTime;
    uint256 public maxReward;
    uint256 public periodFinish;
    uint256 public rewardRate;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    uint256 public rewardDistributed;
    uint256 public maxUint = uint256(-1);
    address public stakeToken;
    address public tokenReward;
    
    address constant uniFactory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    
    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event PoolStarted(uint256 startedAt);
    event Recovered(uint256 tokenAmount);
    
    modifier checkHalve() {
        if (block.timestamp >= periodFinish) {
            initReward = initReward.mul(50).div(100);

            rewardRate = initReward.div(duration);
            lastUpdateTime = block.timestamp;
            periodFinish = block.timestamp.add(duration);
            emit RewardAdded(initReward);
        }
        _;
    }

    modifier checkStart() {
        require(poolEnabled, "Team hasn't started pool");
        _;
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    // https://uniswap.org/docs/v2/smart-contract-integration/getting-pair-addresses/
    function genUniAddr(address left, address right)
        internal
        pure
        returns (address)
    {
        address first = left < right ? left : right;
        address second = left < right ? right : left;
        address pair = address(
            uint256(
                keccak256(
                    abi.encodePacked(
                        hex"ff",
                        uniFactory,
                        keccak256(abi.encodePacked(first, second)),
                        hex"96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f"
                    )
                )
            )
        );
        return pair;
    }
    
    function initialize(
        address rewardToken_,
        address pairToken_,
        bool isUniPair,
        uint256 duration_ //should be made ownable
    ) public initializer {
        if (isUniPair) {
            setStakeToken(genUniAddr(rewardToken_, pairToken_));
        } else {
            setStakeToken(pairToken_);
        }
        rewardToken = IERC20(rewardToken_);

        maxReward = rewardToken.balanceOf(address(this));
        duration = duration_;
        stakeToken = pairToken_;
        tokenReward = rewardToken_;
    }
    
    function startPool() public { //should be made ownable
        require(!poolEnabled, "Pool can only be started once");

        poolEnabled = true;
        notifyRewardAmount(maxReward.mul(50).div(100));
        startTime = block.timestamp + 1;
        emit PoolStarted(startTime);
    }
    
    function contractAddress() public view returns(address) {
        return address(this);
    }
    
    
    function lastTimeRewardApplicable() public view returns (uint256) {
        return Math.min(block.timestamp, periodFinish);
    }
    
    function rewardPerToken() public view returns (uint256) {
        if (totalSupply() == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored.add(
                lastTimeRewardApplicable()
                    .sub(lastUpdateTime)
                    .mul(rewardRate)
                    .mul(10**18)
                    .div(totalSupply())
            );
    }
    
    function earned(address account) public view returns (uint256) {
        return
            balanceOf(account)
                .mul(rewardPerToken().sub(userRewardPerTokenPaid[account]))
                .div(10**18)
                .add(rewards[account]);
    }
    
    // stake visibility is public as overriding LPTokenWrapper's stake() function
    function stake(uint256 amount)
        public
        override
        nonReentrant
        updateReward(msg.sender)
        checkHalve
        checkStart
    {
        require(
            !address(msg.sender).isContract(),
            "Caller must not be a contract"
        );
        require(amount > 0, "Cannot stake 0");
        super.stake(amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount)
        public
        override
        nonReentrant
        updateReward(msg.sender)
        checkHalve
    {
        require(amount > 0, "Cannot withdraw 0");
        super.withdraw(amount);
        emit Withdrawn(msg.sender, amount);
    }

    function exit() external {
        withdraw(balanceOf(msg.sender));
        getReward();
    }

    function getReward()
        public
        nonReentrant
        updateReward(msg.sender)
        checkHalve
        checkStart
    {
        uint256 reward = earned(msg.sender);
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
            rewardDistributed = rewardDistributed.add(reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function notifyRewardAmount(uint256 reward)
        internal
        updateReward(address(0))
    {
        initReward = reward;
        rewardRate = reward.div(duration);
        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp.add(duration);
        emit RewardAdded(reward);
    }
    
    function updatePeriodFinish() public updateReward(address(0)) checkHalve returns(uint256) {
        return periodFinish;
    }
    
    function recoverERC20() public {
        require(block.timestamp >= (startTime.add(8 * duration)), "Mining has not ended");
        uint256 tokenAmount = maxReward.sub(rewardDistributed);
        rewardToken.safeTransfer(msg.sender, tokenAmount);
        emit Recovered(tokenAmount);
    }

}