#[macro_use]
extern crate rocket;

use std::*;

#[get("/")]
fn index() -> &'static str {
    "Hello, Rust Web Server!"
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index])
}