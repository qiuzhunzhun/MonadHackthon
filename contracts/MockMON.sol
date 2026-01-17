// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockMON
 * @dev MON代币的模拟合约（仅用于测试）
 * 注意：在实际部署时，如果Monad有官方的MON代币合约，应该使用官方合约地址
 */
contract MockMON is ERC20 {
    constructor() ERC20("Mock MON", "MON") {
        // 初始铸造一些代币用于测试
        _mint(msg.sender, 1000000 * 10**18);
    }

    /**
     * @dev 任何人都可以铸造（仅用于测试）
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

