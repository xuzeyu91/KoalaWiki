import { Button, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import { RepositoryFormValues } from '../types';

interface RepositoryFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: RepositoryFormValues) => void;
}

const RepositoryForm: React.FC<RepositoryFormProps> = ({
  open,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="添加仓库"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          提交
        </Button>,
      ]}
      maskClosable={false}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: 'git',
        }}
      >
        <Form.Item
          name="address"
          label="仓库地址"
          rules={[{ required: true, message: '请输入仓库地址' }]}
        >
          <Input placeholder="请输入仓库地址" />
        </Form.Item>

        <Form.Item
          name="type"
          label="仓库类型"
          rules={[{ required: true, message: '请选择仓库类型' }]}
        >
          <Select>
            <Select.Option value="git">Git</Select.Option>
            <Select.Option value="svn">SVN</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="prompt"
          label="构建提示词"
          rules={[{ required: true, message: '请输入构建提示词' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入构建提示词" />
        </Form.Item>

        <Form.Item
          name="model"
          label="使用模型"
        >
          <Input placeholder="请输入使用的模型" />
        </Form.Item>

        <Form.Item
          name="openAIKey"
          label="OpenAI 密钥"
        >
          <Input.Password placeholder="请输入 OpenAI 密钥" />
        </Form.Item>

        <Form.Item
          name="openAIEndpoint"
          label="OpenAI 端点"
        >
          <Input placeholder="请输入 OpenAI 端点" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RepositoryForm; 