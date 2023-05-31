use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer};
use reqwest::Client; // Add reqwest dependency to your Cargo.toml

async fn route_request(req: HttpRequest) -> HttpResponse {
    // Extract the path and query parameters from the request
    let path = req.uri().path();
    let query = req.query_string();

    // Determine which microservice to route the request to based on the path
    println!("path: {path}");
    let path_parts = path.split("/").collect::<Vec<&str>>();
    let root = if let Some(root) = path_parts.get(0) {
        root
    } else {
        // Return a 404 Not Found response for unknown paths
        return HttpResponse::NotFound().finish();
    };
    println!("root: {root}");
    let microservice = match *root {
        "order"  => "http://localhost:3000/order",
        "product" => "http://localhost:3001/product",
        "customer" => "http://localhost:3002/customer",
        "invoice" => "http://localhost:3003/invoice",
        _ => {
            // Return a 404 Not Found response for unknown paths
            return HttpResponse::NotFound().finish();
        }
    };

    // Forward the request to the appropriate microservice
    let url = format!("{}{}", microservice, path); // Append only the path, without the query string
    println!("Forwarding request to {}", url);
    let response = Client::new().get(&url).query(&query).send().await; // Pass the query string separately
                                                                       // Process the response from the microservice
    match response {
        Ok(res) => {
            let status = res.status();
            let body = match res.bytes().await {
                Ok(bytes) => bytes,
                Err(_) => {
                    // Return a 502 Bad Gateway response if reading the response body fails
                    return HttpResponse::BadGateway().finish();
                }
            };

            // Forward the microservice's response back to the client
            HttpResponse::build(status)
                .content_type("application/json")
                .body(body)
        }
        Err(_) => {
            // Return a 502 Bad Gateway response if the microservice is unreachable
            HttpResponse::BadGateway().finish()
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().route("/{tail:.*}", web::to(route_request)))
        .bind("127.0.0.1:5000")?
        .run()
        .await
}
