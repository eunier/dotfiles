use noise::{NoiseFn, OpenSimplex};

/// Get the value from a noise
///
/// Value is adjusted from 0.0 to 1.0
pub fn get_noise_point_value(noise: &OpenSimplex, x: f64, y: f64) -> f64 {
	noise.get([x, y]) + 0.5
}
