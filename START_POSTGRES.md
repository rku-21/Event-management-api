# PostgreSQL Setup Guide

## Option 1: Install PostgreSQL on Windows

### Step 1: Download and Install
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - Set password for `postgres` user (e.g., "admin123")
   - Port: 5432 (default)
   - Locale: Default

### Step 2: Verify Installation
Open PowerShell and run:
```powershell
Get-Service -Name "*postgres*"
```

### Step 3: Start PostgreSQL Service
```powershell
Start-Service postgresql-x64-16 
```

### Step 4: Update .env file
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_management
DB_USER=postgres
DB_PASSWORD=your_password_here  # Use the password you set
```

### Step 5: Create Database
```powershell
psql -U postgres
```
Then run:
```sql
CREATE DATABASE event_management;
\q
```

---

## Option 2: Use Docker (Quick Setup)

### Step 1: Install Docker Desktop
Download from: https://www.docker.com/products/docker-desktop/

### Step 2: Run PostgreSQL Container
```powershell
docker run --name postgres-event-api `
  -e POSTGRES_PASSWORD=admin123 `
  -e POSTGRES_DB=event_management `
  -p 5432:5432 `
  -d postgres:15
```

### Step 3: Update .env file
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_management
DB_USER=postgres
DB_PASSWORD=admin123
```

### Step 4: Verify Container is Running
```powershell
docker ps
```

---

## Option 3: Use Cloud Database (Easiest)

### Use a free PostgreSQL service like:
- **Supabase**: https://supabase.com/ (Free tier)
- **ElephantSQL**: https://www.elephantsql.com/ (Free tier)
- **Neon**: https://neon.tech/ (Free tier)

1. Sign up and create a database
2. Get connection details
3. Update .env with provided credentials

---

## After Database is Running

1. Run migrations:
```powershell
npm run migrate
```

2. Start the server:
```powershell
npm run dev
```

---

## Troubleshooting

### Check if PostgreSQL is running:
```powershell
Get-Service -Name "*postgres*"
```

### Start PostgreSQL:
```powershell
Start-Service postgresql-x64-16  
```

### Test connection:
```powershell
psql -U postgres -h localhost
```

### Check if port 5432 is in use:
```powershell
netstat -ano | findstr :5432
```
