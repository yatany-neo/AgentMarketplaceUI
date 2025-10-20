#!/bin/bash
# 环境设置脚本
# 用于快速设置新项目的开发环境

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_success() {
    print_message $GREEN "✅ $1"
}

print_error() {
    print_message $RED "❌ $1"
}

print_warning() {
    print_message $YELLOW "⚠️  $1"
}

print_info() {
    print_message $BLUE "ℹ️  $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 未安装，请先安装 $1"
        exit 1
    fi
}

# 检查 Python 版本
check_python_version() {
    local python_cmd=$1
    local version=$($python_cmd --version 2>&1 | cut -d' ' -f2)
    local major=$(echo $version | cut -d'.' -f1)
    local minor=$(echo $version | cut -d'.' -f2)
    
    if [ "$major" -lt 3 ] || ([ "$major" -eq 3 ] && [ "$minor" -lt 9 ]); then
        print_error "Python 版本过低 ($version)，需要 Python 3.9 或更高版本"
        exit 1
    fi
    
    print_success "Python 版本检查通过: $version"
}

# 创建虚拟环境
create_virtual_environment() {
    local venv_path="venv"
    
    if [ -d "$venv_path" ]; then
        print_warning "虚拟环境已存在，是否重新创建？(y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            print_info "删除现有虚拟环境..."
            rm -rf "$venv_path"
        else
            print_info "使用现有虚拟环境"
            return 0
        fi
    fi
    
    print_info "创建 Python 虚拟环境..."
    python3 -m venv "$venv_path"
    print_success "虚拟环境创建完成"
}

# 激活虚拟环境并安装依赖
install_dependencies() {
    local venv_path="venv"
    
    print_info "激活虚拟环境..."
    source "$venv_path/bin/activate"
    
    print_info "升级 pip..."
    pip install --upgrade pip
    
    if [ -f "requirements.txt" ]; then
        print_info "安装 Python 依赖..."
        pip install -r requirements.txt
        print_success "Python 依赖安装完成"
    else
        print_warning "未找到 requirements.txt 文件"
    fi
}

# 创建必要的目录
create_directories() {
    print_info "创建项目目录结构..."
    
    local directories=(
        "logs"
        "data/input"
        "data/output"
        "docs/images"
        "temp"
        "tests"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
        print_info "创建目录: $dir"
    done
    
    print_success "目录结构创建完成"
}

# 设置 Git 钩子
setup_git_hooks() {
    if [ -d ".git" ]; then
        print_info "设置 Git 钩子..."
        
        # 创建 pre-commit 钩子
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# 运行代码检查
echo "运行代码检查..."

# 检查 Python 语法
if command -v python3 &> /dev/null; then
    python3 -m py_compile $(git diff --cached --name-only --diff-filter=ACM | grep '\.py$')
    if [ $? -ne 0 ]; then
        echo "Python 语法检查失败"
        exit 1
    fi
fi

echo "代码检查通过"
EOF
        
        chmod +x .git/hooks/pre-commit
        print_success "Git 钩子设置完成"
    else
        print_warning "未检测到 Git 仓库，跳过 Git 钩子设置"
    fi
}

# 创建启动脚本
create_startup_scripts() {
    print_info "创建启动脚本..."
    
    # 创建激活环境的脚本
    cat > activate_env.sh << 'EOF'
#!/bin/bash
# 激活项目环境

# 检查虚拟环境是否存在
if [ ! -d "scripts/venv" ]; then
    echo "错误: 虚拟环境不存在，请先运行 setup_environment.sh"
    exit 1
fi

# 激活虚拟环境
source scripts/venv/bin/activate

echo "项目环境已激活"
echo "Python 路径: $(which python)"
echo "Pip 路径: $(which pip)"
EOF
    
    chmod +x activate_env.sh
    
    # 创建运行脚本
    cat > run_project.sh << 'EOF'
#!/bin/bash
# 运行项目主程序

# 激活环境
source activate_env.sh

# 运行主程序
if [ -f "scripts/main.py" ]; then
    python scripts/main.py "$@"
elif [ -f "scripts/template_main.py" ]; then
    python scripts/template_main.py "$@"
else
    echo "错误: 未找到主程序文件"
    exit 1
fi
EOF
    
    chmod +x run_project.sh
    
    print_success "启动脚本创建完成"
}

# 主函数
main() {
    print_info "开始设置项目环境..."
    
    # 检查必要的命令
    check_command "python3"
    check_command "pip"
    
    # 检查 Python 版本
    check_python_version "python3"
    
    # 创建目录结构
    create_directories
    
    # 创建虚拟环境
    create_virtual_environment
    
    # 安装依赖
    install_dependencies
    
    # 设置 Git 钩子
    setup_git_hooks
    
    # 创建启动脚本
    create_startup_scripts
    
    print_success "项目环境设置完成！"
    print_info "使用方法："
    print_info "  激活环境: source activate_env.sh"
    print_info "  运行项目: ./run_project.sh"
    print_info "  手动激活: source scripts/venv/bin/activate"
}

# 运行主函数
main "$@"
