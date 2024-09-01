import { 
  Modal, 
  Form, 
  Input, 
  FormProps,
  DatePicker,
  Radio,
} from "antd";
import { Progress } from "../../../stores";

/**
 * modal props
 */
interface AddProgressNodeModalProps {
  open: boolean;
  progress: Progress;
  onOK: (form: FieldType) => void;
  onCancel: () => void;
}

/**
 * form field type
 */
export type FieldType = {
  label: string;
  description?: string;
  timeStamp: number;
  active: boolean;
}

const AddProgressNodeModal = ({
  open,
  progress,
  onOK,
  onCancel,
}: AddProgressNodeModalProps) => {

  const [form] = Form.useForm<FieldType>();
  const handleSubmit = () => {
    form.submit();
  }
  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  }

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    // transfer day.js object type to timestamp type(number)
    values.timeStamp = values.timeStamp?.valueOf() ?? undefined;
    onOK?.(values);
    form.resetFields();
  }

  return !open ? null : (
    <Modal
      title="新增流程节点"
      open={open}
      onOk={() => handleSubmit()}
      onCancel={() => handleCancel()}
      okText="添加"
      cancelText="取消"
    >
      <p className="text-sm text-gray-400 flex gap-2">
        <span>{progress.title}</span>
        <span> - </span>
        <span>{progress.subTitle}</span>
      </p>
      <Form
        name={`addProgressNodeForm-${progress.id}}`}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        autoComplete="off"
        className="mt-8 mb-4"
      >
        <Form.Item<FieldType>
          label="节点名称"
          name="label"
          rules={[{ required: true, message: '请输入节点名称' }]}  
        >
          <Input placeholder="节点名称" />
        </Form.Item>
        <Form.Item<FieldType>
          label="时间"
          name="timeStamp"
        >
          <DatePicker placeholder="选择时间"/>
        </Form.Item>
        <Form.Item<FieldType>
          label="是否已完成"
          name="active"
          initialValue={false}
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
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
 
export default AddProgressNodeModal;