import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Select } from 'antd';
import { SendOutlined } from '@ant-design/icons';

interface RequestFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (request: string, agentId: string) => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { request: string; agentId: string }) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(values.request, values.agentId);
      message.success('需求提交成功！');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="模拟 AI Agent 提交新需求"
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
          name="agentId"
          label="选择 AI Agent"
          rules={[{ required: true, message: '请选择提交此需求的 AI Agent' }]}
        >
          <Select placeholder="选择哪个 AI Agent 向 Marketplace 提交此需求">
            <Select.Option value="1">Customer Service Agent - 处理客户服务相关查询</Select.Option>
            <Select.Option value="2">Research Assistant Agent - 协助信息检索和数据分析</Select.Option>
            <Select.Option value="3">Content Processing Agent - 处理 YouTube 内容和多媒体分析</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="request"
          label="AI Agent 的需求描述"
          rules={[{ required: true, message: '请输入 AI Agent 的需求描述' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="模拟 AI Agent 向 Marketplace 提交的需求，例如：从微软雷德蒙德园区到最近沃尔玛的骑行时间和路线"
          />
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
              icon={<SendOutlined />}
            >
              提交需求
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestForm;
