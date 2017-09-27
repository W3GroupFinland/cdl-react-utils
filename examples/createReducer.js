import { Record, List } from 'immutable';
import { createReducer } from 'cdl-react-utils';

const Todo = Record({
  name: '',
  description: '',
  isDone: false,
});

const ADD_TODO = Symbol('ADD_TODO');
const TOGGLE_TODO = Symbol('TOGGLE_TODO');
const REMOVE_TODO = Symbol('REMOVE_TODO');

export function addTodo({ name, description }) {
  return {
    data: { name, description },
    type: ADD_TODO,
  };
}

export function toggleTodo(index) {
  return {
    data: index,
    type: TOGGLE_TODO,
  };
}

export function removeTodo(index) {
  return {
    data: index,
    type: REMOVE_TODO,
  };
}

export default createReducer(List(), {
  [ADD_TODO]: (state, { name, description }) => state.push(new Todo({ name, description })),
  [TOGGLE_TODO]: (state, index) => state.updateIn([index, 'isDone'], isDone => !isDone),
  [REMOVE_TODO]: (state, index) => state.delete(index),
});
