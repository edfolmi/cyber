variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "cyber-analyzer"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "eastus"
}

variable "resource_group_name" {
  description = <<-EOT
    Name of the resource group Terraform creates for application resources (ACR, Container Apps, etc.).
    Must NOT be the RG used only for remote state (e.g. terraform-state-rg).
    If this RG already exists in Azure from outside Terraform, import it first:
    terraform import azurerm_resource_group.main /subscriptions/<sub>/resourceGroups/<this-name>
  EOT
  type        = string
  default     = "cyber-analyzer-rg"
}

variable "openai_api_key" {
  description = "OpenAI API key for the application"
  type        = string
  sensitive   = true
  default     = ""
}

variable "semgrep_app_token" {
  description = "Semgrep app token for security scanning"
  type        = string
  sensitive   = true
  default     = ""
}

variable "docker_image_tag" {
  description = "Tag for the Docker image"
  type        = string
  default     = "latest"
}

variable "clerk_publishable_key" {
  description = "Clerk publishable key (NEXT_PUBLIC); baked into the static frontend at image build time"
  type        = string
  sensitive   = true
  default     = ""
}

variable "clerk_plan_key" {
  description = "Clerk Billing plan slug; client checks entitlement as user:{slug}"
  type        = string
  default     = "premium_member"
}

variable "public_app_url" {
  description = "Optional public site URL for post-checkout redirects (e.g. https://app.example.com)"
  type        = string
  default     = ""
}

variable "public_api_url" {
  description = "Optional NEXT_PUBLIC_API_URL if the frontend is not same-origin to the API"
  type        = string
  default     = ""
}

variable "use_existing_log_analytics_workspace" {
  description = <<-EOT
    If true, look up an existing Log Analytics workspace (name = project_name + "-logs") in the
    resource group instead of creating it. Use when Azure already has that workspace but Terraform
    state does not (avoids "already exists" without terraform import). While true, Terraform does
    not destroy that workspace on terraform destroy. In GitHub Actions set repository variable
    TF_USE_EXISTING_LOG_ANALYTICS=true to enable.
    Do not set true if Terraform state already manages that workspace (would plan to destroy it).
  EOT
  type        = bool
  default     = false
}

variable "use_existing_container_app_environment" {
  description = <<-EOT
    If true, use an existing Container Apps environment by resource ID instead of creating one.
    Required together with existing_container_app_environment_id (data source lookup was removed
    because azurerm can error with "no matching workspace found" when resolving the env's linked
    Log Analytics workspace). Set GitHub variables TF_USE_EXISTING_CONTAINER_APP_ENV=true and
    TF_EXISTING_CONTAINER_APP_ENV_ID to the full ARM id from Portal → environment → JSON view.
    While true, Terraform does not destroy that environment on terraform destroy.
    Do not set true if Terraform state already manages that environment (would plan to destroy it).
  EOT
  type        = bool
  default     = false
}

variable "existing_container_app_environment_id" {
  description = <<-EOT
    Full Azure resource ID of the Container Apps environment (e.g. /subscriptions/.../managedEnvironments/cyber-analyzer-env).
    Required when use_existing_container_app_environment is true; ignored otherwise.
  EOT
  type        = string
  default     = ""
  sensitive   = false
}

variable "use_existing_container_app" {
  description = <<-EOT
    If true, read the existing Container App (name = project_name in resource_group_name) instead of creating it.
    Use when Azure already has the app but Terraform state does not. GitHub: TF_USE_EXISTING_CONTAINER_APP=true.
    While true, Terraform does not update image, env, or ingress for that app. After state is healthy, run
    terraform import 'azurerm_container_app.main[0]' <ARM id from Portal JSON> and set this to false so CI can manage deploys.
  EOT
  type        = bool
  default     = false
}