fn sum_u32_numbers(numbers: &[u32]) -> Option<u32> {
    let mut sum:u32 = 0;

    for &num in numbers {
        sum = match sum.checked_add(num) {
            Some(s) => s,
            None => return None,
        };
    }

    Some(sum)
}

fn main() {
    let numbers = &[1, 2, 3, 4, 5];
    let sum = sum_u32_numbers(numbers);
    println!("{:?}", sum); // Output: Some(15)

    let max_value = u32::max_value(); // 2^32 - 1
    let numbers = &[max_value, 1];
    let sum = sum_u32_numbers(numbers);
    println!("{:?}", sum); // Output: None
}
