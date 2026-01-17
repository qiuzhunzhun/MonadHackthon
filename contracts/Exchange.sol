// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MSZToken.sol";

/**
 * @title Exchange
 * @dev 兑换合约，支持MON代币与MSZ代币的双向兑换，1:1汇率
 */
contract Exchange is Ownable {
    using SafeERC20 for IERC20;
    using SafeERC20 for MSZToken;

    // MSZ代币合约
    MSZToken public immutable mszToken;

    // MON代币合约地址（Monad原生代币在EVM中以WETH形式存在，这里假设有一个MON代币合约）
    // 如果Monad使用原生ETH，需要将合约改为payable并使用receive()函数
    IERC20 public immutable monToken;

    // 事件：兑换MON为MSZ
    event MonToMszExchanged(address indexed user, uint256 monAmount, uint256 mszAmount);
    
    // 事件：兑换MSZ为MON
    event MszToMonExchanged(address indexed user, uint256 mszAmount, uint256 monAmount);

    /**
     * @dev 构造函数
     * @param _mszToken MSZ代币合约地址
     * @param _monToken MON代币合约地址（如果Monad使用原生代币，可以传入WETH地址或0地址）
     * @param initialOwner 合约所有者
     */
    constructor(
        address _mszToken,
        address _monToken,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_mszToken != address(0), "Exchange: MSZ token address cannot be zero");
        require(_monToken != address(0), "Exchange: MON token address cannot be zero");
        
        mszToken = MSZToken(_mszToken);
        monToken = IERC20(_monToken);
    }

    /**
     * @dev 使用MON兑换MSZ（1:1汇率）
     * @param monAmount 要兑换的MON数量
     */
    function exchangeMonToMsz(uint256 monAmount) external {
        require(monAmount > 0, "Exchange: Amount must be greater than 0");
        
        // 检查合约是否有足够的MSZ代币
        uint256 mszBalance = mszToken.balanceOf(address(this));
        require(mszBalance >= monAmount, "Exchange: Insufficient MSZ tokens in contract");

        // 从用户转移MON代币到合约
        monToken.safeTransferFrom(msg.sender, address(this), monAmount);

        // 从合约转移MSZ代币给用户（1:1汇率）
        mszToken.safeTransfer(msg.sender, monAmount);

        emit MonToMszExchanged(msg.sender, monAmount, monAmount);
    }

    /**
     * @dev 使用MSZ兑换回MON（1:1汇率）
     * @param mszAmount 要兑换的MSZ数量
     */
    function exchangeMszToMon(uint256 mszAmount) external {
        require(mszAmount > 0, "Exchange: Amount must be greater than 0");
        
        // 检查合约是否有足够的MON代币
        uint256 monBalance = monToken.balanceOf(address(this));
        require(monBalance >= mszAmount, "Exchange: Insufficient MON tokens in contract");

        // 从用户转移MSZ代币到合约
        mszToken.safeTransferFrom(msg.sender, address(this), mszAmount);

        // 从合约转移MON代币给用户（1:1汇率）
        monToken.safeTransfer(msg.sender, mszAmount);

        emit MszToMonExchanged(msg.sender, mszAmount, mszAmount);
    }

    /**
     * @dev 查询合约中的MSZ余额
     */
    function getMszBalance() external view returns (uint256) {
        return mszToken.balanceOf(address(this));
    }

    /**
     * @dev 查询合约中的MON余额
     */
    function getMonBalance() external view returns (uint256) {
        return monToken.balanceOf(address(this));
    }

    /**
     * @dev 所有者可以提取合约中的MON代币（用于私募基金投资）
     */
    function withdrawMon(uint256 amount) external onlyOwner {
        require(amount > 0, "Exchange: Amount must be greater than 0");
        monToken.safeTransfer(owner(), amount);
    }

    /**
     * @dev 所有者可以提取合约中的MSZ代币
     */
    function withdrawMsz(uint256 amount) external onlyOwner {
        require(amount > 0, "Exchange: Amount must be greater than 0");
        mszToken.safeTransfer(owner(), amount);
    }

    /**
     * @dev 所有者可以向合约存入MSZ代币（用于提供流动性）
     */
    function depositMsz(uint256 amount) external onlyOwner {
        require(amount > 0, "Exchange: Amount must be greater than 0");
        mszToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    /**
     * @dev 所有者可以向合约存入MON代币（用于提供赎回流动性）
     */
    function depositMon(uint256 amount) external onlyOwner {
        require(amount > 0, "Exchange: Amount must be greater than 0");
        monToken.safeTransferFrom(msg.sender, address(this), amount);
    }
}

