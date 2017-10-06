/* @flow */
import type { FormsState } from './reducer';
import reducer from './reducer';
import {
  changeValue as createChangeValueAction,
  CHANGE_VALUE,
} from './actions';
import type { ChangeValueAction } from './actions';
import { createSelector } from 'reselect';
import type { Selector } from 'reselect';
import { mapValues, values, every } from 'lodash';

type State = {
  forms: FormsState,
};

type Params<Value> = {
  formName: string,
  name: string,
  defaultValue?: Value,
  validators?: {
    [key: string]: Value => boolean,
  },
};

type Params2 = {
  reduxValidators: {
    [key: string]: Selector<State, any, boolean>,
  },
};
type Result<Value> = {
  changeValue: Value => ChangeValueAction,
  formName: string,
  name: string,
  getErrors: State => { [string]: boolean },
  getValue: State => ?Value,
  isValid: State => boolean,
  next: Params2 => Result<Value>,
};
function input<Value>(params: Params<Value>): Result<Value> {
  const { formName, name, defaultValue, validators = {},  } = params;

  function getValue(state: State) {
    const form = state.forms[formName];
    const input = form && form.inputs && form.inputs[params.name];
    const value = input && input.value;
    return typeof value !== 'undefined' ? value : defaultValue;
  }

  let validationSelectors = mapValues(validators, v => {
    return createSelector(getValue, v);
  });

  let getErrors = (state: State) =>
    mapValues(validationSelectors, f => !f(state));

  let isValid = createSelector(...values(validationSelectors), (...args) =>
    every(args)
  );

  function changeValue(value: Value) {
    return createChangeValueAction({
      formName,
      name,
      value,
    });
  }

  function next(params2: Params2): Result<Value> {
    const { reduxValidators } = params2;
    validationSelectors = {
      ...validationSelectors,
      ...reduxValidators,
    };

    getErrors = (state: State) =>
      mapValues(validationSelectors, f => !f(state));

    isValid = createSelector(...values(validationSelectors), (...args) =>
      every(args)
    );

    return {
      changeValue,
      formName,
      name,
      getErrors,
      getValue,
      isValid,
      validationSelectors,
      next,
    };
  }

  return {
    changeValue,
    formName,
    name,
    getErrors,
    getValue,
    isValid,
    validationSelectors,
    next,
  };
}

export { input, reducer, createChangeValueAction as changeValue, CHANGE_VALUE };
