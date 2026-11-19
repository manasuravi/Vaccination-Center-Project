# VaxCare Frontend (Booking flow updated)

## 1. Copy this project
Extract this ZIP. Open the extracted `vaccination-frontend-complete` folder in VS Code.

## 2. Install frontend packages
Open VS Code Terminal in this folder and run:
```bash
npm install
```

## 3. Start the backend
Open a SECOND terminal in your backend project folder (the folder containing `server.js`) and run:
```bash
npm run dev
```
The backend should be available at `http://localhost:5000`.

## 4. Start the frontend
In the frontend terminal run:
```bash
npm run dev
```
Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Booking notes
- Sign in with a registered user account.
- The current backend chooses the first active vaccination center with available slots matching the PIN code saved in the user's registration profile.
- Select a date and click **Confirm Booking**.
- The frontend now calls the backend's actual cancellation route: `DELETE /api/vaccinations/:id`.
- Search PIN code is for viewing centers. It does not change the registered PIN code used by the current backend booking endpoint.

## Important
The frontend API base is set in `src/App.jsx` to `http://localhost:5000/api`.
Do not run the backend's `database/schema.sql` again unless you intend to recreate the database: it contains `DROP TABLE` statements.
