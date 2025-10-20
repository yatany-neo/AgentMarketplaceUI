import React from 'react';
import { Card, Row, Col, Progress, Tag, Typography } from 'antd';
import { TrophyOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ToolMatchingChartProps {
  tools: Array<{
    name: string;
    category: string;
    matchScore: number;
    reasoning: string;
    rank: number;
    selected: boolean;
  }>;
}

const ToolMatchingChart: React.FC<ToolMatchingChartProps> = ({ tools }) => {
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
    <Card title="工具匹配度分析" size="small" style={{ marginTop: 16 }}>
      <Row gutter={[16, 16]}>
        {tools.map((tool, index) => (
          <Col span={8} key={index}>
            <Card 
              size="small" 
              style={{ 
                height: '100%',
                border: tool.selected ? '2px solid #52c41a' : '1px solid #d9d9d9',
                background: tool.selected ? '#f6ffed' : '#fff'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                {/* 排名图标 */}
                <div style={{ 
                  fontSize: 24, 
                  marginBottom: 8,
                  background: tool.selected ? '#52c41a' : '#f0f0f0',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px'
                }}>
                  {getRankIcon(tool.rank)}
                </div>

                {/* 工具名称 */}
                <Title level={5} style={{ margin: '0 0 8px 0', fontSize: 14 }}>
                  {tool.name}
                  {tool.selected && <Tag color="green" style={{ marginLeft: 8, fontSize: 10 }}>已选择</Tag>}
                </Title>

                {/* 分类标签 */}
                <Tag color="blue" style={{ fontSize: 10, marginBottom: 8 }}>
                  {tool.category}
                </Tag>

                {/* 匹配度进度条 */}
                <div style={{ marginBottom: 8 }}>
                  <Progress
                    percent={tool.matchScore}
                    size="small"
                    strokeColor={getScoreColor(tool.matchScore)}
                    showInfo={false}
                  />
                  <Text style={{ 
                    fontSize: 12, 
                    color: getScoreColor(tool.matchScore),
                    fontWeight: 'bold'
                  }}>
                    匹配度: {tool.matchScore}%
                  </Text>
                </div>

                {/* 推荐原因 */}
                <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>
                  {tool.reasoning}
                </Text>

                {/* 选择指示器 */}
                {tool.selected && (
                  <div style={{ marginTop: 8 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                    <Text style={{ color: '#52c41a', fontSize: 10, marginLeft: 4 }}>
                      最佳选择
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 匹配度对比图表 */}
      <div style={{ marginTop: 16, padding: 16, background: '#fafafa', borderRadius: 8 }}>
        <Title level={5} style={{ textAlign: 'center', marginBottom: 16 }}>
          工具匹配度对比
        </Title>
        <Row gutter={[8, 8]}>
          {tools.map((tool, index) => (
            <Col span={24} key={index}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ minWidth: 80, textAlign: 'right' }}>
                  <Text style={{ fontSize: 12 }}>{tool.name}</Text>
                </div>
                <div style={{ flex: 1 }}>
                  <Progress
                    percent={tool.matchScore}
                    strokeColor={getScoreColor(tool.matchScore)}
                    showInfo={false}
                    size="small"
                  />
                </div>
                <div style={{ minWidth: 40, textAlign: 'left' }}>
                  <Text style={{ 
                    fontSize: 12, 
                    color: getScoreColor(tool.matchScore),
                    fontWeight: 'bold'
                  }}>
                    {tool.matchScore}%
                  </Text>
                </div>
                {tool.selected && (
                  <TrophyOutlined style={{ color: '#faad14', fontSize: 16 }} />
                )}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Card>
  );
};

export default ToolMatchingChart;
