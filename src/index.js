/**
 * Imports
 */

import EvStore from 'ev-store'
import compose from 'compose-function'

 /**
  * Events
  */

const events = [
  "blur", "change", "click",  "contextmenu", "dblclick",
  "error","focus", "focusin", "focusout", "input", "keydown",
  "keypress", "keyup", "load", "mousedown", "mouseup",
  "resize", "select", "submit", "touchcancel",
  "touchend", "touchstart", "unload"
]

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
      fn(handler(e))
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
