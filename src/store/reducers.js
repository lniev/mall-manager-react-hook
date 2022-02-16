import { LOGIN, FETCHALLRIGHTSLIST } from './constants';

/**
 * 登录（待删除）
 */

const loginInitialState = {
  hasLogin: false,
};

export const loginReducer = (state = loginInitialState, actions = {}) => {
  let obj = {
    [LOGIN]: () => ({ ...state, hasLogin: true }),
  };
  return (obj[actions.type] && obj[actions.type]()) || state;
};

/**
 * 所有权限列表
 */

const RightsInitialState = {
  allRightList: []
}

export const RightReducer = (state = RightsInitialState, actions = {}) => {
  let obj = {
    [FETCHALLRIGHTSLIST]: () => ({ ...state, allRightList: actions.data }),
  };
  return (obj[actions.type] && obj[actions.type]()) || state;
}