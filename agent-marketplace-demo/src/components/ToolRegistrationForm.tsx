import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

interface ToolRegistrationFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (tool: any) => void;
}

const ToolRegistrationForm: React.FC<ToolRegistrationFormProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(values);
      message.success('工具注册成功！');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="注册 MCP 工具"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="工具名称"
          rules={[{ required: true, message: '请输入工具名称' }]}
        >
          <Input placeholder="例如：Google Map MCP" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="工具描述"
          rules={[{ required: true, message: '请输入工具描述' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="详细描述工具的功能和用途"
          />
        </Form.Item>
        
        <Form.Item
          name="category"
          label="工具分类"
          rules={[{ required: true, message: '请选择工具分类' }]}
        >
          <Select placeholder="选择工具分类">
            <Select.Option value="location">位置服务</Select.Option>
            <Select.Option value="information">信息检索</Select.Option>
            <Select.Option value="classification">分类识别</Select.Option>
            <Select.Option value="calculation">计算处理</Select.Option>
            <Select.Option value="communication">通信服务</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="endpoint"
          label="MCP 端点"
          rules={[{ required: true, message: '请输入MCP端点' }]}
        >
          <Input placeholder="例如：https://api.example.com/mcp" />
        </Form.Item>
        
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={onClose}>
              取消
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<ToolOutlined />}
            >
              注册工具
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ToolRegistrationForm;
