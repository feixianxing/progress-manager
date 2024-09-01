import { AiOutlinePlus as PlusIcon } from "react-icons/ai";
import { BiArrowToBottom } from "react-icons/bi";
import { BiArrowFromBottom } from "react-icons/bi";
import { AiOutlineClear } from "react-icons/ai";
import React, { useState } from "react";
import type { IconType } from "react-icons";
import { cn } from "../../utils/cn";
import { Modal, message } from 'antd';
import AddProgressModal, { type FieldType as AddProgressForm } from "../modal/add-progress";
import { useProgressStore, ActionType } from "../../stores";

type MenuItem = {
  label: string;
  icon: IconType;
  onClick: () => void;
}

const Toolbar = () => {
  const { state, dispatch } = useProgressStore();
  const [messageApi, contextHolder] = message.useMessage();

  /**
   * menu config
   */
  const menuItems: MenuItem[] = [
    {
      label: '新增',
      icon: PlusIcon,
      onClick: () => handleAddProgress(),
    },
    {
      label: '导入',
      icon: BiArrowToBottom,
      onClick: () => handleImport(),
    },
    {
      label: '导出',
      icon: BiArrowFromBottom,
      onClick: () => handleExport(),
    },
    {
      label: '清除',
      icon: AiOutlineClear,
      onClick: () => handleClear(),
    }
  ];

  // 新增流程
  const [openAddProgressModal, setOpenAddProgressModal] = useState<boolean>(false);
  const handleAddProgress = () => {
    setOpenAddProgressModal(true);
  }
  const addProgressModalHandler = {
    onOk: (progress: AddProgressForm) => {
      dispatch({
        type: ActionType.ADD_PROGRESS,
        payload: {
          title: progress.title,
          subTitle: progress.subTitle,
          description: progress.description,
        }
      })
      setOpenAddProgressModal(false);
    },
    onCancel: () => {
      setOpenAddProgressModal(false);
    }
  }

  // 导出JSON文件
  const handleExport = () => {
    if(state.progress.length === 0){
      return messageApi.info({
        content: '暂无记录',
        duration: 1.5,
      });
    }
    const data = JSON.stringify(state.progress);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'progress.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  // 导入JSON文件
  const handleImport = () => {
    Modal.confirm({
      title: '',
      content: '导入JSON文件将覆盖当前的所有记录，是否导入？',
      onOk: () => {
        input.click();
      },
      okText: '确认',
      cancelText: '取消',
    })
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const data = JSON.parse(e.target?.result as string);
        dispatch({
          type: ActionType.IMPORT,
          payload: data,
        })
      }
    }
  }

  /**
   * clear all records
   */
  const handleClear = () => {
    Modal.confirm({
      content: '建议清除前导出文件备份，是否清除所有记录？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: ActionType.IMPORT,
          payload: [],
        })
      }
    })
  }
  
  /**
   * handle toolbar-item click event
   * @param idx 
   */
  const clickHandler = (idx: number) => {
    menuItems[idx].onClick();
  }
  
  return (
    <div className="flex items-center justify-center w-full h-full">
      {
        menuItems.map((item, idx) => (
          <div 
            className={cn(
              "py-2 px-4 h-full flex flex-col items-center justify-center gap-1",
              " hover:bg-blue-600 cursor-pointer select-none",
              "transition-colors duration-300 ease-in-out"
            )}
            key={idx}
            onClick={() => clickHandler(idx)}
          >
            {React.createElement(item.icon, {
              className: 'w-4 h-4 text-white font-semibold',
            })}
            <span className="text-xs text-white">{item.label}</span>
          </div>
        ))
      }
      <AddProgressModal
        open={openAddProgressModal}
        onOk={addProgressModalHandler.onOk}
        onCancel={addProgressModalHandler.onCancel}
      />
      {contextHolder}
    </div>
  );
}
 
export default Toolbar;