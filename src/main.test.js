/* @flow */
/* eslint-env jest */

import { Input } from './main';
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

  it('includes its name', () => {
    const result = new Input({
      formName,
      name,
    });
    expect(result.name).toBe(name);
  });

  it('includes its form name', () => {
    const result = new Input({
      formName,
      name,
    });
    expect(result.formName).toBe(formName);
  });

  it('provides selector for input value', () => {
    const result = new Input({ name, formName });
    state = reducer(state, result.changeValue('abc'));
    expect(result.getValue(state)).toBe('abc');
  });

  test('default value', () => {
    const result = new Input({
      name,
      formName,
      defaultValue: 'default value',
    });
    expect(result.getValue(state)).toBe('default value');
  });

  test('simple validator', () => {
    const result = new Input({
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

  describe('getErrors', () => {
    it('returns object indicating failed validations', () => {
      const input: Input<number> = new Input({
        name,
        formName,
        validators: {
          a: x => x < 2,
          b: x => x < 4,
        },
      });

      state = reducer(state, input.changeValue(1));

      expect(input.getErrors(state)).toEqual({
        a: false,
        b: false,
      });

      state = reducer(state, input.changeValue(3));

      expect(input.getErrors(state)).toEqual({
        a: true,
        b: false,
      });

      state = reducer(state, input.changeValue(5));

      expect(input.getErrors(state)).toEqual({
        a: true,
        b: true,
      });
    });
  });

  test('redux validator', () => {
    const input1: Input<number> = new Input({
      name: 'input1',
      formName,
    });

    let input2: Input<number> = new Input({
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

  test('parse', () => {
    const input: Input<string, number> = new Input({
      name,
      formName,
      parse: parseInt,
    });

    state = reducer(state, input.changeValue('100'));

    expect(input.getParsed(state)).toBe(100);
  });
});
