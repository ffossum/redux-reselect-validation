/* @flow */
/* eslint-env jest */

import { input } from './main';

describe('input', () => {
  let state;
  let formName;
  let name;
  let value;

  beforeEach(() => {
    formName = 'form';
    name = 'input';
    value = 'abc';
    state = {
      forms: {
        [formName]: {
          inputs: {
            [name]: {
              value,
            },
          },
        },
      },
    };
  });

  it('provides its name', () => {
    const result = input({
      name,
    })(formName);
    expect(result.name).toBe(name);
  });

  it('provides selector for input value', () => {
    const result = input({ name })(formName);
    expect(result.getValue(state)).toBe(value);
  });
});
