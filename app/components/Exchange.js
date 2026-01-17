'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Exchange({ account, contractAddresses }) {
  const [direction, setDirection] = useState('monToMsz'); // 'monToMsz' or 'mszToMon'
  const [amount, setAmount] = useState('');
  const [monBalance, setMonBalance] = useState(null);
  const [mszBalance, setMszBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const EXCHANGE_ABI = [
    'function exchangeMonToMsz(uint256 monAmount) external',
    'function exchangeMszToMon(uint256 mszAmount) external',
    'function getMszBalance() external view returns (uint256)',
    'function getMonBalance() external view returns (uint256)',
  ];

  const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function decimals() view returns (uint8)',
  ];

  useEffect(() => {
    if (account && contractAddresses.MON_TOKEN && contractAddresses.MSZ_TOKEN) {
      fetchBalances();
    }
  }, [account, contractAddresses]);

  const getProvider = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    return null;
  };

  const fetchBalances = async () => {
    const provider = getProvider();
    if (!provider || !account) return;

    try {
      // 获取MON余额
      if (contractAddresses.MON_TOKEN) {
        const monToken = new ethers.Contract(contractAddresses.MON_TOKEN, ERC20_ABI, provider);
        const monBal = await monToken.balanceOf(account);
        setMonBalance(ethers.formatEther(monBal));
      }

      // 获取MSZ余额
      if (contractAddresses.MSZ_TOKEN) {
        const mszToken = new ethers.Contract(contractAddresses.MSZ_TOKEN, ERC20_ABI, provider);
        const mszBal = await mszToken.balanceOf(account);
        setMszBalance(ethers.formatEther(mszBal));
      }
    } catch (error) {
      console.error('获取余额失败:', error);
      setMessage({ type: 'error', text: '获取余额失败，请检查合约地址配置' });
    }
  };

  const checkAllowance = async (tokenAddress, spender) => {
    const provider = getProvider();
    if (!provider || !account) return false;

    const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const allowance = await token.allowance(account, spender);
    return allowance > 0;
  };

  const approveToken = async (tokenAddress, spender, amount) => {
    const provider = getProvider();
    if (!provider) throw new Error('请先连接钱包');

    const signer = await provider.getSigner();
    const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const tx = await token.approve(spender, amount);
    await tx.wait();
  };

  const handleExchange = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: '请输入有效的兑换数量' });
      return;
    }

    if (!contractAddresses.EXCHANGE) {
      setMessage({ type: 'error', text: '兑换合约地址未配置' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const provider = getProvider();
      if (!provider) throw new Error('请先连接钱包');

      const signer = await provider.getSigner();
      const exchange = new ethers.Contract(contractAddresses.EXCHANGE, EXCHANGE_ABI, signer);
      const amountWei = ethers.parseEther(amount);

      if (direction === 'monToMsz') {
        // 检查授权
        const hasAllowance = await checkAllowance(contractAddresses.MON_TOKEN, contractAddresses.EXCHANGE);
        if (!hasAllowance) {
          setMessage({ type: 'info', text: '首次使用需要授权，请确认交易...' });
          await approveToken(contractAddresses.MON_TOKEN, contractAddresses.EXCHANGE, amountWei);
        }

        // 执行兑换
        setMessage({ type: 'info', text: '正在执行兑换，请确认交易...' });
        const tx = await exchange.exchangeMonToMsz(amountWei);
        setMessage({ type: 'info', text: `交易已提交: ${tx.hash}，等待确认...` });
        await tx.wait();
        setMessage({ type: 'success', text: '兑换成功！MON已兑换为MSZ' });
      } else {
        // MSZ -> MON
        const hasAllowance = await checkAllowance(contractAddresses.MSZ_TOKEN, contractAddresses.EXCHANGE);
        if (!hasAllowance) {
          setMessage({ type: 'info', text: '首次使用需要授权，请确认交易...' });
          await approveToken(contractAddresses.MSZ_TOKEN, contractAddresses.EXCHANGE, amountWei);
        }

        setMessage({ type: 'info', text: '正在执行兑换，请确认交易...' });
        const tx = await exchange.exchangeMszToMon(amountWei);
        setMessage({ type: 'info', text: `交易已提交: ${tx.hash}，等待确认...` });
        await tx.wait();
        setMessage({ type: 'success', text: '赎回成功！MSZ已兑换回MON' });
      }

      // 刷新余额
      await fetchBalances();
      setAmount('');
    } catch (error) {
      console.error('兑换失败:', error);
      if (error.code === 4001) {
        setMessage({ type: 'error', text: '用户拒绝了交易' });
      } else if (error.reason) {
        setMessage({ type: 'error', text: error.reason });
      } else {
        setMessage({ type: 'error', text: '兑换失败，请检查余额和合约状态' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMax = () => {
    if (direction === 'monToMsz' && monBalance) {
      setAmount(monBalance);
    } else if (direction === 'mszToMon' && mszBalance) {
      setAmount(mszBalance);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem' }}>MON ↔ MSZ 兑换</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        将您的MON代币兑换为MSZ代币，用于参与私募基金投资。兑换比例为1:1。
      </p>

      {/* 余额显示 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ 
          background: 'var(--bg-color)', 
          padding: '1rem', 
          borderRadius: '0.5rem'
        }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
            MON余额
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {monBalance !== null ? parseFloat(monBalance).toFixed(4) : '加载中...'}
          </div>
        </div>
        <div style={{ 
          background: 'var(--bg-color)', 
          padding: '1rem', 
          borderRadius: '0.5rem'
        }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
            MSZ余额
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {mszBalance !== null ? parseFloat(mszBalance).toFixed(4) : '加载中...'}
          </div>
        </div>
      </div>

      {/* 兑换方向选择 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="label">兑换方向</label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className={`btn ${direction === 'monToMsz' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setDirection('monToMsz')}
            style={{ flex: 1 }}
          >
            MON → MSZ
          </button>
          <button
            className={`btn ${direction === 'mszToMon' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setDirection('mszToMon')}
            style={{ flex: 1 }}
          >
            MSZ → MON
          </button>
        </div>
      </div>

      {/* 兑换数量输入 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <label className="label">兑换数量</label>
          <button
            className="btn btn-secondary"
            onClick={handleMax}
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
          >
            最大
          </button>
        </div>
        <input
          type="number"
          className="input"
          placeholder={`输入要兑换的${direction === 'monToMsz' ? 'MON' : 'MSZ'}数量`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
        />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          汇率: 1:1
        </div>
      </div>

      {/* 消息提示 */}
      {message.text && (
        <div style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 
                      message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 
                      'rgba(99, 102, 241, 0.1)',
          color: message.type === 'error' ? 'var(--error-color)' : 
                 message.type === 'success' ? 'var(--success-color)' : 
                 'var(--text-primary)',
        }}>
          {message.text}
        </div>
      )}

      {/* 兑换按钮 */}
      <button
        className="btn btn-primary"
        onClick={handleExchange}
        disabled={loading || !amount || parseFloat(amount) <= 0}
        style={{ width: '100%' }}
      >
        {loading ? '处理中...' : direction === 'monToMsz' ? '兑换 MON → MSZ' : '赎回 MSZ → MON'}
      </button>

      {/* 刷新余额按钮 */}
      <button
        className="btn btn-secondary"
        onClick={fetchBalances}
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        刷新余额
      </button>
    </div>
  );
}

