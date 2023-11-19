#[macro_use]
extern crate rocket;
use rocket::fs::{NamedFile, FileServer};

#[get("/")]
async fn index() -> Option<NamedFile> {
    let web_path = std::env::current_dir().unwrap().join("src").join("web");
    let index_path = web_path.join("index.html");
    if web_path.exists() {
        Some(NamedFile::open(index_path).await.ok()?)
    } else {
        None
    }
}


#[launch]
fn rocket() -> _ {
    rocket::build()
    .mount("/", routes![index])
    .mount("/", FileServer::from("src/web"))
}