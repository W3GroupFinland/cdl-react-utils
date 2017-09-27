import React, { Component } from 'react';
import { Record, List } from 'immutable';
import { bindStateImmutable } from 'cdl-react-utils';

const TodoRecord = Record({
  name: '',
  description: '',
});

export default class TodoExample extends Component {
  state = {
    todo: new TodoRecord(),
    todos: List(),
  }

  bind = bindStateImmutable(this);

  addTodo = (evt) => {
    evt.preventDefault();

    const { todo, todos } = this.state;

    this.setState({
      todo: new TodoRecord(),

      // NOTE: .push only works because the `todos` object is an Immutable.JS List,
      // not an JavaScript array.
      todos: todos.push(todo),
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
          <input type="button" value="Add todo" />
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
