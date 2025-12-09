# ReactPOC — User Directory (React + .NET 8 + SQLite)

Short description
-----------------
Small demo app: React frontend (Vite + MUI) + .NET 8 Web API (SQLite). Users: Create / Read / Update / Delete.

Quick run (dev)
---------------
Prereqs: .NET 8 SDK, Node.js (16+), npm.

Backend:
```bash
cd backend/UserDirectory.Api
dotnet run
# default: http://localhost:5084


cd frontend
npm install
npm run dev           # Vite dev server (default: http://localhost:5173)
# OR (unified): npm run dev:all  # runs backend + frontend together if you added the script

curl -X POST http://localhost:5084/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","age":30,"city":"Bengaluru","state":"KA","pincode":"560001"}'

  curl -X POST http://localhost:5084/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","age":25,"city":"Chennai","state":"TN","pincode":"600001"}'

curl -X PUT http://localhost:5084/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"Updated Demo","age":26,"city":"Chennai","state":"TN","pincode":"600002"}'

curl -X DELETE http://localhost:5084/api/users/1

## Windows PowerShell Commands (Invoke-RestMethod)

PowerShell  commands instead:

### List users
```powershell
Invoke-RestMethod -Uri http://localhost:5084/api/users -Method GET

Create User
Invoke-RestMethod -Uri http://localhost:5084/api/users -Method POST -ContentType "application/json" -Body (@{
    name="Demo User"
    age=25
    city="Chennai"
    state="TN"
    pincode="600001"
} | ConvertTo-Json)

Get user by ID
Invoke-RestMethod -Uri http://localhost:5084/api/users/1 -Method GET

Update user
Invoke-RestMethod -Uri http://localhost:5084/api/users/1 -Method PUT -ContentType "application/json" -Body (@{
    id=1
    name="Updated Demo"
    age=26
    city="Chennai"
    state="TN"
    pincode="600002"
} | ConvertTo-Json)

Delete user
Invoke-RestMethod -Uri http://localhost:5084/api/users/1 -Method DELETE

