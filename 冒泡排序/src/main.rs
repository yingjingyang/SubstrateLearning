// 基础要求：固定类型（比如 i32）的数组排序
fn bubble_sort(arr: &mut [i32]) {
    for i in 0..arr.len() {
        for j in 0..arr.len() - i - 1 {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}

// 提高部分：能够使用 template 和 PartialOrd 实现对任意类型的排序
fn bubble_sort_generic<T: PartialOrd>(arr: &mut [T]) {
    for i in 0..arr.len() {
        for j in 0..arr.len() - i - 1 {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}



fn main() {
    let mut arr = [7, 9, 3, 5, 2];
    bubble_sort(&mut arr);

    println!("Sorted array (i32): {:?}", arr);

    let mut arr2 = ["banana", "apple", "pear", "orange", "grape"];
    bubble_sort_generic(&mut arr2);

    println!("Sorted array (str): {:?}", arr2);
}

