import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Progress, 
  Tag, 
  Table, 
  Modal, 
  Descriptions,
  Space,
  Divider,
  Tooltip,
  Badge,
  Button
} from 'antd';
import { 
  TrophyOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  StarOutlined,
  EyeOutlined,
  BarChartOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Tool Ranking 数据类型定义
interface ToolMetadata {
  toolId: string;
  toolName: string;
  category: string;
  version: string;
  developer: string;
  
  // 性能指标
  performance: {
    successRate: number; // 成功率
    avgResponseTime: number; // 平均响应时间 (ms)
    reliability: number; // 可靠性评分
    uptime: number; // 可用性
  };
  
  // 成本指标
  cost: {
    pricePerCall: number; // 每次调用价格
    priceModel: 'free' | 'pay-per-use' | 'subscription';
    totalCost: number; // 总成本
    costEfficiency: number; // 成本效率评分
  };
  
  // 质量指标
  quality: {
    rating: number; // 用户评分
    reviewCount: number; // 评价数量
    bugReports: number; // Bug 报告数
    lastUpdated: string; // 最后更新时间
  };
  
  // 使用统计
  usage: {
    totalCalls: number; // 总调用次数
    monthlyCalls: number; // 月调用次数
    uniqueUsers: number; // 唯一用户数
    growthRate: number; // 增长率
  };
  
  // 排名信息
  ranking: {
    overallScore: number; // 综合得分
    rank: number; // 排名
    scoreBreakdown: {
      performance: number;
      cost: number;
      quality: number;
      popularity: number;
    };
    recommendationReason: string; // 推荐理由
    alternatives: string[]; // 替代方案
  };
}

interface RankingCriteria {
  name: string;
  weight: number; // 权重 (0-1)
  description: string;
  icon: React.ReactNode;
}

const ToolRankingView: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<ToolMetadata | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // 排名标准配置
  const rankingCriteria: RankingCriteria[] = [
    {
      name: '性能表现',
      weight: 0.35,
      description: '成功率、响应时间、可靠性',
      icon: <ThunderboltOutlined />
    },
    {
      name: '成本效益',
      weight: 0.25,
      description: '价格、成本效率、性价比',
      icon: <DollarOutlined />
    },
    {
      name: '质量评分',
      weight: 0.25,
      description: '用户评分、稳定性、更新频率',
      icon: <StarOutlined />
    },
    {
      name: '使用热度',
      weight: 0.15,
      description: '调用量、用户数、增长趋势',
      icon: <BarChartOutlined />
    }
  ];

  // 示例工具数据
  const toolRankings: ToolMetadata[] = [
    {
      toolId: '1',
      toolName: 'GoogleMap MCP',
      category: '位置服务',
      version: '1.2.0',
      developer: 'Google Inc.',
      
      performance: {
        successRate: 98.5,
        avgResponseTime: 800,
        reliability: 95,
        uptime: 99.9
      },
      
      cost: {
        pricePerCall: 0.005,
        priceModel: 'pay-per-use',
        totalCost: 6.24,
        costEfficiency: 85
      },
      
      quality: {
        rating: 4.8,
        reviewCount: 1247,
        bugReports: 3,
        lastUpdated: '2024-01-15'
      },
      
      usage: {
        totalCalls: 1500,
        monthlyCalls: 450,
        uniqueUsers: 89,
        growthRate: 12.4
      },
      
      ranking: {
        overallScore: 92.3,
        rank: 1,
        scoreBreakdown: {
          performance: 95,
          cost: 85,
          quality: 96,
          popularity: 88
        },
        recommendationReason: '综合性能优秀，成功率高，响应速度快，适合高频率使用',
        alternatives: ['MapBox API', 'Here Maps API']
      }
    },
    {
      toolId: '2',
      toolName: 'YouTube ToolBox',
      category: '多媒体处理',
      version: '1.0.0',
      developer: 'Video Insights Co.',
      
      performance: {
        successRate: 94.2,
        avgResponseTime: 1200,
        reliability: 88,
        uptime: 98.5
      },
      
      cost: {
        pricePerCall: 0.02,
        priceModel: 'subscription',
        totalCost: 99,
        costEfficiency: 75
      },
      
      quality: {
        rating: 4.6,
        reviewCount: 856,
        bugReports: 8,
        lastUpdated: '2024-01-10'
      },
      
      usage: {
        totalCalls: 900,
        monthlyCalls: 280,
        uniqueUsers: 45,
        growthRate: 8.9
      },
      
      ranking: {
        overallScore: 87.1,
        rank: 2,
        scoreBreakdown: {
          performance: 88,
          cost: 75,
          quality: 92,
          popularity: 82
        },
        recommendationReason: '功能专业，适合视频分析需求，但成本较高',
        alternatives: ['Vimeo API', 'TikTok API']
      }
    },
    {
      toolId: '3',
      toolName: 'CSV Processor',
      category: '数据处理',
      version: '2.1.0',
      developer: 'DataFlow Solutions',
      
      performance: {
        successRate: 96.8,
        avgResponseTime: 500,
        reliability: 92,
        uptime: 99.5
      },
      
      cost: {
        pricePerCall: 0,
        priceModel: 'free',
        totalCost: 0,
        costEfficiency: 100
      },
      
      quality: {
        rating: 4.4,
        reviewCount: 432,
        bugReports: 2,
        lastUpdated: '2024-01-18'
      },
      
      usage: {
        totalCalls: 450,
        monthlyCalls: 120,
        uniqueUsers: 67,
        growthRate: 15.6
      },
      
      ranking: {
        overallScore: 89.7,
        rank: 3,
        scoreBreakdown: {
          performance: 94,
          cost: 100,
          quality: 88,
          popularity: 76
        },
        recommendationReason: '免费且高效，适合基础数据处理，性价比极高',
        alternatives: ['Excel API', 'Google Sheets API']
      }
    }
  ];

  // 表格列定义
  const columns = [
    {
      title: '排名',
      dataIndex: 'ranking',
      key: 'rank',
      width: 80,
      render: (ranking: any) => (
        <div style={{ textAlign: 'center' }}>
          {ranking.rank === 1 && <TrophyOutlined style={{ color: '#faad14', fontSize: 20 }} />}
          {ranking.rank === 2 && <TrophyOutlined style={{ color: '#c0c0c0', fontSize: 20 }} />}
          {ranking.rank === 3 && <TrophyOutlined style={{ color: '#cd7f32', fontSize: 20 }} />}
          {ranking.rank > 3 && <Text strong>#{ranking.rank}</Text>}
        </div>
      ),
    },
    {
      title: '工具名称',
      dataIndex: 'toolName',
      key: 'toolName',
      width: 180,
      render: (text: string, record: ToolMetadata) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            v{record.version} • by {record.developer}
          </Text>
        </div>
      ),
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => (
        <Tag color="blue" style={{ fontSize: 12 }}>
          {category}
        </Tag>
      ),
    },
    {
      title: '综合得分',
      dataIndex: 'ranking',
      key: 'overallScore',
      width: 120,
      render: (ranking: any) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: 24, 
            fontWeight: 'bold',
            color: ranking.overallScore >= 90 ? '#52c41a' : 
                   ranking.overallScore >= 80 ? '#faad14' : '#ff4d4f'
          }}>
            {ranking.overallScore}
          </div>
          <Text type="secondary" style={{ fontSize: 11 }}>/100</Text>
        </div>
      ),
    },
    {
      title: '性能表现',
      dataIndex: 'performance',
      key: 'performance',
      width: 120,
      render: (performance: any) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <Text style={{ fontSize: 12 }}>{performance.successRate}%</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ClockCircleOutlined style={{ color: '#1890ff' }} />
            <Text style={{ fontSize: 12 }}>{performance.avgResponseTime}ms</Text>
          </div>
        </div>
      ),
    },
    {
      title: '成本效益',
      dataIndex: 'cost',
      key: 'cost',
      width: 120,
      render: (cost: any) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <DollarOutlined style={{ color: '#52c41a' }} />
            <Text style={{ fontSize: 12 }}>
              {cost.priceModel === 'free' ? '免费' : `$${cost.pricePerCall}`}
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <BarChartOutlined style={{ color: '#faad14' }} />
            <Text style={{ fontSize: 12 }}>{cost.costEfficiency}/100</Text>
          </div>
        </div>
      ),
    },
    {
      title: '质量评分',
      dataIndex: 'quality',
      key: 'quality',
      width: 120,
      render: (quality: any) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <StarOutlined style={{ color: '#faad14' }} />
            <Text style={{ fontSize: 12 }}>{quality.rating}/5.0</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {quality.reviewCount} 评价
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: '推荐理由',
      dataIndex: 'ranking',
      key: 'recommendationReason',
      width: 200,
      render: (ranking: any) => (
        <Tooltip title={ranking.recommendationReason}>
          <Text style={{ fontSize: 12 }} ellipsis>
            {ranking.recommendationReason}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: ToolMetadata) => (
        <Button 
          type="link" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedTool(record);
            setDetailModalVisible(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrophyOutlined />
          Tool Ranking & Recommendation
        </Title>
        <Text type="secondary">
          基于多维度指标的工具排名和推荐系统，帮助您选择最适合的工具
        </Text>
      </div>

      {/* 排名标准说明 */}
      <Card title="排名标准" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {rankingCriteria.map((criteria, index) => (
            <Col span={6} key={index}>
              <Card size="small" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 8, color: '#1890ff' }}>
                  {criteria.icon}
                </div>
                <Title level={5} style={{ margin: 0 }}>{criteria.name}</Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {criteria.description}
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Progress 
                    percent={criteria.weight * 100} 
                    size="small" 
                    showInfo={false}
                    strokeColor="#1890ff"
                  />
                  <Text style={{ fontSize: 11, color: '#1890ff' }}>
                    权重: {criteria.weight * 100}%
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 排名表格 */}
      <Card title="工具排名列表" extra={<Badge count={toolRankings.length} />}>
        <Table
          columns={columns}
          dataSource={toolRankings}
          rowKey="toolId"
          pagination={false}
          scroll={{ x: 1120 }}
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title={`工具详情 - ${selectedTool?.toolName}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTool && (
          <div>
            {/* 基本信息 */}
            <Descriptions column={2} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="工具名称">{selectedTool.toolName}</Descriptions.Item>
              <Descriptions.Item label="分类">{selectedTool.category}</Descriptions.Item>
              <Descriptions.Item label="版本">{selectedTool.version}</Descriptions.Item>
              <Descriptions.Item label="开发者">{selectedTool.developer}</Descriptions.Item>
              <Descriptions.Item label="综合排名">
                <Badge count={`#${selectedTool.ranking.rank}`} style={{ backgroundColor: '#52c41a' }} />
              </Descriptions.Item>
              <Descriptions.Item label="综合得分">
                <Text strong style={{ 
                  fontSize: 18,
                  color: selectedTool.ranking.overallScore >= 90 ? '#52c41a' : 
                         selectedTool.ranking.overallScore >= 80 ? '#faad14' : '#ff4d4f'
                }}>
                  {selectedTool.ranking.overallScore}/100
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* 得分分解 */}
            <Title level={5}>得分分解</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <ThunderboltOutlined style={{ fontSize: 20, color: '#52c41a', marginBottom: 8 }} />
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {selectedTool.ranking.scoreBreakdown.performance}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>性能表现</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <DollarOutlined style={{ fontSize: 20, color: '#faad14', marginBottom: 8 }} />
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {selectedTool.ranking.scoreBreakdown.cost}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>成本效益</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <StarOutlined style={{ fontSize: 20, color: '#1890ff', marginBottom: 8 }} />
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {selectedTool.ranking.scoreBreakdown.quality}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>质量评分</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <BarChartOutlined style={{ fontSize: 20, color: '#722ed1', marginBottom: 8 }} />
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {selectedTool.ranking.scoreBreakdown.popularity}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>使用热度</Text>
                </Card>
              </Col>
            </Row>

            <Divider />

            {/* 详细指标 */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="性能指标" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>成功率: </Text>
                      <Progress percent={selectedTool.performance.successRate} size="small" />
                    </div>
                    <div>
                      <Text strong>平均响应时间: </Text>
                      <Text>{selectedTool.performance.avgResponseTime}ms</Text>
                    </div>
                    <div>
                      <Text strong>可靠性: </Text>
                      <Progress percent={selectedTool.performance.reliability} size="small" />
                    </div>
                    <div>
                      <Text strong>可用性: </Text>
                      <Progress percent={selectedTool.performance.uptime} size="small" />
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="成本信息" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>价格模式: </Text>
                      <Tag color={selectedTool.cost.priceModel === 'free' ? 'green' : 'blue'}>
                        {selectedTool.cost.priceModel === 'free' ? '免费' : 
                         selectedTool.cost.priceModel === 'pay-per-use' ? '按次付费' : '订阅制'}
                      </Tag>
                    </div>
                    <div>
                      <Text strong>每次调用价格: </Text>
                      <Text>${selectedTool.cost.pricePerCall}</Text>
                    </div>
                    <div>
                      <Text strong>总成本: </Text>
                      <Text>${selectedTool.cost.totalCost}</Text>
                    </div>
                    <div>
                      <Text strong>成本效率: </Text>
                      <Progress percent={selectedTool.cost.costEfficiency} size="small" />
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Divider />

            {/* 推荐理由和替代方案 */}
            <Card title="推荐分析" size="small">
              <div style={{ marginBottom: 16 }}>
                <Text strong>推荐理由:</Text>
                <div style={{ 
                  background: '#f6ffed', 
                  padding: 12, 
                  borderRadius: 6, 
                  marginTop: 8,
                  border: '1px solid #b7eb8f'
                }}>
                  <Text>{selectedTool.ranking.recommendationReason}</Text>
                </div>
              </div>
              
              <div>
                <Text strong>替代方案:</Text>
                <div style={{ marginTop: 8 }}>
                  {selectedTool.ranking.alternatives.map((alt, index) => (
                    <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                      {alt}
                    </Tag>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ToolRankingView;
