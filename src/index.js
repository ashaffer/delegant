/**
 * Imports
 */

import ProxyEvent from './proxy-event'
import events from '@f/dom-events'
import forEach from '@f/foreach'
import compose from '@f/compose'
import EvStore from 'ev-store'
import map from '@f/map-array'

/**
 * Delegator
 */

function delegant (rootNode, fn = v => v) {
  return compose(...map(bind, events))

  function bind (name) {
    const handler = listener(name)
    rootNode.addEventListener(name, handler, true)
    return () => rootNode.removeEventListener(name, handler, true)
  }

  function listener (name) {
    return e => bubble(name, e.target, e)
  }

  function bubble (name, target, e) {
    const es = EvStore(target)
    const handler = es[name]

    if (handler) {
      const event = new ProxyEvent(e)
      event.currentTarget = target

      'function' === typeof handler
        ? fn(handler, event)
        : forEach(handler => fn(handler, event), handler)

      if (event._stopPropagation || event._stopImmediatePropagation) {
        return
      }
    }

    if (target.parentNode && target !== rootNode && e.bubbles) {
      bubble(name, target.parentNode, e)
    }
  }
}

function delegateGlobal (node, fn) {
  const store = EvStore(node)
  return compose(...map(bind, events))

  function bind (name) {
    const handler = listener(name)
    node.addEventListener(name, handler, true)
    return () => node.removeEventListener(name, handler, true)
  }

  function listener (name) {
    return e => forEach(handle => fn(handle, e), store[name])
  }
}

/**
 * Exports
 */

export default delegant
export {
  delegateGlobal
}
