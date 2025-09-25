use bevy::{prelude::*, sprite::Anchor};

use crate::{
	animation::{AnimationIndices, AnimationTimer},
	cursor::CursorCoords,
};

pub const WEAPON_ASSET_ANIMATION_INDICES_FIRST: usize = 0;
pub const WEAPON_ASSET_ANIMATION_INDICES_LAST: usize = 5;
pub const WEAPON_ASSET_COLUMNS: usize = 6;
pub const WEAPON_ASSET_PATH: &str = "weapon.png";
pub const WEAPON_ASSET_ROWS: usize = 1;
pub const WEAPON_ASSET_TILE_SIZE_X: f32 = 10.0;
pub const WEAPON_ASSET_TILE_SIZE_Y: f32 = 10.0;

pub struct WeaponPlugin;

impl Plugin for WeaponPlugin {
	fn build(&self, app: &mut App) {
		app.add_systems(Startup, apply_anchor_to_weapon)
			.add_systems(Update, rotate_weapon_to_mouse_coords);
	}
}

#[derive(Bundle)]
pub struct WeaponBundle {
	pub animation_indices: AnimationIndices,
	pub animation_timer: AnimationTimer,
	pub marker: Weapon,
	pub name: Name,
	pub sprite_sheet_bundle: SpriteSheetBundle,
}

#[derive(Component)]
pub struct Weapon {}

pub fn spawn_weapon(
	asset_server: Res<AssetServer>,
	mut atlases: ResMut<Assets<TextureAtlasLayout>>,
	mut commands: Commands,
) {
	let texture_handle = asset_server.load(WEAPON_ASSET_PATH);

	let layout = TextureAtlasLayout::from_grid(
		Vec2 {
			x: WEAPON_ASSET_TILE_SIZE_X,
			y: WEAPON_ASSET_TILE_SIZE_Y,
		},
		WEAPON_ASSET_COLUMNS,
		WEAPON_ASSET_ROWS,
		None,
		None,
	);

	let handle = atlases.add(layout);

	let weapon_bundle = WeaponBundle {
		animation_indices: AnimationIndices {
			first: WEAPON_ASSET_ANIMATION_INDICES_FIRST,
			last: WEAPON_ASSET_ANIMATION_INDICES_LAST,
		},
		animation_timer: AnimationTimer(Timer::from_seconds(
			0.1,
			TimerMode::Repeating,
		)),
		marker: Weapon {},
		name: Name::new("Weapon"),
		sprite_sheet_bundle: SpriteSheetBundle {
			sprite: Sprite::default(),
			atlas: TextureAtlas {
				layout: handle,
				index: 0,
			},
			texture: texture_handle,
			transform: Transform::from_scale(Vec3::splat(6.0)),
			..default()
		},
	};

	commands.spawn(weapon_bundle);
}

fn apply_anchor_to_weapon(
	cursor_coords: Res<CursorCoords>,
	mut query: Query<&mut Sprite, With<Weapon>>,
) {
	if cursor_coords.0.x != 0.0 && cursor_coords.0.y != 0.0 {
		for mut sprite in query.iter_mut() {
			sprite.anchor = Anchor::Custom(Vec2 { x: -0.5, y: 0.0 });
		}
	}
}

fn rotate_weapon_to_mouse_coords(
	cursor_coords: Res<CursorCoords>,
	mut query: Query<
		(&mut Transform, &GlobalTransform, &mut Sprite),
		With<Weapon>,
	>,
) {
	if cursor_coords.0.x != 0.0 && cursor_coords.0.y != 0.0 {
		for (mut transform, global_transform, mut sprite) in query.iter_mut() {
			let direction = (cursor_coords.0
				- global_transform.translation().truncate())
			.normalize();

			let angle = direction.y.atan2(direction.x);
			transform.rotation = Quat::from_rotation_z(angle);

			sprite.flip_y =
				cursor_coords.0.x < global_transform.translation().x;

			sprite.anchor = Anchor::Custom(Vec2 { x: -0.5, y: 0.0 });
		}
	}
}
