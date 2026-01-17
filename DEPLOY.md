# 部署指南

## 部署前准备

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件，内容如下：

```
MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz
PRIVATE_KEY=your_private_key_here
MON_TOKEN_ADDRESS=
```

**重要提示**：
- `PRIVATE_KEY`: 请替换为你的钱包私钥（确保钱包有足够的测试网代币）
- `MON_TOKEN_ADDRESS`: 如果Monad测试网有官方MON代币合约，请填写；否则留空会自动部署Mock MON合约
- **不要将包含真实私钥的.env文件提交到git仓库**

### 2. 检查配置

运行配置检查：

```bash
node scripts/check-config.js
```

### 3. 部署到Monad测试网

```bash
npm run deploy:testnet
```

## 部署后操作

部署成功后，你会得到以下合约地址：
- MSZ代币合约地址
- MON代币合约地址（或Mock MON地址）
- 兑换合约地址

**重要：部署后需要向兑换合约转入MON代币以提供赎回流动性！**

可以通过以下方式操作：
```javascript
// 在Hardhat console或其他工具中
const exchange = await ethers.getContractAt("Exchange", "兑换合约地址");
const monToken = await ethers.getContractAt("IERC20", "MON代币地址");

// 授权并转入MON代币
await monToken.approve(兑换合约地址, ethers.parseEther("5000"));
await exchange.depositMon(ethers.parseEther("5000"));
```
