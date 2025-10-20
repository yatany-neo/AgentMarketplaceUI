#!/usr/bin/env python3
"""
数据处理模板
用于创建数据处理相关的脚本

作者: [Your Name]
创建时间: [Date]
版本: 1.0.0
"""

import os
import logging
import pandas as pd
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Optional, Union
import json
from datetime import datetime


class DataProcessor:
    """
    数据处理类
    提供数据读取、清洗、转换和分析功能
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初始化数据处理器
        
        Args:
            config: 配置字典
        """
        self.config = config or {}
        self.logger = logging.getLogger(__name__)
        self.data = None
        self.processed_data = None
        
    def load_data(self, file_path: Union[str, Path], 
                  file_type: str = 'auto') -> pd.DataFrame:
        """
        加载数据文件
        
        Args:
            file_path: 文件路径
            file_type: 文件类型 ('csv', 'excel', 'json', 'auto')
            
        Returns:
            加载的数据框
            
        Raises:
            FileNotFoundError: 文件不存在
            ValueError: 不支持的文件类型
        """
        file_path = Path(file_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"文件不存在: {file_path}")
        
        # 自动检测文件类型
        if file_type == 'auto':
            suffix = file_path.suffix.lower()
            if suffix == '.csv':
                file_type = 'csv'
            elif suffix in ['.xlsx', '.xls']:
                file_type = 'excel'
            elif suffix == '.json':
                file_type = 'json'
            else:
                raise ValueError(f"不支持的文件类型: {suffix}")
        
        try:
            if file_type == 'csv':
                self.data = pd.read_csv(file_path)
            elif file_type == 'excel':
                self.data = pd.read_excel(file_path)
            elif file_type == 'json':
                with open(file_path, 'r', encoding='utf-8') as f:
                    json_data = json.load(f)
                self.data = pd.DataFrame(json_data)
            else:
                raise ValueError(f"不支持的文件类型: {file_type}")
            
            self.logger.info(f"成功加载数据: {file_path}, 形状: {self.data.shape}")
            return self.data
            
        except Exception as e:
            self.logger.error(f"加载数据失败: {e}")
            raise
    
    def clean_data(self, 
                   remove_duplicates: bool = True,
                   handle_missing: str = 'drop',  # 'drop', 'fill', 'interpolate'
                   fill_value: Any = None) -> pd.DataFrame:
        """
        清洗数据
        
        Args:
            remove_duplicates: 是否移除重复行
            handle_missing: 处理缺失值的方法
            fill_value: 填充值（当 handle_missing='fill' 时使用）
            
        Returns:
            清洗后的数据框
        """
        if self.data is None:
            raise ValueError("请先加载数据")
        
        cleaned_data = self.data.copy()
        
        # 移除重复行
        if remove_duplicates:
            before_count = len(cleaned_data)
            cleaned_data = cleaned_data.drop_duplicates()
            after_count = len(cleaned_data)
            self.logger.info(f"移除重复行: {before_count - after_count} 行")
        
        # 处理缺失值
        missing_count = cleaned_data.isnull().sum().sum()
        if missing_count > 0:
            self.logger.info(f"发现缺失值: {missing_count} 个")
            
            if handle_missing == 'drop':
                cleaned_data = cleaned_data.dropna()
                self.logger.info("已删除包含缺失值的行")
            elif handle_missing == 'fill':
                if fill_value is not None:
                    cleaned_data = cleaned_data.fillna(fill_value)
                else:
                    # 数值列用均值填充，文本列用众数填充
                    for col in cleaned_data.columns:
                        if cleaned_data[col].dtype in ['int64', 'float64']:
                            cleaned_data[col].fillna(cleaned_data[col].mean(), inplace=True)
                        else:
                            cleaned_data[col].fillna(cleaned_data[col].mode()[0], inplace=True)
                self.logger.info("已填充缺失值")
            elif handle_missing == 'interpolate':
                cleaned_data = cleaned_data.interpolate()
                self.logger.info("已插值填充缺失值")
        
        self.processed_data = cleaned_data
        self.logger.info(f"数据清洗完成，最终形状: {cleaned_data.shape}")
        return cleaned_data
    
    def transform_data(self, 
                      transformations: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        转换数据
        
        Args:
            transformations: 转换操作列表
                每个操作包含: {'type': 'operation_type', 'params': {...}}
                
        Returns:
            转换后的数据框
        """
        if self.processed_data is None:
            raise ValueError("请先清洗数据")
        
        transformed_data = self.processed_data.copy()
        
        for transform in transformations:
            transform_type = transform.get('type')
            params = transform.get('params', {})
            
            if transform_type == 'normalize':
                # 标准化
                column = params.get('column')
                method = params.get('method', 'z-score')  # 'z-score', 'min-max'
                
                if method == 'z-score':
                    transformed_data[column] = (transformed_data[column] - 
                                              transformed_data[column].mean()) / transformed_data[column].std()
                elif method == 'min-max':
                    transformed_data[column] = (transformed_data[column] - transformed_data[column].min()) / (transformed_data[column].max() - transformed_data[column].min())
                
                self.logger.info(f"已标准化列: {column}")
                
            elif transform_type == 'encode':
                # 编码分类变量
                column = params.get('column')
                method = params.get('method', 'one-hot')  # 'one-hot', 'label'
                
                if method == 'one-hot':
                    dummies = pd.get_dummies(transformed_data[column], prefix=column)
                    transformed_data = pd.concat([transformed_data, dummies], axis=1)
                    transformed_data.drop(column, axis=1, inplace=True)
                elif method == 'label':
                    from sklearn.preprocessing import LabelEncoder
                    le = LabelEncoder()
                    transformed_data[column] = le.fit_transform(transformed_data[column])
                
                self.logger.info(f"已编码列: {column}")
                
            elif transform_type == 'filter':
                # 过滤数据
                condition = params.get('condition')
                if condition:
                    before_count = len(transformed_data)
                    transformed_data = transformed_data.query(condition)
                    after_count = len(transformed_data)
                    self.logger.info(f"过滤数据: {before_count - after_count} 行被移除")
        
        self.processed_data = transformed_data
        self.logger.info(f"数据转换完成，最终形状: {transformed_data.shape}")
        return transformed_data
    
    def analyze_data(self) -> Dict[str, Any]:
        """
        分析数据
        
        Returns:
            分析结果字典
        """
        if self.processed_data is None:
            raise ValueError("请先处理数据")
        
        analysis = {
            'basic_info': {
                'shape': self.processed_data.shape,
                'columns': list(self.processed_data.columns),
                'dtypes': self.processed_data.dtypes.to_dict()
            },
            'statistics': self.processed_data.describe().to_dict(),
            'missing_values': self.processed_data.isnull().sum().to_dict(),
            'duplicates': self.processed_data.duplicated().sum()
        }
        
        # 数值列的相关性分析
        numeric_columns = self.processed_data.select_dtypes(include=[np.number]).columns
        if len(numeric_columns) > 1:
            analysis['correlation'] = self.processed_data[numeric_columns].corr().to_dict()
        
        self.logger.info("数据分析完成")
        return analysis
    
    def save_data(self, 
                  output_path: Union[str, Path],
                  file_type: str = 'csv',
                  include_index: bool = False) -> None:
        """
        保存处理后的数据
        
        Args:
            output_path: 输出文件路径
            file_type: 文件类型 ('csv', 'excel', 'json')
            include_index: 是否包含索引
        """
        if self.processed_data is None:
            raise ValueError("没有可保存的数据")
        
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        try:
            if file_type == 'csv':
                self.processed_data.to_csv(output_path, index=include_index)
            elif file_type == 'excel':
                self.processed_data.to_excel(output_path, index=include_index)
            elif file_type == 'json':
                self.processed_data.to_json(output_path, orient='records', 
                                          indent=2, force_ascii=False)
            else:
                raise ValueError(f"不支持的文件类型: {file_type}")
            
            self.logger.info(f"数据已保存到: {output_path}")
            
        except Exception as e:
            self.logger.error(f"保存数据失败: {e}")
            raise
    
    def save_analysis_report(self, 
                           analysis: Dict[str, Any],
                           output_path: Union[str, Path]) -> None:
        """
        保存分析报告
        
        Args:
            analysis: 分析结果
            output_path: 输出文件路径
        """
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # 添加时间戳
        analysis['report_info'] = {
            'generated_at': datetime.now().isoformat(),
            'data_shape': analysis['basic_info']['shape']
        }
        
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(analysis, f, indent=2, ensure_ascii=False, default=str)
            
            self.logger.info(f"分析报告已保存到: {output_path}")
            
        except Exception as e:
            self.logger.error(f"保存分析报告失败: {e}")
            raise


def main():
    """示例用法"""
    # 设置日志
    logging.basicConfig(level=logging.INFO)
    
    # 创建数据处理器
    processor = DataProcessor()
    
    try:
        # 加载数据
        # data = processor.load_data('data/input/sample_data.csv')
        
        # 清洗数据
        # cleaned_data = processor.clean_data()
        
        # 转换数据
        # transformations = [
        #     {'type': 'normalize', 'params': {'column': 'numeric_column', 'method': 'z-score'}},
        #     {'type': 'encode', 'params': {'column': 'categorical_column', 'method': 'one-hot'}}
        # ]
        # transformed_data = processor.transform_data(transformations)
        
        # 分析数据
        # analysis = processor.analyze_data()
        
        # 保存结果
        # processor.save_data('data/output/processed_data.csv')
        # processor.save_analysis_report(analysis, 'data/output/analysis_report.json')
        
        print("数据处理完成")
        
    except Exception as e:
        logging.error(f"数据处理失败: {e}")
        raise


if __name__ == "__main__":
    main()
