function Node(data) {
    this.data = data;
    this.left = null;
    this.right = null;
}
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

function createTree(arr, i) {
    let root = null;
    if (arr[i]) {
        root = new Node(arr[i]);
        root.left = createTree(arr, i * 2);
        root.right = createTree(arr, i * 2 + 1);
    }
    return root;
}
let root = createTree(arr, 1);


function inOrder(node, count = 0) {
    if (node) {

        inOrder(node.left, count);
        console.log(node.data);
        inOrder(node.right, count)

    }
    return count
}
/**
 * 
 *中序遍历，迭代法 
 */
function inOrderDiedai(node) {
    let stack = [];
    let top = -1;
    while (node || top != -1) {
        if (node) {
            stack[++top] = node;
            node = node.left;
        } else {
            node = stack[top--];
            console.log(node.data);
            node = node.right;

        }
    }
}
//先序迭代遍历
function preOrder(node) {
    let stack = [];
    let top = -1;
    while (node || top != -1) {
        if (node) {
            console.log(node.data);
            stack[++top] = node;
            node = node.left;
        } else {
            node = stack[top--];
            node = node.right;
        }

    }
}
//后序迭代遍历,两个栈
function postOrder(node) {
    let stack = [];
    let top = -1;
    let stack2 = [];
    let top2 = -1;
    while (node || top != -1) {
        if (node) {
            stack[++top] = node;
            stack2[++top2] = node;
            node = node.right;
        } else {
            node = stack[top--];
            node = node.left;
        }

    }
    while (top2 != -1) {
        node = stack2[top2--];
        console.log(node.data);

    }
}
//后序迭代遍历，标记法
function postOrder2(node) {
    let stack = [];
    let top = -1;
    let r = null;
    while (top != -1 || node) {
        if (node) {
            stack[++top] = node;
            node = node.left
        } else {
            node = stack[top];
            if (node.right && r != node.right) {
                node = node.right;
                stack[++top] = node;
                node = node.left;
            } else {
                node = stack[top--];
                console.log(node.data);
                r = node;
                node = null;

            }
        }
    }
}

//层次遍历
function levelOrder(node) {
    //let MAXSIZE = 5;
    let que = [];
    let front = 0,
        rear = 0;
    let stack = [];
    let top = -1;
    if (node) {
        que[rear++] = node;
        stack[++top] = node;
    }
    while (rear != front) {
        node = que[front++];
        //stack[++top] = node;
        //console.log(node.data);

        if (node.left) {
            que[rear++] = node.left;
            stack[++top] = node.left;
        }
        if (node.right) {
            que[rear++] = node.right;
            stack[++top] = node.right;
        }
    }
    while (top != -1) {
        console.log(stack[top--].data);

    }
}
/**
 * 交换左右子树，p122-9
 */
function swapLR(root) {
    if (root) {
        swapLR(root.left);
        swapLR(root.right);
        [root.left, root.right] = [root.right, root.left];
        console.log(root.data);

    }

}

//非递归翻转子树
function swapDiedai(node) {
    let stack = [];
    let top = -1;
    if (!node) return null;
    stack[++top] = node;
    while (top != -1) {
        node = stack[top--];
        if (node) {
            [node.left, node.right] = [node.right, node.left];
            if (node.left) stack[++top] = node.left
            if (node.right) stack[++top] = node.right
        }
    }
}



/**
 * 删除根值为x的子树
 */
function deleteX(node, x) {
    if (node) {
        if (node.data == x) node = null;
        else {
            node.left = deleteX(node.left, x);
            node.right = deleteX(node.right, x);
        }
    }
    return node;
}
/**
 * 打印值为x的所有祖先节点，x不多于1个
 */
function printAncestor(node, x, find = { is: false }) {
    if (node) {
        if (!find.is)
            printAncestor(node.left, x, find);
        if (!find.is)
            printAncestor(node.right, x, find);
        if (find.is) {
            console.log(node.data);
            return;
        }
        if (node.data == x) {
            console.log(node.data);
            find.is = true;
        }


    }
}

function postOrderprint(node, x) {
    let stack = [];
    let top = -1;
    let r = null;
    while (node || top != -1) {
        if (node) {
            if (node.data == x) {
                console.log(x);
                for (let i = top; i >= 0; i--) {
                    console.log(stack[i].data);

                }
                return;
            }
            stack[++top] = node;
            node = node.left;

        } else {
            node = stack[top];
            if (node.right && r != node.right) {
                node = node.right;
                //stack[++top] = node;
                // node = node.left;
            } else {
                node = stack[top--];
                r = node;
                node = null;
            }
        }

    }
}

/**求树高\宽 */
function getTreeHeight(node) {
    let que = [];
    let front = 0,
        rear = 0;
    let last = 1,
        level = 0;
    let count = 0,
        max = 0; //求树宽
    if (node) {
        que[rear++] = node;
        count++;
    }

    while (rear != front) {
        node = que[front++];

        if (node.left) {
            que[rear++] = node.left;
            count++;
        }
        if (node.right) {
            que[rear++] = node.right;
            count++;
        }
        if (last == front) {
            level++;
            if (count > max) max = count;
            count = 0;
            last = rear;
        }
    }
    return {
        level,
        width: max
    }
}

function getCommon(node, p, q) {
    let r = null;
    let stack = [];
    let top = -1;
    let stack2 = [];
    let top2 = -1;
    while (node || top != -1) {
        if (node) {
            stack[++top] = node;
            if ((node.data == q || node.data == p) && top2 != -1) {
                for (let i = top2; i >= 0; i--) {
                    for (let j = top; j >= 0; j--) {
                        if (stack2[i].data == stack[j].data) {
                            console.log(stack[j]);
                            return stack[j]
                        }

                    }
                }
            }
            if ((node.data == p || node.data == q) && top2 == -1) {
                for (let i = 0; i <= top; i++) stack2[++top2] = stack[i];
            }

            node = node.left;
        } else {
            node = stack[top];
            if (node.right && node.right != r) {
                node = node.right;
            } else {
                node = stack[top--];
                //  console.log(node.data);
                r = node;
                node = null;

            }
        }
    }
}

function isAvl(node, info = { h: 0, is: 0 }) {
    if (node) {
        let objl = { h: 0, is: 0 }
        let objr = { h: 0, is: 0 }
        if (!node.left && !node.right) {
            info.h = 1;
            info.is = 1;
        } else {
            isAvl(node.left, objl);
            isAvl(node.right, objr);
            info.h = objl.h > objr.h ? objl.h + 1 : objr.h + 1;
            if (Math.abs(objl.h - objr.h) <= 1) {

                info.is = objl.is && objr.is;
            } else info.is = 0;
        }

    } else {
        info.h = 0;
        info.is = 1;
    }
}
//inOrderDiedai(root)
//preOrder(root)
//postOrder(root)
//postOrder2(root)
//levelOrder(root)
//swapLR(root)
//swapDiedai(root);
//root = deleteX(root, 5);
//getCommon(root, 12, 9);
let obj = {}
console.log(isAvl(root, obj), obj);