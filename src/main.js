/* @flow */
import type { FormsState } from './reducer';
import reducer from './reducer';
import { changeValue, CHANGE_VALUE } from './actions';

type State = {
  forms: FormsState,
};

type Params = {
  name: string,
  validators?: {
    [key: string]: Function,
  },
};
export function input(params: Params) {
  return function(formName: string) {
    return {
      name: params.name,
      getValue(state: State) {
        const form = state.forms[formName];
        const input = form && form.inputs && form.inputs[params.name];
        return input && input.value;
      },
    };
  };
}

export { reducer, changeValue, CHANGE_VALUE };
