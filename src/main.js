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
    [key: string]: (Value) => boolean,
  },
  reduxValidators?: {
    [key: string]: Selector<State, any, boolean> | (State => boolean),
  },
};

class Input<Value> {
  changeValue: Value => ChangeValueAction;
  formName: string;
  name: string;
  getErrors: State => { [string]: boolean };
  getValue: State => ?Value;
  isValid: State => boolean;
  validationSelectors: {
    [key: string]: (State) => boolean,
  };
  next: ($Shape<Params<Value>>) => Input<Value>;

  constructor(params: Params<Value>) {
    const {
      formName,
      name,
      defaultValue,
      validators = {},
      reduxValidators = {},
    } = params;

    this.formName = formName;
    this.name = name;

    this.getValue = function(state: State) {
      const form = state.forms[formName];
      const input = form && form.inputs && form.inputs[params.name];
      const value = input && input.value;
      return typeof value !== 'undefined' ? value : defaultValue;
    };

    this.validationSelectors = {
      ...mapValues(validators, v => createSelector(this.getValue, v)),
      ...reduxValidators,
    };

    this.getErrors = (state: State) =>
      mapValues(this.validationSelectors, f => !f(state));

    this.isValid = createSelector(
      ...values(this.validationSelectors),
      (...args) => every(args)
    );

    this.changeValue = function(value: Value) {
      return createChangeValueAction({
        formName,
        name,
        value,
      });
    };

    this.next = function(nextParams: $Shape<Params<Value>>): Input<Value> {
      return new Input({
        ...params,
        ...nextParams,
      });
    };
  }
}

export { Input, reducer, createChangeValueAction as changeValue, CHANGE_VALUE };
