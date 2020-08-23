//单链表
function Node(data, next) {
    this.data = data;
    this.next = next;
}
let c = new Node('c', null);
let b = new Node('b', c);
let a = new Node('a', b);
let p = a;
let newNode = new Node('newNode', null);
while (p != null) {
    if (p.data == 'b') {
        let c = p.next;
        b.next = newNode;
        newNode.next = c;
    }
    console.log(p.data);
    p = p.next


}
//双链表
function Node(data, next, pre) {
    this.data = data;
    this.next = next;
    this.pre = pre;
}
var c = new Node('c', null, b);
var b = new Node('b', c, a);
var a = new Node('a', b, null);
b.pre = a;
c.pre = b;
var p = a;
var newNode = new Node('newNode', null, null);
while (p != null) {
    if (p.data == 'b') {
        let _c = p.next;
        newNode.pre = p;
        p.next = newNode;
        newNode.next = _c;
        _c.pre = newNode;
    }
    p = p.next
}
p = a;
while (p != null) {
    console.log(p.data);
    console.log(p.pre);
    console.log(p.next);
    p = p.next
}

function selectSort(head) { //带头节点的选择排序
    let prep, p, premax, max;
    let rt = head.next;
    head.next = null;

    while (rt) {
        max = rt;
        premax = null;
        p = rt.next;
        prep = rt;
        while (p) {
            if (p.data > max.data) {
                max = p;
                premax = prep;
            }
            prep = p;
            p = p.next;
        }
        if (max == rt) rt = rt.next;
        else premax.next = max.next;
        max.next = head.next;
        head.next = max;
    }

}
//selectSort(head);