import { 
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  Skeleton,
} from "antd";
import { Progress } from "../../../stores";
import { Suspense, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { cn } from "../../../utils/cn";
import { AiOutlineClose } from "react-icons/ai";
import { nanoid } from "nanoid";

interface EditProgressModalProps {
  open: boolean;
  progress: Progress;
  onOk?: (res: EditProgressModalResponse) => void;
  onCancel?: () => void;
}

export interface EditProgressModalResponse {
  progress: Progress;
}

type ProgressFieldType = {
  title: string;
  subTitle?: string;
  description?: string;
};

type ProgressNodeFieldType = {
  label: string;
  active: boolean;
  description?: string;
  timeStamp: number | Dayjs;
}

const EditProgressModal = ({
  open,
  progress,
  onOk,
  onCancel,
}: EditProgressModalProps) => {

  // Form logic
  const [mainForm] = Form.useForm<ProgressFieldType>();
  const [nodeForm] = Form.useForm<{
    nodes: ProgressNodeFieldType[]
  }>();

  // node form config
  const nodeFormConfig = [
    {
      label: '节点名称',
      name: 'label',
      rules: [{ required: true, message: '请输入节点名称' }],
      Component: <Input placeholder="请输入节点名称"/>,
    },
    {
      label: '节点时间',
      name: 'timeStamp',
      Component: <DatePicker placeholder="请选择时间"/>,
    },
    {
      label: '是否已完成',
      name: 'active',
      Component: (
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      ),
    },
    {
      label: '节点描述',
      name: 'description',
      Component: <Input.TextArea placeholder="请输入节点描述"/>,
    },
  ]

  // init node form
  useEffect(() => {
    nodeForm.setFieldsValue({
      nodes: progress.nodes.map(node => ({
        label: node.label,
        active: node.active,
        description: node.description,
        timeStamp: dayjs(node.timeStamp),
      }))
    });
  }, [open, progress.nodes]);

  // handle delete node
  // const handleDeleteNode = (nodeId: string) => {
  //   setNodeList(prev => prev.filter(node => node.id !== nodeId));
  // };

  // Modal logic
  const handleSubmit = () => {
    const mainFormVal = mainForm.getFieldsValue();

    const nodeFormVals = nodeForm.getFieldsValue().nodes;

    const currNodes = nodeFormVals.map(nodeFormVal => ({
      id: nanoid(),
      ...nodeFormVal,
      timeStamp: dayjs(nodeFormVal.timeStamp).valueOf()
    }))

    const res: EditProgressModalResponse = {
      progress: {
        id: progress.id,
        title: mainFormVal.title,
        subTitle: mainFormVal.subTitle,
        description: mainFormVal.description,
        nodes: currNodes,
      }
    }

    onOk?.(res);
  };

  const handleCancel = () => {
    mainForm.resetFields();
    // nodeFormsRef.current.forEach(form => form.resetFields());
    onCancel?.();
  }


  return open ? (
    <Modal
      title="编辑流程信息"
      open={open}
      onOk={() => handleSubmit()}
      onCancel={() => handleCancel()}
      okText="保存"
      cancelText="取消"
      width={1000}
    >
      <div className={cn(
        "flex items-center gap-4",
        "flex-col sm:flex-row"
      )}>
        <div className="flex-grow-4 flex-shrink-4 w-full">
          <Form
            name={`editProgressForm-${progress.id}`}
            form={mainForm}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            autoComplete="off"
            className="mt-8 mb-4"
          >
            <Form.Item<ProgressFieldType>
              label="主标题"
              name="title"
              rules={[{ required: true, message: '请输入主标题' }]}
              initialValue={progress.title}
            >  
              <Input/>
            </Form.Item>
            <Form.Item<ProgressFieldType>
              label="副标题"
              name="subTitle"
              initialValue={progress.subTitle}
            >  
              <Input/>
            </Form.Item>
            <Form.Item<ProgressFieldType>
              label="描述"
              name="description"
              initialValue={progress.description}
            >  
              <Input.TextArea/>
            </Form.Item>
          </Form>
        </div>
        {/* <Divider type="vertical" className="h-full"/> */}
        <Suspense fallback={<Skeleton/>}>
          <div className={cn(
            "flex-grow-6 flex-shrink-6 w-full max-h-[540px] border-l overflow-y-scroll overflow-x-visible",
          )}>
            <Form
              name={`editProgressNodeForm-${progress.id}`}
              form={nodeForm}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 16 }}
              autoComplete="off"
              className="mb-4"
            >
              <Form.List name="nodes">
                {
                  (fields, {remove}) => (
                    fields.map((field, index) => (
                      <div key={field.key}
                        className={cn(
                          "relative p-6 pb-2 border-t border-slate-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-0 left-0 bg-blue-500 text-white rounded-br-md w-6 h-6",
                          "flex items-center justify-center"
                        )}>
                          {index+1}
                        </div>
                        <div className={cn(
                          "w-6 h-6 flex items-center justify-center",
                          "font-bold text-gray-500 bg-slate-100 cursor-pointer",
                          "absolute top-0 right-2 hover:bg-red-500 hover:text-white transition-colors"
                        )}
                          onClick={() => remove(index)}
                        >
                          <AiOutlineClose />
                        </div>
                        {
                          nodeFormConfig.map(item => (
                            <Form.Item
                              name={[field.name, item.name]}
                              key={field.key + item.name}
                              label={item.label}
                              rules={item.rules}
                              className="mb-4"
                            >
                              {item.Component}
                            </Form.Item>
                          ))
                        }
                      </div>
                    ))
                  )
                }
              </Form.List>
            </Form>
          </div>
        </Suspense>
      </div>
    </Modal>
  ) : null;
}
 
export default EditProgressModal;