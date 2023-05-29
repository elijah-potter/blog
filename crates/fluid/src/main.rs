mod field;
mod world;

use macroquad::prelude::*;
use nalgebra::Vector2;
use world::World;

fn window_conf() -> Conf {
    Conf {
        window_title: "Fluid Simulation".to_owned(),
        fullscreen: false,
        window_width: 500,
        window_height: 500,
        ..Default::default()
    }
}

#[macroquad::main("window_conf")]
async fn main() {
    // Setup world
    let size = 200;

    let mut world = World::new_dot(
        Vector2::new(
            size,
            (screen_height() / screen_width() * size as f32) as usize,
        ),
        size as f32 / 4.,
    );
    world.randomize_velocities(100.);

    let mut show_vectors = false;
    let mut last_mouse = Vector2::new(mouse_position().0, mouse_position().1);

    loop {
        world.render(show_vectors);

        let delta_time = get_frame_time();

        world.advect(delta_time);
        world.reset_edges();
        world.diffuse(delta_time, 1.);
        //world.clear_divergence();

        dbg!(world.total_mass());

        if is_key_pressed(KeyCode::V) {
            show_vectors = !show_vectors;
        }

        if is_key_pressed(KeyCode::Space) {
            world.randomize_velocities(100.);
        }

        let mouse = Vector2::new(mouse_position().0, mouse_position().1);
        let m = Vector2::new(
            screen_width() / world.dims().x as f32,
            screen_height() / world.dims().y as f32,
        );
        let world_mouse = mouse.component_div(&m);
        let delta_mouse = mouse - last_mouse;
        let delta_world_mouse = delta_mouse.component_div(&m);
        for (density, velocity, pos) in world.iterate_cells_mut() {
            if (pos.cast::<f32>() - world_mouse).magnitude() < 10. {
                *velocity += delta_world_mouse;
            }
        }

        last_mouse = mouse;
        next_frame().await
    }
}
