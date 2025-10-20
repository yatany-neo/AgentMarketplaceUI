import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Tag, 
  Progress, 
  Typography, 
  Button,
  Modal,
  Descriptions,
  Space,
  Divider,
  Badge,
  Tooltip,
  Rate,
  Timeline,
  Alert
} from 'antd';
import { 
  ToolOutlined, 
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  BarChartOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// MCP Tool 数据类型定义
interface MCPTool {
  id: string;
  name: string;
  description: string;
  category: string;
  endpoint: string;
  version: string;
  status: 'active' | 'inactive' | 'pending' | 'error';
  usage: number;
  rating: number;
  totalCalls: number;
  successRate: number;
  avgResponseTime: number;
  lastUsed: string;
  createdAt: string;
  developer: string;
  documentation: string;
  tags: string[];
  capabilities: string[];
  pricing: {
    model: 'free' | 'pay-per-use' | 'subscription';
    price?: number;
    unit?: string;
  };
}


interface MCPToolDeveloperViewProps {
  onToolSubmit: (tool: any) => void;
}

const MCPToolDeveloperView: React.FC<MCPToolDeveloperViewProps> = ({ onToolSubmit }) => {
  const [selectedTool, setSelectedTool] = useState<MCPTool | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [analyticsModalVisible, setAnalyticsModalVisible] = useState(false);
  const [toolFormVisible, setToolFormVisible] = useState(false);

  // 示例 MCP 工具数据
  const mcpTools: MCPTool[] = [
    {
      id: '1',
      name: 'GoogleMap MCP',
      description: '提供地图查询、路线规划和地理编码服务',
      category: '位置服务',
      endpoint: 'https://maps.googleapis.com/mcp/v1',
      version: '1.2.0',
      status: 'active',
      usage: 1247,
      rating: 4.8,
      totalCalls: 15680,
      successRate: 98.5,
      avgResponseTime: 0.8,
      lastUsed: '2分钟前',
      createdAt: '2024-01-15',
      developer: 'Google Inc.',
      documentation: 'https://developers.google.com/maps/mcp',
      tags: ['地图', '导航', '地理编码', '路线规划'],
      capabilities: ['地址解析', '坐标转换', '路线计算', '附近搜索'],
      pricing: {
        model: 'pay-per-use',
        price: 0.005,
        unit: 'per request'
      }
    },
    {
      id: '2',
      name: 'YouTube ToolBox',
      description: 'YouTube 视频内容分析和数据处理工具',
      category: '多媒体处理',
      endpoint: 'https://youtube-toolbox.mcp.com/v1',
      version: '2.1.0',
      status: 'active',
      usage: 856,
      rating: 4.6,
      totalCalls: 11200,
      successRate: 94.2,
      avgResponseTime: 1.2,
      lastUsed: '5分钟前',
      createdAt: '2024-01-10',
      developer: 'YouTube Tools Corp.',
      documentation: 'https://docs.youtube-toolbox.mcp.com',
      tags: ['视频', '分析', '内容提取', '情感分析'],
      capabilities: ['视频信息提取', '评论分析', '标签识别', '内容分类'],
      pricing: {
        model: 'subscription',
        price: 29.99,
        unit: 'per month'
      }
    },
    {
      id: '3',
      name: 'CSV Processor',
      description: 'CSV 文件读取、解析和数据处理工具',
      category: '数据处理',
      endpoint: 'https://csv-processor.mcp.com/v1',
      version: '1.5.0',
      status: 'active',
      usage: 432,
      rating: 4.4,
      totalCalls: 6800,
      successRate: 96.8,
      avgResponseTime: 0.5,
      lastUsed: '10分钟前',
      createdAt: '2024-01-08',
      developer: 'DataTools Inc.',
      documentation: 'https://docs.csv-processor.mcp.com',
      tags: ['CSV', '数据处理', '文件解析', '数据分析'],
      capabilities: ['文件读取', '数据清洗', '格式转换', '统计分析'],
      pricing: {
        model: 'free'
      }
    },
    {
      id: '4',
      name: 'PDF Generator',
      description: 'PDF 文档生成和格式化工具',
      category: '文档处理',
      endpoint: 'https://pdf-generator.mcp.com/v1',
      version: '1.3.0',
      status: 'pending',
      usage: 0,
      rating: 0,
      totalCalls: 0,
      successRate: 0,
      avgResponseTime: 0,
      lastUsed: '从未使用',
      createdAt: '2024-01-20',
      developer: 'DocTools Ltd.',
      documentation: 'https://docs.pdf-generator.mcp.com',
      tags: ['PDF', '文档生成', '格式化', '报告'],
      capabilities: ['PDF生成', '模板渲染', '图表插入', '格式控制'],
      pricing: {
        model: 'pay-per-use',
        price: 0.02,
        unit: 'per page'
      }
    }
  ];

  // 计算统计数据
  const totalTools = mcpTools.length;
  const activeTools = mcpTools.filter(tool => tool.status === 'active').length;
  const totalUsage = mcpTools.reduce((sum, tool) => sum + tool.usage, 0);
  const avgRating = mcpTools.reduce((sum, tool) => sum + tool.rating, 0) / totalTools;

  // 表格列定义
  const columns = [
    {
      title: '工具名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: MCPTool) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            v{record.version} • {record.developer}
          </Text>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'green', icon: <CheckCircleOutlined />, text: '运行中' },
          inactive: { color: 'default', icon: <ClockCircleOutlined />, text: '已停用' },
          pending: { color: 'orange', icon: <ClockCircleOutlined />, text: '审核中' },
          error: { color: 'red', icon: <ExclamationCircleOutlined />, text: '错误' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '使用量',
      dataIndex: 'usage',
      key: 'usage',
      width: 120,
      render: (usage: number, record: MCPTool) => (
        <div>
          <Text strong>{usage.toLocaleString()}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            总调用: {record.totalCalls.toLocaleString()}
          </Text>
        </div>
      ),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating: number) => (
        <div>
          <Rate disabled value={rating} style={{ fontSize: 12 }} />
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {rating}/5.0
          </Text>
        </div>
      ),
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      width: 100,
      render: (rate: number) => (
        <div>
          <Progress 
            percent={rate} 
            size="small" 
            status={rate >= 95 ? 'success' : rate >= 80 ? 'normal' : 'exception'}
          />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {rate}%
          </Text>
        </div>
      ),
    },
    {
      title: '响应时间',
      dataIndex: 'avgResponseTime',
      key: 'avgResponseTime',
      width: 100,
      render: (time: number) => (
        <Text style={{ color: time <= 1 ? '#52c41a' : time <= 2 ? '#faad14' : '#ff4d4f' }}>
          {time}s
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: MCPTool) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedTool(record);
                setDetailModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="数据分析">
            <Button 
              type="link" 
              size="small" 
              icon={<BarChartOutlined />}
              onClick={() => {
                setSelectedTool(record);
                setAnalyticsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="link" 
              size="small" 
              icon={<EditOutlined />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ToolOutlined />
          MCP Tool 开发者中心
        </Title>
        <Text type="secondary">
          管理您的 MCP 工具，监控使用情况，优化性能
        </Text>
      </div>

      {/* 总体统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总工具数"
              value={totalTools}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="运行中"
              value={activeTools}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总使用量"
              value={totalUsage}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均评分"
              value={avgRating}
              precision={1}
              suffix="/5.0"
              prefix={<StarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 工具管理 */}
      <Card 
        title="我的 MCP 工具" 
        extra={
          <Space>
            <Badge count={totalTools} />
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setToolFormVisible(true)}
            >
              注册新工具
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={mcpTools}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 个工具`
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 工具详情模态框 */}
      <Modal
        title={`工具详情 - ${selectedTool?.name}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTool && (
          <div>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="工具名称">{selectedTool.name}</Descriptions.Item>
              <Descriptions.Item label="版本">v{selectedTool.version}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedTool.status === 'active' ? 'green' : 
                           selectedTool.status === 'pending' ? 'orange' : 'default'}>
                  {selectedTool.status === 'active' ? '运行中' : 
                   selectedTool.status === 'pending' ? '审核中' : '已停用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="开发者">{selectedTool.developer}</Descriptions.Item>
              <Descriptions.Item label="分类">{selectedTool.category}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedTool.createdAt}</Descriptions.Item>
              <Descriptions.Item label="最后使用">{selectedTool.lastUsed}</Descriptions.Item>
              <Descriptions.Item label="MCP 端点" span={2}>
                <Text code>{selectedTool.endpoint}</Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>工具描述</Title>
            <Text>{selectedTool.description}</Text>

            <Divider />

            <Title level={5}>功能标签</Title>
            <Space wrap>
              {selectedTool.tags.map(tag => (
                <Tag key={tag} color="blue">{tag}</Tag>
              ))}
            </Space>

            <Divider />

            <Title level={5}>核心能力</Title>
            <ul>
              {selectedTool.capabilities.map(capability => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>

            <Divider />

            <Title level={5}>定价信息</Title>
            <div style={{ 
              padding: 12, 
              background: '#f5f5f5', 
              borderRadius: 6,
              border: '1px solid #d9d9d9'
            }}>
              <Text strong>
                {selectedTool.pricing.model === 'free' ? '免费使用' :
                 selectedTool.pricing.model === 'pay-per-use' ? 
                 `按次付费: $${selectedTool.pricing.price}/${selectedTool.pricing.unit}` :
                 `订阅制: $${selectedTool.pricing.price}/${selectedTool.pricing.unit}`}
              </Text>
            </div>

            <Divider />

            <Title level={5}>性能指标</Title>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="总调用次数"
                  value={selectedTool.totalCalls}
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="成功率"
                  value={selectedTool.successRate}
                  suffix="%"
                  valueStyle={{ 
                    fontSize: 16,
                    color: selectedTool.successRate >= 95 ? '#52c41a' : 
                           selectedTool.successRate >= 80 ? '#faad14' : '#ff4d4f'
                  }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="平均响应时间"
                  value={selectedTool.avgResponseTime}
                  suffix="s"
                  valueStyle={{ 
                    fontSize: 16,
                    color: selectedTool.avgResponseTime <= 1 ? '#52c41a' : 
                           selectedTool.avgResponseTime <= 2 ? '#faad14' : '#ff4d4f'
                  }}
                />
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* 数据分析模态框 */}
      <Modal
        title={`数据分析 - ${selectedTool?.name}`}
        open={analyticsModalVisible}
        onCancel={() => setAnalyticsModalVisible(false)}
        footer={null}
        width={1000}
      >
        {selectedTool && (
          <div>
            <Alert
              message="数据分析功能"
              description="这里将显示工具的详细使用分析、性能趋势和用户反馈数据。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="使用趋势" size="small">
                  <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text type="secondary">图表区域 - 显示每日使用量趋势</Text>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="性能指标" size="small">
                  <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text type="secondary">图表区域 - 显示响应时间和成功率趋势</Text>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title="主要用户" size="small">
                  <Timeline>
                    <Timeline.Item>Customer Service Agent - 456 次调用</Timeline.Item>
                    <Timeline.Item>Research Assistant Agent - 234 次调用</Timeline.Item>
                    <Timeline.Item>Content Processing Agent - 123 次调用</Timeline.Item>
                  </Timeline>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="错误日志" size="small">
                  <Timeline>
                    <Timeline.Item color="red">2024-01-20 14:30 - API 超时</Timeline.Item>
                    <Timeline.Item color="orange">2024-01-19 09:15 - 参数错误</Timeline.Item>
                    <Timeline.Item color="green">2024-01-18 16:45 - 服务正常</Timeline.Item>
                  </Timeline>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* 工具注册模态框 */}
      <Modal
        title="注册新 MCP 工具"
        open={toolFormVisible}
        onCancel={() => setToolFormVisible(false)}
        footer={null}
        width={600}
      >
        <Alert
          message="工具注册功能"
          description="这里将显示完整的工具注册表单，包括工具名称、描述、分类、端点等信息。"
          type="info"
          showIcon
        />
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button type="primary" onClick={() => {
            onToolSubmit({ name: '新工具', description: '示例工具' });
            setToolFormVisible(false);
          }}>
            注册工具
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MCPToolDeveloperView;
