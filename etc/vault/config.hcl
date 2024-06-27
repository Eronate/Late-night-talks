storage "file" {
  path = "/opt/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1
}

api_addr = "https://localhost:8200"
cluster_addr = "https://localhost:8201"

# For security, use a backend such as Consul in production:
# storage "consul" {
#   address = "127.0.0.1:8500"
#   path    = "vault"
# }
