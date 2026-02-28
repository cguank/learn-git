// https://github.com/sisterAn/blog/issues/130

const fiber = {
  stateNode: App,
  memoizedState: null,
}

let workInProgressHook = null
let isMount = true

function dispatch(hook) {
  return function (action) {
    hook.update = action
  }
}

function useState(initial) {
  let hook = null
  if (isMount) {
    hook = {
      memoizedState: initial,
      update: null,
      next: null,
    }
    if (!workInProgressHook) {
      fiber.memoizedState = hook
    } else {
      workInProgressHook.next = hook
    }
    workInProgressHook = hook
  } else {
    hook = workInProgressHook
    workInProgressHook = workInProgressHook.next
    const baseState = hook.memoizedState
    const action = hook.update
    if (action) {
      const newState = typeof action === 'function' ? action(baseState) : action
      hook.memoizedState = newState
    }
  }
  return [hook.memoizedState, dispatch(hook)]
}

function App() {
  const [numberA, setNumberA] = useState(0)
  if (isMount) {
    var [numberB, setNumberB] = useState(1)
  }
  const [numberC, setNumberC] = useState(2)
  console.log(numberA, numberB, numberC)
  return {
    onClick: (a, b, c) => {
      setNumberA(a)
      setNumberB?.(b)
      setNumberC(c)
    },
  }
}

function Schedule() {
  workInProgressHook = fiber.memoizedState
  const app = fiber.stateNode()
  isMount = false
  return app
}

Schedule().onClick('A1', 'B2', 'C3')
Schedule().onClick('A2', 'B3', 'C4')
Schedule().onClick('A3', 'B4', 'C5')
