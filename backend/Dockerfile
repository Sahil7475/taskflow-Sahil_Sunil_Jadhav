# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY *.sln .
COPY backend/*.csproj ./backend/
RUN dotnet restore

COPY backend/. ./backend/
WORKDIR /app/backend
RUN dotnet publish -c Release -o /out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .

EXPOSE 80
ENTRYPOINT ["dotnet", "TaskFlow.Api.dll"]