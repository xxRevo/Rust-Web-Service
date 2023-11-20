#[macro_use]
extern crate rocket;
use std::io::Read;
use serde_json::Value;
use rocket::fs::{NamedFile, FileServer};
use rocket_cors::{CorsOptions, AllowedOrigins, Cors};
use rocket::http::Method;

fn make_cors() -> Cors {
    CorsOptions {
        allowed_origins: AllowedOrigins::all(),
        allowed_methods: vec![Method::Get, Method::Post]
            .into_iter()
            .map(From::from)
            .collect(),
        ..Default::default()
    }
    .to_cors()
    .expect("Error creating CORS options")
}

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

#[get("/<input>")]
fn query(input: &str) ->  Option<String> {
    static FAIL_RESPONSE: &str = "{\"Invalid input\" : \"1\"}";    
    fn find_entry<'a>(json: &'a Value, key_to_find: &str) -> Option<&'a Value> {
        match json {
            Value::Object(map) => {
                for (key, value) in map.iter() {
                    if key == key_to_find {
                        return Some(value);
                    }
                    if let Some(found_value) = find_entry(value, key_to_find) {
                        return Some(found_value);
                    }
                }
            }
            Value::Array(array) => {
                for value in array.iter() {
                    if let Some(found_value) = find_entry(value, key_to_find) {
                        return Some(found_value);
                    }
                }
            }
            _ => {}
        }
        None
    }

    let file_path = std::env::current_dir().unwrap().join("src").join("config.json");
    let mut file = std::fs::File::open(file_path).unwrap();
    let mut data = String::new();
    file.read_to_string(&mut data).unwrap();
    let json: Value = serde_json::from_str(&data).expect("JSON was not well-formatted");
    //let found_entry_json_string = serde_json::to_string(&found_entry);
    if let Some(found_entry) = find_entry(&json, input) {
        let found_entry_json_string = serde_json::to_string(found_entry).expect("Failed to convert to JSON string");
        Some(found_entry_json_string)
    } else {
        let fail_response_string: String = FAIL_RESPONSE.to_string();
        Some(fail_response_string)
    }


    /*if let Some(found_entry) = find_entry(&json, input) {
        println!("Found entry for key '{}': {:?}", input, found_entry);
    } else {
        println!("Entry for key '{}' not found.", input);
    }*/
    
}


#[launch]
fn rocket() -> _ {
    rocket::build()
    .attach(make_cors())
    .mount("/", routes![index])
    .mount("/guest_entry", routes![query])
    .mount("/", FileServer::from("src/web"))
}