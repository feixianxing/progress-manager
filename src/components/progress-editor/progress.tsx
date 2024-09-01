import { type Progress } from "../../stores";
import { Steps, Button, Tooltip } from "antd";
import { AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
import { useState, useCallback, useMemo } from "react";
import AddProgressNodeModal, { FieldType } from "../modal/add-progress-node";
import EditProgressModal, { type EditProgressModalResponse } from "../modal/edit-progress";

import { useProgressStore, ActionType } from "../../stores";
import dayjs, { Dayjs } from "dayjs";

interface ProgressProps {
  progress: Progress
}

const Progress = ({
  progress
}: ProgressProps) => {
  // Global Store
  const { dispatch } = useProgressStore();

  // Add Node Logic
  const [openAddNodeModal, setOpenAddNodeModal] = useState(false);

  const handleAddNode = useCallback(() => {
    setOpenAddNodeModal(true);
  }, [setOpenAddNodeModal]);

  const addNodeModalHandler = {
    onOk(values: FieldType){
      dispatch({
        type: ActionType.ADD_NODE,
        payload: {
          progressId: progress.id,
          node: {
            label: values.label,
            description: values.description,
            timeStamp: values.timeStamp,
            active: true
          }
        }
      });
      setOpenAddNodeModal(false);
    },
    onCancel(){
      setOpenAddNodeModal(false);
    }
  }

  // Edit progress/node logic
  const [openEditProgressModal, setOpenEditProgressModal] = useState(false);
  
  const handleEditProgress = useCallback(() => {
    setOpenEditProgressModal(true);
  }, [setOpenEditProgressModal]);

  const editProgressModalHandler = {
    onOk(res: EditProgressModalResponse){
      // update progress
      dispatch({
        type: ActionType.UPDATE_PROGRESS,
        payload: {
          id: progress.id,
          title: res.progress.title,
          subTitle: res.progress.subTitle,
          description: res.progress.description
        }
      });
      // update nodes
      dispatch({
        type: ActionType.UPDATE_NODE_LIST,
        payload: {
          progressId: progress.id,
          nodeList: res.progress.nodes
        }
      })
      setOpenEditProgressModal(false);
    },
    onCancel(){
      setOpenEditProgressModal(false);
    }
  }

  // Steps Logic
  const handleStepsChange = useCallback((current: number) => {
    for(let i=0; i<progress.nodes.length; i++){
      const nodeId = progress.nodes[i].id;
      dispatch({
        type: ActionType.UPDATE_NODE,
        payload: {
          progressId: progress.id,
          nodeId,
          nodeData: {
            active: i<=current
          }
        }
      });
    }
  }, [progress])

  const currentStep = useMemo(() => {
    let idx = 0;
    while(progress.nodes[idx]?.active){
      idx++;
    }
    return idx-1;
  }, [progress.nodes]);

  const timeStampToStr = (timeStamp: number | Dayjs | undefined) => {
    if(timeStamp === undefined)return '';
    return dayjs(timeStamp).format('YYYY-MM-DD');
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-slate-200 shadow-md relative">
      <div className="flex items-center">
        <p className="text-lg font-semibold">
          {progress.title}
          <span className="mx-1 text-base font-thin"> —— </span>
          {progress.subTitle && <span className="text-sm font-thin">{progress.subTitle}</span>}  
        </p>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip title="添加节点" placement="bottom">
            <Button
              type="primary"
              icon={<AiOutlinePlus/>}
              onClick={handleAddNode}
            ></Button>
          </Tooltip>
          <Tooltip title="编辑" placement="bottom">
            <Button
              icon={<AiOutlineEdit />}
              onClick={handleEditProgress}
            ></Button>
          </Tooltip>
        </div>
      </div>
      {progress.description && <p className="text-sm text-gray-400 mt-2">{progress.description}</p>}
      <div className="mt-4 p-4">
        <Steps 
          onChange={handleStepsChange}
          current={currentStep}
          items={progress.nodes.map(node => ({
            title: node.label,
            description: node.description,
            subTitle: timeStampToStr(node.timeStamp)
          }))}
          direction={progress.nodes.length > 4 ? 'vertical' : 'horizontal'}
        />
      </div>
      
      
      {
        openAddNodeModal && (
          <AddProgressNodeModal
            open={openAddNodeModal}
            progress={progress}
            onOK={addNodeModalHandler.onOk}
            onCancel={addNodeModalHandler.onCancel}
          />
        )
      }
      {
        openEditProgressModal && (
          <EditProgressModal
            progress={progress}
            open={openEditProgressModal}
            onOk={editProgressModalHandler.onOk}
            onCancel={editProgressModalHandler.onCancel}
          />
        )
      }
    </div>
  );
}
 
export default Progress;