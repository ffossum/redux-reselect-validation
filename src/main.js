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
import { mapValues, every, values } from './util';

type State = {
  forms: FormsState,
};

type Params<Value, Parsed = Value> = {
  stateToForms?: State => FormsState,
  formName: string,
  name: string,
  defaultValue?: Value,
  validators?: {
    [key: string]: (Value) => boolean,
  },
  reduxValidators?: {
    [key: string]: Selector<State, any, boolean> | (State => boolean),
  },
  parse?: Value => Parsed,
};

function id(a) {
  return a;
}
const defaultStateToForms = state => state.forms;

class Input<Value, Parsed = Value> {
  changeValue: Value => ChangeValueAction;
  formName: string;
  name: string;
  getErrors: State => { [string]: boolean };
  getValue: State => ?Value;
  getParsed: State => Parsed;
  isValid: Selector<State, *, boolean>;
  validationSelectors: {
    [key: string]: (State) => boolean,
  };
  next: ($Shape<Params<Value, Parsed>>) => Input<Value, Parsed>;

  constructor(params: Params<Value, Parsed>) {
    const {
      stateToForms = defaultStateToForms,
      formName,
      name,
      defaultValue,
      validators = {},
      reduxValidators = {},
      parse = id,
    } = params;

    this.formName = formName;
    this.name = name;

    this.getValue = createSelector(stateToForms, forms => {
      const form = forms[formName];
      const input = form && form.inputs && form.inputs[params.name];
      const value = input && input.value;
      return typeof value !== 'undefined' ? value : defaultValue;
    });

    this.getParsed = parse
      ? createSelector((this.getValue: any), parse)
      : (this.getValue: any);

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

    this.next = function(
      nextParams: $Shape<Params<Value, Parsed>>
    ): Input<Value, Parsed> {
      return new Input({
        ...params,
        ...nextParams,
      });
    };
  }
}

export { Input, reducer, createChangeValueAction as changeValue, CHANGE_VALUE };
