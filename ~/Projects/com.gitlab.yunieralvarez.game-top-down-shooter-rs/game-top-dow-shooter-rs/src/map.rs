mod constants;
mod events;
pub mod helpers;

use crate::{
	noise::{helpers::get_noise_point_value, NoiseMap, NoiseValue},
	player::{self, Player},
	render::{self, constants::TERRAIN_RENDER_Z_INDEX},
};
use bevy::{log, prelude::*};
use constants::{
	assets::{
		GRASS_GRID_COLUMNS, GRASS_GRID_ROWS, GRASS_PATH, SAND_GRID_COLUMNS,
		SAND_GRID_ROWS, SAND_PATH, WATER_GRID_COLUMNS, WATER_GRID_ROWS,
		WATER_PATH,
	},
	chunks::CHUCK_SIZE_IN_TILES,
	tiles::TILE_SIZE_IN_PX,
	SCALE,
};
use helpers::{
	convert_chunk_coord_to_position, convert_chunk_coord_to_tile_coord,
	convert_from_tile_coord_to_position,
};

pub struct MapPlugin;

impl Plugin for MapPlugin {
	fn build(&self, app: &mut App) {
		app.register_type::<Map>()
			.register_type::<TileCoord>()
			.register_type::<ChunkCoord>()
			.register_type::<NearChunkCoords>()
			.register_type::<Tile>()
			.register_type::<TileType>()
			.add_event::<events::ChunkSpawned>()
			.add_systems(Startup, add_map)
			.add_systems(
				Update,
				(
					update_near_chunk_coords,
					add_chunks,
					add_tiles_to_chunks,
					despawn_chunks,
				)
					.chain(),
			);
	}
}

#[derive(Bundle)]
struct MapBundle {
	marker: Map,
	name: Name,
	transform: TransformBundle,
	visibility: VisibilityBundle,
}

#[derive(Component, Reflect)]
pub struct Map;

#[derive(Component, Reflect)]
pub struct TileCoord(pub Vec2);

#[derive(Component, Copy, Clone, Reflect)]
pub struct ChunkCoord(pub Vec2);

#[derive(Component, Reflect)]
pub struct NearChunkCoords(pub Vec<Vec2>);

#[derive(Bundle)]
struct ChunkBundle {
	marker: Chunk,
	name: Name,
	chunk_coord: ChunkCoord,
	transform: TransformBundle,
	visibility: VisibilityBundle,
}

#[derive(Component, Reflect)]
struct Chunk {}

/// Tile bundle.
#[derive(Bundle)]
struct TileBundle {
	/// Global tile coord of the tile, relative to the center of the [`Map`] marked entity.
	global_tile_coord: TileCoord,
	/// Marker component.
	marker: Tile,
	/// Name component.
	name: Name,
	/// Noise Value.
	noise_value: NoiseValue,
	/// Tile sprite sheet bundle.
	sprite_sheet_bundle: SpriteSheetBundle,
	/// Tile type.
	tile_type: TileType,
}

#[derive(Component, Reflect)]
struct Tile {}

/// The type of terrain on a tile.
#[derive(Component, Reflect)]
enum TileType {
	Grass,
	Sand,
	Water,
}

fn update_near_chunk_coords(
	mut query: Query<(&ChunkCoord, &mut NearChunkCoords), With<player::Player>>,
) {
	if let Ok((chunk_coord, mut near_chunk_coords)) = query.get_single_mut() {
		let chunk_points = helpers::get_points_within_radius(
			chunk_coord.0,
			render::constants::CHUNKS_RENDER_RADIUS,
		);

		near_chunk_coords.0.clear();

		for (chunk_coord_x, chunk_coord_y) in chunk_points {
			near_chunk_coords
				.0
				.push(Vec2::new(chunk_coord_x as f32, chunk_coord_y as f32))
		}
	}
}

/// Add map to the world.
///
/// Spawn the [`Map`] marked entity on the word.
/// This is use as the origin of the chunk and tiling terrain systems.
fn add_map(mut commands: Commands) {
	let map_bundle = MapBundle {
		marker: Map {},
		name: Name::new("Map"),
		transform: TransformBundle {
			local: Transform::from_xyz(
				0.0,
				0.0,
				render::constants::TERRAIN_RENDER_Z_INDEX,
			),
			..default()
		},
		visibility: VisibilityBundle {
			visibility: Visibility::Visible,
			..default()
		},
	};

	commands.spawn(map_bundle);
}

fn add_chunks(
	chunk_query: Query<&ChunkCoord, With<Chunk>>,
	map_query: Query<Entity, With<Map>>,
	mut chunk_spawned_event_writer: EventWriter<events::ChunkSpawned>,
	mut commands: Commands,
	mut player_query: Query<&mut NearChunkCoords, With<player::Player>>,
) {
	let map_entity = map_query.single();
	let mut cur_chunk_coords = Vec::new();

	for chunk_coord in chunk_query.iter() {
		cur_chunk_coords.push((chunk_coord.0.x, chunk_coord.0.y));
	}

	if let Ok(near_chunk_coords) = player_query.get_single_mut() {
		for near_chunk_coord in &near_chunk_coords.0 {
			if !cur_chunk_coords
				.contains(&(near_chunk_coord.x, near_chunk_coord.y))
			{
				let (chunk_coord_in_tile_coord_x, chunk_coord_in_tile_coord_y) =
					convert_chunk_coord_to_tile_coord(
						near_chunk_coord.x,
						near_chunk_coord.y,
					);

				let (near_chunk_pos_x, near_chunk_pos_y) =
					convert_chunk_coord_to_position(
						near_chunk_coord.x,
						near_chunk_coord.y,
					);

				let chunk_bundle = ChunkBundle {
					chunk_coord: ChunkCoord(Vec2::new(
						// TODO there is a transform, do i need this?
						near_chunk_coord.x,
						near_chunk_coord.y,
					)),
					marker: Chunk {},
					name: Name::new("Chunk"),
					transform: TransformBundle {
						local: Transform::from_xyz(
							near_chunk_pos_x,
							near_chunk_pos_y,
							TERRAIN_RENDER_Z_INDEX,
						),
						..default()
					},
					visibility: VisibilityBundle {
						visibility: Visibility::Visible,
						..default()
					},
				};

				commands.entity(map_entity).with_children(
					|map_child_builder| {
						let chunk_entity =
							map_child_builder.spawn(chunk_bundle).id();

						chunk_spawned_event_writer.send(events::ChunkSpawned {
							chunk_entity_id: chunk_entity,
							chunk_coord_in_tile_coord_x,
							chunk_coord_in_tile_coord_y,
						});
					},
				);
			}
		}
	}
}

/// Add tiles to chunk.
///
/// This system listen to [`ChunkSpawned`] events.
///
/// 1. Get the [`Chunk`]'s [`TileCoord`].
/// 2. Traverse the [`Chunk`] spawning [`Tile`] marked entities.
fn add_tiles_to_chunks(
	asset_server: Res<AssetServer>,
	noise_map: Res<NoiseMap>,
	mut atlases: ResMut<Assets<TextureAtlasLayout>>,
	mut chunk_spawned_event_reader: EventReader<events::ChunkSpawned>,
	mut commands: Commands,
) {
	if !chunk_spawned_event_reader.is_empty() {
		// let texture_handle = asset_server.load(SAND_PATH);

		// let layout = TextureAtlasLayout::from_grid(
		// 	Vec2 {
		// 		x: TILE_SIZE_IN_PX,
		// 		y: TILE_SIZE_IN_PX,
		// 	},
		// 	SAND_GRID_COLUMNS,
		// 	SAND_GRID_ROWS,
		// 	None,
		// 	None,
		// );

		// let handle = atlases.add(layout);

		for chunk_spawned_event in chunk_spawned_event_reader.read() {
			for position_unaware_coord_x in 0..CHUCK_SIZE_IN_TILES {
				for position_unaware_coord_y in 0..CHUCK_SIZE_IN_TILES {
					let new_tile_coord_x = position_unaware_coord_x as f32;
					let new_tile_coord_y = position_unaware_coord_y as f32;

					let new_tile_global_coord_x = (new_tile_coord_x
						+ chunk_spawned_event.chunk_coord_in_tile_coord_x)
						as f64;

					let new_tile_global_coord_y = (new_tile_coord_y
						+ chunk_spawned_event.chunk_coord_in_tile_coord_y)
						as f64;

					let noise_map_point_x = new_tile_global_coord_x * SCALE;
					let noise_map_point_y = new_tile_global_coord_y * SCALE;

					let noise_map_point_value = get_noise_point_value(
						&noise_map.noise,
						noise_map_point_x,
						noise_map_point_y,
					);

					log::info!(
						"value: {}, x: {}, y: {}",
						noise_map_point_value,
						noise_map_point_x,
						noise_map_point_y,
					);

					let tile_map_type = if noise_map_point_value > 0.3 {
						TileType::Grass
					} else if noise_map_point_value > 0.25 {
						TileType::Sand
					} else {
						TileType::Water
					};

					let (asset_path, grid_columns, grid_rows) =
						match tile_map_type {
							TileType::Grass => (
								GRASS_PATH,
								GRASS_GRID_COLUMNS,
								GRASS_GRID_ROWS,
							),
							TileType::Sand => {
								(SAND_PATH, SAND_GRID_COLUMNS, SAND_GRID_ROWS)
							}
							TileType::Water => (
								WATER_PATH,
								WATER_GRID_COLUMNS,
								WATER_GRID_ROWS,
							),
						};

					let texture_handle = asset_server.load(asset_path);

					let layout = TextureAtlasLayout::from_grid(
						Vec2 {
							x: TILE_SIZE_IN_PX,
							y: TILE_SIZE_IN_PX,
						},
						grid_columns,
						grid_rows,
						None,
						None,
					);

					let handle = atlases.add(layout);

					let (new_tile_pos_x, new_tile_pos_y) =
						convert_from_tile_coord_to_position(
							new_tile_coord_x,
							new_tile_coord_y,
						);

					let tile_bundle = TileBundle {
						marker: Tile {},
						noise_value: NoiseValue(noise_map_point_value),
						name: Name::new("Tile"),
						tile_type: tile_map_type,
						sprite_sheet_bundle: SpriteSheetBundle {
							atlas: TextureAtlas {
								layout: handle,
								index: 0,
							},
							texture: texture_handle,
							transform: Transform {
								translation: Vec3::new(
									new_tile_pos_x,
									new_tile_pos_y,
									TERRAIN_RENDER_Z_INDEX,
								),
								..default()
							},
							..default()
						},
						global_tile_coord: TileCoord(Vec2::ZERO), // TODO update this
					};

					commands
						.entity(chunk_spawned_event.chunk_entity_id)
						.with_children(|chunk_entity_child_builder| {
							chunk_entity_child_builder.spawn(tile_bundle);
						});
				}
			}
		}
	}
}

fn despawn_chunks(
	chunks_query: Query<(Entity, &ChunkCoord), With<Chunk>>,
	mut commands: Commands,
	player_query: Query<&mut NearChunkCoords, With<Player>>,
) {
	if let Ok(player_near_chunk_coords) = player_query.get_single() {
		for (chunk_entity, chunk_coord) in chunks_query.iter() {
			if !player_near_chunk_coords.0.contains(&chunk_coord.0) {
				commands.entity(chunk_entity).despawn_recursive();
			}
		}
	}
}
