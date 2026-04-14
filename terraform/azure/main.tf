terraform {
  required_version = ">= 1.5"

  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

# Configure Azure Provider
provider "azurerm" {
  features {}
}

check "existing_container_app_environment_id" {
  assert {
    condition     = !var.use_existing_container_app_environment || var.existing_container_app_environment_id != ""
    error_message = "When use_existing_container_app_environment is true, set existing_container_app_environment_id to the environment ARM resource ID (Azure Portal → environment → JSON view → id). In GitHub set variable TF_EXISTING_CONTAINER_APP_ENV_ID."
  }
}

# Upgrade path: workspace was unindexed; now uses count on the managed resource.
moved {
  from = azurerm_log_analytics_workspace.main
  to   = azurerm_log_analytics_workspace.main[0]
}

moved {
  from = azurerm_container_app_environment.main
  to   = azurerm_container_app_environment.main[0]
}

moved {
  from = azurerm_container_app.main
  to   = azurerm_container_app.main[0]
}

# Add a random acr_suffix to the acr name to make it globally unique.
resource "random_string" "acr_suffix" {
  length  = 6
  upper   = false
  lower   = true
  numeric = true
  special = false
}
locals {
  acr_basename = replace(var.project_name, "-", "") // only letters/numbers
  // keep base to <= 40 so base+6 <= 46 (under 50 char limit)
  acr_name = "${substr(local.acr_basename, 0, 40)}${random_string.acr_suffix.result}"
}

# Application resource group (created by Terraform; no manual RG step required)
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    environment = terraform.workspace
    project     = var.project_name
  }
}

# Create Azure Container Registry
resource "azurerm_container_registry" "acr" {
  name                = local.acr_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    environment = terraform.workspace
    project     = var.project_name
  }
}

# Configure Docker provider to use ACR
provider "docker" {
  registry_auth {
    address  = azurerm_container_registry.acr.login_server
    username = azurerm_container_registry.acr.admin_username
    password = azurerm_container_registry.acr.admin_password
  }
}

# Build and push Docker image
resource "docker_image" "app" {
  name = "${azurerm_container_registry.acr.login_server}/${var.project_name}:${var.docker_image_tag}"

  build {
    context    = "${path.module}/../.."
    dockerfile = "Dockerfile"
    platform   = "linux/amd64"
    no_cache   = true
    build_args = {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = var.clerk_publishable_key
      NEXT_PUBLIC_CLERK_PLAN_KEY        = var.clerk_plan_key
      NEXT_PUBLIC_APP_URL               = var.public_app_url
      NEXT_PUBLIC_API_URL               = var.public_api_url
    }
  }
}

resource "docker_registry_image" "app" {
  name = docker_image.app.name

  depends_on = [docker_image.app]
}

# Optional: adopt a workspace already in Azure when state was lost (see variable description).
data "azurerm_log_analytics_workspace" "existing" {
  count               = var.use_existing_log_analytics_workspace ? 1 : 0
  name                = "${var.project_name}-logs"
  resource_group_name = azurerm_resource_group.main.name
}

# Create Log Analytics Workspace for monitoring (skipped when use_existing_log_analytics_workspace)
resource "azurerm_log_analytics_workspace" "main" {
  count = var.use_existing_log_analytics_workspace ? 0 : 1

  name                = "${var.project_name}-logs"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  # Build and push the image first so a failed `npm run build` does not leave
  # orphaned Log Analytics / Container Apps env in Azure ahead of state.
  depends_on = [docker_registry_image.app]

  tags = {
    environment = terraform.workspace
    project     = var.project_name
  }
}

locals {
  log_analytics_workspace_id   = var.use_existing_log_analytics_workspace ? data.azurerm_log_analytics_workspace.existing[0].id : azurerm_log_analytics_workspace.main[0].id
  container_app_environment_id = var.use_existing_container_app_environment ? var.existing_container_app_environment_id : azurerm_container_app_environment.main[0].id
}

# Create Container App Environment (skipped when use_existing_container_app_environment)
resource "azurerm_container_app_environment" "main" {
  count = var.use_existing_container_app_environment ? 0 : 1

  name                       = "${var.project_name}-env"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  log_analytics_workspace_id = local.log_analytics_workspace_id

  # When linking an existing workspace (data source), still wait for the image before Azure app resources.
  depends_on = [docker_registry_image.app]

  tags = {
    environment = terraform.workspace
    project     = var.project_name
  }
}

# Optional: adopt Container App already in Azure when state was lost (see variable description).
data "azurerm_container_app" "existing" {
  count               = var.use_existing_container_app ? 1 : 0
  name                = var.project_name
  resource_group_name = azurerm_resource_group.main.name
}

# Create Container App (skipped when use_existing_container_app; then import for image updates)
resource "azurerm_container_app" "main" {
  count = var.use_existing_container_app ? 0 : 1

  name                         = var.project_name
  container_app_environment_id = local.container_app_environment_id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    container {
      name   = "main"
      image  = docker_registry_image.app.name
      cpu    = 1.0
      memory = "2.0Gi"

      env {
        name  = "OPENAI_API_KEY"
        value = var.openai_api_key
      }

      env {
        name  = "SEMGREP_APP_TOKEN"
        value = var.semgrep_app_token
      }

      env {
        name  = "ENVIRONMENT"
        value = "production"
      }


      env {
        name  = "PYTHONUNBUFFERED"
        value = "1"
      }
    }

    min_replicas = 0
    max_replicas = 1
  }

  ingress {
    external_enabled = true
    target_port      = 8000

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "registry-password"
  }

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.acr.admin_password
  }

  tags = {
    environment = terraform.workspace
    project     = var.project_name
  }
}

locals {
  app_public_fqdn = var.use_existing_container_app ? data.azurerm_container_app.existing[0].ingress[0].fqdn : azurerm_container_app.main[0].ingress[0].fqdn
}

# Outputs
output "app_url" {
  value       = "https://${local.app_public_fqdn}"
  description = "URL of the deployed application"
}

output "acr_login_server" {
  value       = azurerm_container_registry.acr.login_server
  description = "Azure Container Registry login server"
}

output "resource_group" {
  value       = azurerm_resource_group.main.name
  description = "Resource group name"
}
