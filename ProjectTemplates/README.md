# 项目模板说明

这是一个标准化的项目模板，用于快速创建新项目并保持一致的代码组织结构。

## 使用方法

### 1. 复制模板到新项目
```bash
# 复制整个模板文件夹
cp -r ProjectTemplates/ MyNewProject/
cd MyNewProject/

# 或者手动创建结构
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

### 3. 初始化项目
```bash
# 创建虚拟环境（Python 项目）
cd scripts
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

## 项目结构说明

### 文件夹用途
- `docs/` - 存放所有文档文件
- `scripts/` - 存放所有代码脚本
- `src/` - 存放源代码（如适用）
- `tests/` - 存放测试文件
- `config/` - 存放配置文件
- `data/` - 存放数据文件

### 重要文件
- `.cursorrules` - Cursor AI 助手规则配置
- `.gitignore` - Git 版本控制忽略文件
- `README.md` - 项目说明文档

## 开发规范

### 代码组织
- 所有代码文件必须存放在 `scripts/` 文件夹
- 使用虚拟环境隔离依赖
- 保持文档与代码同步

### 命名规范
- 使用小写字母和下划线
- 使用描述性的文件名
- 避免空格和特殊字符

### 文档要求
- 为每个项目创建详细的 README.md
- 为 scripts 文件夹创建专门的说明文档
- 保持文档的及时更新

## 注意事项

1. 始终遵循项目结构规范
2. 使用虚拟环境管理依赖
3. 保持代码和文档的同步
4. 定期清理不再使用的文件
5. 使用版本控制管理代码变更

## 支持的项目类型

- Python 数据分析项目
- Web 开发项目
- 机器学习项目
- 自动化脚本项目
- 文档生成项目

## 获取帮助

如果在使用过程中遇到问题，请参考：
1. `.cursorrules` 文件中的详细规范
2. `scripts/README.md` 中的脚本说明
3. 项目文档中的具体说明
