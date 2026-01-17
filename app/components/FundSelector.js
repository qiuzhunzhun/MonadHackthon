'use client';

import { useState } from 'react';

// 示例私募基金列表
const FUNDS = [
  {
    id: 1,
    name: '创新科技基金',
    description: '专注于区块链和Web3技术的早期投资',
    minInvestment: 1000,
    targetAmount: 1000000,
    currentAmount: 450000,
    returnRate: '15-30%',
    riskLevel: '中等',
    status: '募集中',
  },
  {
    id: 2,
    name: '稳健收益基金',
    description: '投资于成熟DeFi协议和稳定币策略',
    minInvestment: 500,
    targetAmount: 500000,
    currentAmount: 320000,
    returnRate: '8-12%',
    riskLevel: '较低',
    status: '募集中',
  },
  {
    id: 3,
    name: '高成长基金',
    description: '聚焦新兴公链和基础设施项目',
    minInvestment: 2000,
    targetAmount: 2000000,
    currentAmount: 1200000,
    returnRate: '25-50%',
    riskLevel: '较高',
    status: '募集中',
  },
];

export default function FundSelector({ account, selectedFund, onSelectFund }) {

  const handleSelectFund = (fund) => {
    onSelectFund(fund);
  };

  const getProgress = (fund) => {
    return (fund.currentAmount / fund.targetAmount * 100).toFixed(1);
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem' }}>选择私募基金进行投资</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        使用您兑换得到的MSZ代币投资心仪的私募基金
      </p>
      
      {selectedFund ? (
        <div>
          <div style={{ 
            background: 'var(--bg-color)', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>{selectedFund.name}</h3>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                background: 'var(--primary-color)', 
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}>
                {selectedFund.status}
              </span>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {selectedFund.description}
            </p>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>风险等级:</strong> {selectedFund.riskLevel}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>预期收益:</strong> {selectedFund.returnRate}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>最低投资:</strong> {selectedFund.minInvestment} MSZ
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>募集进度</span>
                <span>{getProgress(selectedFund)}%</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '1rem', 
                background: 'var(--bg-color)', 
                borderRadius: '0.5rem',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${getProgress(selectedFund)}%`, 
                  height: '100%', 
                  background: 'var(--success-color)',
                  transition: 'width 0.3s'
                }}></div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {selectedFund.currentAmount.toLocaleString()} / {selectedFund.targetAmount.toLocaleString()} MSZ
              </div>
            </div>

            <div style={{ 
              background: 'var(--accent-color)', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>投资此基金</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', marginBottom: '1rem' }}>
                使用您的MSZ代币投资此私募基金
              </p>
              <button 
                className="btn"
                style={{ 
                  background: 'white', 
                  color: 'var(--accent-color)',
                  border: 'none',
                  width: '100%'
                }}
                onClick={() => alert('投资功能即将上线 - 使用您的MSZ代币投资此基金')}
              >
                投资全部MSZ代币
              </button>
            </div>
            
            <button 
              className="btn btn-secondary"
              onClick={() => onSelectFund(null)}
              style={{ marginTop: '1rem' }}
            >
              重新选择
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {FUNDS.map((fund) => (
            <div
              key={fund.id}
              onClick={() => handleSelectFund(fund)}
              style={{
                background: 'var(--bg-color)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: '2px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3>{fund.name}</h3>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  background: 'var(--primary-color)', 
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem'
                }}>
                  {fund.status}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {fund.description}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div><strong>风险:</strong> {fund.riskLevel}</div>
                <div><strong>收益:</strong> {fund.returnRate}</div>
                <div><strong>最低:</strong> {fund.minInvestment} MSZ</div>
                <div><strong>进度:</strong> {getProgress(fund)}%</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

