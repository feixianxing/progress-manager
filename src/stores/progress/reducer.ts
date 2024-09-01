import { State, Action, ActionType } from './types';
import { nanoid } from 'nanoid';

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    /**
     * Add a new progress
     */
    case ActionType.ADD_PROGRESS: {
      const newProgress = {
        ...action.payload,
        id: nanoid(),
        nodes: []
      };
      return { ...state, progress: [...state.progress, newProgress] };
    }
    /**
     * delete progress by id
     */
    case ActionType.DELETE_PROGRESS: {
      const progress = state.progress.filter(p => p.id !== action.payload.id);
      return { ...state, progress };
    }
    /**
     * update progress by id
     */
    case ActionType.UPDATE_PROGRESS: {
      return {
        ...state,
        progress: state.progress.map(p => 
          p.id === action.payload.id
            ? { ...p, ...action.payload }
            : p
        )
      };
    }
    /**
     * add a node to the specific progress
     */
    case ActionType.ADD_NODE: {
      const newNode = {
        ...action.payload.node,
        id: nanoid(),
        active: false,
      };
      return {
        ...state,
        progress: state.progress.map(p =>
          p.id === action.payload.progressId
            ? { ...p, nodes: [...p.nodes, newNode] }
            : p
        ),
      };
    }
    /**
     * delete a node from the specific progress by nodeId
     */
    case ActionType.DELETE_NODE: {
      return {
        ...state,
        progress: state.progress.map(p => 
          p.id === action.payload.progressId
            ? { ...p, nodes: p.nodes.filter(n => n.id !== action.payload.nodeId) }
            : p
        ),
      }
    }
    /**
     * update a node from the specific progress by nodeId
     */
    case ActionType.UPDATE_NODE: {
      return {
        ...state,
        progress: state.progress.map(p =>
          p.id === action.payload.progressId
            ? { ...p, nodes: p.nodes.map(n => n.id === action.payload.nodeId ? { ...n, ...action.payload.nodeData } : n) }
            : p
        ),
      }
    }
    /**
     * update a node list from the specific progress
     */
    case ActionType.UPDATE_NODE_LIST: {
      return {
        ...state,
        progress: state.progress.map(p =>
          p.id === action.payload.progressId
            ? { ...p, nodes: action.payload.nodeList }
            : p
        ),
      }
    }
    /**
     * import JSON file and load all progress into state
     */
    case ActionType.IMPORT: {
      return {
        ...state,
        progress: action.payload,
      }
    }
    default: {
      throw new Error('Invalid action type');
    }
  }
}

export default reducer;