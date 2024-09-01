import { Dayjs } from "dayjs";

export interface Progress{
  id: string;
  title: string;
  subTitle?: string;
  description?: string;
  nodes: ProgressNode[];
}

export interface ProgressNode {
  id: string;
  label: string;
  timeStamp: number | Dayjs;
  active: boolean;
  description?: string;
}

export interface State {
  progress: Progress[];
}

export enum ActionType {
  ADD_PROGRESS = 'ADD_PROGRESS',
  DELETE_PROGRESS = 'DELETE_PROGRESS',
  UPDATE_PROGRESS = 'UPDATE_PROGRESS',
  ADD_NODE = 'ADD_NODE',
  DELETE_NODE = 'DELETE_NODE',
  UPDATE_NODE = 'UPDATE_NODE',
  UPDATE_NODE_LIST = 'UPDATE_NODE_LIST',
  IMPORT = 'IMPORT',
}

export type Action = 
  | { type: ActionType.ADD_PROGRESS; payload: Omit<Progress, 'id' | 'nodes'> }
  | { type: ActionType.DELETE_PROGRESS; payload: { id: string } }
  | { type: ActionType.UPDATE_PROGRESS; payload: { id: string; title?: string; subTitle?: string; description?: string } }
  | { type: ActionType.ADD_NODE; payload: { progressId: string; node: Omit<ProgressNode, 'id'> } }
  | { type: ActionType.DELETE_NODE; payload: { progressId: string; nodeId: string } }
  | { type: ActionType.UPDATE_NODE; payload: { progressId: string; nodeId: string, nodeData: Partial<ProgressNode> } }
  | { type: ActionType.UPDATE_NODE_LIST; payload: { progressId: string; nodeList: ProgressNode[] } }
  | { type: ActionType.IMPORT; payload: Progress[] };