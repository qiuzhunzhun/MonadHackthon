# 快速开始部署

## 一键部署脚本

### 1. 部署智能合约

```bash
# 1. 确保.env已配置
cat .env

# 2. 编译合约
npm run compile

# 3. 部署到Monad测试网
npm run deploy:testnet
```

**保存输出的合约地址！**

### 2. 配置前端

创建 `.env.local` 文件，填入合约地址：

```bash
cat > .env.local << EOL
NEXT_PUBLIC_MSZ_TOKEN_ADDRESS=你的MSZ代币地址
NEXT_PUBLIC_MON_TOKEN_ADDRESS=你的MON代币地址
NEXT_PUBLIC_EXCHANGE_ADDRESS=你的兑换合约地址
NEXT_PUBLIC_CHAIN_ID=41443
EOL
```

### 3. 启动前端

```bash
# 开发模式
npm run dev

# 或生产模式
npm run build
npm start
```

### 4. 访问应用

打开浏览器访问: http://localhost:3000

---

## 完整文档

详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)
前端使用说明请查看 [FRONTEND.md](./FRONTEND.md)
