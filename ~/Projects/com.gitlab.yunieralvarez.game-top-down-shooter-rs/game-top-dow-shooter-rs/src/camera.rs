use bevy::prelude::*;

use crate::player::Player;

pub struct CameraPlugin;

impl Plugin for CameraPlugin {
	fn build(&self, app: &mut App) {
		app.add_systems(Startup, spawn_camera)
			.add_systems(Update, camera_follow_player);
	}
}

fn spawn_camera(mut commands: Commands) {
	let mut camera_bundle = Camera2dBundle {
		transform: Transform::from_scale(Vec3::splat(0.2)),
		..default()
	};

	commands.spawn(camera_bundle);
}

fn camera_follow_player(
	mut query_set: ParamSet<(
		Query<&Transform, With<Player>>,
		Query<&mut Transform, With<Camera>>,
	)>,
) {
	if let Ok(player_transform) = query_set.p0().get_single() {
		let player_position = Vec2 {
			x: player_transform.translation.x,
			y: player_transform.translation.y,
		};

		if let Ok(mut camera_transform) = query_set.p1().get_single_mut() {
			camera_transform.translation.x = player_position.x;
			camera_transform.translation.y = player_position.y;
		}
	}
}
