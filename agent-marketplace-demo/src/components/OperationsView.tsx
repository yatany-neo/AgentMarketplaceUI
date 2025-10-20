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
  Badge,
  Button,
  Modal,
  Descriptions,
  Tabs,
  List,
  Avatar,
  Rate
} from 'antd';
import { 
  DashboardOutlined,
  BarChartOutlined,
  UserOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  SettingOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 运营数据类型定义
interface MarketplaceStats {
  totalRequests: number;
  activeAgents: number;
  activeTools: number;
  successRate: number;
  avgResponseTime: number;
  totalUsers: number;
  revenue: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

interface AgentPerformance {
  agentId: string;
  agentName: string;
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  userSatisfaction: number;
  status: 'active' | 'inactive' | 'maintenance';
  lastActive: string;
  growth: number; // 增长率
}

interface ToolPerformance {
  toolId: string;
  toolName: string;
  category: string;
  totalUsage: number;
  successRate: number;
  avgResponseTime: number;
  rating: number;
  revenue: number;
  status: 'active' | 'inactive' | 'deprecated';
  growth: number; // 增长率
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

interface RevenueData {
  period: string;
  revenue: number;
  requests: number;
  newUsers: number;
}

interface FailedRequest {
  id: string;
  agentId: string;
  agentName: string;
  requestTitle: string;
  failureReason: string;
  failureCategory: 'tool_error' | 'timeout' | 'api_limit' | 'data_quality' | 'system_error';
  timestamp: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction: string;
}

interface ToolCoverage {
  category: string;
  totalRequests: number;
  coveredRequests: number;
  coverageRate: number;
  missingCapabilities: string[];
  popularUncoveredRequests: string[];
}

interface CoverageGap {
  category: string;
  gapDescription: string;
  requestCount: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  suggestedTools: string[];
}

const OperationsView: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentPerformance | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolPerformance | null>(null);
  const [agentDetailVisible, setAgentDetailVisible] = useState(false);
  const [toolDetailVisible, setToolDetailVisible] = useState(false);

  // 示例运营数据
  const marketplaceStats: MarketplaceStats = {
    totalRequests: 31,
    activeAgents: 3,
    activeTools: 8,
    successRate: 89.3,
    avgResponseTime: 1.8,
    totalUsers: 156,
    revenue: 12450.50,
    systemHealth: 'good'
  };

  const agentPerformance: AgentPerformance[] = [
    {
      agentId: '1',
      agentName: 'Customer Service Agent',
      totalRequests: 16,
      successRate: 93.3,
      avgResponseTime: 1.2,
      userSatisfaction: 4.8,
      status: 'active',
      lastActive: '2分钟前',
      growth: 15.2
    },
    {
      agentId: '2',
      agentName: 'Research Assistant Agent',
      totalRequests: 9,
      successRate: 87.5,
      avgResponseTime: 2.1,
      userSatisfaction: 4.6,
      status: 'active',
      lastActive: '5分钟前',
      growth: 8.7
    },
    {
      agentId: '3',
      agentName: 'Content Processing Agent',
      totalRequests: 6,
      successRate: 60,
      avgResponseTime: 3.2,
      userSatisfaction: 3.8,
      status: 'active',
      lastActive: '1分钟前',
      growth: -5.3
    }
  ];

  const toolPerformance: ToolPerformance[] = [
    {
      toolId: '1',
      toolName: 'GoogleMap MCP',
      category: '位置服务',
      totalUsage: 1247,
      successRate: 98.5,
      avgResponseTime: 0.8,
      rating: 4.8,
      revenue: 6235.00,
      status: 'active',
      growth: 12.4
    },
    {
      toolId: '2',
      toolName: 'YouTube ToolBox',
      category: '多媒体处理',
      totalUsage: 856,
      successRate: 94.2,
      avgResponseTime: 1.2,
      rating: 4.6,
      revenue: 4280.00,
      status: 'active',
      growth: 8.9
    },
    {
      toolId: '3',
      toolName: 'CSV Processor',
      category: '数据处理',
      totalUsage: 432,
      successRate: 96.8,
      avgResponseTime: 0.5,
      rating: 4.4,
      revenue: 0,
      status: 'active',
      growth: 15.6
    },
    {
      toolId: '4',
      toolName: 'PDF Generator',
      category: '文档处理',
      totalUsage: 0,
      successRate: 0,
      avgResponseTime: 0,
      rating: 0,
      revenue: 0,
      status: 'inactive',
      growth: 0
    }
  ];

  const systemAlerts: SystemAlert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'YouTube ToolBox API 配额警告',
      message: 'YouTube ToolBox 的 API 配额使用率达到 85%，建议监控使用情况',
      timestamp: '2024-01-20 14:30',
      severity: 'medium',
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      title: '新工具注册',
      message: 'PDF Generator 工具已注册，等待审核',
      timestamp: '2024-01-20 14:25',
      severity: 'low',
      resolved: false
    },
    {
      id: '3',
      type: 'success',
      title: '系统性能优化完成',
      message: 'GoogleMap MCP 响应时间优化完成，平均响应时间从 1.2s 降至 0.8s',
      timestamp: '2024-01-20 14:20',
      severity: 'low',
      resolved: true
    },
    {
      id: '4',
      type: 'error',
      title: 'Content Processing Agent 错误率上升',
      message: 'Content Processing Agent 的错误率从 20% 上升至 40%，需要立即关注',
      timestamp: '2024-01-20 14:15',
      severity: 'high',
      resolved: false
    }
  ];

  const revenueData: RevenueData[] = [
    { period: '2024-01-20', revenue: 12450.50, requests: 31, newUsers: 5 },
    { period: '2024-01-19', revenue: 11890.20, requests: 28, newUsers: 3 },
    { period: '2024-01-18', revenue: 13200.80, requests: 35, newUsers: 7 },
    { period: '2024-01-17', revenue: 10950.30, requests: 25, newUsers: 2 },
    { period: '2024-01-16', revenue: 14120.60, requests: 38, newUsers: 8 }
  ];

  // 失败请求分析数据
  const failedRequests: FailedRequest[] = [
    {
      id: 'f1',
      agentId: '3',
      agentName: 'Content Processing Agent',
      requestTitle: 'YouTube 视频内容分析',
      failureReason: 'YouTube API 配额超限，无法获取视频评论数据',
      failureCategory: 'api_limit',
      timestamp: '2024-01-20 14:20',
      impact: 'high',
      suggestedAction: '升级 API 配额或实现请求限制机制'
    },
    {
      id: 'f2',
      agentId: '2',
      agentName: 'Research Assistant Agent',
      requestTitle: '实时股票数据获取',
      failureReason: '股票数据 API 服务暂时不可用，连接超时',
      failureCategory: 'timeout',
      timestamp: '2024-01-20 13:45',
      impact: 'medium',
      suggestedAction: '添加备用数据源或重试机制'
    },
    {
      id: 'f3',
      agentId: '1',
      agentName: 'Customer Service Agent',
      requestTitle: '多语言翻译服务',
      failureReason: '翻译工具返回数据格式错误，无法解析结果',
      failureCategory: 'tool_error',
      timestamp: '2024-01-20 12:30',
      impact: 'medium',
      suggestedAction: '修复翻译工具的数据格式问题'
    },
    {
      id: 'f4',
      agentId: '3',
      agentName: 'Content Processing Agent',
      requestTitle: 'PDF 文档内容提取',
      failureReason: 'PDF 文件损坏或格式不支持',
      failureCategory: 'data_quality',
      timestamp: '2024-01-20 11:15',
      impact: 'low',
      suggestedAction: '增强文件格式验证和错误处理'
    }
  ];

  // MCP Tool 覆盖度分析数据
  const toolCoverage: ToolCoverage[] = [
    {
      category: '位置服务',
      totalRequests: 8,
      coveredRequests: 7,
      coverageRate: 87.5,
      missingCapabilities: ['实时交通信息', '公共交通路线规划'],
      popularUncoveredRequests: ['获取实时交通状况', '公交路线查询']
    },
    {
      category: '多媒体处理',
      totalRequests: 5,
      coveredRequests: 3,
      coverageRate: 60.0,
      missingCapabilities: ['音频处理', '图像识别', '视频编辑'],
      popularUncoveredRequests: ['音频转文字', '图像内容识别', '视频剪辑']
    },
    {
      category: '数据处理',
      totalRequests: 6,
      coveredRequests: 4,
      coverageRate: 66.7,
      missingCapabilities: ['实时数据流处理', '大数据分析'],
      popularUncoveredRequests: ['实时数据监控', '大规模数据分析']
    },
    {
      category: '文档处理',
      totalRequests: 4,
      coveredRequests: 1,
      coverageRate: 25.0,
      missingCapabilities: ['文档转换', 'OCR 识别', '文档比较'],
      popularUncoveredRequests: ['Word 转 PDF', '图片文字识别', '文档差异对比']
    },
    {
      category: '通信服务',
      totalRequests: 3,
      coveredRequests: 0,
      coverageRate: 0.0,
      missingCapabilities: ['邮件发送', '短信通知', '语音通话'],
      popularUncoveredRequests: ['发送邮件通知', '短信提醒', '语音消息']
    }
  ];

  // 功能缺口分析数据
  const coverageGaps: CoverageGap[] = [
    {
      category: '通信服务',
      gapDescription: '完全缺乏通信类工具，无法处理邮件、短信、语音等通信需求',
      requestCount: 3,
      priority: 'critical',
      suggestedTools: ['Email MCP', 'SMS Gateway', 'Voice API']
    },
    {
      category: '文档处理',
      gapDescription: '文档处理能力严重不足，缺乏 OCR、格式转换等核心功能',
      requestCount: 3,
      priority: 'high',
      suggestedTools: ['OCR Engine', 'Document Converter', 'PDF Processor']
    },
    {
      category: '多媒体处理',
      gapDescription: '音频和图像处理能力缺失，影响内容分析效果',
      requestCount: 2,
      priority: 'high',
      suggestedTools: ['Audio Processor', 'Image Recognition', 'Video Editor']
    },
    {
      category: '位置服务',
      gapDescription: '缺乏实时交通和公共交通信息，影响导航准确性',
      requestCount: 1,
      priority: 'medium',
      suggestedTools: ['Traffic API', 'Public Transit API']
    },
    {
      category: '数据处理',
      gapDescription: '缺乏实时数据处理能力，无法处理流式数据',
      requestCount: 2,
      priority: 'medium',
      suggestedTools: ['Stream Processor', 'Big Data Analytics']
    }
  ];

  // Agent 表格列定义
  const agentColumns = [
    {
      title: 'Agent 名称',
      dataIndex: 'agentName',
      key: 'agentName',
      width: 200,
      render: (text: string, record: AgentPerformance) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            最后活跃: {record.lastActive}
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
          maintenance: { color: 'orange', icon: <SettingOutlined />, text: '维护中' }
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
      title: '总请求数',
      dataIndex: 'totalRequests',
      key: 'totalRequests',
      width: 100,
      render: (value: number) => <Text strong>{value}</Text>,
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      width: 120,
      render: (rate: number) => (
        <div>
          <Progress 
            percent={rate} 
            size="small" 
            status={rate >= 90 ? 'success' : rate >= 70 ? 'normal' : 'exception'}
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
        <Text style={{ color: time <= 1.5 ? '#52c41a' : time <= 3 ? '#faad14' : '#ff4d4f' }}>
          {time}s
        </Text>
      ),
    },
    {
      title: '用户满意度',
      dataIndex: 'userSatisfaction',
      key: 'userSatisfaction',
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
      title: '增长率',
      dataIndex: 'growth',
      key: 'growth',
      width: 100,
      render: (growth: number) => (
        <Text style={{ color: growth >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {growth >= 0 ? <RiseOutlined /> : <FallOutlined />} {Math.abs(growth)}%
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: AgentPerformance) => (
        <Button 
          type="link" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedAgent(record);
            setAgentDetailVisible(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  // Tool 表格列定义
  const toolColumns = [
    {
      title: '工具名称',
      dataIndex: 'toolName',
      key: 'toolName',
      width: 200,
      render: (text: string, record: ToolPerformance) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.category}
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
          deprecated: { color: 'red', icon: <ExclamationCircleOutlined />, text: '已弃用' }
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
      dataIndex: 'totalUsage',
      key: 'totalUsage',
      width: 100,
      render: (value: number) => <Text strong>{value.toLocaleString()}</Text>,
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      width: 120,
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
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
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
      title: '收入',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 100,
      render: (revenue: number) => (
        <Text strong style={{ color: revenue > 0 ? '#52c41a' : '#999' }}>
          ${revenue.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '增长率',
      dataIndex: 'growth',
      key: 'growth',
      width: 100,
      render: (growth: number) => (
        <Text style={{ color: growth >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {growth >= 0 ? <RiseOutlined /> : <FallOutlined />} {Math.abs(growth)}%
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: ToolPerformance) => (
        <Button 
          type="link" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedTool(record);
            setToolDetailVisible(true);
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
          <DashboardOutlined />
          Marketplace 运营中心
        </Title>
        <Text type="secondary">
          监控和管理 Agent Marketplace 的整体运营状况
        </Text>
      </div>

      {/* 关键指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总需求数"
              value={marketplaceStats.totalRequests}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃 Agent"
              value={marketplaceStats.activeAgents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃工具"
              value={marketplaceStats.activeTools}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="系统健康度"
              value={marketplaceStats.systemHealth === 'excellent' ? '优秀' : 
                     marketplaceStats.systemHealth === 'good' ? '良好' :
                     marketplaceStats.systemHealth === 'warning' ? '警告' : '严重'}
              prefix={marketplaceStats.systemHealth === 'excellent' ? <CheckCircleOutlined /> :
                      marketplaceStats.systemHealth === 'good' ? <CheckCircleOutlined /> :
                      marketplaceStats.systemHealth === 'warning' ? <WarningOutlined /> : <ExclamationCircleOutlined />}
              valueStyle={{ 
                color: marketplaceStats.systemHealth === 'excellent' ? '#52c41a' :
                       marketplaceStats.systemHealth === 'good' ? '#52c41a' :
                       marketplaceStats.systemHealth === 'warning' ? '#faad14' : '#ff4d4f'
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="成功率"
              value={marketplaceStats.successRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均响应时间"
              value={marketplaceStats.avgResponseTime}
              suffix="s"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={marketplaceStats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总收入"
              value={marketplaceStats.revenue}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 系统告警 */}
      <Card title="系统告警" style={{ marginBottom: 24 }}>
        <List
          dataSource={systemAlerts.filter(alert => !alert.resolved)}
          renderItem={(alert) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    style={{ 
                      backgroundColor: alert.type === 'error' ? '#ff4d4f' :
                                      alert.type === 'warning' ? '#faad14' :
                                      alert.type === 'info' ? '#1890ff' : '#52c41a'
                    }}
                    icon={
                      alert.type === 'error' ? <ExclamationCircleOutlined /> :
                      alert.type === 'warning' ? <WarningOutlined /> :
                      alert.type === 'info' ? <InfoCircleOutlined /> : <CheckCircleOutlined />
                    }
                  />
                }
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text strong>{alert.title}</Text>
                    <Tag color={alert.severity === 'critical' ? 'red' :
                               alert.severity === 'high' ? 'orange' :
                               alert.severity === 'medium' ? 'blue' : 'green'}>
                      {alert.severity === 'critical' ? '严重' :
                       alert.severity === 'high' ? '高' :
                       alert.severity === 'medium' ? '中' : '低'}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <Text>{alert.message}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {alert.timestamp}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 详细分析 */}
      <Tabs defaultActiveKey="agents">
        <TabPane tab="Agent 性能" key="agents">
          <Card title="Agent 性能监控" extra={<Badge count={agentPerformance.length} />}>
            <Table
              columns={agentColumns}
              dataSource={agentPerformance}
              rowKey="agentId"
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="工具性能" key="tools">
          <Card title="工具性能监控" extra={<Badge count={toolPerformance.length} />}>
            <Table
              columns={toolColumns}
              dataSource={toolPerformance}
              rowKey="toolId"
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="失败分析" key="failures">
          <Card title="失败请求分析" extra={<Badge count={failedRequests.length} />}>
            <List
              dataSource={failedRequests}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: item.impact === 'critical' ? '#ff4d4f' :
                                          item.impact === 'high' ? '#fa8c16' :
                                          item.impact === 'medium' ? '#faad14' : '#52c41a'
                        }}
                        icon={<ExclamationCircleOutlined />}
                      />
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text strong>{item.requestTitle}</Text>
                        <Tag color={item.impact === 'critical' ? 'red' :
                                   item.impact === 'high' ? 'orange' :
                                   item.impact === 'medium' ? 'blue' : 'green'}>
                          {item.impact === 'critical' ? '严重' :
                           item.impact === 'high' ? '高' :
                           item.impact === 'medium' ? '中' : '低'}
                        </Tag>
                        <Tag color="purple">{item.failureCategory}</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Text>Agent: {item.agentName}</Text>
                        <br />
                        <Text type="secondary">失败原因: {item.failureReason}</Text>
                        <br />
                        <Text type="secondary" style={{ color: '#1890ff' }}>
                          建议: {item.suggestedAction}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.timestamp}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="工具覆盖度" key="coverage">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="分类覆盖度分析" extra={<Badge count={toolCoverage.length} />}>
                <List
                  dataSource={toolCoverage}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text strong>{item.category}</Text>
                            <Tag color={item.coverageRate >= 80 ? 'green' : 
                                       item.coverageRate >= 60 ? 'orange' : 'red'}>
                              {item.coverageRate}%
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <Text type="secondary">
                              覆盖: {item.coveredRequests}/{item.totalRequests} 请求
                            </Text>
                            <br />
                            <Text type="secondary" style={{ color: '#ff4d4f' }}>
                              缺失能力: {item.missingCapabilities.join(', ')}
                            </Text>
                            <br />
                            <Text type="secondary" style={{ color: '#faad14' }}>
                              未覆盖请求: {item.popularUncoveredRequests.join(', ')}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="功能缺口分析" extra={<Badge count={coverageGaps.length} />}>
                <List
                  dataSource={coverageGaps}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            style={{ 
                              backgroundColor: item.priority === 'critical' ? '#ff4d4f' :
                                              item.priority === 'high' ? '#fa8c16' :
                                              item.priority === 'medium' ? '#faad14' : '#52c41a'
                            }}
                            icon={<WarningOutlined />}
                          />
                        }
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text strong>{item.category}</Text>
                            <Tag color={item.priority === 'critical' ? 'red' :
                                       item.priority === 'high' ? 'orange' :
                                       item.priority === 'medium' ? 'blue' : 'green'}>
                              {item.priority === 'critical' ? '严重' :
                               item.priority === 'high' ? '高' :
                               item.priority === 'medium' ? '中' : '低'}
                            </Tag>
                            <Badge count={item.requestCount} />
                          </div>
                        }
                        description={
                          <div>
                            <Text>{item.gapDescription}</Text>
                            <br />
                            <Text type="secondary" style={{ color: '#1890ff' }}>
                              建议工具: {item.suggestedTools.join(', ')}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="收入分析" key="revenue">
          <Card title="收入趋势分析">
            <Row gutter={[16, 16]}>
              {revenueData.map((data, index) => (
                <Col span={4} key={index}>
                  <Card size="small">
                    <Statistic
                      title={data.period}
                      value={data.revenue}
                      prefix="$"
                      precision={2}
                      valueStyle={{ fontSize: 16 }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        请求: {data.requests}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        新用户: {data.newUsers}
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      {/* Agent 详情模态框 */}
      <Modal
        title={`Agent 详情 - ${selectedAgent?.agentName}`}
        open={agentDetailVisible}
        onCancel={() => setAgentDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedAgent && (
          <div>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Agent 名称">{selectedAgent.agentName}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedAgent.status === 'active' ? 'green' : 'default'}>
                  {selectedAgent.status === 'active' ? '运行中' : '已停用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="总请求数">{selectedAgent.totalRequests}</Descriptions.Item>
              <Descriptions.Item label="成功率">{selectedAgent.successRate}%</Descriptions.Item>
              <Descriptions.Item label="平均响应时间">{selectedAgent.avgResponseTime}s</Descriptions.Item>
              <Descriptions.Item label="用户满意度">
                <Rate disabled value={selectedAgent.userSatisfaction} style={{ fontSize: 14 }} />
                <Text style={{ marginLeft: 8 }}>{selectedAgent.userSatisfaction}/5.0</Text>
              </Descriptions.Item>
              <Descriptions.Item label="增长率">
                <Text style={{ color: selectedAgent.growth >= 0 ? '#52c41a' : '#ff4d4f' }}>
                  {selectedAgent.growth >= 0 ? <RiseOutlined /> : <FallOutlined />} {Math.abs(selectedAgent.growth)}%
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="最后活跃">{selectedAgent.lastActive}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Tool 详情模态框 */}
      <Modal
        title={`工具详情 - ${selectedTool?.toolName}`}
        open={toolDetailVisible}
        onCancel={() => setToolDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedTool && (
          <div>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="工具名称">{selectedTool.toolName}</Descriptions.Item>
              <Descriptions.Item label="分类">{selectedTool.category}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedTool.status === 'active' ? 'green' : 'default'}>
                  {selectedTool.status === 'active' ? '运行中' : '已停用'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="总使用量">{selectedTool.totalUsage.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="成功率">{selectedTool.successRate}%</Descriptions.Item>
              <Descriptions.Item label="平均响应时间">{selectedTool.avgResponseTime}s</Descriptions.Item>
              <Descriptions.Item label="评分">
                <Rate disabled value={selectedTool.rating} style={{ fontSize: 14 }} />
                <Text style={{ marginLeft: 8 }}>{selectedTool.rating}/5.0</Text>
              </Descriptions.Item>
              <Descriptions.Item label="收入">
                <Text strong style={{ color: selectedTool.revenue > 0 ? '#52c41a' : '#999' }}>
                  ${selectedTool.revenue.toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="增长率">
                <Text style={{ color: selectedTool.growth >= 0 ? '#52c41a' : '#ff4d4f' }}>
                  {selectedTool.growth >= 0 ? <RiseOutlined /> : <FallOutlined />} {Math.abs(selectedTool.growth)}%
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OperationsView;
