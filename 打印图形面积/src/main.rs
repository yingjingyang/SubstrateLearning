trait HasArea {
    fn get_area(&self) -> f64;
}

struct Circle {
    radius: f64,
}

struct Triangle {
    base: f64,
    height: f64,
}

struct Square {
    side: f64,
}

impl HasArea for Circle {
    fn get_area(&self) -> f64 {
        std::f64::consts::PI * self.radius.powi(2)
    }
}

impl HasArea for Triangle {
    fn get_area(&self) -> f64 {
        0.5 * self.base * self.height
    }
}

impl HasArea for Square {
    fn get_area(&self) -> f64 {
        self.side.powi(2)
    }
}

fn print_area<T: HasArea>(shape: &T) {
    println!("The area of the shape is {}", shape.get_area());
}

fn main() {
    let circle = Circle { radius: 5.0 };
    let triangle = Triangle { base: 3.0, height: 4.0 };
    let square = Square { side: 2.0 };

    print_area(&circle); // outputs "The area of the shape is 78.53981633974483"
    print_area(&triangle); // outputs "The area of the shape is 6"
    print_area(&square); // outputs "The area of the shape is 4"
}
