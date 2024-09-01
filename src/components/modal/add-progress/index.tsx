import { Modal, Form, Input } from "antd";
import type { FormProps } from 'antd';

/**
 * form field type
 */
export type FieldType = {
  title: string;
  subTitle?: string;
  description?: string;
};

/**
 * modal props
 */
interface AddProgressModalProps {
  open: boolean;
  onOk?: (form: FieldType) => void;
  onCancel?: () => void;
}

const AddProgressModal = ({
  open,
  onOk,
  onCancel,
}: AddProgressModalProps) => {

  /**
   * submit form data
   */
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    onOk?.(values);
  }

  /**
   * the submit button is in the ModalComponent,  
   * so we need to submit the form manually,  
   * trigger the submit event and call `onFinish` above,  
   * finally use `onOk` in props to emit data to the parent component. 
   */
  const [form] = Form.useForm<FieldType>();
  const handleSubmit = () => {
    form.submit();
  }

  return !open ? null : (
    <Modal 
      title="新增流程"
      open={open}
      onOk={()=>handleSubmit()}
      onCancel={()=>onCancel?.()}
      okText="添加"
      cancelText="取消"
    >
      <Form
        name="addProgressForm"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        autoComplete="off"
        className="mt-8 mb-4"
      >
        <Form.Item<FieldType>
          label="主标题"
          name="title"
          rules={[{ required: true, message: '请输入主标题' }]}
        >  
          <Input/>
        </Form.Item>
        <Form.Item<FieldType>
          label="副标题"
          name="subTitle"
        >  
          <Input/>
        </Form.Item>
        <Form.Item<FieldType>
          label="描述"
          name="description"
        >  
          <Input.TextArea/>
        </Form.Item>
      </Form>
    </Modal>
  );
}
 
export default AddProgressModal;