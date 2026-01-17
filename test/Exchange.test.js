const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MSZ Token and Exchange", function () {
  let mszToken;
  let monToken;
  let exchange;
  let owner;
  let user1;
  let user2;

  const INITIAL_SUPPLY = ethers.parseEther("10000");
  const EXCHANGE_AMOUNT = ethers.parseEther("100");

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // 部署MSZ代币
    const MSZToken = await ethers.getContractFactory("MSZToken");
    mszToken = await MSZToken.deploy(owner.address);
    await mszToken.waitForDeployment();

    // 部署Mock MON代币
    const MockMON = await ethers.getContractFactory("MockMON");
    monToken = await MockMON.deploy();
    await monToken.waitForDeployment();

    // 给用户一些MON代币
    await monToken.mint(user1.address, ethers.parseEther("1000"));
    await monToken.mint(user2.address, ethers.parseEther("1000"));

    // 部署兑换合约
    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy(
      await mszToken.getAddress(),
      await monToken.getAddress(),
      owner.address
    );
    await exchange.waitForDeployment();

    // 将部分MSZ转移到兑换合约
    await mszToken.transfer(await exchange.getAddress(), ethers.parseEther("5000"));
    
    // 将部分MON转移到兑换合约（用于赎回流动性）
    await monToken.transfer(await exchange.getAddress(), ethers.parseEther("5000"));
  });

  describe("MSZ Token", function () {
    it("应该正确设置初始供应量", async function () {
      expect(await mszToken.totalSupply()).to.equal(INITIAL_SUPPLY);
    });

    it("初始代币应该发给所有者", async function () {
      // 注意：在beforeEach中已经转移了5000个MSZ到兑换合约
      // 所以所有者余额应该是 INITIAL_SUPPLY - 5000
      const expectedBalance = INITIAL_SUPPLY - ethers.parseEther("5000");
      expect(await mszToken.balanceOf(owner.address)).to.equal(expectedBalance);
    });
  });

  describe("Exchange", function () {
    it("应该允许用户用MON兑换MSZ", async function () {
      const initialMszBalance = await mszToken.balanceOf(user1.address);
      
      // 用户授权MON代币
      await monToken.connect(user1).approve(await exchange.getAddress(), EXCHANGE_AMOUNT);
      
      // 执行兑换
      await exchange.connect(user1).exchangeMonToMsz(EXCHANGE_AMOUNT);
      
      // 检查用户MSZ余额增加
      expect(await mszToken.balanceOf(user1.address)).to.equal(initialMszBalance + EXCHANGE_AMOUNT);
      
      // 检查用户MON余额减少
      expect(await monToken.balanceOf(user1.address)).to.equal(
        ethers.parseEther("1000") - EXCHANGE_AMOUNT
      );
    });

    it("应该允许用户用MSZ兑换回MON", async function () {
      // 先兑换一些MSZ
      await monToken.connect(user1).approve(await exchange.getAddress(), EXCHANGE_AMOUNT);
      await exchange.connect(user1).exchangeMonToMsz(EXCHANGE_AMOUNT);
      
      const initialMonBalance = await monToken.balanceOf(user1.address);
      
      // 授权MSZ代币
      await mszToken.connect(user1).approve(await exchange.getAddress(), EXCHANGE_AMOUNT);
      
      // 兑换回MON
      await exchange.connect(user1).exchangeMszToMon(EXCHANGE_AMOUNT);
      
      // 检查MON余额恢复
      expect(await monToken.balanceOf(user1.address)).to.equal(initialMonBalance + EXCHANGE_AMOUNT);
    });

    it("汇率应该是1:1", async function () {
      const exchangeAmount = ethers.parseEther("50");
      
      // MON -> MSZ
      await monToken.connect(user1).approve(await exchange.getAddress(), exchangeAmount);
      await exchange.connect(user1).exchangeMonToMsz(exchangeAmount);
      
      // MSZ -> MON（应该得到相同的数量）
      await mszToken.connect(user1).approve(await exchange.getAddress(), exchangeAmount);
      const monBalanceBefore = await monToken.balanceOf(user1.address);
      await exchange.connect(user1).exchangeMszToMon(exchangeAmount);
      const monBalanceAfter = await monToken.balanceOf(user1.address);
      
      expect(monBalanceAfter - monBalanceBefore).to.equal(exchangeAmount);
    });

    it("应该拒绝数量为0的兑换", async function () {
      await monToken.connect(user1).approve(await exchange.getAddress(), EXCHANGE_AMOUNT);
      
      await expect(
        exchange.connect(user1).exchangeMonToMsz(0)
      ).to.be.revertedWith("Exchange: Amount must be greater than 0");
    });

    it("应该在MSZ不足时拒绝兑换", async function () {
      const largeAmount = ethers.parseEther("10000");
      await monToken.connect(user1).approve(await exchange.getAddress(), largeAmount);
      
      await expect(
        exchange.connect(user1).exchangeMonToMsz(largeAmount)
      ).to.be.revertedWith("Exchange: Insufficient MSZ tokens in contract");
    });

    it("应该在MON不足时拒绝赎回", async function () {
      const largeAmount = ethers.parseEther("10000");
      await mszToken.connect(user1).approve(await exchange.getAddress(), largeAmount);
      
      await expect(
        exchange.connect(user1).exchangeMszToMon(largeAmount)
      ).to.be.revertedWith("Exchange: Insufficient MON tokens in contract");
    });

    it("所有者应该可以提取MON", async function () {
      const withdrawAmount = ethers.parseEther("100");
      const initialBalance = await monToken.balanceOf(owner.address);
      
      await exchange.withdrawMon(withdrawAmount);
      
      expect(await monToken.balanceOf(owner.address)).to.equal(initialBalance + withdrawAmount);
    });
  });
});

