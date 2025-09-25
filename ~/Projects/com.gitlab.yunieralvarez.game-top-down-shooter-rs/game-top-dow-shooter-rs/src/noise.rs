pub mod helpers;

use bevy::prelude::*;
use noise::{core::simplex, OpenSimplex};
use rand::Rng;

/// Plugin for noise map generation.
pub struct NoisePlugin;

impl Plugin for NoisePlugin {
	fn build(&self, app: &mut App) {
		app.register_type::<NoiseMap>()
			.register_type::<NoiseValue>()
			.add_systems(Startup, generate_noise_map);
	}
}

#[derive(Resource, Default, Reflect)]
#[reflect(Resource)]
pub struct NoiseMap {
	/// OpenSimplex noise.
	#[reflect(ignore)]
	pub noise: OpenSimplex,
	/// Seed of the noise map.
	pub seed: u32,
}

/// The numeric value of a specific point in the [`NoiseMap`].
#[derive(Component, Reflect)]
pub struct NoiseValue(pub f64);

/// Generate noise map resource.
fn generate_noise_map(mut commands: Commands) {
	let mut rng = rand::thread_rng();
	let seed = rng.gen_range(0..=u32::MAX);
	let simplex = OpenSimplex::new(seed);

	let noise_map = NoiseMap {
		seed,
		noise: simplex,
	};

	commands.insert_resource(noise_map);
}
