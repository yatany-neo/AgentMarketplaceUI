# 🚀 快速开始指南

本指南将帮助您在 5 分钟内快速设置并使用这套 Cursor Rules 配置系统。

## ⚡ 超快速开始（2 分钟）

### 1. 创建新项目

```bash
# 复制模板到新项目
cp -r ProjectTemplates/ MyNewProject/
cd MyNewProject/
```

### 2. 设置环境

```bash
# 进入脚本文件夹并运行设置脚本
cd scripts
chmod +x setup_environment.sh
./setup_environment.sh
```

### 3. 开始开发

```bash
# 返回项目根目录并激活环境
cd ..
source activate_env.sh

# 运行项目
./run_project.sh
```

**完成！** 🎉 您的项目已经准备就绪。

## 📋 详细步骤（5 分钟）

### 步骤 1: 项目创建

```bash
# 创建项目目录
mkdir MyAwesomeProject
cd MyAwesomeProject

# 复制模板文件
cp -r ~/path/to/ProjectTemplates/* .

# 查看项目结构
ls -la
```

### 步骤 2: 环境配置

```bash
# 进入脚本文件夹
cd scripts

# 运行环境设置脚本
./setup_environment.sh
```

脚本会自动：
- ✅ 检查 Python 版本
- ✅ 创建虚拟环境
- ✅ 安装依赖包
- ✅ 创建目录结构
- ✅ 设置 Git 钩子

### 步骤 3: 验证安装

```bash
# 返回项目根目录
cd ..

# 激活环境
source activate_env.sh

# 检查 Python 环境
which python
python --version

# 运行测试
./run_project.sh --help
```

### 步骤 4: 开始编码

```bash
# 创建你的第一个脚本
cp scripts/template_main.py scripts/my_script.py

# 编辑脚本
# ... 添加你的代码 ...

# 运行脚本
python scripts/my_script.py
```

## 🎯 项目结构概览

设置完成后，您的项目结构如下：

```
MyAwesomeProject/
├── 📁 docs/                 # 文档文件夹
├── 📁 scripts/              # 代码文件夹（所有代码都在这里）
│   ├── 📁 venv/            # Python 虚拟环境
│   ├── 📄 requirements.txt # Python 依赖
│   └── 📄 *.py            # 您的 Python 脚本
├── 📁 config/              # 配置文件
├── 📁 data/                # 数据文件
├── 📄 .cursorrules         # Cursor AI 规则
├── 📄 activate_env.sh      # 环境激活脚本
└── 📄 run_project.sh       # 项目运行脚本
```

## 🔧 常用命令

### 环境管理

```bash
# 激活环境
source activate_env.sh

# 运行项目
./run_project.sh

# 手动激活虚拟环境
source scripts/venv/bin/activate
```

### 开发工作流

```bash
# 创建新脚本
touch scripts/new_script.py

# 安装新依赖
pip install package_name
pip freeze > scripts/requirements.txt

# 运行测试
python -m pytest tests/

# 代码格式化
black scripts/
```

### 项目管理

```bash
# 查看项目状态
git status

# 提交更改
git add .
git commit -m "feat: 添加新功能"

# 推送到远程仓库
git push
```

## 🆘 遇到问题？

### 常见问题解决

**Q: 环境设置脚本失败？**
```bash
# 检查 Python 版本
python3 --version

# 手动创建虚拟环境
cd scripts
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Q: 找不到命令？**
```bash
# 确保脚本有执行权限
chmod +x scripts/setup_environment.sh
chmod +x activate_env.sh
chmod +x run_project.sh
```

**Q: 虚拟环境问题？**
```bash
# 重新创建虚拟环境
rm -rf scripts/venv
cd scripts
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 获取帮助

1. 📖 查看完整文档：`USAGE_GUIDE.md`
2. 🔍 检查 Cursor 规则：`.cursorrules`
3. 📝 查看脚本说明：`scripts/README.md`

## 🎉 下一步

现在您已经成功设置了项目环境，可以：

1. **开始编码**：在 `scripts/` 文件夹中创建您的脚本
2. **添加文档**：在 `docs/` 文件夹中编写项目文档
3. **配置项目**：修改 `config/` 中的配置文件
4. **运行测试**：在 `tests/` 文件夹中编写测试

## 💡 提示

- 🔄 每次开始工作前运行 `source activate_env.sh`
- 📁 所有代码文件都放在 `scripts/` 文件夹中
- 📝 及时更新 `scripts/README.md` 文档
- 🔧 根据需要修改配置文件

**祝您编码愉快！** 🚀
