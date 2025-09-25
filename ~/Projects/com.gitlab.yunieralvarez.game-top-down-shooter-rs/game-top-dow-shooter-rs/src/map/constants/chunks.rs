use super::tiles::TILE_SIZE_IN_PX;

/// The chunk size in px.
pub const CHUCK_SIZE_IN_PX: f32 = TILE_SIZE_IN_PX * CHUCK_SIZE_IN_TILES as f32;
/// The chunk size in amount of tiles.
pub const CHUCK_SIZE_IN_TILES: usize = 8;
