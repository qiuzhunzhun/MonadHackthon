// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MSZToken
 * @dev MSZ代币合约，初始发行1万个代币
 */
contract MSZToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 10000 * 10**18; // 1万个代币，18位小数

    /**
     * @dev 构造函数，初始化代币名称和符号，并铸造初始供应量
     * @param initialOwner 初始所有者地址，将接收所有初始代币
     */
    constructor(address initialOwner) ERC20("MSZ Token", "MSZ") Ownable(initialOwner) {
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    /**
     * @dev 铸造新代币（仅所有者可调用）
     * @param to 接收地址
     * @param amount 铸造数量
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev 销毁代币（仅所有者可调用）
     * @param from 销毁地址
     * @param amount 销毁数量
     */
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}

