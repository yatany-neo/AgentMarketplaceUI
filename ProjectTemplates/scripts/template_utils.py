#!/usr/bin/env python3
"""
工具函数模板
提供常用的工具函数和辅助功能

作者: [Your Name]
创建时间: [Date]
版本: 1.0.0
"""

import os
import sys
import json
import logging
import hashlib
import shutil
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from datetime import datetime
import yaml


def setup_logger(name: str = __name__,
                level: str = "INFO",
                log_file: Optional[str] = None,
                format_string: Optional[str] = None) -> logging.Logger:
    """
    设置日志记录器
    
    Args:
        name: 日志记录器名称
        level: 日志级别
        log_file: 日志文件路径
        format_string: 日志格式字符串
        
    Returns:
        配置好的日志记录器
    """
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper()))
    
    # 避免重复添加处理器
    if logger.handlers:
        return logger
    
    # 设置格式
    if format_string is None:
        format_string = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    formatter = logging.Formatter(format_string)
    
    # 控制台处理器
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # 文件处理器
    if log_file:
        # 确保日志目录存在
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger


def load_config(config_path: Union[str, Path],
               config_type: str = 'auto') -> Dict[str, Any]:
    """
    加载配置文件
    
    Args:
        config_path: 配置文件路径
        config_type: 配置文件类型 ('json', 'yaml', 'auto')
        
    Returns:
        配置字典
        
    Raises:
        FileNotFoundError: 配置文件不存在
        ValueError: 不支持的文件类型或格式错误
    """
    config_path = Path(config_path)
    
    if not config_path.exists():
        raise FileNotFoundError(f"配置文件不存在: {config_path}")
    
    # 自动检测文件类型
    if config_type == 'auto':
        suffix = config_path.suffix.lower()
        if suffix == '.json':
            config_type = 'json'
        elif suffix in ['.yaml', '.yml']:
            config_type = 'yaml'
        else:
            raise ValueError(f"不支持的文件类型: {suffix}")
    
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            if config_type == 'json':
                config = json.load(f)
            elif config_type == 'yaml':
                config = yaml.safe_load(f)
            else:
                raise ValueError(f"不支持的文件类型: {config_type}")
        
        return config
        
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON 格式错误: {e}")
    except yaml.YAMLError as e:
        raise ValueError(f"YAML 格式错误: {e}")


def save_config(config: Dict[str, Any],
               config_path: Union[str, Path],
               config_type: str = 'auto') -> None:
    """
    保存配置文件
    
    Args:
        config: 配置字典
        config_path: 配置文件路径
        config_type: 配置文件类型 ('json', 'yaml', 'auto')
    """
    config_path = Path(config_path)
    config_path.parent.mkdir(parents=True, exist_ok=True)
    
    # 自动检测文件类型
    if config_type == 'auto':
        suffix = config_path.suffix.lower()
        if suffix == '.json':
            config_type = 'json'
        elif suffix in ['.yaml', '.yml']:
            config_type = 'yaml'
        else:
            raise ValueError(f"不支持的文件类型: {suffix}")
    
    try:
        with open(config_path, 'w', encoding='utf-8') as f:
            if config_type == 'json':
                json.dump(config, f, indent=2, ensure_ascii=False, default=str)
            elif config_type == 'yaml':
                yaml.dump(config, f, default_flow_style=False, allow_unicode=True)
            else:
                raise ValueError(f"不支持的文件类型: {config_type}")
                
    except Exception as e:
        raise ValueError(f"保存配置文件失败: {e}")


def ensure_directory(directory_path: Union[str, Path]) -> Path:
    """
    确保目录存在，如果不存在则创建
    
    Args:
        directory_path: 目录路径
        
    Returns:
        目录路径对象
    """
    directory_path = Path(directory_path)
    directory_path.mkdir(parents=True, exist_ok=True)
    return directory_path


def get_file_hash(file_path: Union[str, Path],
                 algorithm: str = 'md5') -> str:
    """
    计算文件哈希值
    
    Args:
        file_path: 文件路径
        algorithm: 哈希算法 ('md5', 'sha1', 'sha256')
        
    Returns:
        文件哈希值
    """
    file_path = Path(file_path)
    
    if not file_path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")
    
    hash_obj = hashlib.new(algorithm)
    
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_obj.update(chunk)
    
    return hash_obj.hexdigest()


def copy_file_with_backup(source: Union[str, Path],
                         destination: Union[str, Path],
                         create_backup: bool = True) -> None:
    """
    复制文件，可选择创建备份
    
    Args:
        source: 源文件路径
        destination: 目标文件路径
        create_backup: 是否创建备份
    """
    source = Path(source)
    destination = Path(destination)
    
    if not source.exists():
        raise FileNotFoundError(f"源文件不存在: {source}")
    
    # 确保目标目录存在
    destination.parent.mkdir(parents=True, exist_ok=True)
    
    # 如果目标文件存在且需要备份
    if destination.exists() and create_backup:
        backup_path = destination.with_suffix(f"{destination.suffix}.backup")
        shutil.copy2(destination, backup_path)
    
    # 复制文件
    shutil.copy2(source, destination)


def format_file_size(size_bytes: int) -> str:
    """
    格式化文件大小
    
    Args:
        size_bytes: 文件大小（字节）
        
    Returns:
        格式化后的文件大小字符串
    """
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.2f} {size_names[i]}"


def get_directory_size(directory_path: Union[str, Path]) -> int:
    """
    计算目录大小
    
    Args:
        directory_path: 目录路径
        
    Returns:
        目录大小（字节）
    """
    directory_path = Path(directory_path)
    
    if not directory_path.exists():
        raise FileNotFoundError(f"目录不存在: {directory_path}")
    
    total_size = 0
    for file_path in directory_path.rglob('*'):
        if file_path.is_file():
            total_size += file_path.stat().st_size
    
    return total_size


def clean_old_files(directory_path: Union[str, Path],
                   pattern: str = "*",
                   days_old: int = 30,
                   dry_run: bool = True) -> List[Path]:
    """
    清理旧文件
    
    Args:
        directory_path: 目录路径
        pattern: 文件匹配模式
        days_old: 文件天数阈值
        dry_run: 是否为试运行（不实际删除）
        
    Returns:
        被删除（或将被删除）的文件列表
    """
    directory_path = Path(directory_path)
    
    if not directory_path.exists():
        raise FileNotFoundError(f"目录不存在: {directory_path}")
    
    cutoff_time = datetime.now().timestamp() - (days_old * 24 * 60 * 60)
    old_files = []
    
    for file_path in directory_path.glob(pattern):
        if file_path.is_file() and file_path.stat().st_mtime < cutoff_time:
            old_files.append(file_path)
            
            if not dry_run:
                file_path.unlink()
    
    return old_files


def validate_file_path(file_path: Union[str, Path],
                      must_exist: bool = True,
                      must_be_file: bool = True,
                      must_be_readable: bool = True) -> Path:
    """
    验证文件路径
    
    Args:
        file_path: 文件路径
        must_exist: 文件必须存在
        must_be_file: 必须是文件（不是目录）
        must_be_readable: 必须可读
        
    Returns:
        验证后的路径对象
        
    Raises:
        FileNotFoundError: 文件不存在
        ValueError: 路径验证失败
    """
    file_path = Path(file_path)
    
    if must_exist and not file_path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")
    
    if must_be_file and file_path.exists() and not file_path.is_file():
        raise ValueError(f"路径不是文件: {file_path}")
    
    if must_be_readable and file_path.exists() and not os.access(file_path, os.R_OK):
        raise ValueError(f"文件不可读: {file_path}")
    
    return file_path


def create_timestamped_filename(base_name: str,
                              extension: str = "",
                              include_time: bool = True) -> str:
    """
    创建带时间戳的文件名
    
    Args:
        base_name: 基础文件名
        extension: 文件扩展名
        include_time: 是否包含时间
        
    Returns:
        带时间戳的文件名
    """
    timestamp = datetime.now().strftime("%Y%m%d")
    
    if include_time:
        time_str = datetime.now().strftime("%H%M%S")
        timestamp = f"{timestamp}_{time_str}"
    
    if extension and not extension.startswith('.'):
        extension = f".{extension}"
    
    return f"{base_name}_{timestamp}{extension}"


def main():
    """示例用法"""
    # 设置日志
    logger = setup_logger("utils_test", log_file="logs/utils_test.log")
    
    try:
        # 创建目录
        test_dir = ensure_directory("temp/test_directory")
        logger.info(f"创建目录: {test_dir}")
        
        # 创建配置文件
        config = {
            "database": {
                "host": "localhost",
                "port": 5432,
                "name": "test_db"
            },
            "api": {
                "base_url": "https://api.example.com",
                "timeout": 30
            }
        }
        
        config_path = test_dir / "config.json"
        save_config(config, config_path)
        logger.info(f"保存配置文件: {config_path}")
        
        # 加载配置文件
        loaded_config = load_config(config_path)
        logger.info(f"加载配置文件: {loaded_config}")
        
        # 创建测试文件
        test_file = test_dir / "test.txt"
        test_file.write_text("Hello, World!")
        
        # 计算文件哈希
        file_hash = get_file_hash(test_file)
        logger.info(f"文件哈希: {file_hash}")
        
        # 格式化文件大小
        file_size = format_file_size(test_file.stat().st_size)
        logger.info(f"文件大小: {file_size}")
        
        # 创建带时间戳的文件名
        timestamped_name = create_timestamped_filename("test", "txt")
        logger.info(f"带时间戳的文件名: {timestamped_name}")
        
        logger.info("工具函数测试完成")
        
    except Exception as e:
        logger.error(f"测试失败: {e}")
        raise


if __name__ == "__main__":
    main()
