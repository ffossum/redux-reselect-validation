/* @flow */
/* eslint-env jest */

import reducer from './reducer';
import { changeValue } from './actions';

describe('reducer', () => {
  const initAction: any = {
    type: '@@INIT',
  };

  it('initializes to empty object', () => {
    const initialState = reducer(undefined, initAction);
    expect(initialState).toEqual({});
  });

  it('handles value change', () => {
    const action = changeValue({
      formName: 'form',
      name: 'input',
      value: 'abc',
    });

    const state: any = reducer(undefined, action);
    expect(state.form.inputs.input.value).toBe('abc');
  });
});
