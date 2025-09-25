use bevy::{
	diagnostic::{
		EntityCountDiagnosticsPlugin, FrameTimeDiagnosticsPlugin,
		SystemInformationDiagnosticsPlugin,
	},
	prelude::*,
};
use bevy_inspector_egui::quick::WorldInspectorPlugin;
use iyes_perf_ui::{PerfUiCompleteBundle, PerfUiPlugin};

pub struct DebugPlugin;

impl Plugin for DebugPlugin {
	fn build(&self, app: &mut App) {
		app.add_plugins((
			EntityCountDiagnosticsPlugin,
			FrameTimeDiagnosticsPlugin,
			PerfUiPlugin,
			SystemInformationDiagnosticsPlugin,
			WorldInspectorPlugin::new(),
		))
		.add_systems(Startup, show_pref_ui);
	}
}

fn show_pref_ui(mut commands: Commands) {
	commands.spawn(PerfUiCompleteBundle::default());
}
