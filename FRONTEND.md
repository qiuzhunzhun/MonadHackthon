# 前端使用指南

## 项目说明

这是一个Next.js前端应用，用于与MSZ私募基金代币化智能合约交互。

## 功能特性

1. **钱包连接**
   - 支持MetaMask钱包连接
   - 自动检测和切换到Monad测试网
   - 连接时请求签名以验证身份

2. **私募基金选择**
   - 显示多个私募基金选项
   - 查看基金详情、风险等级、预期收益
   - 显示募集进度

3. **MON与MSZ兑换**
   - 支持MON兑换MSZ（投资）
   - 支持MSZ兑换回MON（赎回）
   - 1:1汇率实时显示
   - 自动授权代币
   - 实时余额显示

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件（参考 `.env.local.example`）：

```bash
# 合约地址（部署后填写）
NEXT_PUBLIC_MSZ_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_MON_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_EXCHANGE_ADDRESS=0x...

# Monad测试网Chain ID
NEXT_PUBLIC_CHAIN_ID=41443
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 使用流程

### 1. 连接钱包

- 点击"连接MetaMask钱包"按钮
- 在MetaMask中确认连接请求
- 如果网络不正确，会自动提示切换到Monad测试网
- 连接成功后会请求签名以验证身份

### 2. 选择私募基金

- 浏览可用的私募基金
- 点击基金卡片查看详细信息
- 查看风险等级、预期收益、募集进度

### 3. 兑换代币

**MON → MSZ（投资）**：
1. 选择"MON → MSZ"方向
2. 输入要兑换的MON数量（或点击"最大"）
3. 首次使用需要授权（确认交易）
4. 执行兑换（确认交易）
5. 等待交易确认

**MSZ → MON（赎回）**：
1. 选择"MSZ → MON"方向
2. 输入要兑换的MSZ数量（或点击"最大"）
3. 首次使用需要授权（确认交易）
4. 执行赎回（确认交易）
5. 等待交易确认

## 技术栈

- **Next.js 14** - React框架
- **ethers.js v6** - Web3交互
- **MetaMask** - 钱包连接
- **Tailwind CSS** - 样式（内联样式）

## 注意事项

1. **合约地址配置**：部署合约后，务必在 `.env.local` 中配置正确的合约地址
2. **网络要求**：确保连接到Monad测试网（Chain ID: 41443）
3. **钱包准备**：确保MetaMask钱包中有足够的MON代币用于兑换
4. **Gas费用**：每次交易需要支付Gas费用
5. **首次授权**：首次使用某个代币时，需要先授权才能兑换

## 常见问题

**Q: 无法连接钱包？**
A: 确保已安装MetaMask浏览器插件，并刷新页面重试。

**Q: 交易失败？**
A: 检查：
- 账户余额是否充足
- 是否已授权代币
- 合约地址是否正确
- 网络是否连接到Monad测试网

**Q: 余额不更新？**
A: 点击"刷新余额"按钮，或等待交易确认后自动刷新。

**Q: 如何切换到Monad测试网？**
A: 连接钱包时如果网络不正确，会提示切换。也可以手动在MetaMask中添加网络：
- Chain ID: 41443
- RPC URL: https://testnet-rpc.monad.xyz
- Currency Symbol: MON

