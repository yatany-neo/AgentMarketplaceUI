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
  Space,
  Divider
} from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined,
  BarChartOutlined,
  HistoryOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// 历史数据类型定义
interface HistoryTask {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  description: string;
  status: 'completed' | 'failed' | 'running';
  tools: string[];
  progress: number;
  createdAt: string;
  completedAt?: string;
  duration?: number; // 执行时长（分钟）
  successRate?: number; // 成功率
  failureReason?: string; // 失败原因
  suggestions?: string; // 建议
  requestClarification?: {
    originalRequest: string;
    clarifiedRequest: string;
    keywords: string[];
    constraints: string[];
  };
  taskBreakdown?: {
    subtasks: Array<{
      id: string;
      title: string;
      description: string;
      query: string;
      recommendedTools: Array<{
        name: string;
        matchScore: number;
        reasoning: string;
      }>;
    }>;
  };
  toolRanking?: Array<{
    toolName: string;
    rank: number;
    reasoning: string;
    matchScore: number;
  }>;
}

interface AgentStats {
  agentId: string;
  agentName: string;
  totalRequests: number; // 总需求数
  completedRequests: number;
  failedRequests: number;
  successRate: number;
  averageDuration: number;
  mostUsedTools: Array<{
    toolName: string;
    usageCount: number;
  }>;
}

interface HistoryPageProps {
  agentId?: string;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ agentId }) => {
  const [selectedTask, setSelectedTask] = useState<HistoryTask | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // 示例历史数据
  const historyTasks: HistoryTask[] = [
    // 当前正在执行的任务
    {
      id: 'current-1',
      agentId: '1',
      agentName: 'Customer Service Agent',
      title: '从微软雷德蒙德园区 Building C 到最近沃尔玛的骑行时间查询',
      description: '用户需要了解从微软雷德蒙德园区 Building C 到最近沃尔玛的骑行时间和路线',
      status: 'running',
      tools: ['Search', 'GoogleMap MCP', 'Location Search', 'Route Calculator'],
      progress: 75,
      createdAt: '2024-01-20 14:30',
      duration: 0, // 正在执行中
      successRate: 0, // 正在执行中
      requestClarification: {
        originalRequest: '从微软雷德蒙德园区到最近沃尔玛的骑行时间',
        clarifiedRequest: '从微软雷德蒙德园区 Building C 到最近沃尔玛的骑行时间和路线',
        keywords: ['位置', '距离', '交通方式', '骑行时间'],
        constraints: ['起点：微软雷德蒙德园区 Building C', '终点：最近沃尔玛', '交通方式：自行车']
      }
    },
    {
      id: 'current-2',
      agentId: '2',
      agentName: 'Research Assistant Agent',
      title: '企业数据分析报告生成',
      description: '分析公司销售数据，生成可视化报告并发送给管理层',
      status: 'running',
      tools: ['CSV', 'Xlsx', 'PDF', 'Search'],
      progress: 75,
      createdAt: '2024-01-20 14:25',
      duration: 0, // 正在执行中
      successRate: 0, // 正在执行中
      requestClarification: {
        originalRequest: '分析销售数据并生成报告',
        clarifiedRequest: '分析公司销售数据，生成可视化报告并发送给管理层',
        keywords: ['数据分析', '销售数据', '可视化', '报告', '管理层'],
        constraints: ['数据源：销售数据', '输出：可视化报告', '目标：管理层', '格式：PDF']
      }
    },
    {
      id: 'current-3',
      agentId: '3',
      agentName: 'Content Processing Agent',
      title: 'YouTube 视频内容分析',
      description: '分析指定 YouTube 视频的标题、描述、标签和评论情感',
      status: 'running',
      tools: ['YouTube ToolBox'],
      progress: 60,
      createdAt: '2024-01-20 14:20',
      duration: 0, // 正在执行中
      successRate: 0, // 正在执行中
      requestClarification: {
        originalRequest: '分析YouTube视频内容',
        clarifiedRequest: '分析指定YouTube视频的标题、描述、标签和评论情感',
        keywords: ['YouTube', '视频分析', '情感分析', '内容提取'],
        constraints: ['视频ID：xyz789', '分析维度：标题、描述、标签、评论']
      }
    },
    // 历史已完成的任务
    {
      id: 'h1',
      agentId: '1',
      agentName: 'Customer Service Agent',
      title: '客户投诉处理',
      description: '处理客户关于产品问题的投诉',
      status: 'completed',
      tools: ['Search', 'Email', 'CRM'],
      progress: 100,
      createdAt: '2024-01-17 09:30',
      completedAt: '2024-01-17 09:50',
      duration: 20,
      successRate: 100,
      requestClarification: {
        originalRequest: '处理客户投诉',
        clarifiedRequest: '分析客户投诉内容，查找解决方案，生成回复邮件',
        keywords: ['客户投诉', '产品问题', '解决方案', '回复'],
        constraints: ['投诉类型：产品质量', '回复时限：24小时内', '需要记录到CRM系统']
      },
      taskBreakdown: {
        subtasks: [
          {
            id: 'h1-1',
            title: '地址解析',
            description: '将微软雷德蒙德园区 Building C 转换为精确地址',
            query: '微软雷德蒙德园区 Building C 地址',
            recommendedTools: [
              { name: 'Search', matchScore: 88, reasoning: '可以搜索微软园区的官方地址信息' },
              { name: 'GoogleMap MCP', matchScore: 85, reasoning: '专门处理地址解析，但需要精确输入' }
            ]
          },
          {
            id: 'h1-2',
            title: '坐标转换',
            description: '将地址转换为地理坐标',
            query: '地址转坐标 API 调用',
            recommendedTools: [
              { name: 'GoogleMap MCP', matchScore: 98, reasoning: '提供精确的地理编码服务' },
              { name: 'Location Search', matchScore: 65, reasoning: '基础坐标转换功能' }
            ]
          },
          {
            id: 'h1-3',
            title: '附近搜索',
            description: '搜索附近的沃尔玛商店',
            query: '附近沃尔玛商店搜索',
            recommendedTools: [
              { name: 'Location Search', matchScore: 90, reasoning: '专门搜索附近商店和地点' },
              { name: 'GoogleMap MCP', matchScore: 85, reasoning: '强大的附近地点搜索功能' }
            ]
          },
          {
            id: 'h1-4',
            title: '路线规划',
            description: '计算骑行路线和时间',
            query: '骑行路线规划 API',
            recommendedTools: [
              { name: 'Route Calculator', matchScore: 92, reasoning: '专门计算骑行路线和时间' },
              { name: 'GoogleMap MCP', matchScore: 88, reasoning: '完整的路线规划，但主要针对驾车' }
            ]
          }
        ]
      }
    },
    {
      id: 'h2',
      agentId: '2',
      agentName: 'Research Assistant Agent',
      title: '企业数据分析报告生成',
      description: '分析销售数据并生成专业报告',
      status: 'completed',
      tools: ['CSV', 'Xlsx', 'PDF', 'Search'],
      progress: 100,
      createdAt: '2024-01-19 10:15',
      completedAt: '2024-01-19 10:35',
      duration: 20,
      successRate: 95,
      requestClarification: {
        originalRequest: '生成销售数据分析报告',
        clarifiedRequest: '分析Q4销售数据，生成包含趋势分析和建议的专业报告',
        keywords: ['销售数据', 'Q4', '趋势分析', '报告'],
        constraints: ['数据格式：CSV', '输出格式：PDF', '包含图表和趋势分析']
      }
    },
    {
      id: 'h3',
      agentId: '3',
      agentName: 'Content Processing Agent',
      title: 'YouTube 视频内容分析',
      description: '分析视频内容并提取关键信息',
      status: 'failed',
      tools: ['YouTube ToolBox'],
      progress: 60,
      createdAt: '2024-01-18 16:20',
      completedAt: '2024-01-18 16:45',
      duration: 25,
      successRate: 60,
      failureReason: 'YouTube API 访问限制，无法获取视频评论数据。视频ID 可能无效或视频已被删除。',
      suggestions: '建议：1) 验证视频ID的有效性 2) 检查API配额限制 3) 考虑使用备用数据源 4) 添加错误重试机制',
      requestClarification: {
        originalRequest: '分析YouTube视频内容',
        clarifiedRequest: '分析指定YouTube视频的标题、描述、标签和评论情感',
        keywords: ['YouTube', '视频分析', '情感分析', '内容提取'],
        constraints: ['视频ID：abc123', '分析维度：标题、描述、标签、评论']
      }
    },
  ];

  // 计算统计数据
  const agentStats: AgentStats[] = [
    {
      agentId: '1',
      agentName: 'Customer Service Agent',
      totalRequests: 16, // 总需求数：15 + 1 (当前执行中)
      completedRequests: 14,
      failedRequests: 1,
      successRate: 93.3,
      averageDuration: 18,
      mostUsedTools: [
        { toolName: 'Search', usageCount: 12 },
        { toolName: 'GoogleMap MCP', usageCount: 8 },
        { toolName: 'Email', usageCount: 6 }
      ]
    },
    {
      agentId: '2',
      agentName: 'Research Assistant Agent',
      totalRequests: 9, // 总需求数：8 + 1 (当前执行中)
      completedRequests: 7,
      failedRequests: 1,
      successRate: 87.5,
      averageDuration: 25,
      mostUsedTools: [
        { toolName: 'CSV', usageCount: 6 },
        { toolName: 'Xlsx', usageCount: 5 },
        { toolName: 'PDF', usageCount: 4 }
      ]
    },
    {
      agentId: '3',
      agentName: 'Content Processing Agent',
      totalRequests: 6, // 总需求数：5 + 1 (当前执行中)
      completedRequests: 3,
      failedRequests: 2,
      successRate: 60,
      averageDuration: 30,
      mostUsedTools: [
        { toolName: 'YouTube ToolBox', usageCount: 5 },
        { toolName: 'Search', usageCount: 2 }
      ]
    }
  ];

  // 过滤数据
  const filteredTasks = agentId ? historyTasks.filter(task => task.agentId === agentId) : historyTasks;
  const filteredStats = agentId ? agentStats.filter(stat => stat.agentId === agentId) : agentStats;
  
  // 计算总体统计数据
  const totalRequests = filteredStats.reduce((sum, stat) => sum + stat.totalRequests, 0);
  const completedRequests = filteredStats.reduce((sum, stat) => sum + stat.completedRequests, 0);
  const runningRequests = filteredTasks.filter(t => t.status === 'running').length;
  const failedRequests = filteredStats.reduce((sum, stat) => sum + stat.failedRequests, 0);

  // 表格列定义
  const columns = [
    {
      title: '需求标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text: string, record: HistoryTask) => (
        <div>
          <Text strong style={{ fontSize: 13 }}>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.createdAt}
          </Text>
        </div>
      ),
    },
    {
      title: 'Agent',
      dataIndex: 'agentName',
      key: 'agentName',
      width: 150,
      render: (agentName: string) => (
        <Tag color="blue" style={{ fontSize: 12 }}>
          {agentName}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          completed: { color: 'green', icon: <CheckCircleOutlined />, text: '已完成' },
          running: { color: 'blue', icon: <ClockCircleOutlined />, text: '执行中' },
          failed: { color: 'red', icon: <ExclamationCircleOutlined />, text: '失败' }
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
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: number, record: HistoryTask) => (
        <div>
          <Progress 
            percent={progress} 
            size="small" 
            status={record.status === 'failed' ? 'exception' : 'normal'}
          />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {progress}%
          </Text>
        </div>
      ),
    },
    {
      title: '执行时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration: number) => (
        <Text>{duration} 分钟</Text>
      ),
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      width: 100,
      render: (rate: number) => (
        <Text style={{ color: rate >= 90 ? '#52c41a' : rate >= 70 ? '#faad14' : '#ff4d4f' }}>
          {rate}%
        </Text>
      ),
    },
    {
      title: '使用工具',
      dataIndex: 'tools',
      key: 'tools',
      width: 200,
      render: (tools: string[]) => (
        <div>
          {tools.slice(0, 2).map(tool => (
            <Tag key={tool} style={{ marginBottom: 2, fontSize: 11 }}>
              {tool}
            </Tag>
          ))}
          {tools.length > 2 && (
            <Tag style={{ marginBottom: 2, fontSize: 11 }}>
              +{tools.length - 2}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: HistoryTask) => (
        <Button 
          type="link" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedTask(record);
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
          <HistoryOutlined />
          执行历史
        </Title>
        <Text type="secondary">
          查看所有 Agent 的需求处理历史和执行统计
        </Text>
      </div>

      {/* 总体统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总需求数"
              value={totalRequests}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={completedRequests}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="执行中"
              value={runningRequests}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="失败"
              value={failedRequests}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Agent 统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {filteredStats.map(stat => (
          <Col span={8} key={stat.agentId}>
            <Card title={stat.agentName} size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="总需求数"
                    value={stat.totalRequests}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="成功率"
                    value={stat.successRate}
                    suffix="%"
                    valueStyle={{ 
                      fontSize: 16,
                      color: stat.successRate >= 90 ? '#52c41a' : 
                             stat.successRate >= 70 ? '#faad14' : '#ff4d4f'
                    }}
                  />
                </Col>
              </Row>
              <div style={{ marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  平均执行时长: {stat.averageDuration} 分钟
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  常用工具: {stat.mostUsedTools.slice(0, 2).map(t => t.toolName).join(', ')}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 历史记录表格 */}
      <Card title="执行历史记录" extra={<Badge count={filteredTasks.length} />}>
        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title={`需求详情 - ${selectedTask?.title}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTask && (
          <div>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Agent">{selectedTask.agentName}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedTask.status === 'completed' ? 'green' : 
                           selectedTask.status === 'running' ? 'blue' : 'red'}>
                  {selectedTask.status === 'completed' ? '已完成' : 
                   selectedTask.status === 'running' ? '执行中' : '失败'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedTask.createdAt}</Descriptions.Item>
              <Descriptions.Item label="完成时间">{selectedTask.completedAt || '-'}</Descriptions.Item>
              <Descriptions.Item label="执行时长">{selectedTask.duration} 分钟</Descriptions.Item>
              <Descriptions.Item label="成功率">{selectedTask.successRate}%</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>需求描述</Title>
            <Text>{selectedTask.description}</Text>

            {selectedTask.requestClarification && (
              <>
                <Divider />
                <Title level={5}>需求澄清</Title>
                <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 6 }}>
                  <Text strong>原始需求:</Text> {selectedTask.requestClarification.originalRequest}
                  <br />
                  <Text strong>澄清后需求:</Text> {selectedTask.requestClarification.clarifiedRequest}
                </div>
              </>
            )}

            <Divider />
            <Title level={5}>使用工具</Title>
            <Space wrap>
              {selectedTask.tools.map(tool => (
                <Tag key={tool} color="blue">{tool}</Tag>
              ))}
            </Space>

            {selectedTask.status === 'failed' && selectedTask.failureReason && (
              <>
                <Divider />
                <Title level={5} style={{ color: '#ff4d4f' }}>❌ 失败原因</Title>
                <div style={{ 
                  background: '#fff2f0', 
                  padding: 12, 
                  borderRadius: 6, 
                  border: '1px solid #ffccc7',
                  marginBottom: 12
                }}>
                  <Text style={{ color: '#ff4d4f' }}>
                    {selectedTask.failureReason}
                  </Text>
                </div>
                
                {selectedTask.suggestions && (
                  <>
                    <Title level={5} style={{ color: '#1890ff' }}>💡 改进建议</Title>
                    <div style={{ 
                      background: '#f0f9ff', 
                      padding: 12, 
                      borderRadius: 6, 
                      border: '1px solid #91d5ff'
                    }}>
                      <Text style={{ color: '#1890ff' }}>
                        {selectedTask.suggestions}
                      </Text>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HistoryPage;
