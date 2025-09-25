use crate::ecs;

/// Event for when a Chunk spawn.
#[derive(ecs::event::Event)]
pub struct ChunkSpawned {
	/// Entity Id of the Chunk Entity.
	pub chunk_entity_id: ecs::entity::Entity, // TODO  refactor to this this instead, ex: get the entity with this id, then get the pos
	/// Chunk's x Coord in the Tile Coord Format.
	pub chunk_coord_in_tile_coord_x: f32,
	/// Chunk's y Coord in the Tile Coord Format.
	pub chunk_coord_in_tile_coord_y: f32,
}
