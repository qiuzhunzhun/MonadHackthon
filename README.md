# Monad私募基金代币化项目

## 项目简介

这是一个部署在Monad测试网上的DeFi项目，主要实现私募基金代币化功能：

- **MSZ代币**：项目方发行的代币，初始发行1万个
- **兑换功能**：支持MON代币与MSZ代币双向兑换，1:1汇率
- **使用场景**：散户可以通过MON兑换MSZ来间接投资私募基金，也可以随时以1:1汇率赎回

## 功能特性

1. **MSZ代币发行**：初始发行10,000个MSZ代币
2. **MON兑换MSZ**：用户可以使用MON代币兑换MSZ代币（1:1汇率）
3. **MSZ赎回MON**：用户可以使用MSZ代币兑换回MON代币（1:1汇率）
4. **资金管理**：项目方可以提取MON代币用于私募基金投资

## 合约说明

### MSZToken.sol
MSZ代币合约，基于OpenZeppelin的ERC20标准实现：
- 代币名称：MSZ Token
- 代币符号：MSZ
- 初始供应量：10,000 MSZ
- 支持铸造和销毁功能（仅所有者）

### Exchange.sol
兑换合约，实现MON与MSZ的双向兑换：
- `exchangeMonToMsz(uint256 amount)`: 使用MON兑换MSZ
- `exchangeMszToMon(uint256 amount)`: 使用MSZ兑换回MON
- `withdrawMon(uint256 amount)`: 所有者提取MON（用于私募投资）
- `depositMon(uint256 amount)`: 所有者存入MON（提供赎回流动性）
- `depositMsz(uint256 amount)`: 所有者存入MSZ（提供兑换流动性）

## 安装和部署

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写以下信息：

```bash
cp .env.example .env
```

编辑 `.env` 文件：
```
MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz
PRIVATE_KEY=your_private_key_here
MON_TOKEN_ADDRESS=0x...  # 可选，如果不设置将部署Mock MON合约
```

### 3. 编译合约

```bash
npm run compile
```

### 4. 运行测试

```bash
npm test
```

### 5. 部署到Monad测试网

```bash
npm run deploy:testnet
```

部署完成后，脚本会输出：
- MSZ代币合约地址
- MON代币合约地址（或Mock MON地址）
- 兑换合约地址

## 使用流程

### 对于散户用户：

1. **投资**：
   - 授权MON代币给兑换合约
   - 调用 `exchangeMonToMsz(amount)` 将MON兑换为MSZ
   - 获得等量的MSZ代币

2. **退出**：
   - 授权MSZ代币给兑换合约
   - 调用 `exchangeMszToMon(amount)` 将MSZ兑换回MON
   - 获得等量的MON代币（1:1汇率）

### 对于项目方：

1. **初始化**：
   - 部署合约后，将部分MSZ代币转移到兑换合约以提供初始流动性
   - 将部分MON代币转移到兑换合约以提供赎回流动性

2. **提取资金**：
   - 调用 `withdrawMon(amount)` 提取MON代币用于私募基金投资

3. **管理流动性**：
   - 根据需要调用 `depositMon()` 或 `depositMsz()` 来管理合约中的流动性

## 项目结构

```
Monad-hackathon/
├── contracts/
│   ├── MSZToken.sol          # MSZ代币合约
│   ├── Exchange.sol          # 兑换合约
│   └── MockMON.sol           # Mock MON代币（仅用于测试）
├── scripts/
│   └── deploy.js             # 部署脚本
├── test/
│   └── Exchange.test.js      # 测试文件
├── hardhat.config.js         # Hardhat配置
├── package.json              # 项目依赖
└── README.md                 # 项目说明
```

## 注意事项

1. **MON代币地址**：如果Monad测试网有官方的MON代币合约，请在部署时使用官方地址。否则，部署脚本会自动部署Mock MON合约用于测试。

2. **流动性管理**：确保兑换合约中有足够的MSZ和MON代币，以支持用户的兑换和赎回需求。

3. **安全性**：
   - 妥善保管私钥，不要提交到代码仓库
   - 在生产环境部署前，建议进行充分的安全审计
   - 使用多签钱包管理合约所有者权限

## 许可证

MIT License

