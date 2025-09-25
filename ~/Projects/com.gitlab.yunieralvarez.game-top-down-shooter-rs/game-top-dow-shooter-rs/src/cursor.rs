use bevy::prelude::*;

pub struct CursorPlugin;

impl Plugin for CursorPlugin {
	fn build(&self, app: &mut App) {
		app.register_type::<CursorCoords>()
			.init_resource::<CursorCoords>()
			.add_systems(Update, capture_cursor_coords);
	}
}

#[derive(Resource, Default, Reflect)]
#[reflect(Resource)]
pub struct CursorCoords(pub Vec2);

fn capture_cursor_coords(
	camera_query: Query<(&Camera, &GlobalTransform)>,
	mut cursor_coords: ResMut<CursorCoords>,
	window_query: Query<&Window>,
) {
	let (camera, camera_transform) = camera_query.single();
	let window = window_query.single();

	if let Some(world_position) = window
		.cursor_position()
		.and_then(|cursor| camera.viewport_to_world(camera_transform, cursor))
		.map(|ray| ray.origin.truncate())
	{
		cursor_coords.0 = world_position;
	}
}
