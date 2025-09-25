use bevy::{prelude::*, utils::HashSet};

use super::constants;

/// Convert position to tile coordinates.
pub fn convert_position_to_tile_coord(x: f32, y: f32) -> (f32, f32) {
	(
		(x / constants::tiles::TILE_SIZE_IN_PX).floor(),
		(y / constants::tiles::TILE_SIZE_IN_PX).floor(),
	)
}

/// Convert position to chunk coordinates.
pub fn convert_position_to_chunk_coord(x: f32, y: f32) -> (f32, f32) {
	(
		(x / constants::chunks::CHUCK_SIZE_IN_PX).floor(),
		(y / constants::chunks::CHUCK_SIZE_IN_PX).floor(),
	)
}

/// Convert chunk coordinates To tile coordinates.
pub fn convert_chunk_coord_to_tile_coord(x: f32, y: f32) -> (f32, f32) {
	(
		(x * constants::chunks::CHUCK_SIZE_IN_TILES as f32).floor(),
		(y * constants::chunks::CHUCK_SIZE_IN_TILES as f32).floor(),
	)
}

/// Convert from tile coord to position.
pub fn convert_from_tile_coord_to_position(x: f32, y: f32) -> (f32, f32) {
	(
		(x * constants::tiles::TILE_SIZE_IN_PX).floor(),
		(y * constants::tiles::TILE_SIZE_IN_PX).floor(),
	)
}

/// Convert chunk Coord to position.
pub fn convert_chunk_coord_to_position(x: f32, y: f32) -> (f32, f32) {
	let (chunk_coord_to_tile_coord_x, chunk_coord_to_tile_coord_y) =
		convert_chunk_coord_to_tile_coord(x, y);

	(
		(chunk_coord_to_tile_coord_x * constants::tiles::TILE_SIZE_IN_PX)
			.floor(),
		(chunk_coord_to_tile_coord_y * constants::tiles::TILE_SIZE_IN_PX)
			.floor(),
	)
}

/// Get all whole number points within a radius from a Vec2 point.
pub fn get_points_within_radius(
	center: Vec2,
	radius: f32,
) -> HashSet<(i32, i32)> {
	let mut points = HashSet::new();
	let radius_squared = radius * radius;

	// Determine the bounds for the search area
	let min_x = (center.x - radius).floor() as i32;
	let max_x = (center.x + radius).ceil() as i32;
	let min_y = (center.y - radius).floor() as i32;
	let max_y = (center.y + radius).ceil() as i32;

	for x in min_x..=max_x {
		for y in min_y..=max_y {
			let point = Vec2::new(x as f32, y as f32);

			if center.distance_squared(point) <= radius_squared {
				points.insert((x, y));
			}
		}
	}

	points
}

#[cfg(test)]
mod test {
	use super::*;

	mod convert_transform_translation_to_chunk_coord {
		use super::*;

		#[test]
		fn positive() {
			let (res_x, res_y) = convert_position_to_chunk_coord(128.0, 128.0);

			assert_eq!(res_x, 2.0);
			assert_eq!(res_y, 2.0);
		}

		#[test]
		fn negative() {
			let (res_x, res_y) =
				convert_position_to_chunk_coord(-128.0, -128.0);

			assert_eq!(res_x, -2.0);
			assert_eq!(res_y, -2.0);
		}
	}

	mod convert_chunk_coord_to_tile_coord {
		use super::*;

		#[test]
		fn positive() {
			let (res_x, res_y) = convert_chunk_coord_to_tile_coord(2.0, 2.0);
			assert_eq!(res_x, 8.0);
			assert_eq!(res_y, 8.0);
		}

		#[test]
		fn negative() {
			let (res_x, res_y) = convert_chunk_coord_to_tile_coord(-2.0, -2.0);
			assert_eq!(res_x, -8.0);
			assert_eq!(res_y, -8.0);
		}
	}

	mod convert_chunk_coord_to_pos {
		use super::*;

		#[test]
		fn positive() {
			let (res_x, res_y) = convert_chunk_coord_to_position(2.0, 2.0);
			assert_eq!(res_x, 128.0);
			assert_eq!(res_y, 128.0);
		}

		#[test]
		fn negative() {
			let (res_x, res_y) = convert_chunk_coord_to_position(-2.0, -2.0);
			assert_eq!(res_x, -128.0);
			assert_eq!(res_y, -128.0);
		}
	}
}
