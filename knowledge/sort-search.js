/**
 * 
乱序排序
 */
function shuffle(arr) {
    for (let i = arr.length; i > 0; i--) {
        let j = parseInt(Math.random() * i); //将当前元素和前面元素进行交换，想下为什么不和数组任意元素交换
        [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
    }
}


/**
 * 归并排序
左边数组【low，mid】
右边数组【mid+，high】
 */
function mergeSort(arr, low, high) {
    if (low < high) {
        let mid = parseInt((low + high) / 2);
        mergeSort(arr, low, mid);
        mergeSort(arr, mid + 1, high);
        merge(arr, low, mid, high);
    }
}

function merge(arr, low, mid, high) {
    let temp = [];
    for (let i = low; i <= high; i++) temp[i] = arr[i];
    for (var i = low, j = mid + 1, k = low; i <= mid && j <= high; k++) {
        if (temp[i] < temp[j]) arr[k] = temp[i++];
        else arr[k] = temp[j++]
    }
    while (i <= mid) arr[k++] = temp[i++];
    while (j <= high) arr[k++] = temp[j++];
}
////////////////////////////////快排
function quickSort(list, low, high) {
    if (low < high) {
        let pivotIndex = partition(list, low, high);
        quickSort(list, low, pivotIndex - 1);
        quickSort(list, pivotIndex + 1, high);
    }
}

function partition(list, low, high) {
    let pivot = list[low];
    while (low < high) {
        while (pivot <= list[high] && low < high) high--; //忘记加low<high <=
        list[low] = list[high];
        while (pivot >= list[low] && low < high) low++; //忘记加low<high   >=
        list[high] = list[low];
    }
    console.log(low, high);

    list[low] = pivot;
    return low;
}

let b = [32, 123, 434, 312, 1, 3, 5, 2, 1, 6, 3, 4]
quickSort(b, 0, b.length - 1)
console.log(b);
//////////////////////////////快排结束

//选择排序
function selectSort(list) {
    for (let i = 0; i < list.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < list.length; j++) {
            if (list[min] > list[j]) min = j;
        }
        [list[i], list[min]] = [list[min], list[i]];
    }
}
let b = [32, 123, 434, 312, 1, 3, 5, 2, 1, 6, 3, 4]
selectSort(b)
console.log(b);

//冒泡排序
function bubbleSort(list) {
    for (var i = 0; i < list.length - 1; i++) {
        let done = true;
        for (let j = 0; j < list.length - 1 - i; j++) {
            if (list[j] > list[j + 1]) {
                [list[j], list[j + 1]] = [list[j + 1], list[j]];
                done = false;
            }
        }
        if (done) break;
    }
    console.log(i);

}
let b = [32, 123, 434, 312, 1, 3, 5, 2, 1, 6, 3, 4]
bubbleSort(b)
console.log(b);

//折半查找
function binarySearch(list, value) {
    let [low, high] = [0, list.length - 1];
    let mid;
    while (low <= high) {
        mid = parseInt((low + high) / 2);
        if (list[mid] == value) return mid;
        else if (list[mid] > value) high = mid - 1;
        else low = mid + 1;
    }
    return -1
}
console.log(binarySearch(b, 1232));