use std::{
    f32::{consts::PI, EPSILON},
    io::Cursor,
};

use itertools::Itertools;
use macroquad::prelude::*;
use nalgebra::{Matrix4, Point3, Vector3, Vector4};
use tobj::{load_obj_buf, LoadOptions};

type Vec4 = Vector4<f32>;
type Vec3 = Vector3<f32>;
type Mat4 = Matrix4<f32>;

#[derive(Debug, Clone, Copy)]
enum RenderMode {
    Workbench,
    Depth,
    Solid,
}

impl RenderMode {
    pub fn clicked(&self) -> Self {
        match self {
            Self::Workbench => Self::Depth,
            Self::Depth => Self::Solid,
            Self::Solid => Self::Workbench,
        }
    }
}

struct Mesh {
    pub points: Vec<Vec4>,
    pub indices: Vec<usize>,
}

#[macroquad::main("Rendering")]
async fn main() {
    let mesh = load_model();

    let mut camera_transform = CameraTransform {
        position: Vec4::new(2., 2., 2., 1.),
        rotation: Vec3::new(0., PI / 2., 0.),
    };
    let mut last_mouse: Option<(f32, f32)> = None;
    let mut camera_rotate = true;
    let mut fov_coeff = 1.5;
    let mut render_mode = RenderMode::Workbench;
    let mut sort = true;
    let mut backface_culling = true;

    loop {
        clear_background(Color::from_rgba(50, 50, 50, 255));

        let new_mouse = mouse_position();
        let delta_mouse = match last_mouse {
            Some(last_mouse) => (new_mouse.0 - last_mouse.0, new_mouse.1 - last_mouse.1),
            None => (0., 0.),
        };
        last_mouse = Some(new_mouse);

        if is_mouse_button_pressed(MouseButton::Left) {
            camera_rotate = !camera_rotate;
            set_cursor_grab(!camera_rotate);
        }

        if is_key_pressed(KeyCode::Up) {
            fov_coeff -= 0.1;
        }

        if is_key_pressed(KeyCode::Down) {
            fov_coeff += 0.1;
        }

        if is_key_pressed(KeyCode::R) {
            render_mode = render_mode.clicked();
        }

        if is_key_pressed(KeyCode::O) {
            sort = !sort
        }

        if is_key_pressed(KeyCode::B) {
            backface_culling = !backface_culling
        }

        match camera_rotate {
            true => rotate(&mut camera_transform, delta_mouse),
            false => fov_camera_controller(&mut camera_transform, delta_mouse),
        }

        render(
            &mesh,
            Mat4::identity(),
            camera_transform.to_matrix(),
            fov_coeff,
            render_mode,
            sort,
            backface_culling,
        );

        // Draw FPS counter
        draw_text(&get_fps().to_string(), 10., 35., 50., RED);

        next_frame().await
    }
}

fn render(
    mesh: &Mesh,
    object_transform: Mat4,
    camera_transform: Mat4,
    fov_coeff: f32,
    render_mode: RenderMode,
    sort: bool,
    backface_culling: bool,
) {
    let perspective = Mat4::from_columns(&[
        Vec4::x(),
        Vec4::y(),
        Vec4::w() * (-1. / fov_coeff) + Vec4::z(),
        Vec4::w(),
    ]);

    let to_screen = Mat4::new_translation(
        &(Vec3::x() * screen_width() / 2.0 + Vec3::y() * screen_height() / 2.0),
    ) * Mat4::new_scaling(screen_width() / 2.)
        * perspective
        * Mat4::new_translation(&(Vec3::z() * fov_coeff));

    let to_world = camera_transform.try_inverse().unwrap() * object_transform;

    // Convert the mesh indices to points relative to the camera, then sort them based on their
    // distance.
    let unordered_world_points = mesh.indices.iter().tuples().filter_map(|(a_i, b_i, c_i)| {
        let a = *mesh.points.get(*a_i).unwrap();
        let b = *mesh.points.get(*b_i).unwrap();
        let c = *mesh.points.get(*c_i).unwrap();

        let w_a = to_world * a;
        let w_b = to_world * b;
        let w_c = to_world * c;

        let avg = (w_a + w_b + w_c) / 3.;

        let Some(screen_a) = Point3::from_homogeneous(to_screen * w_a).map(na_to_mq) else{
                return None;
            };
        let Some(screen_b) = Point3::from_homogeneous(to_screen * w_b).map(na_to_mq) else{
                return None;
            };
        let Some(screen_c) = Point3::from_homogeneous(to_screen * w_c).map(na_to_mq) else {
                return None;
            };

        // Calculate the surface normal
        let h_a = Point3::from_homogeneous(w_a).unwrap();
        let h_b = Point3::from_homogeneous(w_b).unwrap();
        let h_c = Point3::from_homogeneous(w_c).unwrap();

        let tri_normal = ((h_b - h_a).normalize())
            .cross(&(h_c - h_a).normalize())
            .normalize();

        // Normal alignment with direction to camera
        let point_avg = Point3::from_homogeneous(avg).unwrap().coords;
        let k = tri_normal.dot(&point_avg.normalize());

        // Only render the face if it's in front of the camera
        // TODO: Frustum culling
        if !(backface_culling && k < 0.)
            && screen_a.z.is_sign_negative()
            && screen_b.z.is_sign_negative()
            && screen_c.z.is_sign_negative()
        {
            let color = match render_mode {
                RenderMode::Workbench => {
                    Color::from_rgba((k * 255.) as u8, (k * 255.) as u8, (k * 255.) as u8, 255)
                }
                RenderMode::Depth => {
                    let mag = point_avg.magnitude();
                    let c = (255. - 100. * mag) as u8;
                    Color::from_rgba(c, c, c, 255)
                }
                RenderMode::Solid => Color::from_rgba(255, 255, 255, 255),
            };
            Some((screen_a, screen_b, screen_c, color, avg))
        } else {
            None
        }
    });

    let to_render = if sort {
        unordered_world_points
            .sorted_unstable_by(|(a, b, c, d, avg_a), (e, f, g, h, avg_b)| {
                avg_a
                    .magnitude_squared()
                    .total_cmp(&avg_b.magnitude_squared())
                    .reverse()
            })
            .collect_vec()
    } else {
        unordered_world_points.collect_vec()
    };

    for (a, b, c, color, avg) in to_render {
        // Color the face based on how directly its facing the camera
        draw_triangle(a.xy(), b.xy(), c.xy(), color);
    }
}

fn na_to_mq(nap: Point3<f32>) -> macroquad::prelude::Vec3 {
    macroquad::prelude::vec3(nap.x, nap.y, nap.z)
}

fn load_model() -> Mesh {
    let load_options = LoadOptions {
        triangulate: true,
        ..Default::default()
    };

    let (models, _) = load_obj_buf(
        &mut Cursor::new(include_bytes!("../monkey.obj")),
        &load_options,
        // We don't do anything with materials yet.
        // Just manually remove them from the file itself.
        |p| unreachable!(),
    )
    .unwrap();

    let model = models.first().unwrap();

    Mesh {
        points: model
            .mesh
            .positions
            .iter()
            .tuples()
            .map(|(a, b, c)| Vec4::new(*a, *b, *c, 1.))
            .collect(),
        indices: model
            .mesh
            .indices
            .iter()
            .rev()
            .map(|v| *v as usize)
            .collect(),
    }
}

struct CameraTransform {
    position: Vec4,
    rotation: Vec3,
}

impl CameraTransform {
    pub fn to_matrix(&self) -> Mat4 {
        Mat4::new_translation(
            &Point3::from_homogeneous(self.position)
                .unwrap()
                .to_homogeneous()
                .xyz(),
        ) * Mat4::new_rotation(Vec3::y() * self.rotation.y)
            * Mat4::new_rotation(Vec3::x() * self.rotation.x)
            * Mat4::new_rotation(Vec3::z() * self.rotation.z)
    }
}

fn fov_camera_controller(camera: &mut CameraTransform, delta_mouse: (f32, f32)) {
    let current_transform = camera.to_matrix();

    let mut d = 0.01;

    if is_key_down(KeyCode::LeftShift) {
        d *= 3.;
    }

    if is_key_down(KeyCode::W) {
        camera.position += current_transform * (Vec4::z() * d);
    }

    if is_key_down(KeyCode::S) {
        camera.position += current_transform * (Vec4::z() * -d);
    }

    if is_key_down(KeyCode::A) {
        camera.position += current_transform * (Vec4::x() * d);
    }

    if is_key_down(KeyCode::D) {
        camera.position += current_transform * (Vec4::x() * -d);
    }

    if is_key_down(KeyCode::Escape) {
        return;
    }

    let v = 0.001;

    camera.rotation.x += delta_mouse.1 * v;
    camera.rotation.y += delta_mouse.0 * -v;
}

fn rotate(camera: &mut CameraTransform, delta_mouse: (f32, f32)) {
    let t = get_time() as f32;

    let radius = 3.0;

    camera.position.x = t.cos() * radius;
    camera.position.y = 0.;
    camera.position.z = t.sin() * radius;

    camera.rotation.y = t * -1. - PI / 2.;
}
