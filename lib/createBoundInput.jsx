import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';

import bindState from './bindState';
import bindStateImmutable from './bindStateImmutable';

const lensPath = R.memoize(R.lensPath);

export default function createBoundInput(thisBind) {
  const bindDefault = bindState(thisBind);
  const bindImmutable = bindStateImmutable(thisBind);

  const createCheckboxChangeHandler = R.memoize((path) => {
    const lens = lensPath(path);

    if (!Array.isArray(path) && typeof path !== 'string') {
      throw new Error('bindState: invalid path!');
    }

    // If path is not an array use it as the key
    if (!Array.isArray(path)) {
      return () => thisBind.setState({
        [path]: !R.view(lens, thisBind.state),
      });
    }

    if (path.length === 0) {
      throw new Error('bindState: invalid path!');
    }

    const head = R.head(path);
    const tail = R.tail(path);

    if (!tail) {
      return () => thisBind.setState({
        [head]: !R.view(lens, thisBind.state),
      });
    }

    const baseLens = R.lensProp(head);
    const pathLens = R.lensPath(tail);
    const base = R.view(baseLens, thisBind.state);

    return () => thisBind.setState({
      [head]: R.set(pathLens, !R.view(lens, thisBind.state), base),
    });
  });

  function checkboxBind(path) {
    const lens = lensPath(path);

    return {
      checked: R.view(lens, thisBind.state),
      onClick: createCheckboxChangeHandler(thisBind, path),
    };
  }

  function BoundInput({ type, path, formatter, immutable, children, ...props }) {
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

        return (
          <input
            type={type}
            {...checkboxBind(path)}
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
    path: PropTypes.oneOf([
      PropTypes.string,
      PropTypes.array,
    ]).isRequired,
    formatter: PropTypes.func,
    immutable: PropTypes.bool,
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node,
    ]),
  };

  BoundInput.defaultProps = {
    formatter: undefined,
    immutable: false,
    children: null,
  };

  return BoundInput;
}
