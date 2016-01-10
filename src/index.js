/**
 * Imports
 */

import EvStore from 'ev-store'
import compose from 'compose-function'
import ProxyEvent from './proxy-event'
import events from '@f/dom-events'

/**
 * Delegator
 */

function delegant (rootNode, fn = v => v) {
  return compose(...events.map(bind))

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
      fn(handler(event))
      if (event._stopPropagation || event._stopImmediatePropagation) {
        return
      }
    }

    if (target.parentNode && target.parentNode !== rootNode) {
      bubble(name, target.parentNode, e)
    }
  }
}

/**
 * Exports
 */

export default delegant
