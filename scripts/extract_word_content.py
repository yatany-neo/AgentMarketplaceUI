#!/usr/bin/env python3
"""
Word 文档内容提取脚本
用于从 .docx 文件中提取纯文本内容
"""

import zipfile
import xml.etree.ElementTree as ET
import re
import sys
import os
from pathlib import Path

def extract_text_from_docx(docx_path):
    """
    从 .docx 文件中提取文本内容
    
    Args:
        docx_path (str): Word 文档路径
        
    Returns:
        dict: 包含提取文本的字典
    """
    try:
        # 打开 .docx 文件（实际上是 ZIP 文件）
        with zipfile.ZipFile(docx_path, 'r') as docx:
            # 读取 document.xml 文件
            document_xml = docx.read('word/document.xml')
            
            # 解析 XML
            root = ET.fromstring(document_xml)
            
            # 定义命名空间
            namespaces = {
                'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
            }
            
            # 提取所有段落
            paragraphs = []
            for para in root.findall('.//w:p', namespaces):
                # 提取段落中的所有文本
                text_runs = []
                for text_elem in para.findall('.//w:t', namespaces):
                    if text_elem.text:
                        text_runs.append(text_elem.text)
                
                # 合并文本运行
                paragraph_text = ''.join(text_runs).strip()
                if paragraph_text:
                    paragraphs.append(paragraph_text)
            
            # 合并所有段落
            full_text = '\n\n'.join(paragraphs)
            
            return {
                'paragraphs': paragraphs,
                'text': full_text,
                'word_count': len(full_text.split()),
                'paragraph_count': len(paragraphs),
                'file_path': docx_path
            }
            
    except Exception as e:
        return {
            'error': str(e),
            'file_path': docx_path
        }

def main():
    """主函数"""
    # 默认文档路径
    default_docx_path = "/Users/alice_eric/Documents/AgentMarketplaceUI/ProjectTemplates/docs/Agent marketplace engineering weekly update.docx"
    
    # 检查命令行参数
    if len(sys.argv) > 1:
        docx_path = sys.argv[1]
    else:
        docx_path = default_docx_path
    
    # 检查文件是否存在
    if not os.path.exists(docx_path):
        print(f"错误: 文件不存在 - {docx_path}")
        sys.exit(1)
    
    print(f"正在提取文档内容: {docx_path}")
    print("-" * 50)
    
    # 提取文本
    result = extract_text_from_docx(docx_path)
    
    if 'error' in result:
        print(f"提取失败: {result['error']}")
        sys.exit(1)
    
    # 显示结果
    print(f"文档路径: {result['file_path']}")
    print(f"段落数量: {result['paragraph_count']}")
    print(f"单词数量: {result['word_count']}")
    print("-" * 50)
    print("提取的文本内容:")
    print("-" * 50)
    print(result['text'])
    
    # 保存到文件
    output_file = "extracted_word_content.txt"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(result['text'])
    
    print(f"\n内容已保存到: {output_file}")

if __name__ == "__main__":
    main()
