/* @flow */
import type { Action } from './actions';
import { CHANGE_VALUE } from './actions';

export type FormsState = {
  [formName: string]: FormState,
};
type FormState = {
  inputs: InputsState,
};
type InputsState = {
  [inputName: string]: InputState,
};
type InputState = {
  value: any,
};

export default function formsReducer(state: FormsState = {}, action: Action) {
  switch (action.type) {
    case CHANGE_VALUE: {
      const { formName, name } = action.payload;
      const form = state[formName];
      const input = form && form.inputs[name];
      const value = input && input.value;

      if (value !== action.payload.value) {
        return {
          ...state,
          [formName]: formReducer(state[formName], action),
        };
      }
    }
  }
  return state;
}

const initialFormState = {
  inputs: {},
};
function formReducer(state: FormState = initialFormState, action: Action) {
  switch (action.type) {
    case CHANGE_VALUE: {
      return {
        ...state,
        inputs: inputsReducer(state.inputs, action),
      };
    }
  }
  return state;
}

function inputsReducer(state: InputsState = {}, action) {
  switch (action.type) {
    case CHANGE_VALUE: {
      const { name } = action.payload;
      return {
        ...state,
        [name]: inputReducer(state[name], action),
      };
    }
  }
  return state;
}

const initialInputState = {
  value: undefined,
};
function inputReducer(state: InputState = initialInputState, action: Action) {
  switch (action.type) {
    case CHANGE_VALUE: {
      const { value } = action.payload;
      return {
        ...state,
        value,
      };
    }
  }
  return state;
}
