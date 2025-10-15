# Quick Start with SQLite (No PostgreSQL Required)

Since PostgreSQL is not installed, you can use SQLite instead for development:

## Steps:

1. Install SQLite adapter:
```powershell
npm install sqlite3
```

2. I'll update the database configuration to use SQLite

3. Run the server:
```powershell
npm run dev
```

## OR Install PostgreSQL

### Using Installer (Recommended):
1. Download: https://www.postgresql.org/download/windows/
2. Install and set password for 'postgres' user
3. Update .env file with your password
4. Run: `npm run migrate`
5. Run: `npm run dev`

### Using Docker:
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Run: 
```powershell
docker run --name postgres-event-api -e POSTGRES_PASSWORD=admin123 -e POSTGRES_DB=event_management -p 5432:5432 -d postgres:15
```
3. Update .env with password: admin123
4. Run: `npm run migrate`
5. Run: `npm run dev`
