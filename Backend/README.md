# Creating a New Migration
## Infrastructure
```bash
dotnet ef migrations add MigrationName --project Infrastructure/Infrastructure.csproj --startup-project Animo.API/Animo.API.csproj --context AnimoContext
```

# Updating the Database
## Infrastructure
```bash
dotnet ef database update --project Infrastructure/Infrastructure.csproj --startup-project Animo.API/Animo.API.csproj --context AnimoContext
```
