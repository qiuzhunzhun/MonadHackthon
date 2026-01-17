'use client';

import { useState, useEffect } from 'react';

export default function WalletConnect({ account, chainId, isConnecting, onConnect, isCorrectNetwork, onSwitchNetwork }) {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (account) {
      fetchBalance();
    }
  }, [account, chainId]);

  const fetchBalance = async () => {
    if (typeof window === 'undefined' || !window.ethereum || !account) return;

    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest'],
      });
      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
      setBalance(balanceInEth.toFixed(4));
    } catch (error) {
      console.error('获取余额失败:', error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      {!account ? (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>连接钱包</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            连接您的钱包以开始使用MSZ私募基金平台
          </p>
          <button
            className="btn btn-primary"
            onClick={onConnect}
            disabled={isConnecting}
          >
            {isConnecting ? '连接中...' : '连接MetaMask钱包'}
          </button>
        </div>
      ) : (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>钱包已连接</h2>
          <div style={{ 
            background: 'var(--bg-color)', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>地址:</strong> <code style={{ color: 'var(--primary-color)' }}>{formatAddress(account)}</code>
            </div>
            {balance !== null && (
              <div>
                <strong>余额:</strong> {balance} MON
              </div>
            )}
            {!isCorrectNetwork && (
              <div style={{ marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={onSwitchNetwork}>
                  切换到Monad测试网
                </button>
              </div>
            )}
            {isCorrectNetwork && (
              <div style={{ marginTop: '0.5rem', color: 'var(--success-color)' }}>
                ✓ 已连接到Monad测试网
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

