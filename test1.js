function Node(data) {
  this.data = data
  this.left = null
  this.right = null
}
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

function createTree(arr, i) {
  let root = null
  if (arr[i]) {
    root = new Node(arr[i])
    root.left = createTree(arr, i * 2)
    root.right = createTree(arr, i * 2 + 1)
  }
  return root
}
let root = createTree(arr, 1)

function preorder1 (root) {
  if (!root) return
  
  preorder1(root.left)
preorder1(root.right)
      console.log(root.data)

}

function preorder(root) {
  const stack1 = []
  const stack2 = []
  let cur = root
  while (cur || stack1.length) {
    if (cur) {
      stack1.push(cur)
      stack2.push(cur)
      cur = cur.right
    } else {
      const node = stack1.pop()
      cur = node.left
    }
  }
  while (stack2.length) {
      const node = stack2.pop()
    console.log(node.data);
    
  }
}
preorder(root)
preorder1(root)