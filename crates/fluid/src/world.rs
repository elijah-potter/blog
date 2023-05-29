use macroquad::{
    prelude::{Color, RED},
    rand,
    shapes::{draw_line, draw_rectangle},
    window::{screen_height, screen_width},
};
use nalgebra::{Matrix2, Vector, Vector2};

use crate::field::Field;

#[derive(Debug, Clone)]
pub struct World {
    dims: Vector2<usize>,
    density: Field<f32>,
    velocity: Field<Vector2<f32>>,
}

impl World {
    pub fn new_empty(dims: Vector2<usize>) -> Self {
        Self {
            dims,
            density: Field::new_empty(dims, 0.),
            velocity: Field::new_empty(dims, Vector2::zeros()),
        }
    }

    pub fn new_dot(dims: Vector2<usize>, radius: f32) -> Self {
        let mut world = Self::new_empty(dims);
        let center = dims.cast() / 2.;

        let rotation = Matrix2::new(0., 1., -1., 0.);

        for (density, velocity, pos) in world.iterate_cells_mut() {
            // NOTE: Had a lot of trouble here because negative values are not visible (and this
            // bit of code _was_ making them).
            let mut v = pos.cast::<f32>() - center;

            if v.magnitude() == 0. {
                v = Vector2::x()
            }

            *density = (radius - v.magnitude()).clamp(0.0, 1.0);
            *velocity = rotation * v.normalize();
        }

        world
    }

    pub fn dims(&self) -> Vector2<usize> {
        self.dims
    }

    pub fn randomize_velocities(&mut self, mag: f32) {
        for (density, velocity, _) in self.iterate_cells_mut() {
            *velocity = Vector2::new(rand::gen_range(-1.0, 1.0), rand::gen_range(-1.0, 1.0))
                .normalize()
                * mag;
        }

        self.clear_divergence();
    }

    /// Iterates through the world, summing the total density.
    pub fn total_mass(&self) -> f32 {
        self.density
            .iterate_cells()
            .map(|(density, _)| density)
            .sum()
    }

    pub fn get_cell_at(&self, at: Vector2<usize>) -> Option<Cell> {
        Some(Cell {
            density: self.density.get_at(at)?,
            velocity: self.velocity.get_at(at)?,
        })
    }

    pub fn get_cell_at_mut(&mut self, at: Vector2<usize>) -> Option<CellRef> {
        Some(CellRef {
            density: self.density.get_at_mut(at)?,
            velocity: self.velocity.get_at_mut(at)?,
        })
    }

    pub fn iterate_cells<'a>(
        &'a self,
    ) -> impl Iterator<Item = (f32, Vector2<f32>, Vector2<usize>)> + 'a {
        self.density
            .iterate_cells()
            .zip(self.velocity.iterate_cells())
            .map(|((density, pos), (velocity, _))| (density, velocity, pos))
    }

    pub fn iterate_cells_mut<'a>(
        &'a mut self,
    ) -> impl Iterator<Item = (&mut f32, &mut Vector2<f32>, Vector2<usize>)> + 'a {
        self.density
            .iterate_cells_mut()
            .zip(self.velocity.iterate_cells_mut())
            .map(|((density, pos), (velocity, _))| (density, velocity, pos))
    }

    pub fn render(&self, show_vectors: bool) {
        let m = Vector2::new(
            screen_width() / self.dims.x as f32,
            screen_height() / self.dims.y as f32,
        );

        for (density, velocity, pos) in self.iterate_cells() {
            let pos = pos.cast::<f32>().component_mul(&m);

            let l = (density * 255.) as u8;

            draw_rectangle(pos.x, pos.y, m.x, m.y, Color::from_rgba(l, l, l, 255));
            if show_vectors {
                let d = pos + velocity.normalize() * 10.;
                draw_line(pos.x, pos.y, d.x, d.y, 1.0, RED);
            }
        }
    }

    pub fn diffuse(&mut self, delta_time: f32, diffusion_rate: f32) {
        let a = diffusion_rate * delta_time;

        if a == 0. {
            return;
        }

        let unchanged = self.clone();

        for _ in 0..20 {
            for x in 0..self.dims.x {
                for y in 0..self.dims.y {
                    let pos = Vector2::new(x, y);

                    *self.density.get_at_mut(pos).unwrap() = {
                        let center = unchanged.density.get_at(pos).unwrap();
                        let left = self
                            .density
                            .get_at(pos - Vector2::new(1, 0))
                            .unwrap_or_default();
                        let top = self
                            .density
                            .get_at(pos - Vector2::new(0, 1))
                            .unwrap_or_default();
                        let right = self
                            .density
                            .get_at(pos + Vector2::new(1, 0))
                            .unwrap_or_default();
                        let bottom = self
                            .density
                            .get_at(pos + Vector2::new(0, 1))
                            .unwrap_or_default();

                        (center + a * (left + top + right + bottom)) / (1. + 4. * a)
                    };
                }
            }
        }
    }

    pub fn advect(&mut self, delta_time: f32) {
        let unchanged = self.clone();
        self.clear_density();

        for x in 0..self.dims.x {
            for y in 0..self.dims.y {
                let pos = Vector2::new(x as f32, y as f32);
                let pos_usize = Vector2::new(x, y);

                let cell = self.get_cell_at_mut(pos_usize).unwrap();

                let orig_pos_center = pos - *cell.velocity * delta_time;

                let top_left = unchanged
                    .get_cell_at(Vector2::new(
                        orig_pos_center.x.floor() as usize,
                        orig_pos_center.y.floor() as usize,
                    ))
                    .unwrap_or_default();
                let top_right = unchanged
                    .get_cell_at(Vector2::new(
                        orig_pos_center.x.ceil() as usize,
                        orig_pos_center.y.floor() as usize,
                    ))
                    .unwrap_or_default();
                let bottom_right = unchanged
                    .get_cell_at(Vector2::new(
                        orig_pos_center.x.ceil() as usize,
                        orig_pos_center.y.ceil() as usize,
                    ))
                    .unwrap_or_default();
                let bottom_left = unchanged
                    .get_cell_at(Vector2::new(
                        orig_pos_center.x.floor() as usize,
                        orig_pos_center.y.ceil() as usize,
                    ))
                    .unwrap_or_default();

                fn lerp(v0: f32, v1: f32, t: f32) -> f32 {
                    (1. - t) * v0 + t * v1
                }

                fn lerp_vector(v0: Vector2<f32>, v1: Vector2<f32>, t: f32) -> Vector2<f32> {
                    (1. - t) * v0 + t * v1
                }

                let d = orig_pos_center.apply_into(|v| *v = v.fract());

                let z_1 = lerp(top_left.density, top_right.density, d.x);
                let z_2 = lerp(bottom_left.density, bottom_right.density, d.x);
                let z_3 = lerp(z_1, z_2, d.y);

                let v_1 = lerp_vector(top_left.velocity, top_right.velocity, d.x);
                let v_2 = lerp_vector(bottom_left.velocity, bottom_right.velocity, d.x);
                let v_3 = lerp_vector(v_1, v_2, d.y);

                *cell.density = z_3;
                *cell.velocity = v_3;
            }
        }
    }

    pub fn clear_divergence(&mut self) {
        let del = self.velocity.dot_del();

        let mut field = Field::new_empty(self.dims, Vector2::zeros());

        // Because Gauss-Sidel
        for _ in 0..20 {
            for pos in self.velocity.iterate_cell_positions() {
                if self.velocity.is_pos_on_edge(pos) {
                    continue;
                }

                let left = self.get_cell_at(pos - Vector2::y()).unwrap().velocity;
                let top = self.get_cell_at(pos + Vector2::y()).unwrap().velocity;
                let right = self.get_cell_at(pos + Vector2::x()).unwrap().velocity;
                let bottom = self.get_cell_at(pos - Vector2::x()).unwrap().velocity;

                let d = del.get_at(pos).unwrap();

                *field.get_at_mut(pos).unwrap() = (top + left + right + bottom - d) / 4.
            }
        }

        let grad = field.grad_del();

        for (velocity, pos) in self.velocity.iterate_cells_mut() {
            *velocity -= grad.get_at(pos).unwrap() * 0.1;
        }
    }

    /// Sets the edges to ['Cell::default']
    pub fn reset_edges(&mut self) {
        for x in 0..self.dims.x {
            let top = self.get_cell_at_mut(Vector2::new(x, 0)).unwrap();
            *top.density = 0.;
            *top.velocity = Vector2::zeros();

            let bottom = self
                .get_cell_at_mut(Vector2::new(x, self.dims.y - 1))
                .unwrap();
            *bottom.density = 0.;
            *bottom.velocity = Vector2::zeros();
        }

        for y in 0..self.dims.y {
            let right = self.get_cell_at_mut(Vector2::new(0, y)).unwrap();
            *right.density = 0.;
            *right.velocity = Vector2::zeros();

            let left = self
                .get_cell_at_mut(Vector2::new(self.dims.x - 1, y))
                .unwrap();
            *left.density = 0.;
            *left.velocity = Vector2::zeros();
        }
    }

    fn clear_density(&mut self) {
        for (density, _) in self.density.iterate_cells_mut() {
            *density = 0.
        }
    }
}

#[derive(Debug, Clone, Copy, Default)]
pub struct Cell {
    pub density: f32,
    pub velocity: Vector2<f32>,
}

#[derive(Debug)]
pub struct CellRef<'a> {
    pub density: &'a mut f32,
    pub velocity: &'a mut Vector2<f32>,
}
