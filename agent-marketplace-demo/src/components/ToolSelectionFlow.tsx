import React from 'react';
import { Card, Steps, Progress, Tag, Row, Col, Typography, Space } from 'antd';
import { 
  SearchOutlined, 
  ToolOutlined, 
  TrophyOutlined, 
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface ToolSelectionFlowProps {
  query: string;
  discoveredTools: Array<{
    name: string;
    category: string;
    description: string;
    matchScore: number;
  }>;
  rankedTools: Array<{
    name: string;
    rank: number;
    reasoning: string;
    matchScore: number;
    selected: boolean;
  }>;
  selectedTool: string;
}

const ToolSelectionFlow: React.FC<ToolSelectionFlowProps> = ({
  query,
  discoveredTools,
  rankedTools,
  selectedTool
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  };

  return (
    <Card title="工具选择流程可视化" style={{ marginBottom: 16 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        
        {/* 步骤流程 */}
        <div>
          <Title level={5}>处理流程</Title>
          <Steps
            current={3}
            items={[
              {
                title: 'Query 分析',
                description: '解析用户查询',
                icon: <SearchOutlined />
              },
              {
                title: '工具发现',
                description: '搜索可用 MCP 工具',
                icon: <ToolOutlined />
              },
              {
                title: '工具排序',
                description: '基于匹配度排序',
                icon: <TrophyOutlined />
              },
              {
                title: '工具选择',
                description: '选择最佳工具',
                icon: <CheckCircleOutlined />
              }
            ]}
          />
        </div>

        {/* Query 分析 */}
        <Card size="small" title="1. Query 分析" style={{ background: '#f6f8fa' }}>
          <Text code style={{ fontSize: 14 }}>{query}</Text>
        </Card>

        {/* 工具发现 */}
        <Card size="small" title="2. MCP 工具发现" style={{ background: '#f0f9ff' }}>
          <Row gutter={[16, 16]}>
            {discoveredTools.map((tool, index) => (
              <Col span={8} key={index}>
                <Card size="small" style={{ height: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: 12 }}>{tool.name}</Text>
                    <br />
                    <Tag color="blue" style={{ fontSize: 10, margin: '4px 0' }}>
                      {tool.category}
                    </Tag>
                    <br />
                    <Text type="secondary" style={{ fontSize: 10 }}>
                      {tool.description}
                    </Text>
                    <br />
                    <Progress
                      percent={tool.matchScore}
                      size="small"
                      strokeColor={getScoreColor(tool.matchScore)}
                      style={{ marginTop: 8 }}
                    />
                    <Text style={{ fontSize: 10, color: getScoreColor(tool.matchScore) }}>
                      匹配度: {tool.matchScore}%
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* 工具排序 */}
        <Card size="small" title="3. 工具排序与推荐" style={{ background: '#f6ffed' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {rankedTools.map((tool, index) => (
              <div
                key={index}
                style={{
                  padding: 12,
                  border: tool.selected ? '2px solid #52c41a' : '1px solid #d9d9d9',
                  borderRadius: 8,
                  background: tool.selected ? '#f6ffed' : '#fff',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      fontSize: 20, 
                      minWidth: 30, 
                      textAlign: 'center',
                      background: tool.selected ? '#52c41a' : '#f0f0f0',
                      borderRadius: '50%',
                      padding: '4px 8px'
                    }}>
                      {getRankIcon(tool.rank)}
                    </div>
                    <div>
                      <Text strong style={{ fontSize: 14 }}>{tool.name}</Text>
                      {tool.selected && (
                        <Tag color="green" style={{ marginLeft: 8 }}>已选择</Tag>
                      )}
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {tool.reasoning}
                      </Text>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Progress
                      type="circle"
                      percent={tool.matchScore}
                      size={60}
                      strokeColor={getScoreColor(tool.matchScore)}
                    />
                    <br />
                    <Text style={{ fontSize: 10, color: getScoreColor(tool.matchScore) }}>
                      匹配度: {tool.matchScore}%
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </Space>
        </Card>

        {/* 最终选择 */}
        <Card size="small" title="4. 最终工具选择" style={{ background: '#fff7e6' }}>
          <div style={{ textAlign: 'center', padding: 20 }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
            <br />
            <Title level={4} style={{ color: '#52c41a', margin: 0 }}>
              选择工具: {selectedTool}
            </Title>
            <Text type="secondary">
              基于匹配度分析和排序结果，该工具最适合处理当前查询
            </Text>
          </div>
        </Card>
      </Space>
    </Card>
  );
};

export default ToolSelectionFlow;
