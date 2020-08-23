function insertSort (arr) {
  for (let i = 1; i < arr.length; i++) {
    const temp = arr[i];
    for (var j = i; j > 0; j--) {
      if (temp >= arr[j - 1]) break;
      arr[j] = arr[j - 1];
    }
    arr[j] = temp;
  }
}
const arr = [5, 4, 3, 2, 1];
insertSort(arr);
console.log(arr);