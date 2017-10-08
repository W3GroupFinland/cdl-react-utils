import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

import bindState from './bindState';
import bindStateImmutable from './bindStateImmutable';

const lensPath = R.memoize(R.lensPath);
/**
 * Creates the BoundInput component.
 *
 * @function
 * @param thisBind {React.Component} `this` of the component the function is used in.
 * @returns {createBoundInput~BoundInput}
 */
export default function createBoundInput(thisBind) {
  const bindDefault = bindState(thisBind);
  const bindImmutable = bindStateImmutable(thisBind);

  // Utility function used to toggle a certain value in array.
  function toggleInArray(array, value) {
    return array.includes(value)
      ? R.without([value], array)
      : R.append(value, array);
  }

  const createCheckboxHandler = R.memoize((path) => {
    if (!Array.isArray(path) && typeof path !== 'string') {
      throw new Error(`BoundInput: invalid path: ${path.toString()}`);
    }

    // If path is not an array use it as the key
    if (!Array.isArray(path)) {
      return evt => thisBind.setState({
        [path]: toggleInArray(thisBind.state[path], evt.target.value),
      });
    }

    if (path.length === 0) {
      throw new Error(`BoundInput: invalid path: ${path.toString()}`);
    }

    const lens = lensPath(path);
    const head = R.head(path);
    const tail = R.tail(path);

    if (!tail) {
      return evt => thisBind.setState({
        [head]: toggleInArray(R.view(lens, thisBind.state), evt.target.value),
      });
    }

    return (evt) => {
      const baseLens = R.lensProp(head);
      const pathLens = R.lensPath(tail);
      const base = R.view(baseLens, thisBind.state);

      thisBind.setState({
        [head]: R.set(
          pathLens,
          toggleInArray(R.view(lens, thisBind.state), evt.target.value),
          base
        ),
      });
    };
  });

  const createToggleHandler = R.memoize((path) => {
    if (!Array.isArray(path) && typeof path !== 'string') {
      throw new Error('BoundInput: invalid path!');
    }

    // If path is not an array use it as the key
    if (!Array.isArray(path)) {
      return () => thisBind.setState({
        [path]: !thisBind.state[path],
      });
    }

    if (path.length === 0) {
      throw new Error('BoundInput: invalid path!');
    }

    const lens = lensPath(path);
    const head = R.head(path);
    const tail = R.tail(path);

    if (!tail) {
      return () => thisBind.setState({
        [head]: !R.view(lens, thisBind.state),
      });
    }

    return () => {
      const baseLens = R.lensProp(head);
      const pathLens = R.lensPath(tail);
      const base = R.view(baseLens, thisBind.state);

      thisBind.setState({
        [head]: R.set(pathLens, !R.view(lens, thisBind.state), base),
      });
    };
  });

  function checkboxBind(path, value) {
    if (!Array.isArray(path)) {
      return {
        checked: thisBind.state[path].includes(value),
        onChange: createCheckboxHandler(path),
      };
    }

    const lens = lensPath(path);

    return {
      checked: R.view(lens, thisBind.state).includes(value),
      onChange: createCheckboxHandler(path),
    };
  }

  function toggleBind(path) {
    if (!Array.isArray(path)) {
      return {
        checked: thisBind.state[path],
        onChange: createToggleHandler(path),
      };
    }

    const lens = lensPath(path);

    return {
      checked: R.view(lens, thisBind.state),
      onChange: createToggleHandler(path),
    };
  }

  /**
   * The main BoundInput component.
   *
   * @function
   * @type type {string} Type of the input, including select which allows you to embed
   * the options used as children.
   *
   * @param path {Array.<string|number>|string} The path in the state to bind to.
   *
   * @param formatter {function} Optional formatter for the input value, for example
   * for numeric fields. Cannot be used with checkboxes.
   *
   * @param immutable {boolean} Flag to tell the BoundInput component if the state uses Immutable.JS
   * containers as part of its state. Defaults to false.
   *
   * @param boolean {boolean} Switches between boolean/value mode in checkboxes. No-op if used
   * with other input types (for now, atleas). Defaults to false.
   */
  function BoundInput({
    type,
    path,
    formatter,
    immutable,
    children,
    boolean,
    ...props
  }) {
    switch (type) {
      case 'color':
      case 'date':
      case 'datetime-local':
      case 'email':
      case 'hidden':
      case 'month':
      case 'number':
      case 'password':
      case 'range':
      case 'search':
      case 'tel':
      case 'text':
      case 'time':
      case 'url':
      case 'week': {
        const bind = immutable ? bindImmutable : bindDefault;

        return (
          <input
            type={type}
            {...bind(path, formatter)}
            {...R.omit(['value', 'onChange'], props)}
          />
        );
      }
      case 'select': {
        const bind = immutable ? bindImmutable : bindDefault;

        return (
          <select
            {...bind(path, formatter)}
            {...R.omit(['value', 'onChange'], props)}
          >
            {children}
          </select>
        );
      }
      case 'checkbox': {
        if (formatter) {
          throw new Error('BoundInput: formatter functions are not supported on checkboxes!');
        }

        if (immutable) {
          throw new Error('BoundInput: binding Immutable.JS state to checkboxes is currently uninmplemented.');
        }

        const bind = boolean ? toggleBind : checkboxBind;

        return (
          <input
            type={type}
            {...bind(path, props.value)}
            {...R.omit(['checked', 'onChange'], props)}
          />
        );
      }
      default: {
        throw new Error('BoundInput: invalid or uninmplemented type!');
      }
    }
  }

  BoundInput.propTypes = {
    type: PropTypes.string.isRequired,
    path: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.array,
    ]).isRequired,
    formatter: PropTypes.func,
    immutable: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    boolean: PropTypes.bool,
    value: PropTypes.string,
  };

  BoundInput.defaultProps = {
    formatter: undefined,
    immutable: false,
    boolean: false,
    children: null,
    value: undefined,
  };

  return BoundInput;
}
