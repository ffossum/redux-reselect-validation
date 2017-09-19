/* @flow */
import type { FormsState } from './reducer';
import reducer from './reducer';
import { changeValue, CHANGE_VALUE } from './actions';
import type { ChangeValueAction } from './actions';
import { createSelector } from 'reselect';
import { mapValues, values, every } from 'lodash';

type State = {
  forms: FormsState,
};

type Params<Value> = {
  formName: string,
  name: string,
  validators?: {
    [key: string]: Array<Function> | Value => boolean,
  },
};

type Result<Value> = {
  changeValue: Value => ChangeValueAction,
  formName: string,
  name: string,
  getErrors: State => { [string]: boolean },
  getValue: State => Value,
  isValid: State => boolean,
}
function input<Value>(params: Params<Value>): Result<Value> {
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
    changeValue(value: Value) {
      return changeValue({
        formName,
        name,
        value,
      });
    },
    formName,
    name,
    getErrors,
    getValue,
    isValid,
  };
}

export { input, reducer, changeValue, CHANGE_VALUE };
