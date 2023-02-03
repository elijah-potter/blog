use macroquad::{
    prelude::RED,
    shapes::draw_line,
    window::{screen_height, screen_width},
};
use nalgebra::Vector2;

#[derive(Debug, Clone)]
pub struct Field<T: Clone + Copy> {
    dims: Vector2<usize>,
    points: Vec<T>,
}

impl<T> Field<T>
where
    T: Clone + Copy,
{
    pub fn new_empty(dims: Vector2<usize>, fill_with: T) -> Self {
        Self {
            dims,
            points: vec![fill_with; dims.x * dims.y],
        }
    }

    pub fn iterate_cells<'a>(&'a self) -> impl Iterator<Item = (T, Vector2<usize>)> + 'a {
        self.points.iter().enumerate().map(|(index, value)| {
            let pos = Vector2::new(index % self.dims.x, index / self.dims.x);

            (*value, pos)
        })
    }

    pub fn iterate_cells_mut<'a>(
        &'a mut self,
    ) -> impl Iterator<Item = (&'a mut T, Vector2<usize>)> + 'a {
        self.points.iter_mut().enumerate().map(|(index, value)| {
            let pos = Vector2::new(index % self.dims.x, index / self.dims.x);

            (value, pos)
        })
    }

    pub fn iterate_cell_positions(&self) -> impl Iterator<Item = Vector2<usize>> {
        let dims = self.dims;

        (0..(self.dims.x * self.dims.y))
            .into_iter()
            .map(move |i| Vector2::new(i % dims.x, i / dims.x))
    }

    pub fn get_at(&self, at: Vector2<usize>) -> Option<T> {
        if self.dims.x <= at.x || self.dims.y <= at.y {
            return None;
        }

        Some(self.points[at.y * self.dims.x + at.x])
    }

    pub fn get_at_mut<'a>(&'a mut self, at: Vector2<usize>) -> Option<&'a mut T> {
        if self.dims.x <= at.x || self.dims.y <= at.y {
            return None;
        }

        Some(&mut self.points[at.y * self.dims.x + at.x])
    }

    pub fn is_pos_on_edge(&self, pos: Vector2<usize>) -> bool {
        pos.x == 0 || pos.y == 0 || pos.x == self.dims.x - 1 || pos.y == self.dims.y - 1
    }
}

impl Field<Vector2<f32>> {
    pub fn get_cell_divergence(&self, at: Vector2<usize>) -> Option<Vector2<f32>> {
        let left = self.get_at(at - Vector2::new(1, 0))?;
        let top = self.get_at(at + Vector2::new(0, 1))?;
        let right = self.get_at(at + Vector2::new(1, 0))?;
        let bottom = self.get_at(at - Vector2::new(0, 1))?;

        Some((right - left + bottom - top) / 2.)
    }

    pub fn dot_del(&self) -> Self {
        let mut result = Self::new_empty(self.dims, Vector2::default());

        for pos in self.iterate_cell_positions() {
            *result.get_at_mut(pos).unwrap() = self.get_cell_divergence(pos).unwrap_or_default();
        }

        result
    }

    pub fn grad_del(&self) -> Self {
        let mut result = Self::new_empty(self.dims, Vector2::default());

        for pos in self.iterate_cell_positions() {
            if self.is_pos_on_edge(pos) {
                continue;
            }

            *result.get_at_mut(pos).unwrap() = (self.get_at(pos - Vector2::x()).unwrap()
                + self.get_at(pos + Vector2::x()).unwrap()
                + self.get_at(pos - Vector2::y()).unwrap()
                + self.get_at(pos + Vector2::y()).unwrap())
                / 4.
        }

        result
    }

    pub fn render(&self) {
        let m = Vector2::new(
            screen_width() / self.dims.x as f32,
            screen_height() / self.dims.y as f32,
        );

        for (v, pos) in self.iterate_cells() {
            let pos = pos.cast::<f32>().component_mul(&m);
            let d = pos + v.normalize() * 10.;
            draw_line(pos.x, pos.y, d.x, d.y, 1.0, RED);
        }
    }
}
