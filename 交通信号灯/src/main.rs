#[derive(Debug)]
enum TrafficLight {
    Green,
    Yellow,
    Red,
}

trait TimeDuration {
    fn time(&self) -> u8;
}

impl TimeDuration for TrafficLight {
    fn time(&self) -> u8 {
        match self {
            TrafficLight::Green => 30,
            TrafficLight::Yellow => 5,
            TrafficLight::Red => 45,
        }
    }
}

fn main() {
    let light = TrafficLight::Green;
    println!("Duration of {:?} is {} seconds", light, light.time());
}
