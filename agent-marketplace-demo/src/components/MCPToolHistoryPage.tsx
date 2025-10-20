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
  Divider
} from 'antd';
import { 
  HistoryOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ToolOutlined,
  UserOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// MCP Tool 历史任务数据类型定义
interface MCPToolTask {
  id: string;
  toolId: string;
  toolName: string;
  agentId: string;
  agentName: string;
  taskTitle: string;
  taskDescription: string;
  status: 'completed' | 'failed' | 'running';
  progress: number;
  createdAt: string;
  completedAt?: string;
  duration?: number; // 执行时长（秒）
  successRate?: number; // 成功率
  failureReason?: string; // 失败原因
  suggestions?: string; // 建议
  requestDetails: {
    originalRequest: string;
    toolInput: any;
    toolOutput?: any;
    errorMessage?: string;
  };
  performance: {
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

interface ToolStats {
  toolId: string;
  toolName: string;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  successRate: number;
  averageResponseTime: number;
  totalUsage: number;
}

interface MCPToolHistoryPageProps {
  toolId?: string;
}

const MCPToolHistoryPage: React.FC<MCPToolHistoryPageProps> = ({ toolId }) => {
  const [selectedTask, setSelectedTask] = useState<MCPToolTask | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // 示例 MCP Tool 历史任务数据
  const mcpToolTasks: MCPToolTask[] = [
    {
      id: 't1',
      toolId: '1',
      toolName: 'GoogleMap MCP',
      agentId: '1',
      agentName: 'Customer Service Agent',
      taskTitle: '从微软雷德蒙德园区 Building C 到最近沃尔玛的骑行时间查询',
      taskDescription: '用户需要了解从微软雷德蒙德园区 Building C 到最近沃尔玛的骑行时间和路线',
      status: 'completed',
      progress: 100,
      createdAt: '2024-01-20 14:30',
      completedAt: '2024-01-20 14:32',
      duration: 2.5,
      successRate: 100,
      requestDetails: {
        originalRequest: '从微软雷德蒙德园区 Building C 到最近沃尔玛的骑行时间',
        toolInput: {
          origin: '微软雷德蒙德园区 Building C',
          destination: '最近沃尔玛',
          mode: 'bicycling'
        },
        toolOutput: {
          distance: '2.3 km',
          duration: '8 minutes',
          route: '详细的骑行路线'
        }
      },
      performance: {
        responseTime: 0.8,
        memoryUsage: 45.2,
        cpuUsage: 12.5
      }
    },
    {
      id: 't2',
      toolId: '1',
      toolName: 'GoogleMap MCP',
      agentId: '2',
      agentName: 'Research Assistant Agent',
      taskTitle: '企业数据分析报告生成',
      taskDescription: '分析公司销售数据，生成可视化报告并发送给管理层',
      status: 'completed',
      progress: 100,
      createdAt: '2024-01-20 14:25',
      completedAt: '2024-01-20 14:27',
      duration: 1.8,
      successRate: 100,
      requestDetails: {
        originalRequest: '分析销售数据并生成报告',
        toolInput: {
          dataSource: 'sales_data.csv',
          analysisType: 'trend_analysis',
          outputFormat: 'report'
        },
        toolOutput: {
          report: '销售趋势分析报告',
          charts: ['销售趋势图', '地区分布图'],
          insights: ['Q4销售额增长15%', '西部地区表现最佳']
        }
      },
      performance: {
        responseTime: 0.6,
        memoryUsage: 38.7,
        cpuUsage: 8.9
      }
    },
    {
      id: 't3',
      toolId: '2',
      toolName: 'YouTube ToolBox',
      agentId: '3',
      agentName: 'Content Processing Agent',
      taskTitle: 'YouTube 视频内容分析',
      taskDescription: '分析指定 YouTube 视频的标题、描述、标签和评论情感',
      status: 'failed',
      progress: 60,
      createdAt: '2024-01-20 14:20',
      completedAt: '2024-01-20 14:25',
      duration: 5.2,
      successRate: 60,
      failureReason: 'YouTube API 访问限制，无法获取视频评论数据。视频ID 可能无效或视频已被删除。',
      suggestions: '建议：1) 验证视频ID的有效性 2) 检查API配额限制 3) 考虑使用备用数据源 4) 添加错误重试机制',
      requestDetails: {
        originalRequest: '分析YouTube视频内容',
        toolInput: {
          videoId: 'xyz789',
          analysisType: 'sentiment_analysis',
          includeComments: true
        },
        toolOutput: {
          videoInfo: {
            title: '示例视频标题',
            description: '视频描述',
            tags: ['tag1', 'tag2']
          },
          comments: null,
          error: 'API quota exceeded'
        },
        errorMessage: 'YouTube API quota exceeded for today'
      },
      performance: {
        responseTime: 1.2,
        memoryUsage: 52.1,
        cpuUsage: 18.3
      }
    },
    {
      id: 't4',
      toolId: '3',
      toolName: 'CSV Processor',
      agentId: '2',
      agentName: 'Research Assistant Agent',
      taskTitle: '销售数据清洗和预处理',
      taskDescription: '清洗和预处理销售数据，为后续分析做准备',
      status: 'completed',
      progress: 100,
      createdAt: '2024-01-20 14:15',
      completedAt: '2024-01-20 14:16',
      duration: 0.8,
      successRate: 100,
      requestDetails: {
        originalRequest: '清洗销售数据',
        toolInput: {
          filePath: 'sales_data_raw.csv',
          operations: ['remove_duplicates', 'fill_missing', 'validate_format']
        },
        toolOutput: {
          processedRows: 15420,
          removedDuplicates: 234,
          filledMissing: 45,
          outputFile: 'sales_data_cleaned.csv'
        }
      },
      performance: {
        responseTime: 0.5,
        memoryUsage: 28.4,
        cpuUsage: 6.2
      }
    },
    {
      id: 't5',
      toolId: '1',
      toolName: 'GoogleMap MCP',
      agentId: '1',
      agentName: 'Customer Service Agent',
      taskTitle: '客户地址验证',
      taskDescription: '验证客户提供的地址信息是否有效',
      status: 'running',
      progress: 75,
      createdAt: '2024-01-20 14:35',
      duration: 0,
      successRate: 0,
      requestDetails: {
        originalRequest: '验证客户地址',
        toolInput: {
          address: '123 Main St, Seattle, WA 98101',
          validationType: 'geocoding'
        }
      },
      performance: {
        responseTime: 0.0,
        memoryUsage: 0,
        cpuUsage: 0
      }
    }
  ];

  // 计算统计数据
  const toolStats: ToolStats[] = [
    {
      toolId: '1',
      toolName: 'GoogleMap MCP',
      totalTasks: 3,
      completedTasks: 2,
      failedTasks: 0,
      successRate: 100,
      averageResponseTime: 0.7,
      totalUsage: 1247
    },
    {
      toolId: '2',
      toolName: 'YouTube ToolBox',
      totalTasks: 1,
      completedTasks: 0,
      failedTasks: 1,
      successRate: 0,
      averageResponseTime: 1.2,
      totalUsage: 856
    },
    {
      toolId: '3',
      toolName: 'CSV Processor',
      totalTasks: 1,
      completedTasks: 1,
      failedTasks: 0,
      successRate: 100,
      averageResponseTime: 0.5,
      totalUsage: 432
    }
  ];

  // 过滤数据
  const filteredTasks = toolId ? mcpToolTasks.filter(task => task.toolId === toolId) : mcpToolTasks;
  const filteredStats = toolId ? toolStats.filter(stat => stat.toolId === toolId) : toolStats;

  // 计算总体统计数据
  const totalTasks = filteredStats.reduce((sum, stat) => sum + stat.totalTasks, 0);
  const completedTasks = filteredStats.reduce((sum, stat) => sum + stat.completedTasks, 0);
  const runningTasks = filteredTasks.filter(t => t.status === 'running').length;
  const failedTasks = filteredStats.reduce((sum, stat) => sum + stat.failedTasks, 0);

  // 表格列定义
  const columns = [
    {
      title: '任务标题',
      dataIndex: 'taskTitle',
      key: 'taskTitle',
      width: 250,
      render: (text: string, record: MCPToolTask) => (
        <div>
          <Text strong style={{ fontSize: 13 }}>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.agentName} • {record.createdAt}
          </Text>
        </div>
      ),
    },
    {
      title: '工具',
      dataIndex: 'toolName',
      key: 'toolName',
      width: 150,
      render: (toolName: string) => (
        <Tag color="blue" style={{ fontSize: 12 }}>
          <ToolOutlined /> {toolName}
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
      render: (progress: number, record: MCPToolTask) => (
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
        <Text>{duration ? `${duration}s` : '-'}</Text>
      ),
    },
    {
      title: '响应时间',
      dataIndex: 'performance',
      key: 'responseTime',
      width: 100,
      render: (performance: any) => (
        <Text style={{ color: performance.responseTime <= 1 ? '#52c41a' : performance.responseTime <= 2 ? '#faad14' : '#ff4d4f' }}>
          {performance.responseTime}s
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: MCPToolTask) => (
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
          MCP Tool 执行历史
        </Title>
        <Text type="secondary">
          查看所有 MCP 工具的任务处理历史和性能统计
        </Text>
      </div>

      {/* 总体统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={totalTasks}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={completedTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="执行中"
              value={runningTasks}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="失败"
              value={failedTasks}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tool 统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {filteredStats.map(stat => (
          <Col span={8} key={stat.toolId}>
            <Card title={stat.toolName} size="small">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="总任务"
                    value={stat.totalTasks}
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
                  平均响应时间: {stat.averageResponseTime}s
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  总使用量: {stat.totalUsage.toLocaleString()}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 历史记录表格 */}
      <Card title="任务执行历史记录" extra={<Badge count={filteredTasks.length} />}>
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
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title={`任务详情 - ${selectedTask?.taskTitle}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={900}
      >
        {selectedTask && (
          <div>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="工具">
                <Tag color="blue">
                  <ToolOutlined /> {selectedTask.toolName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Agent">
                <Tag color="green">
                  <UserOutlined /> {selectedTask.agentName}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedTask.status === 'completed' ? 'green' : 
                           selectedTask.status === 'running' ? 'blue' : 'red'}>
                  {selectedTask.status === 'completed' ? '已完成' : 
                   selectedTask.status === 'running' ? '执行中' : '失败'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedTask.createdAt}</Descriptions.Item>
              <Descriptions.Item label="完成时间">{selectedTask.completedAt || '-'}</Descriptions.Item>
              <Descriptions.Item label="执行时长">{selectedTask.duration ? `${selectedTask.duration}s` : '-'}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>任务描述</Title>
            <Text>{selectedTask.taskDescription}</Text>

            <Divider />

            <Title level={5}>请求详情</Title>
            <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 6 }}>
              <Text strong>原始请求:</Text> {selectedTask.requestDetails.originalRequest}
              <br />
              <Text strong>工具输入:</Text> 
              <pre style={{ marginTop: 8, fontSize: 12, background: '#fff', padding: 8, borderRadius: 4 }}>
                {JSON.stringify(selectedTask.requestDetails.toolInput, null, 2)}
              </pre>
              {selectedTask.requestDetails.toolOutput && (
                <>
                  <Text strong>工具输出:</Text>
                  <pre style={{ marginTop: 8, fontSize: 12, background: '#fff', padding: 8, borderRadius: 4 }}>
                    {JSON.stringify(selectedTask.requestDetails.toolOutput, null, 2)}
                  </pre>
                </>
              )}
              {selectedTask.requestDetails.errorMessage && (
                <>
                  <Text strong style={{ color: '#ff4d4f' }}>错误信息:</Text>
                  <div style={{ marginTop: 8, padding: 8, background: '#fff2f0', borderRadius: 4, border: '1px solid #ffccc7' }}>
                    <Text style={{ color: '#ff4d4f' }}>{selectedTask.requestDetails.errorMessage}</Text>
                  </div>
                </>
              )}
            </div>

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

            <Divider />

            <Title level={5}>性能指标</Title>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="响应时间"
                  value={selectedTask.performance.responseTime}
                  suffix="s"
                  valueStyle={{ 
                    fontSize: 16,
                    color: selectedTask.performance.responseTime <= 1 ? '#52c41a' : 
                           selectedTask.performance.responseTime <= 2 ? '#faad14' : '#ff4d4f'
                  }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="内存使用"
                  value={selectedTask.performance.memoryUsage}
                  suffix="MB"
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="CPU 使用"
                  value={selectedTask.performance.cpuUsage}
                  suffix="%"
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MCPToolHistoryPage;
