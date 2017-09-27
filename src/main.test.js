/* @flow */
/* eslint-env jest */

import { input } from './main';
import formsReducer from './reducer';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

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
    state = reducer(state, result.changeValue('abc'));
    expect(result.getValue(state)).toBe('abc');
  });

  test('default value', () => {
    const result = input({ name, formName, defaultValue: 'default value' });
    expect(result.getValue(state)).toBe('default value');
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
    state = reducer(state, result.changeValue('abc'));
    expect(result.isValid(state)).toBe(true);
  });

  test('advanced validator', () => {
    const input1 = input({
      name: 'input1',
      formName,
    });
    let input2 = input({
      name: 'input2',
      formName,
    });

    input2 = input2.next({
      reduxValidators: {
        largest: createSelector(
          input2.getValue,
          input1.getValue,
          (value, input1Value) => value > input1Value
        ),
      },
    });

    state = reducer(state, input1.changeValue(1));
    state = reducer(state, input2.changeValue(2));

    expect(input2.isValid(state)).toBe(true);

    state = reducer(state, input1.changeValue(3));

    expect(input2.isValid(state)).toBe(false);
  });
});
