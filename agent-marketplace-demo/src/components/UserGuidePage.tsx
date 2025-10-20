import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Steps,
  Tag,
  Divider,
  Alert,
  Tabs,
  List,
  Avatar
} from 'antd';
import { 
  UserOutlined,
  ToolOutlined,
  DashboardOutlined,
  TrophyOutlined,
  HistoryOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;

// 用户角色数据
interface UserPersona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  background: string;
  goals: string[];
  painPoints: string[];
  icon: React.ReactNode;
  color: string;
}

// 用户旅程步骤
interface JourneyStep {
  step: number;
  title: string;
  description: string;
  actions: string[];
  uiElements: string[];
  outcome: string;
  icon: React.ReactNode;
}

const UserGuidePage: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<string>('agent-developer');

  // 用户角色定义
  const userPersonas: UserPersona[] = [
    {
      id: 'agent-developer',
      name: 'Alex Chen',
      role: 'Agent 开发者',
      avatar: 'AC',
      background: '资深 AI 工程师，专注于开发智能 Agent 系统，需要监控多个 Agent 项目的执行状态和 Marketplace 工具推荐效果',
      goals: [
        '监控 Agent 的执行状态和性能',
        '了解 Marketplace 自动推荐的工具选择',
        '分析工具使用效果和成本',
        '优化 Agent 的配置和参数'
      ],
      painPoints: [
        '缺乏工具推荐过程的透明信息',
        '难以评估工具的真实性能',
        '无法了解工具选择的决策逻辑',
        '工具故障时缺乏替代方案信息'
      ],
      icon: <UserOutlined />,
      color: '#1890ff'
    },
    {
      id: 'tool-developer',
      name: 'Sarah Johnson',
      role: 'MCP Tool 开发者',
      avatar: 'SJ',
      background: 'MCP 工具开发专家，负责开发和维护多个 MCP 工具，关注工具的使用情况和性能表现',
      goals: [
        '监控工具的使用情况和性能',
        '分析用户反馈和错误报告',
        '优化工具性能和稳定性',
        '推广工具的使用'
      ],
      painPoints: [
        '缺乏工具使用情况的详细数据',
        '难以识别性能瓶颈',
        '用户反馈收集困难',
        '工具推广效果难以衡量'
      ],
      icon: <ToolOutlined />,
      color: '#52c41a'
    },
    {
      id: 'operations',
      name: 'David Kim',
      role: '运营人员',
      avatar: 'DK',
      background: '平台运营经理，负责整体平台运营，关注系统健康度、用户满意度和商业指标',
      goals: [
        '监控平台整体运营状况',
        '识别和解决系统问题',
        '优化平台性能和用户体验',
        '制定运营策略和决策'
      ],
      painPoints: [
        '缺乏系统性的运营数据',
        '问题定位和解决效率低',
        '难以预测系统风险',
        '决策缺乏数据支持'
      ],
      icon: <DashboardOutlined />,
      color: '#faad14'
    }
  ];

  // 用户旅程定义
  const userJourneys: { [key: string]: JourneyStep[] } = {
    'agent-developer': [
      {
        step: 1,
        title: '登录系统',
        description: 'Alex 作为 Agent 开发者登录系统，查看自己的 Agent 管理控制台',
        actions: [
          '访问 Agent Marketplace UI',
          '选择 "Agent 开发者" 角色',
          '查看 "控制台" 页面'
        ],
        uiElements: [
          '左侧导航菜单',
          'Agent 开发者控制台标题',
          '我的 AI Agents 卡片列表'
        ],
        outcome: '了解当前管理的所有 Agent 状态',
        icon: <UserOutlined />
      },
      {
        step: 2,
        title: '查看工具排名',
        description: 'Alex 了解 Marketplace 的工具排名和推荐机制，为 Agent 配置提供参考',
        actions: [
          '点击 "工具排名" 菜单',
          '查看排名标准和权重',
          '分析工具综合得分',
          '了解推荐算法逻辑'
        ],
        uiElements: [
          '排名标准说明卡片',
          '工具排名表格',
          '综合得分显示',
          '推荐算法说明'
        ],
        outcome: '了解 Marketplace 的工具推荐机制',
        icon: <TrophyOutlined />
      },
      {
        step: 3,
        title: '模拟需求提交',
        description: 'Alex 模拟 AI Agent 向 Marketplace 提交新需求',
        actions: [
          '点击 "模拟 AI Agent 提交新需求" 按钮',
          '选择对应的 Agent',
          '输入需求描述',
          '提交需求'
        ],
        uiElements: [
          '需求提交按钮',
          'Agent 选择下拉框',
          '需求描述文本框',
          '提交确认'
        ],
        outcome: '触发 Marketplace 的需求处理流程',
        icon: <PlayCircleOutlined />
      },
      {
        step: 4,
        title: '监控执行过程',
        description: 'Alex 监控需求的处理过程，包括澄清、分解和 Marketplace 自动工具推荐',
        actions: [
          '查看需求澄清流程',
          '分析任务分解结果',
          '了解工具推荐逻辑',
          '监控执行进度'
        ],
        uiElements: [
          '需求澄清流程展示',
          '任务分解流程图',
          'Marketplace 工具推荐',
          '执行进度条'
        ],
        outcome: '了解需求处理的完整过程',
        icon: <EyeOutlined />
      },
      {
        step: 5,
        title: '查看执行历史',
        description: 'Alex 查看历史执行记录，分析 Agent 性能和 Marketplace 工具推荐效果',
        actions: [
          '点击 "执行历史" 菜单',
          '查看总体统计',
          '分析 Agent 表现',
          '了解工具推荐成功率'
        ],
        uiElements: [
          '总体统计卡片',
          'Agent 统计卡片',
          '历史记录表格',
          '工具推荐效果分析'
        ],
        outcome: '基于历史数据了解工具推荐效果，优化 Agent 配置',
        icon: <HistoryOutlined />
      }
    ],
    'tool-developer': [
      {
        step: 1,
        title: '登录系统',
        description: 'Sarah 作为 MCP Tool 开发者登录系统，查看工具管理控制台',
        actions: [
          '访问 Agent Marketplace UI',
          '选择 "MCP Tool 开发者" 角色',
          '查看 "控制台" 页面'
        ],
        uiElements: [
          '左侧导航菜单',
          'MCP Tool 开发者控制台',
          '总体统计卡片',
          '工具管理表格'
        ],
        outcome: '了解工具的整体运营状况',
        icon: <ToolOutlined />
      },
      {
        step: 2,
        title: '查看工具性能',
        description: 'Sarah 分析自己开发的工具的性能表现',
        actions: [
          '查看工具列表',
          '分析使用量统计',
          '检查成功率数据',
          '查看用户评分'
        ],
        uiElements: [
          '工具管理表格',
          '使用量统计',
          '成功率进度条',
          '评分显示'
        ],
        outcome: '识别工具的性能问题',
        icon: <BarChartOutlined />
      },
      {
        step: 3,
        title: '查看工具详情',
        description: 'Sarah 深入了解工具的使用情况和用户反馈',
        actions: [
          '点击工具 "详情" 按钮',
          '查看工具基本信息',
          '分析使用统计',
          '检查错误日志'
        ],
        uiElements: [
          '工具详情模态框',
          '基本信息展示',
          '使用统计图表',
          '错误日志列表'
        ],
        outcome: '获得工具优化的具体方向',
        icon: <InfoCircleOutlined />
      },
      {
        step: 4,
        title: '查看执行历史',
        description: 'Sarah 查看工具的历史执行记录，分析使用模式',
        actions: [
          '点击 "执行历史" 菜单',
          '查看任务执行记录',
          '分析失败原因',
          '检查性能指标'
        ],
        uiElements: [
          '任务执行历史表格',
          '失败原因分析',
          '性能指标展示',
          '详情查看功能'
        ],
        outcome: '基于使用数据优化工具',
        icon: <HistoryOutlined />
      },
      {
        step: 5,
        title: '注册新工具',
        description: 'Sarah 注册新的 MCP 工具到 Marketplace',
        actions: [
          '点击 "工具注册" 按钮',
          '填写工具信息',
          '设置定价模式',
          '提交注册申请'
        ],
        uiElements: [
          '工具注册表单',
          '信息输入字段',
          '定价配置',
          '提交按钮'
        ],
        outcome: '新工具成功注册到 Marketplace',
        icon: <CheckCircleOutlined />
      }
    ],
    'operations': [
      {
        step: 1,
        title: '登录系统',
        description: 'David 作为运营人员登录系统，查看运营中心',
        actions: [
          '访问 Agent Marketplace UI',
          '选择 "运营人员" 角色',
          '查看运营中心概览'
        ],
        uiElements: [
          '左侧导航菜单',
          'Marketplace 运营中心标题',
          '关键指标监控面板',
          '系统告警列表'
        ],
        outcome: '了解平台整体运营状况',
        icon: <DashboardOutlined />
      },
      {
        step: 2,
        title: '监控系统告警',
        description: 'David 查看系统告警，识别需要关注的问题',
        actions: [
          '查看告警列表',
          '分析告警严重程度',
          '识别问题类型',
          '制定解决方案'
        ],
        uiElements: [
          '系统告警卡片',
          '告警类型标签',
          '严重程度标识',
          '告警描述'
        ],
        outcome: '及时发现和处理系统问题',
        icon: <ExclamationCircleOutlined />
      },
      {
        step: 3,
        title: '分析 Agent 性能',
        description: 'David 分析各个 Agent 的性能表现',
        actions: [
          '切换到 "Agent 性能" 标签',
          '查看 Agent 统计',
          '分析成功率数据',
          '检查用户满意度'
        ],
        uiElements: [
          'Agent 性能表格',
          '成功率进度条',
          '用户满意度评分',
          '增长率显示'
        ],
        outcome: '识别需要优化的 Agent',
        icon: <UserOutlined />
      },
      {
        step: 4,
        title: '分析工具性能',
        description: 'David 分析工具的整体性能和使用情况',
        actions: [
          '切换到 "工具性能" 标签',
          '查看工具统计',
          '分析使用量趋势',
          '检查收入数据'
        ],
        uiElements: [
          '工具性能表格',
          '使用量统计',
          '收入显示',
          '增长率图表'
        ],
        outcome: '了解工具生态的健康状况',
        icon: <ToolOutlined />
      },
      {
        step: 5,
        title: '分析失败原因',
        description: 'David 深入分析失败请求，找出系统问题',
        actions: [
          '切换到 "失败分析" 标签',
          '查看失败请求列表',
          '分析失败原因',
          '制定改进措施'
        ],
        uiElements: [
          '失败请求列表',
          '失败原因分类',
          '影响程度评估',
          '改进建议'
        ],
        outcome: '制定系统优化策略',
        icon: <ExclamationCircleOutlined />
      },
      {
        step: 6,
        title: '分析工具覆盖度',
        description: 'David 分析工具覆盖度，识别功能缺口',
        actions: [
          '切换到 "工具覆盖度" 标签',
          '查看分类覆盖度',
          '分析功能缺口',
          '制定工具发展策略'
        ],
        uiElements: [
          '分类覆盖度分析',
          '功能缺口列表',
          '优先级标识',
          '建议工具'
        ],
        outcome: '制定工具生态发展规划',
        icon: <BulbOutlined />
      }
    ]
  };

  const selectedPersonaData = userPersonas.find(p => p.id === selectedPersona);
  const selectedJourney = userJourneys[selectedPersona] || [];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined />
          用户使用指南
        </Title>
        <Text type="secondary">
          了解不同用户角色如何使用 Agent Marketplace UI 系统
        </Text>
      </div>

      {/* 用户角色选择 */}
      <Card title="选择用户角色" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {userPersonas.map(persona => (
            <Col span={8} key={persona.id}>
              <Card
                size="small"
                style={{ 
                  cursor: 'pointer',
                  border: selectedPersona === persona.id ? `2px solid ${persona.color}` : '1px solid #f0f0f0',
                  backgroundColor: selectedPersona === persona.id ? '#f6ffed' : '#fff'
                }}
                onClick={() => setSelectedPersona(persona.id)}
              >
                <div style={{ textAlign: 'center' }}>
                  <Avatar 
                    size={64} 
                    style={{ 
                      backgroundColor: persona.color, 
                      marginBottom: 12,
                      fontSize: 24
                    }}
                  >
                    {persona.avatar}
                  </Avatar>
                  <Title level={4} style={{ margin: '0 0 8px 0' }}>
                    {persona.name}
                  </Title>
                  <Tag color={persona.color} style={{ marginBottom: 12 }}>
                    {persona.icon} {persona.role}
                  </Tag>
                  <Paragraph style={{ fontSize: 12, margin: 0 }}>
                    {persona.background}
                  </Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 用户详情和旅程 */}
      {selectedPersonaData && (
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card title="用户画像" size="small">
              <div style={{ marginBottom: 16 }}>
                <Avatar 
                  size={48} 
                  style={{ 
                    backgroundColor: selectedPersonaData.color, 
                    marginBottom: 12,
                    fontSize: 18
                  }}
                >
                  {selectedPersonaData.avatar}
                </Avatar>
                <Title level={4} style={{ margin: '0 0 8px 0' }}>
                  {selectedPersonaData.name}
                </Title>
                <Tag color={selectedPersonaData.color}>
                  {selectedPersonaData.icon} {selectedPersonaData.role}
                </Tag>
              </div>
              
              <Divider />
              
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>🎯 主要目标</Title>
                <List
                  size="small"
                  dataSource={selectedPersonaData.goals}
                  renderItem={goal => (
                    <List.Item>
                      <Text style={{ fontSize: 12 }}>• {goal}</Text>
                    </List.Item>
                  )}
                />
              </div>
              
              <div>
                <Title level={5}>😰 痛点问题</Title>
                <List
                  size="small"
                  dataSource={selectedPersonaData.painPoints}
                  renderItem={pain => (
                    <List.Item>
                      <Text style={{ fontSize: 12, color: '#ff4d4f' }}>• {pain}</Text>
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </Col>
          
          <Col span={16}>
            <Card title="用户旅程" size="small">
              <Steps
                direction="vertical"
                size="small"
                current={selectedJourney.length}
              >
                {selectedJourney.map(step => (
                  <Step
                    key={step.step}
                    title={step.title}
                    description={
                      <div>
                        <Paragraph style={{ fontSize: 12, margin: '4px 0' }}>
                          {step.description}
                        </Paragraph>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong style={{ fontSize: 11 }}>主要操作:</Text>
                          <ul style={{ margin: '4px 0', paddingLeft: 16 }}>
                            {step.actions.map((action, index) => (
                              <li key={index}>
                                <Text style={{ fontSize: 11 }}>{action}</Text>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong style={{ fontSize: 11 }}>相关界面:</Text>
                          <div style={{ marginTop: 4 }}>
                            {step.uiElements.map((element, index) => (
                              <Tag key={index} style={{ margin: '2px', fontSize: 10 }}>
                                {element}
                              </Tag>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Text strong style={{ fontSize: 11, color: '#52c41a' }}>
                            ✅ 预期结果: {step.outcome}
                          </Text>
                        </div>
                      </div>
                    }
                    icon={step.icon}
                  />
                ))}
              </Steps>
            </Card>
          </Col>
        </Row>
      )}

      {/* 系统功能概览 */}
      <Card title="系统功能概览" style={{ marginTop: 24 }}>
        <Tabs defaultActiveKey="features">
          <TabPane tab="核心功能" key="features">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card size="small" title="Agent 开发者功能">
                  <List
                    size="small"
                    dataSource={[
                      'Agent 管理控制台',
                      '工具排名和推荐',
                      '需求模拟和监控',
                      '执行历史分析'
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        <Text style={{ fontSize: 12 }}>{item}</Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="MCP Tool 开发者功能">
                  <List
                    size="small"
                    dataSource={[
                      '工具性能监控',
                      '使用统计分析',
                      '工具注册管理',
                      '执行历史追踪'
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        <Text style={{ fontSize: 12 }}>{item}</Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="运营人员功能">
                  <List
                    size="small"
                    dataSource={[
                      '系统运营监控',
                      '失败原因分析',
                      '工具覆盖度分析',
                      '收入趋势分析'
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        <Text style={{ fontSize: 12 }}>{item}</Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="设计理念" key="design">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Alert
                  message="透明化设计"
                  description="所有排名算法、推荐理由、失败原因都完全透明，让用户了解系统决策的依据"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Alert
                  message="数据驱动"
                  description="基于真实的性能数据、成本信息、用户反馈进行决策，确保选择的准确性"
                  type="success"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              </Col>
              <Col span={12}>
                <Alert
                  message="多维度评估"
                  description="不仅考虑性能，还综合考虑成本、质量、使用热度等多个维度"
                  type="warning"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Alert
                  message="用户体验优先"
                  description="界面简洁直观，信息层次清晰，操作流程顺畅，降低学习成本"
                  type="error"
                  showIcon
                />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserGuidePage;
