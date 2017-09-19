/* @flow */
/* eslint-env jest */

import { input } from './main';
import formsReducer from './reducer';
import { changeValue } from './actions';
import { combineReducers } from 'redux';

describe('input', () => {
  let reducer;
  let formName = 'formName';
  let name = 'inputName';
  let state;

  beforeEach(() => {
    reducer = combineReducers({ forms: formsReducer });
    const initAction: any = { type: '@@INIT' };
    state = reducer(undefined, initAction);
  });

  it('provides its name', () => {
    const result = input({
      formName,
      name,
    });
    expect(result.name).toBe(name);
  });

  it('provides selector for input value', () => {
    const result = input({ name, formName });
    state = reducer(state, changeValue({ formName, name, value: 'abc' }));
    expect(result.getValue(state)).toBe('abc');
  });

  test('simple validator', () => {
    const result = input({
      name,
      formName,
      validators: {
        simple: value => value === 'abc',
      },
    });
    expect(result.isValid(state)).toBe(false);
    state = reducer(state, changeValue({ formName, name, value: 'abc' }));
    expect(result.isValid(state)).toBe(true);
  });

  test('advanced validator', () => {
    const input1 = input({
      name: 'input1',
      formName,
    });
    const input2 = input({
      name: 'input2',
      formName,
      validators: {
        largest: [input1.getValue, (value, input1Value) => value > input1Value],
      },
    });

    state = reducer(
      state,
      changeValue({ formName: input1.formName, name: input1.name, value: 1 })
    );
    state = reducer(
      state,
      changeValue({ formName: input2.formName, name: input2.name, value: 2 })
    );

    expect(input2.isValid(state)).toBe(true);

    state = reducer(
      state,
      changeValue({ formName: input1.formName, name: input1.name, value: 3 })
    );

    expect(input2.isValid(state)).toBe(false);
  });
});
