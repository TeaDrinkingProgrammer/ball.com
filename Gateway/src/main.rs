#[macro_use]
extern crate log;

use std::{collections::HashMap, sync::Arc};

use actix_web::{
    web::{self, Data},
    App, HttpServer,
};
use reqwest::Client;

mod handler;

#[derive(Clone)]
pub struct State<'a> {
    client: Arc<Client>,
    hosts: HashMap<&'a str, String>,
}

impl<'a> Default for State<'a> {
    fn default() -> Self {
        Self {
            client: Arc::new(Client::new()),
            hosts: set_hosts(),
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    let state = Data::new(State::default());
    HttpServer::new(move || {
        App::new()
            .route("/{tail:.*}", web::to(handler::route_request))
            .app_data(state.clone())
    })
    .bind("0.0.0.0:5000")?
    .run()
    .await
}

fn set_hosts<'a>() -> HashMap<&'a str, String> {
    let mut hosts: HashMap<&str, String> = HashMap::new();
    if std::env::var("CONTAINERIZED").is_ok() {
        info!("binding to container hostnames");
        hosts.insert(
            "order",
            "http://order:3000/order_management_service".to_string(),
        );
        hosts.insert(
            "product",
            "http://product:3001/product_management_service".to_string(),
        );
        hosts.insert(
            "customer",
            "http://customer:3002/api/customer_management_service".to_string(),
        );
        hosts.insert(
            "invoice",
            "http://invoice:3003/invoice_management_service".to_string(),
        );
    } else {
        info!("binding to local hostnames");
        hosts.insert("order", "http://localhost:3000/order".to_string());
        hosts.insert("product", "http://localhost:3001/product".to_string());
        hosts.insert("customer", "http://localhost:3002/api/customer".to_string());
        hosts.insert("invoice", "http://localhost:3003/invoice".to_string());
    };
    hosts
}
