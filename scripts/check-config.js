const fs = require('fs');
const path = require('path');

console.log("检查部署配置...\n");

const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.log("❌ 未找到 .env 文件");
  console.log("\n请创建 .env 文件并配置以下信息：");
  console.log("MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz");
  console.log("PRIVATE_KEY=your_private_key_here");
  console.log("MON_TOKEN_ADDRESS=  # 可选，如果不填将自动部署Mock MON合约");
  console.log("\n提示：可以从 .env.example 文件复制模板");
  process.exit(1);
}

require('dotenv').config();

const required = ['PRIVATE_KEY'];
const missing = [];

required.forEach(key => {
  if (!process.env[key] || process.env[key] === '' || process.env[key].includes('your_')) {
    missing.push(key);
  }
});

if (missing.length > 0) {
  console.log("❌ 缺少必要的配置：", missing.join(', '));
  console.log("\n请在 .env 文件中配置这些值");
  process.exit(1);
}

console.log("✅ 配置检查通过");
console.log("\n配置信息：");
console.log("- RPC URL:", process.env.MONAD_TESTNET_RPC_URL || "未设置（将使用默认值）");
console.log("- MON Token Address:", process.env.MON_TOKEN_ADDRESS || "未设置（将部署Mock MON）");
console.log("- Private Key: 已设置（****）");
console.log("\n可以运行部署命令：npm run deploy:testnet");

