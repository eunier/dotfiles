use crate::{
	animation::AnimationTimer,
	map::{
		helpers::{
			convert_position_to_chunk_coord, convert_position_to_tile_coord,
		},
		ChunkCoord, NearChunkCoords, TileCoord,
	},
	movement::{MoveDirection, Movement},
	render,
	weapon::{spawn_weapon, Weapon},
};
use bevy::prelude::*;

const PLAYER_ASSET_FIRST_DOWN_RUN_INDEX: usize = 16;
const PLAYER_ASSET_FIRST_DOWN_WALK_INDEX: usize = 4;
const PLAYER_ASSET_FIRST_SIDE_RUN_INDEX: usize = 12;
const PLAYER_ASSET_FIRST_SIDE_WALK_INDEX: usize = 0;
const PLAYER_ASSET_FIRST_UP_RUN_INDEX: usize = 20;
const PLAYER_ASSET_FIRST_UP_WALK_INDEX: usize = 8;
const PLAYER_ASSET_GRID_COLUMNS: usize = 4;
const PLAYER_ASSET_GRID_ROWS: usize = 6;
const PLAYER_ASSET_LAST_DOWN_RUN_INDEX: usize = 19;
const PLAYER_ASSET_LAST_DOWN_WALK_INDEX: usize = 7;
const PLAYER_ASSET_LAST_SIDE_RUN_INDEX: usize = 15;
const PLAYER_ASSET_LAST_SIDE_WALK_INDEX: usize = 3;
const PLAYER_ASSET_LAST_UP_RUN_INDEX: usize = 23;
const PLAYER_ASSET_LAST_UP_WALK_INDEX: usize = 11;
const PLAYER_ASSET_PATH: &str = "player.png";
const PLAYER_ASSET_TILE_SIZE_X: f32 = 16.0;
const PLAYER_ASSET_TILE_SIZE_Y: f32 = 16.0;
const PLAYER_RUN_SPEED_MULTIPLIER: f32 = 2.0;
const PLAYER_WALK_SPEED: f32 = 75.0;

pub struct PlayerPlugin;

impl Plugin for PlayerPlugin {
	fn build(&self, app: &mut App) {
		app.add_systems(
			Startup,
			(
				spawn_player,
				spawn_weapon,
				apply_deferred,
				attach_weapon_to_player,
			)
				.chain(),
		)
		.add_systems(
			Update,
			(
				animate_sprite,
				move_player,
				despawn_weapon,
				update_tile_map_coords,
			),
		);
	}
}

#[derive(Bundle)]
struct PlayerBundle {
	animation_timer: AnimationTimer,
	marker: Player,
	movement_direction: Movement,
	name: Name,
	sprite_sheet_bundle: SpriteSheetBundle,
	tile_coord: TileCoord,
	chunk_coord: ChunkCoord,
	near_chunk_coords: NearChunkCoords,
}

#[derive(Component)]
pub struct Player {}

fn spawn_player(
	asset_server: Res<AssetServer>,
	mut atlases: ResMut<Assets<TextureAtlasLayout>>,
	mut commands: Commands,
) {
	let texture_handle = asset_server.load(PLAYER_ASSET_PATH);

	let layout = TextureAtlasLayout::from_grid(
		Vec2 {
			x: PLAYER_ASSET_TILE_SIZE_X,
			y: PLAYER_ASSET_TILE_SIZE_Y,
		},
		PLAYER_ASSET_GRID_COLUMNS,
		PLAYER_ASSET_GRID_ROWS,
		None,
		None,
	);

	let handle = atlases.add(layout);

	let player_bundle = PlayerBundle {
		animation_timer: AnimationTimer(Timer::from_seconds(
			0.1,
			TimerMode::Repeating,
		)),
		marker: Player {},
		movement_direction: Movement::Idle,
		name: Name::new("Player"),
		sprite_sheet_bundle: SpriteSheetBundle {
			atlas: TextureAtlas {
				layout: handle,
				index: 0,
			},
			texture: texture_handle,
			transform: Transform {
				translation: Vec3 {
					z: render::constants::PLAYER_RENDER_Z_INDEX,
					..default()
				},
				..default()
			},
			..default()
		},
		tile_coord: TileCoord(Vec2::ZERO),
		chunk_coord: ChunkCoord(Vec2::ZERO),
		near_chunk_coords: NearChunkCoords(Vec::new()),
	};

	commands.spawn(player_bundle);
}

fn move_player(
	keyboard_input: Res<ButtonInput<KeyCode>>,
	mut query: Query<(&mut Movement, &mut Transform), With<Player>>,
	time: Res<Time>,
) {
	if let Ok((mut movement, mut transform)) = query.get_single_mut() {
		let mut direction = Vec3::ZERO;

		let is_left_key_pressed = keyboard_input.pressed(KeyCode::ArrowLeft)
			|| keyboard_input.pressed(KeyCode::KeyA);

		let is_right_key_pressed = keyboard_input.pressed(KeyCode::ArrowRight)
			|| keyboard_input.pressed(KeyCode::KeyD);

		let is_up_key_pressed = keyboard_input.pressed(KeyCode::ArrowUp)
			|| keyboard_input.pressed(KeyCode::KeyW);

		let is_down_key_pressed = keyboard_input.pressed(KeyCode::ArrowDown)
			|| keyboard_input.pressed(KeyCode::KeyS);

		if is_left_key_pressed {
			direction += Vec3::new(-1.0, 0.0, 0.0);
		}

		if is_right_key_pressed {
			direction += Vec3::new(1.0, 0.0, 0.0);
		}

		if is_up_key_pressed {
			direction += Vec3::new(0.0, 1.0, 0.0);
		}

		if is_down_key_pressed {
			direction += Vec3::new(0.0, -1.0, 0.0);
		}

		if direction.length() > 0.0 {
			direction = direction.normalize();
		}

		let is_shift_pressed = keyboard_input.pressed(KeyCode::ShiftLeft);

		let run_multiplier = if is_shift_pressed {
			PLAYER_RUN_SPEED_MULTIPLIER
		} else {
			1.0
		};

		let new_translation = transform.translation
			+ direction
				* PLAYER_WALK_SPEED
				* run_multiplier * time.delta_seconds();

		let cur_translation = transform.translation;

		let new_movement_direction = if new_translation.x > cur_translation.x
			&& new_translation.y == cur_translation.y
		{
			if !is_shift_pressed {
				Movement::Walk(MoveDirection::Right)
			} else {
				Movement::Run(MoveDirection::Right)
			}
		} else if new_translation.x > cur_translation.x
			&& new_translation.y < cur_translation.y
		{
			if !is_shift_pressed {
				Movement::Walk(MoveDirection::RightDown)
			} else {
				Movement::Run(MoveDirection::RightDown)
			}
		} else if new_translation.x == cur_translation.x
			&& new_translation.y < cur_translation.y
		{
			if !is_shift_pressed {
				Movement::Walk(MoveDirection::Down)
			} else {
				Movement::Run(MoveDirection::Down)
			}
		} else if new_translation.x < cur_translation.x
			&& new_translation.y < cur_translation.y
		{
			if !is_shift_pressed {
				Movement::Walk(MoveDirection::LeftDown)
			} else {
				Movement::Run(MoveDirection::LeftDown)
			}
		} else if new_translation.x < cur_translation.x
			&& new_translation.y == cur_translation.y
		{
			if !is_shift_pressed {
				Movement::Walk(MoveDirection::Left)
			} else {
				Movement::Run(MoveDirection::Left)
			}
		} else if new_translation.x < cur_translation.x
			&& new_translation.y > cur_translation.y
		{
			if !is_shift_pressed {
				Movement::Walk(MoveDirection::LeftUp)
			} else {
				Movement::Run(MoveDirection::LeftUp)
			}
		} else if new_translation.x == cur_translation.x
			&& new_translation.y > cur_translation.y
		{
			if !is_shift_pressed {
				Movement::Walk(MoveDirection::Up)
			} else {
				Movement::Run(MoveDirection::Up)
			}
		} else if new_translation.x > cur_translation.x
			&& new_translation.y > cur_translation.y
		{
			if !is_shift_pressed {
				Movement::Walk(MoveDirection::RightUp)
			} else {
				Movement::Run(MoveDirection::RightUp)
			}
		} else {
			Movement::Idle
		};

		transform.translation = new_translation;
		*movement = new_movement_direction;
	}
}

fn animate_sprite(
	mut query: Query<
		(
			&Movement,
			&mut AnimationTimer,
			&mut Sprite,
			&mut TextureAtlas,
		),
		With<Player>,
	>,
	time: Res<Time>,
) {
	for (movement, mut timer, mut sprite, mut texture_atlas) in &mut query {
		let index_range = match movement {
			Movement::Idle => (0, 0), // TODO replace with real idle image
			Movement::Walk(direction) => match direction {
				MoveDirection::Right
				| MoveDirection::RightDown
				| MoveDirection::RightUp
				| MoveDirection::LeftDown
				| MoveDirection::Left
				| MoveDirection::LeftUp => (
					PLAYER_ASSET_FIRST_SIDE_WALK_INDEX,
					PLAYER_ASSET_LAST_SIDE_WALK_INDEX,
				),
				MoveDirection::Down => (
					PLAYER_ASSET_FIRST_DOWN_WALK_INDEX,
					PLAYER_ASSET_LAST_DOWN_WALK_INDEX,
				),
				MoveDirection::Up => (
					PLAYER_ASSET_FIRST_UP_WALK_INDEX,
					PLAYER_ASSET_LAST_UP_WALK_INDEX,
				),
			},
			Movement::Run(direction) => match direction {
				MoveDirection::Right
				| MoveDirection::RightDown
				| MoveDirection::RightUp
				| MoveDirection::LeftDown
				| MoveDirection::Left
				| MoveDirection::LeftUp => (
					PLAYER_ASSET_FIRST_SIDE_RUN_INDEX,
					PLAYER_ASSET_LAST_SIDE_RUN_INDEX,
				),
				MoveDirection::Down => (
					PLAYER_ASSET_FIRST_DOWN_RUN_INDEX,
					PLAYER_ASSET_LAST_DOWN_RUN_INDEX,
				),
				MoveDirection::Up => (
					PLAYER_ASSET_FIRST_UP_RUN_INDEX,
					PLAYER_ASSET_LAST_UP_RUN_INDEX,
				),
			},
		};

		if texture_atlas.index < index_range.0
			|| index_range.1 < texture_atlas.index
		{
			texture_atlas.index = index_range.0;
		}

		match movement {
			Movement::Idle => texture_atlas.index = index_range.0,
			_ => {
				timer.tick(time.delta());

				if timer.just_finished() {
					texture_atlas.index =
						if texture_atlas.index == index_range.1 {
							index_range.0
						} else {
							texture_atlas.index + 1
						};
				}
			}
		}

		let horizontal_direction = match movement {
			Movement::Walk(direction) | Movement::Run(direction) => {
				match direction {
					MoveDirection::RightUp
					| MoveDirection::Right
					| MoveDirection::RightDown
					| MoveDirection::LeftUp
					| MoveDirection::Left
					| MoveDirection::LeftDown => Some(direction),
					_ => None,
				}
			}
			Movement::Idle => None,
		};

		if let Some(direction) = horizontal_direction {
			if *direction == MoveDirection::Right
				|| *direction == MoveDirection::RightUp
				|| *direction == MoveDirection::RightDown
			{
				sprite.flip_x = false
			} else if *direction == MoveDirection::Left
				|| *direction == MoveDirection::LeftUp
				|| *direction == MoveDirection::LeftDown
			{
				sprite.flip_x = true;
			}
		}
	}
}

fn attach_weapon_to_player(
	mut commands: Commands,
	player_query: Query<Entity, With<Player>>,
	weapon_query: Query<Entity, With<Weapon>>,
) {
	if let (Ok(player), Ok(weapon)) =
		(player_query.get_single(), weapon_query.get_single())
	{
		let player_entity = commands.entity(player).id();
		let weapon_entity = commands.entity(weapon).id();

		commands
			.entity(player_entity)
			.push_children(&[weapon_entity]);
	}
}

fn despawn_weapon(
	keyboard_input: Res<ButtonInput<KeyCode>>,
	mut commands: Commands,
	weapon_query: Query<Entity, With<Weapon>>,
) {
	if let Ok(weapon) = weapon_query.get_single() {
		let weapon_entity = commands.entity(weapon).id();

		if keyboard_input.just_pressed(KeyCode::KeyQ) {
			commands.entity(weapon_entity).despawn_recursive();
		}
	}
}

fn update_tile_map_coords(
	mut query: Query<
		(&GlobalTransform, &mut TileCoord, &mut ChunkCoord),
		With<Player>,
	>,
) {
	if let Ok((transform, mut tile_coords, mut chuck_coords)) =
		query.get_single_mut()
	{
		let (x, y) = convert_position_to_tile_coord(
			transform.translation().x,
			transform.translation().y,
		);

		tile_coords.0.x = x;
		tile_coords.0.y = y;

		let (x, y) = convert_position_to_chunk_coord(
			transform.translation().x,
			transform.translation().y,
		);

		chuck_coords.0.x = x;
		chuck_coords.0.y = y;
	}
}
