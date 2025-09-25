#![allow(clippy::type_complexity)]

use crate::{debug::DebugPlugin, game::GamePlugin};
use bevy::prelude::*;

mod animation;
mod camera;
mod cursor;
mod debug;
mod ecs;
mod game;
mod map;
mod movement;
mod player;
mod render;
mod weapon;
mod noise;

fn main() {
	let mut app = App::new();

	app.add_plugins(DefaultPlugins.set(ImagePlugin::default_nearest()))
		.add_plugins(GamePlugin);

	#[cfg(debug_assertions)]
	{
		app.add_plugins(DebugPlugin);
	}

	app.run();
}
