use std::collections::HashMap;

use actix_web::{
    web::{self, Data},
    HttpRequest, HttpResponse, Responder,
};
use reqwest::{Client, Method, RequestBuilder};

use crate::State;

pub async fn route_request(
    req: HttpRequest,
    body: web::Bytes,
    state: Data<State<'_>>,
) -> impl Responder {
    let method = req.method().clone();

    let path = req.uri().path();
    let query = req.query_string();
    let con_info = req.connection_info().clone();
    let ip = con_info.realip_remote_addr().unwrap_or("UNKNOWN");
    let url = match route_builder(path, query, &state.hosts) {
        Ok(url) => url,
        Err(res) => {
            info!("{ip}: Unknown route");
            return res
        },
    };

    let response = match request_builder(method, body, &state.client, &url) {
        Ok(res) => res.send().await,
        Err(e) => {
            info!("{ip}: Method not allowed");
            return e
        },
    };

    match response {
        Ok(res) => {
            let status = res.status();
            let body = match res.bytes().await {
                Ok(bytes) => bytes,
                Err(_) => {
                    warn!("{ip}: Bad gateway");
                    return HttpResponse::BadGateway().finish();
                }
            };
            info!("{ip}: RESPONSE: {status} | {url}");
            HttpResponse::build(status)
                .content_type("application/json")
                .body(body)
        }
        Err(_) => {
            warn!("{ip}: Bad gateway");
            HttpResponse::BadGateway().finish()
        },
    }
}

fn route_builder(
    path: &str,
    query: &str,
    hosts: &HashMap<&str, String>,
) -> Result<String, HttpResponse> {
    let path_parts = path.split('/').collect::<Vec<&str>>();
    let root = if let Some(root) = path_parts.get(1) {
        root
    } else {
        return Err(HttpResponse::NotFound().finish());
    };

    let route = if path_parts.len() > 2 {
        String::from("/") + &path_parts[2..].join("/")
    } else {
        String::new()
    };

    let microservice = match hosts.get(*root) {
        Some(microservice) => microservice,
        None => {
            return Err(HttpResponse::NotFound().finish());
        }
    };

    Ok(format!("{}{}?{}", microservice, route, query))
}

fn request_builder(
    method: Method,
    body: web::Bytes,
    client: &Client,
    url: &str,
) -> Result<RequestBuilder, HttpResponse> {
    match method {
        Method::GET => Ok(client
            .get(url)
            .header("Content-Type", "application/json")
            .body(body)),
        Method::POST => Ok(client
            .post(url)
            .header("Content-Type", "application/json")
            .body(body)),
        Method::PUT => Ok(client
            .put(url)
            .header("Content-Type", "application/json")
            .body(body)),
        Method::DELETE => Ok(client
            .delete(url)
            .header("Content-Type", "application/json")
            .body(body)),
        Method::PATCH => Ok(client
            .patch(url)
            .header("Content-Type", "application/json")
            .body(body)),
        _ => Err(HttpResponse::MethodNotAllowed().finish()),
    }
}
