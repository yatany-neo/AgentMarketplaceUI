import React, { useState } from 'react';
import { Layout, Menu, Card, Typography, Space, Avatar, Button, message, Tag } from 'antd';
import {
  UserOutlined,
  ToolOutlined,
  DashboardOutlined,
  SendOutlined,
  SearchOutlined,
  HistoryOutlined,
  TrophyOutlined,
  InfoCircleOutlined,
  CustomerServiceOutlined,
  ExperimentOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import RequestForm from './components/RequestForm';
import HistoryPage from './components/HistoryPage';
import MCPToolDeveloperView from './components/MCPToolDeveloperView';
import MCPToolHistoryPage from './components/MCPToolHistoryPage';
import OperationsView from './components/OperationsView';
import ToolRankingView from './components/ToolRankingView';
import UserGuidePage from './components/UserGuidePage';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// Demo 数据类型定义
interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'training';
  totalRequests: number; // 总需求数
  successRate: number;
  lastActive: string;
}

interface Task {
  id: string;
  agentId: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  tools: string[];
  progress: number;
  createdAt: string;
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
        alternatives?: Array<{
          name: string;
          matchScore: number;
          reasoning: string;
          whyNot: string;
        }>;
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

interface MCPTool {
  id: string;
  name: string;
  description: string;
  category: string;
  usage: number;
  rating: number;
}

interface DashboardData {
  totalRequests: number; // 总需求数
  activeTools: number;
  successRate: number;
  avgResponseTime: number;
}

// Demo 数据
const demoAgents: Agent[] = [
  {
    id: '1',
    name: 'Customer Service Agent',
    description: '处理客户服务相关的复杂查询和问题解决',
    status: 'active',
    totalRequests: 16, // 总需求数，与 History 页面一致
    successRate: 93.3, // 与 History 页面一致
    lastActive: '2分钟前'
  },
  {
    id: '2',
    name: 'Research Assistant Agent',
    description: '协助用户进行信息检索、数据分析和研究报告生成',
    status: 'active',
    totalRequests: 9, // 总需求数，与 History 页面一致
    successRate: 87.5, // 与 History 页面一致
    lastActive: '5分钟前'
  },
  {
    id: '3',
    name: 'Content Processing Agent',
    description: '处理 YouTube 内容、文档分析和多媒体内容处理',
    status: 'active',
    totalRequests: 6, // 总需求数，与 History 页面一致
    successRate: 60, // 与 History 页面一致
    lastActive: '3分钟前'
  }
];

const demoTasks: Task[] = [
  {
    id: '1',
    agentId: '1',
    title: 'Microsoft Redmond Woods Campus 到最近 Walmart 骑行时间查询',
    description: 'How many minutes does it take to start off from Microsoft Redmond Woods Campus - Building C to the nearest Walmart by bicycle?',
    status: 'running',
    tools: ['curated--googleMap--maps_geocode', 'curated--googleMap--get_place_details', 'curated--googleMap--search_nearby', 'curated--googleMap--maps_distance_matrix', 'curated--googleMap--maps_directions'],
    progress: 75,
    createdAt: '2024-01-20 14:30',
    requestClarification: {
      originalRequest: 'How many minutes does it take to start off from Microsoft Redmond Woods Campus - Building C to the nearest Walmart by bicycle?',
      clarifiedRequest: '用户希望查询从 Microsoft Redmond Woods Campus - Building C 到最近的 Walmart 的骑行时间（以分钟为单位），并获取商店详情。',
      keywords: ['Smart Search & Info Retrieval', 'place disambiguation', 'entity resolution', 'System Integration & API', 'geocoding', 'coordinate retrieval', 'places search', 'POI retrieval', 'directions API', 'bicycle routing', 'Math & Data Processing', 'time comparison', 'min selection', 'unit conversion', 'result formatting'],
      constraints: ['起点：Microsoft Redmond Woods Campus - Building C', '终点：最近的 Walmart', '交通方式：自行车', '输出：分钟为单位的时间']
    },
    taskBreakdown: {
      subtasks: [
        {
          id: '1-1',
          title: '验证并标准化起始地点',
          description: '将 "Microsoft Redmond Woods Campus - Building C" 验证并标准化为规范的地址或地点实体。',
          query: '标准化地址：Microsoft Redmond Woods Campus - Building C',
          recommendedTools: [
            { 
              name: 'curated--googleMap--maps_geocode', 
              matchScore: 95, 
              reasoning: '直接将自由文本起始地点转换为规范格式地址、place_id 和坐标，满足验证和地理编码需求',
              alternatives: [
                { 
                  name: 'Tavily', 
                  matchScore: 65, 
                  reasoning: '可以搜索地址信息，但缺乏专业的地理编码能力，无法提供精确的坐标和place_id',
                  whyNot: '通用搜索工具，缺乏地理编码的专业能力，无法满足精确地址验证需求'
                },
                { 
                  name: 'DuckDuckGo', 
                  matchScore: 45, 
                  reasoning: '可以搜索微软园区信息，但无法进行地址标准化和地理编码',
                  whyNot: '搜索工具，无法提供地理编码服务，不适合地址验证任务'
                }
              ]
            }
          ]
        },
        {
          id: '1-2',
          title: '地理编码起始地点',
          description: '将已验证的起始地点转换为经纬度坐标。',
          query: '获取 Microsoft Redmond Woods Campus - Building C 的经纬度坐标',
          recommendedTools: [
            { 
              name: 'curated--googleMap--maps_geocode', 
              matchScore: 95, 
              reasoning: '提供地理编码后的格式化地址、place_id 和 geometry.lat/lng',
              alternatives: [
                { 
                  name: 'Exa', 
                  matchScore: 70, 
                  reasoning: '可以搜索地理位置信息，但无法提供精确的坐标数据',
                  whyNot: '搜索工具，缺乏地理编码API能力，无法提供精确的经纬度坐标'
                }
              ]
            }
          ]
        },
        {
          id: '1-3',
          title: '搜索附近的沃尔玛门店',
          description: '在起始地点定义的半径内搜索附近的沃尔玛门店（包括 Supercenter 和 Neighborhood Market）。',
          query: '搜索 Microsoft Redmond Woods Campus - Building C 附近的所有沃尔玛门店',
          recommendedTools: [
            { 
              name: 'curated--googleMap--search_nearby', 
              matchScore: 90, 
              reasoning: '根据起始坐标查找附近的沃尔玛位置，支持关键词过滤和半径控制',
              alternatives: [
                { 
                  name: 'Tavily', 
                  matchScore: 60, 
                  reasoning: '可以搜索沃尔玛门店信息，但无法基于坐标进行附近搜索',
                  whyNot: '缺乏基于地理位置的附近搜索功能，无法按半径筛选结果'
                },
                { 
                  name: 'DuckDuckGo', 
                  matchScore: 50, 
                  reasoning: '可以搜索沃尔玛信息，但无法进行地理位置相关的附近搜索',
                  whyNot: '通用搜索工具，缺乏地理位置搜索能力，无法按距离筛选'
                }
              ]
            }
          ]
        },
        {
          id: '1-4',
          title: '获取骑行路线和时间',
          description: '从起始地点到每个候选沃尔玛门店检索骑行路线和预估旅行时间。',
          query: '计算从 Microsoft Redmond Woods Campus - Building C 到每个沃尔玛的骑行路线和时间',
          recommendedTools: [
            { 
              name: 'curated--googleMap--maps_distance_matrix', 
              matchScore: 92, 
              reasoning: '高效计算从一个起始点到多个候选沃尔玛目的地的自行车旅行时间，支持直接比较',
              alternatives: [
                { 
                  name: 'Tavily', 
                  matchScore: 40, 
                  reasoning: '可以搜索路线信息，但无法提供精确的骑行时间和距离计算',
                  whyNot: '缺乏路线规划API能力，无法计算精确的骑行时间和距离，不适合导航任务'
                }
              ]
            },
            { 
              name: 'curated--googleMap--maps_directions', 
              matchScore: 88, 
              reasoning: '获取完整的逐向自行车路线和精确旅行时间，用于最终结果确认',
              alternatives: [
                { 
                  name: 'Exa', 
                  matchScore: 35, 
                  reasoning: '可以搜索路线信息，但无法提供实时导航和精确时间计算',
                  whyNot: '搜索工具，缺乏实时路线规划能力，无法提供精确的骑行时间和逐向导航'
                }
              ]
            }
          ]
        },
        {
          id: '1-5',
          title: '比较并选择最短骑行时间',
          description: '比较所有骑行时间，并选择时间最短的沃尔玛门店。',
          query: '比较骑行时间并选择最短的沃尔玛',
          recommendedTools: [
            { 
              name: 'curated--googleMap--maps_distance_matrix', 
              matchScore: 90, 
              reasoning: '解析时间并选择最小值，支持时间比较和最小值选择',
              alternatives: [
                { 
                  name: 'Think', 
                  matchScore: 75, 
                  reasoning: 'AI推理工具可以进行比较计算，但需要额外的数据处理步骤',
                  whyNot: '虽然可以进行推理比较，但缺乏直接的时间数据解析能力，需要额外的数据预处理'
                },
                { 
                  name: 'Mem0', 
                  matchScore: 30, 
                  reasoning: '记忆工具可以存储数据，但无法进行数值比较和选择',
                  whyNot: '主要用于记忆存储，缺乏数值比较和选择算法，不适合数据处理任务'
                }
              ]
            }
          ]
        },
        {
          id: '1-6',
          title: '转换并呈现结果',
          description: '将选定的旅行时间转换为分钟，并与商店详情一起呈现结果。',
          query: '将最短骑行时间转换为分钟并输出商店详情',
          recommendedTools: [
            { 
              name: 'curated--googleMap--get_place_details', 
              matchScore: 88, 
              reasoning: '提供选定沃尔玛商店的权威详情，用于最终结果展示',
              alternatives: [
                { 
                  name: 'Tavily', 
                  matchScore: 60, 
                  reasoning: '可以搜索商店信息，但无法提供结构化的商店详情数据',
                  whyNot: '搜索工具，无法提供结构化的商店详情（如营业时间、联系方式等），数据格式不统一'
                },
                { 
                  name: 'Think', 
                  matchScore: 70, 
                  reasoning: 'AI推理工具可以处理数据转换，但无法获取商店详情',
                  whyNot: '虽然可以进行时间转换，但缺乏获取商店详情的API能力，无法提供完整的商店信息'
                }
              ]
            }
          ]
        }
      ]
    },
    toolRanking: [
      {
        toolName: 'curated--googleMap--maps_geocode',
        rank: 1,
        reasoning: '直接将自由文本起始地点转换为规范格式地址、place_id 和坐标，满足验证和地理编码需求',
        matchScore: 95
      },
      {
        toolName: 'curated--googleMap--search_nearby',
        rank: 2,
        reasoning: '根据起始坐标查找附近的沃尔玛位置，支持关键词过滤和半径控制',
        matchScore: 90
      },
      {
        toolName: 'curated--googleMap--maps_distance_matrix',
        rank: 3,
        reasoning: '高效计算从一个起始点到多个候选沃尔玛目的地的自行车旅行时间，支持直接比较',
        matchScore: 92
      },
      {
        toolName: 'curated--googleMap--maps_directions',
        rank: 4,
        reasoning: '获取完整的逐向自行车路线和精确旅行时间，用于最终结果确认',
        matchScore: 88
      },
      {
        toolName: 'curated--googleMap--get_place_details',
        rank: 5,
        reasoning: '提供选定沃尔玛商店的权威详情，用于最终结果展示',
        matchScore: 88
      }
    ]
  },
  {
    id: '2',
    agentId: '2',
    title: 'Doctor Who 第9季第11集迷宫场景查询',
    description: 'In Series 9, Episode 11 of Doctor Who, the Doctor is trapped inside an ever-shifting maze. What is this location called in the official script for the episode? Give the setting exactly as it appears in the first scene heading.',
    status: 'completed',
    tools: ['curated--tavily--tavily_search', 'curated--tavily--tavily_extract', 'mcp_download_mcp_download_file', 'mcp_pdf_mcp_extract_document_content'],
    progress: 100,
    createdAt: '2024-01-20 14:25',
    requestClarification: {
      originalRequest: 'In Series 9, Episode 11 of Doctor Who, the Doctor is trapped inside an ever-shifting maze. What is this location called in the official script for the episode? Give the setting exactly as it appears in the first scene heading.',
      clarifiedRequest: '用户需要查找 Doctor Who 第9季第11集中 Doctor 被困的不断变化的迷宫场景的官方名称，并获取剧本中第一个场景标题的确切表述。',
      keywords: ['Doctor Who', 'Series 9', 'Episode 11', 'maze', 'official script', 'scene heading', 'BBC Writersroom', 'Heaven Sent'],
      constraints: ['剧集：Doctor Who 第9季第11集', '场景：不断变化的迷宫', '来源：官方剧本', '输出：第一个场景标题的确切表述']
    },
    taskBreakdown: {
      subtasks: [
        {
          id: '2-1',
          title: '确认第9季第11集标题',
          description: '确认第9季第11集的正确标题，确保目标剧集准确。',
          query: 'Doctor Who Series 9 Episode 11 title confirmation',
          recommendedTools: [
            { 
              name: 'curated--tavily--tavily_search', 
              matchScore: 90, 
              reasoning: '用于识别第9季第11集的标题（确认为"Heaven Sent"）并定位官方剧本来源',
              alternatives: [
                { 
                  name: 'Exa', 
                  matchScore: 75, 
                  reasoning: '可以搜索Doctor Who相关信息，但可能无法提供最权威的剧集标题确认',
                  whyNot: '搜索工具，虽然可以找到相关信息，但缺乏对官方剧集数据库的专业访问，可能信息不够权威'
                },
                { 
                  name: 'DuckDuckGo', 
                  matchScore: 65, 
                  reasoning: '可以搜索剧集信息，但结果可能不够精确和权威',
                  whyNot: '通用搜索引擎，缺乏对专业影视数据库的访问，可能返回不准确或过时的信息'
                }
              ]
            }
          ]
        },
        {
          id: '2-2',
          title: '定位官方剧本来源',
          description: '定位该剧集的官方剧本来源（如 BBC Writersroom）并获取最新、权威的链接。',
          query: 'BBC Writersroom Doctor Who Heaven Sent official script',
          recommendedTools: [
            { 
              name: 'curated--tavily--tavily_search', 
              matchScore: 88, 
              reasoning: '搜索 BBC Writersroom 等官方来源，获取权威链接',
              alternatives: [
                { 
                  name: 'Exa', 
                  matchScore: 70, 
                  reasoning: '可以搜索BBC相关网站，但可能无法精确定位到官方剧本页面',
                  whyNot: '搜索工具，虽然可以找到BBC网站，但缺乏对官方剧本页面的精确定位能力'
                },
                { 
                  name: 'OpenWebSearch', 
                  matchScore: 60, 
                  reasoning: '可以搜索网络资源，但结果可能不够权威和准确',
                  whyNot: '开源搜索工具，缺乏对权威来源的识别能力，可能返回非官方或过时的链接'
                }
              ]
            }
          ]
        },
        {
          id: '2-3',
          title: '提取页面内容验证',
          description: '一旦找到候选 URL，提取页面内容以验证链接是否为官方 BBC Writersroom 剧本页面。',
          query: 'Extract BBC Writersroom script page content',
          recommendedTools: [
            { name: 'curated--tavily--tavily_extract', matchScore: 85, reasoning: '提取页面内容以验证链接是官方 BBC Writersroom 剧本页面，并获取直接剧本文档 URL' }
          ]
        },
        {
          id: '2-4',
          title: '下载官方剧本文档',
          description: '下载官方剧本文档（通常是从 BBC Writersroom 的 PDF）到本地路径进行可靠解析。',
          query: 'Download official script PDF from BBC Writersroom',
          recommendedTools: [
            { name: 'mcp_download_mcp_download_file', matchScore: 92, reasoning: '下载官方剧本文档到本地路径，确保我们有确切的源文件' }
          ]
        },
        {
          id: '2-5',
          title: '提取剧本文本和结构',
          description: '从下载的 PDF 中提取文本和结构元素，以隔离场景标题。',
          query: 'Extract script text and scene headings from PDF',
          recommendedTools: [
            { name: 'mcp_pdf_mcp_extract_document_content', matchScore: 90, reasoning: '从下载的 PDF 中提取文本和结构，以隔离场景标题，检索第一个场景标题的设置' }
          ]
        },
        {
          id: '2-6',
          title: '验证剧本官方状态',
          description: '验证剧本的官方状态，并在需要时与次要权威档案进行交叉检查。',
          query: 'Verify official script status and cross-check',
          recommendedTools: [
            { name: 'curated--tavily--tavily_search', matchScore: 75, reasoning: '验证剧本的官方状态，与权威档案进行交叉检查' }
          ]
        },
        {
          id: '2-7',
          title: '呈现场景设置字符串',
          description: '呈现设置字符串的确切表述，保持剧本中的大小写和标点符号。',
          query: 'Present setting string exactly as written in script',
          recommendedTools: [
            { name: 'mcp_pdf_mcp_extract_document_content', matchScore: 88, reasoning: '提取并呈现第一个场景标题的设置字符串，保持原始格式' }
          ]
        }
      ]
    },
    toolRanking: [
      {
        toolName: 'curated--tavily--tavily_search',
        rank: 1,
        reasoning: '用于识别第9季第11集的标题并定位官方剧本来源，获取最新、权威的链接',
        matchScore: 90
      },
      {
        toolName: 'curated--tavily--tavily_extract',
        rank: 2,
        reasoning: '提取页面内容以验证链接是官方 BBC Writersroom 剧本页面，并获取直接剧本文档 URL',
        matchScore: 85
      },
      {
        toolName: 'mcp_download_mcp_download_file',
        rank: 3,
        reasoning: '下载官方剧本文档到本地路径，确保我们有确切的源文件进行可靠解析',
        matchScore: 92
      },
      {
        toolName: 'mcp_pdf_mcp_extract_document_content',
        rank: 4,
        reasoning: '从下载的 PDF 中提取文本和结构，以隔离场景标题，检索第一个场景标题的设置',
        matchScore: 90
      }
    ]
  },
  {
    id: '3',
    agentId: '3',
    title: '企业数据分析报告生成',
    description: '分析公司销售数据，生成可视化报告并发送给管理层',
    status: 'running',
    tools: ['CSV', 'Xlsx', 'PDF', 'Search'],
    progress: 75,
    createdAt: '2024-01-20 14:25',
    requestClarification: {
      originalRequest: '分析销售数据并生成报告',
      clarifiedRequest: '分析公司销售数据，生成可视化报告并发送给管理层',
      keywords: ['数据分析', '销售数据', '可视化', '报告', '管理层'],
      constraints: ['数据源：销售数据', '输出：可视化报告', '目标：管理层', '格式：PDF']
    },
    taskBreakdown: {
      subtasks: [
        {
          id: '2-1',
          title: '数据提取和清洗',
          description: '从多个数据源提取和清洗销售数据',
          query: '提取和清洗销售数据 CSV 文件',
          recommendedTools: [
            { name: 'CSV', matchScore: 95, reasoning: '专门处理 CSV 格式的销售数据文件' },
            { name: 'Xlsx', matchScore: 70, reasoning: '可以处理 Excel 格式，但效率较低' }
          ]
        },
        {
          id: '2-2',
          title: '数据分析和计算',
          description: '进行销售趋势分析和关键指标计算',
          query: '销售数据分析和统计计算',
          recommendedTools: [
            { name: 'Xlsx', matchScore: 90, reasoning: '强大的数据分析和计算功能' },
            { name: 'CSV', matchScore: 60, reasoning: '基础数据处理，缺少高级分析功能' }
          ]
        },
        {
          id: '2-3',
          title: '报告生成和格式化',
          description: '将分析结果生成为专业的 PDF 报告',
          query: '生成 PDF 格式的分析报告',
          recommendedTools: [
            { name: 'PDF', matchScore: 92, reasoning: '专业的 PDF 报告生成和格式化' },
            { name: 'Xlsx', matchScore: 45, reasoning: '可以生成报告，但格式不够专业' }
          ]
        },
        {
          id: '2-4',
          title: '市场趋势研究',
          description: '搜索相关市场趋势信息作为报告背景',
          query: '搜索行业市场趋势和竞争对手分析',
          recommendedTools: [
            { name: 'Search', matchScore: 88, reasoning: '可以搜索最新的市场趋势和行业信息' },
            { name: 'PDF', matchScore: 30, reasoning: '主要用于报告生成，搜索功能有限' }
          ]
        }
      ]
    },
    toolRanking: [
      {
        toolName: 'CSV',
        rank: 1,
        reasoning: '最适合处理销售数据提取和清洗',
        matchScore: 95
      },
      {
        toolName: 'Xlsx',
        rank: 2,
        reasoning: '强大的数据分析和计算功能',
        matchScore: 90
      },
      {
        toolName: 'PDF',
        rank: 3,
        reasoning: '专业的报告生成和格式化',
        matchScore: 92
      },
      {
        toolName: 'Search',
        rank: 4,
        reasoning: '可以搜索市场趋势信息',
        matchScore: 88
      }
    ]
  },
  {
    id: '4',
    agentId: '3',
    title: 'Justin Bieber - Off My Face YouTube 评论获取',
    description: 'Could you get the top 10 comments from Justin Bieber - Off My Face (Live from Paris) from YouTube?',
    status: 'completed',
    tools: ['curated--youtube--search_videos', 'curated--youtube--get_video_details', 'curated--youtube--get_video_comments', 'mcp_browser_mcp_browser_use'],
    progress: 100,
    createdAt: '2024-01-20 14:20',
    requestClarification: {
      originalRequest: 'Could you get the top 10 comments from Justin Bieber - Off My Face (Live from Paris) from YouTube?',
      clarifiedRequest: '用户需要获取 Justin Bieber - Off My Face (Live from Paris) 视频的 Top 10 评论，按相关性排序，仅获取顶级评论。',
      keywords: ['Justin Bieber', 'Off My Face', 'Live from Paris', 'YouTube', 'top comments', 'relevance sorting', 'top-level comments'],
      constraints: ['艺术家：Justin Bieber', '歌曲：Off My Face', '版本：Live from Paris', '数量：Top 10', '排序：按相关性', '类型：仅顶级评论']
    },
    taskBreakdown: {
      subtasks: [
        {
          id: '4-1',
          title: '搜索 YouTube 视频',
          description: '找到官方的 "Justin Bieber - Off My Face (Live from Paris)" 视频并获取其视频 ID。',
          query: 'Search YouTube for "Justin Bieber - Off My Face (Live from Paris)"',
          recommendedTools: [
            { 
              name: 'curated--youtube--search_videos', 
              matchScore: 95, 
              reasoning: '具有高级过滤功能，可精确定位官方视频及其 ID',
              alternatives: [
                { 
                  name: 'Tavily', 
                  matchScore: 60, 
                  reasoning: '可以搜索YouTube视频信息，但无法直接获取视频ID和API访问',
                  whyNot: '搜索工具，虽然可以找到视频链接，但缺乏YouTube API的直接访问能力，无法获取视频ID'
                },
                { 
                  name: 'Exa', 
                  matchScore: 55, 
                  reasoning: '可以搜索视频信息，但无法提供YouTube API所需的结构化数据',
                  whyNot: '通用搜索工具，缺乏YouTube平台的专业集成，无法提供后续API调用所需的数据格式'
                }
              ]
            }
          ]
        },
        {
          id: '4-2',
          title: '确认视频详情',
          description: '验证标题和频道，并捕获规范 URL/ID。',
          query: 'Get video details and confirm title, channel, canonical ID/URL',
          recommendedTools: [
            { 
              name: 'curated--youtube--get_video_details', 
              matchScore: 90, 
              reasoning: '用于检索权威元数据（标题、频道名称、规范 ID/URL）以确认正确的视频资源',
              alternatives: [
                { 
                  name: 'YoutubeDownload', 
                  matchScore: 65, 
                  reasoning: '可以获取视频基本信息，但无法提供完整的元数据',
                  whyNot: '下载工具，主要功能是视频下载，缺乏获取详细元数据的能力，无法提供频道、发布时间等信息'
                },
                { 
                  name: 'Tavily', 
                  matchScore: 50, 
                  reasoning: '可以搜索视频信息，但无法提供YouTube API的结构化数据',
                  whyNot: '搜索工具，虽然可以找到视频信息，但无法提供YouTube API所需的规范ID和结构化元数据'
                }
              ]
            }
          ]
        },
        {
          id: '4-3',
          title: '配置评论检索',
          description: '确保按 Top（相关性）排序，仅针对顶级评论。',
          query: 'Set parameters for comment API request (order-relevance, filter-top-level)',
          recommendedTools: [
            { name: 'curated--youtube--get_video_comments', matchScore: 88, reasoning: '支持评论检索的排序/分页；将在调用中指定相关性和顶级评论' }
          ]
        },
        {
          id: '4-4',
          title: '获取评论',
          description: '使用相关性排序获取视频 ID 的评论线程。',
          query: 'Call comments endpoint and begin retrieval with relevance sorting',
          recommendedTools: [
            { name: 'curated--youtube--get_video_comments', matchScore: 90, reasoning: '获取 YouTube 评论，支持相关性排序和分页，是收集 Top 10 评论的关键' }
          ]
        },
        {
          id: '4-5',
          title: '分页直到收集≥10个顶级评论',
          description: '收集至少 10 个唯一的顶级评论。',
          query: 'Use pagination tokens to continue retrieving batches',
          recommendedTools: [
            { name: 'curated--youtube--get_video_comments', matchScore: 85, reasoning: '使用分页令牌继续检索批次，直到收集足够的顶级评论' }
          ]
        },
        {
          id: '4-6',
          title: '清理和提取所需字段',
          description: '提取评论文本和可选的作者显示名称；如果需要，排除回复/置顶。',
          query: 'Filter returned items to top-level comments, remove pinned if present, normalize text',
          recommendedTools: [
            { name: 'curated--youtube--get_video_comments', matchScore: 80, reasoning: '对返回的数据进行过滤和处理，提取顶级评论文本' }
          ]
        },
        {
          id: '4-7',
          title: '验证和去重',
          description: '确保评论属于目标视频并删除重复项。',
          query: 'Verify video ID association in results and deduplicate comment texts/authors',
          recommendedTools: [
            { name: 'curated--youtube--get_video_comments', matchScore: 75, reasoning: '对检索到的数据进行逻辑处理，验证和去重' }
          ]
        },
        {
          id: '4-8',
          title: '准备最终输出',
          description: '生成一个简单的、可读的 Top 10 评论列表。',
          query: 'Format the cleaned, validated comments as a list',
          recommendedTools: [
            { name: 'curated--youtube--get_video_comments', matchScore: 70, reasoning: '格式化清理和验证的评论为列表' }
          ]
        },
        {
          id: '4-9',
          title: '备用抓取（如果 API 失败）',
          description: '如果 API 访问失败或评论受限，仍从视频页面获取 Top 评论。',
          query: 'Use browser automation to open video, switch to "Top" comments, scroll/load, and scrape top-level comments',
          recommendedTools: [
            { name: 'mcp_browser_mcp_browser_use', matchScore: 85, reasoning: '作为 API 访问失败或评论受限时的强大备用机制，允许自动化浏览器交互直接从视频页面抓取评论' }
          ]
        }
      ]
    },
    toolRanking: [
      {
        toolName: 'curated--youtube--search_videos',
        rank: 1,
        reasoning: '具有高级过滤功能，可精确定位官方视频及其 ID',
        matchScore: 95
      },
      {
        toolName: 'curated--youtube--get_video_details',
        rank: 2,
        reasoning: '用于检索权威元数据（标题、频道名称、规范 ID/URL）以确认正确的视频资源',
        matchScore: 90
      },
      {
        toolName: 'curated--youtube--get_video_comments',
        rank: 3,
        reasoning: '获取 YouTube 评论，支持相关性排序和分页，是收集 Top 10 评论的关键',
        matchScore: 90
      },
      {
        toolName: 'mcp_browser_mcp_browser_use',
        rank: 4,
        reasoning: '作为 API 访问失败或评论受限时的强大备用机制，允许自动化浏览器交互直接从视频页面抓取评论',
        matchScore: 85
      }
    ]
  }
];

const demoTools: MCPTool[] = [
  // YouTube Content
  {
    id: '1',
    name: 'YoutubeToolBox',
    description: 'YouTube 内容处理和视频分析工具，支持视频搜索、详情获取和评论提取',
    category: 'YouTube Content',
    usage: 156,
    rating: 4.8
  },
  {
    id: '2',
    name: 'YoutubeDownload',
    description: 'YouTube 视频下载工具，支持多种格式和质量选择',
    category: 'YouTube Content',
    usage: 89,
    rating: 4.6
  },
  // Terminal Automation
  {
    id: '3',
    name: 'DesktopCommander',
    description: '桌面自动化工具，支持系统级操作和应用程序控制',
    category: 'Terminal Automation',
    usage: 67,
    rating: 4.5
  },
  // Smart Search & Info Retrieval
  {
    id: '4',
    name: 'Exa',
    description: '智能搜索和信息检索工具，提供高质量的网络搜索结果',
    category: 'Smart Search & Info Retrieval',
    usage: 134,
    rating: 4.7
  },
  {
    id: '5',
    name: 'Tavily',
    description: '专业搜索工具，专注于获取最新、权威的信息来源',
    category: 'Smart Search & Info Retrieval',
    usage: 98,
    rating: 4.6
  },
  {
    id: '6',
    name: 'DuckDuckGo',
    description: '隐私友好的搜索引擎，提供无追踪的搜索服务',
    category: 'Smart Search & Info Retrieval',
    usage: 76,
    rating: 4.4
  },
  {
    id: '7',
    name: 'OpenWebSearch',
    description: '开源网络搜索工具，支持多种搜索模式和结果格式',
    category: 'Smart Search & Info Retrieval',
    usage: 45,
    rating: 4.3
  },
  {
    id: '8',
    name: 'GoogleMap',
    description: 'Google 地图服务集成，提供地理编码、路线规划和地点搜索功能',
    category: 'Smart Search & Info Retrieval',
    usage: 189,
    rating: 4.8
  },
  // Finance & Analytics
  {
    id: '9',
    name: 'YahooFinance',
    description: '雅虎财经数据工具，提供股票、基金和金融市场数据',
    category: 'Finance & Analytics',
    usage: 67,
    rating: 4.5
  },
  // Memory & Knowledge Graph
  {
    id: '10',
    name: 'Mem0',
    description: '记忆和知识图谱工具，支持长期记忆存储和知识关联',
    category: 'Memory & Knowledge Graph',
    usage: 34,
    rating: 4.2
  },
  // AI Native & Inference
  {
    id: '11',
    name: 'Think',
    description: 'AI 原生推理工具，提供高级思维链和推理能力',
    category: 'AI Native & Inference',
    usage: 23,
    rating: 4.1
  }
];

// 基于 History 页面数据计算的统一统计数据
const dashboardData: DashboardData = {
  totalRequests: 31, // 16 + 9 + 6 = 31 (所有 Agent 的总需求数，包含正在执行的)
  activeTools: 11, // 更新为真实已上线的MCP工具数量
  successRate: 89.3, // 基于历史完成情况计算
  avgResponseTime: 1.8
};

// 组件定义
const AgentDeveloperView: React.FC<{ onRequestSubmit: (request: string, agentId: string) => void }> = ({ onRequestSubmit }) => {
  const [requestFormVisible, setRequestFormVisible] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('1');

  const getAgentById = (id: string) => demoAgents.find(agent => agent.id === id);
  const getTasksByAgent = (agentId: string) => demoTasks.filter(task => task.agentId === agentId);

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined />
          Agent 开发者控制台
        </Title>
        <Text type="secondary">
          管理和监控您的 AI Agents，查看任务执行状态和工具使用情况
        </Text>
      </div>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Agent 管理区域 */}
        <Card title="我的 AI Agents" extra={
          <Button 
            type="primary" 
            icon={<SendOutlined />}
            onClick={() => setRequestFormVisible(true)}
          >
            模拟 AI Agent 提交新需求
          </Button>
        }>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {demoAgents.map(agent => (
              <Card 
                key={agent.id} 
                size="small" 
                style={{ 
                  border: selectedAgent === agent.id ? '2px solid #1890ff' : '1px solid #f0f0f0',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <Avatar 
                        style={{ 
                          backgroundColor: agent.status === 'active' ? '#52c41a' : agent.status === 'training' ? '#faad14' : '#d9d9d9',
                          marginRight: 8
                        }}
                        icon={
                          agent.id === '1' ? <CustomerServiceOutlined /> :
                          agent.id === '2' ? <ExperimentOutlined /> :
                          agent.id === '3' ? <VideoCameraOutlined /> :
                          <UserOutlined />
                        }
                      />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>{agent.name}</Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {agent.status === 'active' ? '运行中' : agent.status === 'training' ? '训练中' : '已停止'}
                        </Text>
                      </div>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{agent.description}</Text>
                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 12 }}>请求数: {agent.totalRequests}</Text>
                      <Text style={{ fontSize: 12 }}>成功率: {agent.successRate}%</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>最后活跃: {agent.lastActive}</Text>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* 选中 Agent 的任务管理 */}
        <Card title={`${getAgentById(selectedAgent)?.name} - 任务管理`}>
          <div style={{ marginBottom: 16 }}>
            <Text strong>当前 Agent: </Text>
            <Text>{getAgentById(selectedAgent)?.name}</Text>
            <Text type="secondary" style={{ marginLeft: 16 }}>
              {getAgentById(selectedAgent)?.description}
            </Text>
          </div>
          
          {getTasksByAgent(selectedAgent).length > 0 ? (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {getTasksByAgent(selectedAgent).map(task => (
                <Card key={task.id} size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <Title level={5} style={{ margin: 0 }}>{task.title}</Title>
                      <Text type="secondary" style={{ fontSize: 12 }}>{task.description}</Text>
                      
                      {/* 需求澄清流程 */}
                      {task.requestClarification && (
                        <div style={{ marginTop: 12, padding: 12, background: '#f6f8fa', borderRadius: 6, border: '1px solid #e1e8ed' }}>
                          <Title level={5} style={{ margin: '0 0 12px 0', color: '#1890ff' }}>
                            📋 需求澄清流程
                          </Title>
                          
                          <div style={{ marginBottom: 12 }}>
                            <Text strong style={{ fontSize: 12, color: '#666' }}>AI Agent 原始需求:</Text>
                            <div style={{ padding: 8, background: '#fff', borderRadius: 4, marginTop: 4, border: '1px solid #d9d9d9' }}>
                              <Text style={{ fontSize: 13 }}>"{task.requestClarification.originalRequest}"</Text>
                            </div>
                          </div>

                          <div style={{ marginBottom: 12 }}>
                            <Text strong style={{ fontSize: 12, color: '#666' }}>Marketplace 澄清后需求:</Text>
                            <div style={{ padding: 8, background: '#e6f7ff', borderRadius: 4, marginTop: 4, border: '1px solid #91d5ff' }}>
                              <Text style={{ fontSize: 13 }}>"{task.requestClarification.clarifiedRequest}"</Text>
                            </div>
                          </div>

                          <div>
                            <Text strong style={{ fontSize: 12, color: '#666' }}>提取的关键词:</Text>
                            <div style={{ marginTop: 4 }}>
                              {task.requestClarification.keywords.map((keyword, index) => (
                                <Tag key={index} color="blue" style={{ margin: '2px' }}>
                                  {keyword}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 任务分解流程 */}
                      {task.taskBreakdown && (
                        <div style={{ marginTop: 16, padding: 12, background: '#f0f9ff', borderRadius: 6, border: '1px solid #bae7ff' }}>
                          <Title level={5} style={{ margin: '0 0 12px 0', color: '#1890ff' }}>
                            🔧 任务分解流程
                          </Title>
                          <Text type="secondary" style={{ fontSize: 12, marginBottom: 12, display: 'block' }}>
                            基于澄清后的需求，Marketplace 将需求分解为可执行的子任务：
                          </Text>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {task.taskBreakdown.subtasks.map((subtask, index) => (
                              <div key={subtask.id} style={{ 
                                padding: 16, 
                                background: '#fff', 
                                borderRadius: 8, 
                                border: '1px solid #d9d9d9',
                                position: 'relative'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                  <div style={{ 
                                    minWidth: 28, 
                                    height: 28, 
                                    borderRadius: '50%', 
                                    background: '#1890ff', 
                                    color: '#fff', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: 14,
                                    fontWeight: 'bold'
                                  }}>
                                    {index + 1}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <Text strong style={{ fontSize: 14, color: '#1890ff' }}>
                                      {subtask.title}
                                    </Text>
                                    <br />
                                    <Text style={{ fontSize: 12, color: '#666', marginBottom: 8, display: 'block' }}>
                                      {subtask.description}
                                    </Text>
                                    <Text code style={{ fontSize: 11, color: '#999', marginBottom: 12, display: 'block' }}>
                                      查询: {subtask.query}
                                    </Text>
                                    
                                    {/* 每个子任务的工具推荐 */}
                                    {subtask.recommendedTools && (
                                      <div style={{ marginTop: 8 }}>
                                        <Text strong style={{ fontSize: 12, color: '#52c41a' }}>
                                          🛠️ 推荐工具:
                                        </Text>
                                        <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                          {subtask.recommendedTools.map((tool, toolIndex) => (
                                            <div key={toolIndex} style={{ 
                                              padding: 8, 
                                              background: toolIndex === 0 ? '#f6ffed' : '#fafafa', 
                                              borderRadius: 4, 
                                              border: toolIndex === 0 ? '1px solid #b7eb8f' : '1px solid #d9d9d9'
                                            }}>
                                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                  <Text strong style={{ fontSize: 12, color: toolIndex === 0 ? '#52c41a' : '#1890ff' }}>
                                                    {tool.name}
                                                    {toolIndex === 0 && <Tag color="green" style={{ marginLeft: 6, fontSize: 9 }}>最佳</Tag>}
                                                  </Text>
                                                  <br />
                                                  <Text style={{ fontSize: 11, color: '#666' }}>
                                                    {tool.reasoning}
                                                  </Text>
                                                </div>
                                                <div style={{ 
                                                  fontSize: 14, 
                                                  fontWeight: 'bold', 
                                                  color: tool.matchScore >= 90 ? '#52c41a' : tool.matchScore >= 70 ? '#faad14' : '#ff4d4f'
                                                }}>
                                                  {tool.matchScore}%
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 子任务工具选择总结 */}
                      {task.taskBreakdown && (
                        <div style={{ marginTop: 16, padding: 12, background: '#f6ffed', borderRadius: 6, border: '1px solid #b7eb8f' }}>
                          <Title level={5} style={{ margin: '0 0 12px 0', color: '#52c41a' }}>
                            🎯 子任务工具选择总结
                          </Title>
                          <Text type="secondary" style={{ fontSize: 12, marginBottom: 12, display: 'block' }}>
                            每个子任务独立选择最适合的工具：
                          </Text>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {task.taskBreakdown.subtasks.map((subtask, index) => {
                              const selectedTool = subtask.recommendedTools?.[0]; // 选择匹配度最高的工具
                              return (
                                <div key={subtask.id} style={{ 
                                  padding: 12, 
                                  background: '#fff', 
                                  borderRadius: 6, 
                                  border: '1px solid #d9d9d9',
                                  position: 'relative'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                      <div style={{ 
                                        minWidth: 28, 
                                        height: 28, 
                                        borderRadius: '50%', 
                                        background: '#1890ff', 
                                        color: '#fff', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        fontSize: 12,
                                        fontWeight: 'bold'
                                      }}>
                                        {index + 1}
                                      </div>
                                      <div style={{ flex: 1 }}>
                                        <Text strong style={{ fontSize: 13, color: '#1890ff' }}>
                                          {subtask.title}
                                        </Text>
                                        <br />
                                        <Text style={{ fontSize: 12, color: '#666' }}>
                                          选择工具: <Text strong style={{ color: '#52c41a' }}>{selectedTool?.name}</Text>
                                        </Text>
                                        <br />
                                        <Text style={{ fontSize: 11, color: '#999' }}>
                                          {selectedTool?.reasoning}
                                        </Text>
                                        
                                        {/* 备选工具 */}
                                        {selectedTool?.alternatives && selectedTool.alternatives.length > 0 && (
                                          <div style={{ marginTop: 8 }}>
                                            <Text strong style={{ fontSize: 11, color: '#faad14', marginBottom: 4, display: 'block' }}>
                                              🔍 备选工具:
                                            </Text>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                              {selectedTool.alternatives.map((alt, altIndex) => (
                                                <div key={altIndex} style={{ 
                                                  padding: 6, 
                                                  background: '#fff7e6', 
                                                  borderRadius: 4, 
                                                  border: '1px solid #ffd591',
                                                  fontSize: 10
                                                }}>
                                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                                    <Text strong style={{ color: '#faad14' }}>
                                                      {alt.name}
                                                    </Text>
                                                    <Text style={{ 
                                                      fontWeight: 'bold', 
                                                      color: alt.matchScore >= 70 ? '#faad14' : '#ff4d4f'
                                                    }}>
                                                      {alt.matchScore}%
                                                    </Text>
                                                  </div>
                                                  <Text style={{ color: '#666', marginBottom: 2, display: 'block' }}>
                                                    <Text strong>考虑:</Text> {alt.reasoning}
                                                  </Text>
                                                  <Text style={{ color: '#ff4d4f', display: 'block' }}>
                                                    <Text strong>未选:</Text> {alt.whyNot}
                                                  </Text>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <div style={{ 
                                        fontSize: 16, 
                                        fontWeight: 'bold', 
                                        color: selectedTool?.matchScore && selectedTool.matchScore >= 80 ? '#52c41a' : 
                                               selectedTool?.matchScore && selectedTool.matchScore >= 60 ? '#faad14' : '#ff4d4f'
                                      }}>
                                        {selectedTool?.matchScore}%
                                      </div>
                                      <Text style={{ fontSize: 10, color: '#999' }}>匹配度</Text>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* MCP 工具使用总结 */}
                      {task.taskBreakdown && (
                        <div style={{ marginTop: 16, padding: 16, background: '#fff7e6', borderRadius: 8, border: '1px solid #ffd591' }}>
                          <Title level={5} style={{ margin: '0 0 16px 0', color: '#fa8c16' }}>
                            🎯 执行方案总结
                          </Title>
                          
                          {(() => {
                            // 收集所有子任务选择的工具
                            const usedTools = new Map();
                            task.taskBreakdown.subtasks.forEach((subtask, index) => {
                              const selectedTool = subtask.recommendedTools?.[0];
                              if (selectedTool) {
                                if (usedTools.has(selectedTool.name)) {
                                  usedTools.get(selectedTool.name).subtasks.push({
                                    id: index + 1,
                                    title: subtask.title,
                                    description: subtask.description
                                  });
                                } else {
                                  usedTools.set(selectedTool.name, {
                                    name: selectedTool.name,
                                    matchScore: selectedTool.matchScore,
                                    reasoning: selectedTool.reasoning,
                                    subtasks: [{
                                      id: index + 1,
                                      title: subtask.title,
                                      description: subtask.description
                                    }]
                                  });
                                }
                              }
                            });

                            const toolCount = usedTools.size;
                            const totalSubtasks = task.taskBreakdown.subtasks.length;

                            return (
                              <div>
                                {/* 执行概览 */}
                                <div style={{ 
                                  padding: 12, 
                                  background: '#f0f9ff', 
                                  borderRadius: 6, 
                                  border: '1px solid #91d5ff',
                                  marginBottom: 16
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                    <div style={{ 
                                      width: 40, 
                                      height: 40, 
                                      borderRadius: '50%', 
                                      background: '#1890ff', 
                                      color: '#fff', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      fontSize: 16,
                                      fontWeight: 'bold'
                                    }}>
                                      {toolCount}
                                    </div>
                                    <div>
                                      <Text strong style={{ fontSize: 14, color: '#1890ff' }}>
                                        执行方案概览
                                      </Text>
                                      <br />
                                      <Text style={{ fontSize: 12, color: '#666' }}>
                                        共 {totalSubtasks} 个子任务，使用 {toolCount} 个 MCP 工具
                                      </Text>
                                    </div>
                                  </div>
                                  <Text style={{ fontSize: 12, color: '#1890ff' }}>
                                    💡 此需求通过智能工具组合实现：每个工具都针对特定任务进行了优化，确保高效完成从 {task.requestClarification?.originalRequest} 到最终结果的完整流程。
                                  </Text>
                                </div>

                                {/* 工具执行流程 */}
                                <div style={{ marginBottom: 16 }}>
                                  <Text strong style={{ fontSize: 13, color: '#fa8c16', marginBottom: 8, display: 'block' }}>
                                    🔧 工具执行流程
                                  </Text>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {Array.from(usedTools.values()).map((tool, index) => (
                                      <div key={index} style={{ 
                                        padding: 12, 
                                        background: '#fff', 
                                        borderRadius: 6, 
                                        border: '1px solid #d9d9d9',
                                        position: 'relative'
                                      }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                          <div style={{ 
                                            minWidth: 28, 
                                            height: 28, 
                                            borderRadius: '50%', 
                                            background: '#fa8c16', 
                                            color: '#fff', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            fontSize: 12,
                                            fontWeight: 'bold'
                                          }}>
                                            {index + 1}
                                          </div>
                                          <div style={{ flex: 1 }}>
                                            <Text strong style={{ fontSize: 13, color: '#fa8c16' }}>
                                              {tool.name}
                                            </Text>
                                            <div style={{ marginTop: 4 }}>
                                              {tool.subtasks.map((subtask: any, subIndex: number) => (
                                                <div key={subIndex} style={{ 
                                                  padding: 6, 
                                                  background: '#fafafa', 
                                                  borderRadius: 4, 
                                                  marginBottom: 4,
                                                  border: '1px solid #f0f0f0'
                                                }}>
                                                  <Text style={{ fontSize: 11, color: '#666' }}>
                                                    <Text strong>步骤 {subtask.id}:</Text> {subtask.title}
                                                  </Text>
                                                  <br />
                                                  <Text style={{ fontSize: 10, color: '#999' }}>
                                                    {subtask.description}
                                                  </Text>
                                                </div>
                                              ))}
                                            </div>
                                            <Text style={{ fontSize: 11, color: '#999', marginTop: 4, display: 'block' }}>
                                              {tool.reasoning}
                                            </Text>
                                          </div>
                                          <div style={{ textAlign: 'right', minWidth: 60 }}>
                                            <div style={{ 
                                              fontSize: 14, 
                                              fontWeight: 'bold', 
                                              color: tool.matchScore >= 90 ? '#52c41a' : 
                                                     tool.matchScore >= 80 ? '#faad14' : '#ff4d4f'
                                            }}>
                                              {tool.matchScore}%
                                            </div>
                                            <Text style={{ fontSize: 10, color: '#999' }}>匹配度</Text>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* 执行策略 */}
                                <div style={{ 
                                  padding: 12, 
                                  background: '#f6ffed', 
                                  borderRadius: 6, 
                                  border: '1px solid #b7eb8f'
                                }}>
                                  <Text strong style={{ fontSize: 12, color: '#52c41a', marginBottom: 4, display: 'block' }}>
                                    🚀 执行策略
                                  </Text>
                                  <Text style={{ fontSize: 11, color: '#666' }}>
                                    此方案采用"专业化分工"策略：每个 MCP 工具都专注于其最擅长的领域。
                                    {task.id === '1' && ' Search 负责信息检索，GoogleMap MCP 处理地理编码，Location Search 专注附近搜索，Route Calculator 计算最优路线。'}
                                    {task.id === '2' && ' CSV 处理数据提取，Xlsx 进行深度分析，PDF 生成专业报告，Search 提供市场背景。'}
                                    {task.id === '3' && ' YouTube ToolBox 全程处理视频相关任务，确保数据一致性和专业性。'}
                                    这种组合确保了高效、准确的任务完成。
                                  </Text>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}


                      <Text type="secondary" style={{ fontSize: 11, marginTop: 8, display: 'block' }}>
                        创建时间: {task.createdAt}
                      </Text>
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: 16 }}>
                      <div style={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%', 
                        background: `conic-gradient(#52c41a ${task.progress * 3.6}deg, #f0f0f0 0deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8
                      }}>
                        <Text strong style={{ fontSize: 12 }}>{task.progress}%</Text>
                      </div>
                      <Text 
                        type={task.status === 'completed' ? 'success' : task.status === 'running' ? 'warning' : 'secondary'}
                        style={{ fontSize: 12 }}
                      >
                        {task.status === 'completed' ? '已完成' : task.status === 'running' ? '执行中' : '待处理'}
                      </Text>
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              <Text type="secondary">该 Agent 暂无任务</Text>
    </div>
          )}
        </Card>
      </Space>
      
      <RequestForm
        visible={requestFormVisible}
        onClose={() => setRequestFormVisible(false)}
        onSubmit={(request) => onRequestSubmit(request, selectedAgent)}
      />
    </>
  );
};



const App: React.FC = () => {
  const [selectedView, setSelectedView] = useState('agent');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    {
      key: 'agent',
      icon: <UserOutlined />,
      label: 'Agent 开发者',
      children: [
        {
          key: 'agent-dashboard',
          icon: <DashboardOutlined />,
          label: '控制台',
        },
        {
          key: 'agent-history',
          icon: <HistoryOutlined />,
          label: '执行历史',
        },
        {
          key: 'agent-ranking',
          icon: <TrophyOutlined />,
          label: '工具排名',
        },
      ],
    },
    {
      key: 'tool',
      icon: <ToolOutlined />,
      label: 'MCP Tool 开发者',
      children: [
        {
          key: 'tool-dashboard',
          icon: <DashboardOutlined />,
          label: '控制台',
        },
        {
          key: 'tool-history',
          icon: <HistoryOutlined />,
          label: '执行历史',
        },
      ],
    },
    {
      key: 'operations',
      icon: <DashboardOutlined />,
      label: '运营人员',
    },
    {
      key: 'guide',
      icon: <InfoCircleOutlined />,
      label: '用户指南',
    },
  ];

  const handleRequestSubmit = (request: string, agentId: string) => {
    const agent = demoAgents.find(a => a.id === agentId);
    message.success(`AI Agent ${agent?.name} 已向 Marketplace 提交需求: ${request}`);
    // 这里可以添加实际的API调用逻辑
  };

  const handleToolSubmit = (tool: any) => {
    message.success(`新工具已注册: ${tool.name}`);
    // 这里可以添加实际的API调用逻辑
  };

  const renderContent = () => {
    if (selectedView === 'agent') {
      if (currentPage === 'history') {
        return <HistoryPage />;
      } else if (currentPage === 'ranking') {
        return <ToolRankingView />;
      } else {
        return <AgentDeveloperView onRequestSubmit={handleRequestSubmit} />;
      }
    }
    
    if (selectedView === 'tool') {
      if (currentPage === 'history') {
        return <MCPToolHistoryPage />;
      } else {
        return <MCPToolDeveloperView onToolSubmit={handleToolSubmit} />;
      }
    }
    
    switch (selectedView) {
      case 'operations':
        return <OperationsView />;
      case 'guide':
        return <UserGuidePage />;
      default:
        return <AgentDeveloperView onRequestSubmit={handleRequestSubmit} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SearchOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: 12 }} />
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            Agent Marketplace
          </Title>
        </div>
      </Header>
      
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[
              currentPage === 'history' && selectedView === 'agent' ? 'agent-history' : 
              currentPage === 'ranking' && selectedView === 'agent' ? 'agent-ranking' :
              currentPage === 'history' && selectedView === 'tool' ? 'tool-history' :
              selectedView === 'agent' ? 'agent-dashboard' : 
              selectedView === 'tool' ? 'tool-dashboard' : 
              selectedView
            ]}
            openKeys={['agent', 'tool']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => {
              if (key === 'agent-dashboard') {
                setSelectedView('agent');
                setCurrentPage('dashboard');
              } else if (key === 'agent-history') {
                setSelectedView('agent');
                setCurrentPage('history');
              } else if (key === 'agent-ranking') {
                setSelectedView('agent');
                setCurrentPage('ranking');
              } else if (key === 'tool-dashboard') {
                setSelectedView('tool');
                setCurrentPage('dashboard');
              } else if (key === 'tool-history') {
                setSelectedView('tool');
                setCurrentPage('history');
              } else {
                setSelectedView(key);
                setCurrentPage('dashboard');
              }
            }}
          />
        </Sider>
        
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;