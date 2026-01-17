# 完整部署指南

本文档包含智能合约和前端应用的完整部署步骤。

## 一、智能合约部署

### 1. 准备工作

#### 1.1 配置环境变量

确保 `.env` 文件已创建并配置：

```bash
# Monad测试网RPC URL
MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz

# 部署账户私钥（请替换为你的钱包私钥）
PRIVATE_KEY=your_private_key_here

# MON代币合约地址（可选，如果不填将自动部署Mock MON合约）
MON_TOKEN_ADDRESS=
```

**重要提示**：
- 确保私钥对应的钱包有足够的测试网MON代币支付Gas费用
- 不要将包含真实私钥的`.env`文件提交到git仓库

#### 1.2 安装依赖

```bash
npm install
```

#### 1.3 编译合约

```bash
npm run compile
```

### 2. 部署合约到Monad测试网

#### 2.1 检查配置

```bash
node scripts/check-config.js
```

#### 2.2 执行部署

```bash
npm run deploy:testnet
```

部署完成后，会输出以下合约地址：
```
=== 部署完成 ===
MSZ代币合约地址: 0x...
MON代币合约地址: 0x...
兑换合约地址: 0x...
```

**请保存这些地址，后续配置前端时需要用到！**

### 3. 部署后的重要操作

#### 3.1 向兑换合约存入MON代币

为了提供赎回流动性，需要向兑换合约存入MON代币。

**方法一：使用Hardhat Console**

```bash
npx hardhat console --network monad-testnet
```

然后执行：

```javascript
const Exchange = await ethers.getContractFactory("Exchange");
const IERC20 = await ethers.getContractFactory("IERC20");

const exchangeAddress = "兑换合约地址";
const monTokenAddress = "MON代币合约地址";

const exchange = Exchange.attach(exchangeAddress);
const monToken = IERC20.attach(monTokenAddress);

// 授权（例如：授权5000个MON）
const amount = ethers.parseEther("5000");
const approveTx = await monToken.approve(exchangeAddress, amount);
await approveTx.wait();

// 存入MON
const depositTx = await exchange.depositMon(amount);
await depositTx.wait();

console.log("MON已存入兑换合约");
```

**方法二：使用前端界面**

部署前端后，使用钱包连接并存入MON。

#### 3.2 验证部署

使用区块浏览器查看合约：
- 访问 Monad测试网浏览器（如果可用）
- 搜索合约地址验证部署状态
- 查看合约交易记录

---

## 二、前端应用部署

### 1. 配置前端环境变量

创建 `.env.local` 文件：

```bash
# 合约地址（从部署步骤中获得的地址）
NEXT_PUBLIC_MSZ_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_MON_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_EXCHANGE_ADDRESS=0x...

# Monad测试网Chain ID
NEXT_PUBLIC_CHAIN_ID=41443
```

### 2. 安装前端依赖

```bash
npm install
```

### 3. 本地测试

#### 3.1 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

#### 3.2 测试功能

1. **连接钱包**
   - 安装MetaMask浏览器插件
   - 在MetaMask中添加Monad测试网：
     - Network Name: Monad Testnet
     - RPC URL: https://testnet-rpc.monad.xyz
     - Chain ID: 41443
     - Currency Symbol: MON
   - 连接钱包并确认签名

2. **测试兑换功能**
   - 确保钱包中有MON代币
   - 尝试MON兑换MSZ
   - 尝试MSZ兑换回MON

3. **测试私募基金选择**
   - 浏览基金列表
   - 选择基金查看详情

### 4. 构建生产版本

```bash
npm run build
```

构建成功后，会生成 `.next` 目录。

### 5. 部署到生产环境

#### 方法一：Vercel部署（推荐）

1. **安装Vercel CLI**（如果未安装）

```bash
npm i -g vercel
```

2. **登录Vercel**

```bash
vercel login
```

3. **部署**

```bash
vercel
```

或直接连接GitHub仓库，在Vercel网站上部署。

4. **配置环境变量**

在Vercel项目设置中添加环境变量：
- `NEXT_PUBLIC_MSZ_TOKEN_ADDRESS`
- `NEXT_PUBLIC_MON_TOKEN_ADDRESS`
- `NEXT_PUBLIC_EXCHANGE_ADDRESS`
- `NEXT_PUBLIC_CHAIN_ID`

#### 方法二：自托管部署

1. **构建应用**

```bash
npm run build
```

2. **启动生产服务器**

```bash
npm start
```

默认运行在 http://localhost:3000

3. **使用PM2管理进程**（可选）

```bash
npm install -g pm2
pm2 start npm --name "msz-app" -- start
pm2 save
pm2 startup
```

#### 方法三：Docker部署

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

构建和运行：

```bash
docker build -t msz-app .
docker run -p 3000:3000 --env-file .env.local msz-app
```

---

## 三、部署检查清单

### 智能合约部署
- [ ] `.env` 文件已配置
- [ ] 合约编译成功
- [ ] 合约部署到Monad测试网
- [ ] 保存了所有合约地址
- [ ] 向兑换合约存入了MON代币（提供赎回流动性）

### 前端部署
- [ ] `.env.local` 文件已配置所有合约地址
- [ ] 本地测试通过
- [ ] 生产版本构建成功
- [ ] 部署到生产环境
- [ ] 环境变量已正确配置
- [ ] 测试钱包连接功能
- [ ] 测试兑换功能
- [ ] 测试私募基金选择功能

---

## 四、常见问题

### Q1: 部署合约时提示"insufficient funds"？
**A:** 确保部署账户有足够的MON代币支付Gas费用。可以从Monad测试网水龙头获取测试代币。

### Q2: 前端无法连接到合约？
**A:** 检查：
- `.env.local` 中的合约地址是否正确
- 网络是否连接到Monad测试网
- MetaMask是否已正确配置网络

### Q3: 兑换交易失败？
**A:** 检查：
- 代币余额是否充足
- 是否已授权代币（首次使用需要授权）
- 兑换合约中是否有足够的流动性

### Q4: 如何获取测试网MON代币？
**A:** 
- 访问Monad测试网水龙头（如果可用）
- 或联系Monad测试网管理员

### Q5: 前端部署后无法访问？
**A:** 检查：
- 服务器是否正常运行
- 端口是否正确（默认3000）
- 防火墙设置
- 环境变量是否正确加载

---

## 五、部署后的维护

### 监控合约
- 定期检查合约余额
- 监控兑换交易
- 检查异常交易

### 更新前端
1. 修改代码
2. 本地测试
3. 重新构建和部署

### 升级合约
⚠️ **注意**：部署后的合约无法升级。如需更新功能，需要部署新合约并更新前端配置。

---

## 六、安全建议

1. **私钥管理**
   - 永远不要将私钥提交到代码仓库
   - 使用环境变量存储敏感信息
   - 考虑使用硬件钱包或多签钱包

2. **合约安全**
   - 部署前进行充分测试
   - 考虑进行安全审计
   - 使用已验证的OpenZeppelin合约

3. **前端安全**
   - 验证用户输入
   - 防止重入攻击
   - 使用HTTPS部署

4. **访问控制**
   - 限制所有者权限的使用
   - 实现多签机制
   - 监控异常交易

---

## 七、技术支持

如有问题，请检查：
1. 日志文件（检查错误信息）
2. 合约部署记录
3. 前端控制台错误
4. 区块链浏览器交易记录

