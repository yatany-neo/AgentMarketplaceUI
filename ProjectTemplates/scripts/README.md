# Scripts 文件夹说明

本文件夹包含项目相关的所有代码文件。

## 文件分类

### 1. 数据处理脚本
- `data_processor.py` - 数据预处理脚本
- `data_analyzer.py` - 数据分析脚本
- `data_cleaner.py` - 数据清洗脚本

### 2. 工具脚本
- `file_utils.py` - 文件操作工具
- `config_loader.py` - 配置加载工具
- `logger_setup.py` - 日志设置工具

### 3. 主程序脚本
- `main.py` - 主程序入口
- `run_analysis.py` - 运行分析脚本
- `generate_report.py` - 生成报告脚本

### 4. 测试脚本
- `test_*.py` - 单元测试脚本
- `integration_test.py` - 集成测试脚本

### 5. 配置文件
- `config.json` - 项目配置
- `settings.yaml` - 设置文件
- `*.json` - 其他配置文件

## 使用说明

### 环境要求
- Python 3.9+
- 虚拟环境已配置在 `venv/` 文件夹中

### 激活虚拟环境
```bash
cd scripts
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows
```

### 运行脚本
```bash
python3 <script_name>.py
```

### 安装依赖
```bash
pip install -r requirements.txt
```

## 开发规范

### 1. 代码风格
- 使用 PEP 8 代码风格
- 添加类型提示
- 编写详细的文档字符串
- 使用有意义的变量名

### 2. 错误处理
- 使用 try-except 处理异常
- 记录详细的错误日志
- 提供有意义的错误信息

### 3. 日志记录
- 使用 logging 模块记录日志
- 设置适当的日志级别
- 记录关键操作和错误

### 4. 测试
- 为关键功能编写单元测试
- 使用 pytest 进行测试
- 保持测试覆盖率

## 文件命名规范

- 使用小写字母和下划线：`my_script.py`
- 避免空格和特殊字符
- 使用描述性的文件名
- 版本号使用下划线：`script_v2.py`

## 注意事项

1. 所有脚本都设计为在项目根目录运行
2. 生成的输出文件会保存到相应的文件夹
3. 配置文件用于存储项目设置
4. 虚拟环境包含了所有必要的依赖包

## 文件维护

- 定期清理不再使用的脚本文件
- 保持配置文件与最新的项目需求同步
- 更新 README 文件以反映新的脚本添加或删除
- 定期更新依赖包版本
