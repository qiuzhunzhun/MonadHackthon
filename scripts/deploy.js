const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("部署账户:", deployer.address);
  console.log("账户余额:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // 部署MSZ代币合约
  console.log("\n开始部署MSZ代币合约...");
  const MSZToken = await ethers.getContractFactory("MSZToken");
  const mszToken = await MSZToken.deploy(deployer.address); // 将初始供应量发给部署者
  await mszToken.waitForDeployment();
  const mszTokenAddress = await mszToken.getAddress();
  console.log("MSZ代币合约已部署:", mszTokenAddress);

  // 获取初始供应量
  const totalSupply = await mszToken.totalSupply();
  console.log("MSZ总供应量:", ethers.formatEther(totalSupply), "MSZ");

  // 检查MON代币地址（从环境变量或使用Mock）
  let monTokenAddress = process.env.MON_TOKEN_ADDRESS;
  
  if (!monTokenAddress || monTokenAddress === "") {
    console.log("\n未设置MON_TOKEN_ADDRESS，部署Mock MON代币合约...");
    const MockMON = await ethers.getContractFactory("MockMON");
    const mockMON = await MockMON.deploy();
    await mockMON.waitForDeployment();
    monTokenAddress = await mockMON.getAddress();
    console.log("Mock MON代币合约已部署:", monTokenAddress);
  } else {
    console.log("\n使用指定的MON代币地址:", monTokenAddress);
  }

  // 部署兑换合约
  console.log("\n开始部署兑换合约...");
  const Exchange = await ethers.getContractFactory("Exchange");
  const exchange = await Exchange.deploy(mszTokenAddress, monTokenAddress, deployer.address);
  await exchange.waitForDeployment();
  const exchangeAddress = await exchange.getAddress();
  console.log("兑换合约已部署:", exchangeAddress);

  // 将初始MSZ代币转移到兑换合约（用于提供初始流动性）
  // 注意：在实际部署中，你可能希望保留部分代币或全部转移到兑换合约
  console.log("\n准备转移MSZ代币到兑换合约...");
  const transferAmount = ethers.parseEther("5000"); // 转移5000个MSZ到兑换合约
  const transferTx = await mszToken.transfer(exchangeAddress, transferAmount);
  await transferTx.wait();
  console.log("已转移", ethers.formatEther(transferAmount), "MSZ到兑换合约");

  console.log("\n=== 部署完成 ===");
  console.log("MSZ代币合约地址:", mszTokenAddress);
  console.log("MON代币合约地址:", monTokenAddress);
  console.log("兑换合约地址:", exchangeAddress);
  console.log("\n接下来的步骤：");
  console.log("1. 向兑换合约转入MON代币以提供赎回流动性");
  console.log("2. 用户可以开始使用MON兑换MSZ");
  console.log("3. 用户也可以使用MSZ兑换回MON（1:1汇率）");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

