/* @flow */
import type { FormsState } from './reducer';
import reducer from './reducer';
import { changeValue, CHANGE_VALUE } from './actions';
import { createSelector } from 'reselect';
import { mapValues, values, every } from 'lodash';

type State = {
  forms: FormsState,
};

type Params = {
  formName: string,
  name: string,
  validators?: {
    [key: string]: Array<*> | Function,
  },
};
export function input(params: Params) {
  const { formName, name, validators = {} } = params;

  function getValue(state: State) {
    const form = state.forms[formName];
    const input = form && form.inputs && form.inputs[params.name];
    return input && input.value;
  }

  const validationSelectors = mapValues(validators, v => {
    if (typeof v === 'function') {
      return createSelector(getValue, v);
    } else {
      const args = [getValue, ...v];
      return createSelector.apply(undefined, args);
    }
  });

  const getErrors = (state: State) =>
    mapValues(validationSelectors, f => !f(state));

  const isValid = createSelector(...values(validationSelectors), (...args) =>
    every(args)
  );

  return {
    formName,
    name,
    getErrors,
    getValue,
    isValid,
  };
}

export { reducer, changeValue, CHANGE_VALUE };
