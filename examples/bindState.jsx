import React, { Component } from 'react';
import { List } from 'immutable';
import { bindState } from 'cdl-react-utils';

export default class TodoExample extends Component {
  state = {
    todo: {
      name: '',
      description: '',
    },

    todos: List(),
  }

  bind = bindState(this);

  addTodo = (evt) => {
    evt.preventDefault();

    const { todo, todos } = this.state;

    this.setState({
      todo: {
        name: '',
        description: '',
      },

      // NOTE: .push only works because the `todos` object is an Immutable.JS List,
      // not an JavaScript array.
      todos: todos.push({
        name: todo.name,
        description: todo.description,
      }),
    });
  }

  render() {
    const { bind, addTodo } = this;
    const { todos } = this.state;

    return (
      <div className="todo-example">
        <form onSubmit={addTodo}>
          <h2>Todos</h2>
          <div className="input-group">
            <label htmlFor="todo-name">Name</label>
            <input
              type="text"
              id="todo-name"
              {...bind(['todo', 'name'])}
            />
          </div>
          <div className="input-group">
            <label htmlFor="todo-description">Description</label>
            <input
              type="text"
              id="todo-description"
              {...bind(['todo', 'description'])}
            />
          </div>
          <input type="submit" value="Add todo" />
        </form>
        {todos.map(({ name, description }) => (
          <div key={name} className="todo">
            <div className="name">{name}</div>
            <div className="description">{description}</div>
          </div>
        )).toArray()}
      </div>
    );
  }
}
