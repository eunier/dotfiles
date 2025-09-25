use bevy::prelude::*;

pub struct MovementPlugin;

impl Plugin for MovementPlugin {
	fn build(&self, app: &mut App) {
		app.register_type::<Movement>()
			.register_type::<MoveDirection>();
	}
}

#[derive(Component, Debug, Reflect, PartialEq)]
pub enum Movement {
	Idle,
	Walk(MoveDirection),
	Run(MoveDirection),
}

#[derive(Component, Debug, Reflect, PartialEq)]
pub enum MoveDirection {
	Right,
	RightDown,
	Down,
	LeftDown,
	Left,
	LeftUp,
	Up,
	RightUp,
}
