use crate::{
	camera::CameraPlugin, cursor::CursorPlugin, map::MapPlugin,
	movement::MovementPlugin, noise::NoisePlugin, player::PlayerPlugin,
	weapon::WeaponPlugin,
};
use bevy::prelude::*;

pub struct GamePlugin;

impl Plugin for GamePlugin {
	fn build(&self, app: &mut App) {
		app.add_plugins((
			CameraPlugin,
			CursorPlugin,
			MapPlugin,
			MovementPlugin,
			NoisePlugin,
			PlayerPlugin,
			WeaponPlugin,
		));
	}
}
