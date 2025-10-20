# Cursor Rules 使用指南

本指南将帮助您快速上手使用这套标准化的项目组织规范和 Cursor Rules 配置。

## 📋 目录

1. [快速开始](#快速开始)
2. [项目结构说明](#项目结构说明)
3. [环境设置](#环境设置)
4. [开发工作流程](#开发工作流程)
5. [代码规范](#代码规范)
6. [配置文件说明](#配置文件说明)
7. [常见问题](#常见问题)
8. [最佳实践](#最佳实践)

## 🚀 快速开始

### 1. 创建新项目

```bash
# 方法一：复制整个模板
cp -r ProjectTemplates/ MyNewProject/
cd MyNewProject/

# 方法二：手动创建结构
mkdir MyNewProject
cd MyNewProject
mkdir -p docs scripts src tests config data
```

### 2. 复制配置文件

```bash
# 复制 Cursor 规则文件
cp ProjectTemplates/.cursorrules .

# 复制 Git 忽略文件
cp ProjectTemplates/.gitignore .

# 复制脚本说明文档
cp ProjectTemplates/scripts/README.md scripts/
```

### 3. 初始化环境

```bash
# 运行环境设置脚本
cd scripts
chmod +x setup_environment.sh
./setup_environment.sh
```

### 4. 开始开发

```bash
# 激活环境
source activate_env.sh

# 运行项目
./run_project.sh
```

## 📁 项目结构说明

### 标准项目结构

```
ProjectName/
├── docs/                    # 📚 文档文件夹
│   ├── README.md           # 项目说明文档
│   ├── *.md               # 其他文档文件
│   └── images/            # 图片资源
├── scripts/                # 💻 代码文件夹（统一存放）
│   ├── README.md          # 脚本说明文档
│   ├── *.py               # Python 脚本
│   ├── *.js               # JavaScript 脚本
│   ├── *.json             # 配置文件
│   ├── requirements.txt   # Python 依赖
│   ├── package.json       # Node.js 依赖
│   ├── venv/              # Python 虚拟环境
│   └── setup_environment.sh # 环境设置脚本
├── src/                    # 🔧 源代码文件夹（如适用）
├── tests/                  # 🧪 测试文件夹
├── config/                 # ⚙️ 配置文件
├── data/                   # 📊 数据文件
├── .cursorrules           # 🤖 Cursor 规则文件
├── .gitignore             # 🚫 Git 忽略文件
├── activate_env.sh        # 🔄 环境激活脚本
├── run_project.sh         # ▶️ 项目运行脚本
└── README.md              # 📖 项目根说明
```

### 文件夹用途详解

| 文件夹 | 用途 | 说明 |
|--------|------|------|
| `docs/` | 文档存储 | 存放所有项目文档、说明、图片等 |
| `scripts/` | 代码存储 | **所有代码文件必须存放在此文件夹** |
| `src/` | 源代码 | 适用于需要编译的项目 |
| `tests/` | 测试文件 | 存放单元测试、集成测试等 |
| `config/` | 配置文件 | 存放项目配置文件 |
| `data/` | 数据文件 | 存放输入数据、输出结果等 |

## ⚙️ 环境设置

### Python 项目环境设置

```bash
# 1. 进入 scripts 文件夹
cd scripts

# 2. 创建虚拟环境
python3 -m venv venv

# 3. 激活虚拟环境
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows

# 4. 安装依赖
pip install -r requirements.txt
```

### Node.js 项目环境设置

```bash
# 1. 进入 scripts 文件夹
cd scripts

# 2. 安装依赖
npm install

# 3. 运行项目
npm start
```

### 自动化环境设置

使用提供的环境设置脚本：

```bash
cd scripts
./setup_environment.sh
```

该脚本会自动：
- 检查 Python 版本
- 创建虚拟环境
- 安装依赖包
- 创建必要的目录结构
- 设置 Git 钩子
- 创建启动脚本

## 🔄 开发工作流程

### 1. 项目初始化流程

```bash
# 创建项目
mkdir MyProject && cd MyProject

# 复制模板文件
cp -r ~/ProjectTemplates/* .

# 设置环境
cd scripts && ./setup_environment.sh

# 开始开发
cd .. && source activate_env.sh
```

### 2. 日常开发流程

```bash
# 激活环境
source activate_env.sh

# 开发代码
# ... 编写代码 ...

# 运行测试
python -m pytest tests/

# 提交代码
git add .
git commit -m "feat: 添加新功能"
git push
```

### 3. 代码组织流程

1. **创建新脚本**：在 `scripts/` 文件夹中创建
2. **添加文档**：更新 `scripts/README.md`
3. **编写测试**：在 `tests/` 文件夹中创建测试
4. **更新配置**：修改 `config/` 中的配置文件

## 📝 代码规范

### 文件命名规范

- 使用小写字母和下划线：`my_script.py`
- 避免空格和特殊字符
- 使用描述性的文件名
- 版本号使用下划线：`script_v2.py`

### Python 代码规范

```python
#!/usr/bin/env python3
"""
脚本说明文档
描述脚本的功能和用途

作者: Your Name
创建时间: 2024-01-01
版本: 1.0.0
"""

import os
import sys
from typing import List, Dict, Any
import logging

# 设置日志
logger = logging.getLogger(__name__)

def main() -> int:
    """
    主函数
    
    Returns:
        退出代码 (0: 成功, 1: 失败)
    """
    try:
        # 主程序逻辑
        logger.info("程序开始执行")
        
        # TODO: 添加你的代码
        
        logger.info("程序执行完成")
        return 0
        
    except Exception as e:
        logger.error(f"程序执行失败: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
```

### 文档字符串规范

```python
def process_data(data: List[Dict[str, Any]], 
                config: Dict[str, Any]) -> pd.DataFrame:
    """
    处理数据
    
    Args:
        data: 输入数据列表
        config: 配置字典
        
    Returns:
        处理后的数据框
        
    Raises:
        ValueError: 数据格式错误
        FileNotFoundError: 配置文件不存在
    """
    pass
```

## ⚙️ 配置文件说明

### 1. `.cursorrules` 文件

这是 Cursor AI 助手的核心配置文件，包含：
- 用户偏好设置
- 项目结构规范
- 代码组织原则
- 开发工作流程
- 错误处理规范

### 2. `requirements.txt` 文件

Python 项目依赖管理：

```txt
# 核心依赖
pandas>=1.5.0
numpy>=1.21.0
matplotlib>=3.5.0

# 开发依赖
pytest>=7.0.0
black>=22.0.0
flake8>=5.0.0
```

### 3. `package.json` 文件

Node.js 项目依赖管理：

```json
{
  "name": "project-name",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

### 4. 配置文件

- `config/config.json` - JSON 格式配置
- `config/settings.yaml` - YAML 格式配置
- `env.example` - 环境变量示例

## ❓ 常见问题

### Q1: 为什么所有代码都要放在 `scripts/` 文件夹？

**A:** 这种组织方式有以下优势：
- 保持项目根目录整洁
- 便于代码管理和维护
- 统一的虚拟环境配置
- 清晰的职责分离

### Q2: 如何处理不同类型的项目？

**A:** 根据项目类型调整结构：
- **数据分析项目**：重点使用 `data/` 和 `scripts/analysis/`
- **Web 开发项目**：使用 `src/frontend/` 和 `src/backend/`
- **机器学习项目**：使用 `models/` 和 `scripts/training/`

### Q3: 虚拟环境应该放在哪里？

**A:** 虚拟环境统一放在 `scripts/venv/` 中，这样：
- 与代码文件在同一位置
- 便于环境管理
- 符合项目组织原则

### Q4: 如何更新 Cursor Rules？

**A:** 直接修改 `.cursorrules` 文件，Cursor 会自动重新加载配置。

### Q5: 如何处理多个 Python 版本？

**A:** 使用 `pyenv` 或 `conda` 管理多个 Python 版本：

```bash
# 使用 pyenv
pyenv install 3.9.0
pyenv local 3.9.0

# 使用 conda
conda create -n myproject python=3.9
conda activate myproject
```

## 🏆 最佳实践

### 1. 项目初始化最佳实践

- 始终使用模板创建新项目
- 及时更新项目文档
- 配置合适的 `.gitignore`
- 设置必要的 Git 钩子

### 2. 代码开发最佳实践

- 遵循 PEP 8 代码风格
- 编写详细的文档字符串
- 使用类型提示
- 编写单元测试

### 3. 环境管理最佳实践

- 使用虚拟环境隔离依赖
- 定期更新依赖包
- 使用 `requirements.txt` 锁定版本
- 区分开发和生产环境

### 4. 文档维护最佳实践

- 保持文档与代码同步
- 使用 Markdown 格式
- 添加代码示例
- 定期更新使用说明

### 5. 版本控制最佳实践

- 使用有意义的提交信息
- 定期提交代码
- 使用分支管理功能
- 保持主分支稳定

## 🔧 自定义配置

### 修改 Cursor Rules

编辑 `.cursorrules` 文件，添加你的特定需求：

```markdown
## 自定义规则
- 使用特定的代码风格
- 添加项目特定的工具配置
- 设置特殊的错误处理方式
```

### 添加新的脚本模板

在 `ProjectTemplates/scripts/` 中创建新的模板文件：

```python
#!/usr/bin/env python3
"""
新功能模板
"""

def new_function():
    """新功能实现"""
    pass
```

### 扩展配置文件

根据需要添加新的配置选项：

```json
{
  "custom_settings": {
    "new_option": "value"
  }
}
```

## 📞 获取帮助

如果在使用过程中遇到问题：

1. 查看本使用指南
2. 检查 `.cursorrules` 文件中的规范
3. 参考 `scripts/README.md` 中的说明
4. 查看项目文档中的具体说明

## 🎯 总结

这套 Cursor Rules 配置系统提供了：

- ✅ 标准化的项目结构
- ✅ 统一的代码组织方式
- ✅ 自动化的环境设置
- ✅ 完善的开发工作流程
- ✅ 详细的文档和说明

通过遵循这些规范，您可以：
- 快速创建新项目
- 保持代码组织的一致性
- 提高开发效率
- 减少环境配置问题
- 便于团队协作

开始使用这套规范，让您的项目开发更加高效和专业！
