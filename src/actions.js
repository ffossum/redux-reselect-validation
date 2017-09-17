/* @flow */
export type Action = ChangeValueAction;

export const CHANGE_VALUE = 'forms/change value';

type ChangeValueAction = {
  type: typeof CHANGE_VALUE,
  payload: ValueChange,
};

type ValueChange = {
  formName: string,
  name: string,
  value: any,
};

export function changeValue(payload: ValueChange): ChangeValueAction {
  return {
    type: CHANGE_VALUE,
    payload,
  };
}
