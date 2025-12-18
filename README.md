# MediConnect – Emergency-First Healthcare Platform (India)

MediConnect is a **patient-only, emergency-focused healthcare platform** for India.  
It provides instant access to **first-aid guides with diagrams, an AI first-aid assistant, live nearby medical help, and online consultation (chat + audio + video signaling)** without any login or signup.

---

## 1. Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn-ui, React Router
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), Socket.IO
- **Real-time**: Socket.IO (chat + WebRTC signaling)

Project layout:

- `client/` – Vite React SPA (patient UI)
- `server/` – Express + TS + MongoDB + Socket.IO backend

---

## 2. Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud)

### Backend (`/server`)

1. Install dependencies:

```bash
cd server
npm install
```

2. Create `.env` in `server/`:

```bash
MONGO_URI=mongodb://localhost:27017/mediconnect
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
# JWT_SECRET is optional in this demo – a safe default is provided
```

3. (Optional but recommended) Seed the database:

```bash
npm run build
node dist/seed/seed.js
```

This will create:

- **Doctors (with real Indian numbers)**:
  - Dr. Amit Sharma – General Physician – `6396634403`
  - Dr. Neha Verma – Emergency Medicine – `8534062358`
  - Dr. Rahul Mehta – Orthopedic – `8534062358`
- First-aid content and sample hospital/clinic/pharmacy resources.

4. Start the backend (dev or built):

```bash
# Development (TS with nodemon / ts-node depending on your scripts)
npm run dev

# OR build + run
npm run build
node dist/server.js
```

### Frontend (`/client`)

1. Install dependencies:

```bash
cd client
npm install
```

2. Create `.env` in `client/`:

```bash
VITE_API_BASE=http://localhost:5000
```

3. Start the dev server:

```bash
npm run dev
```

Open the app at `http://localhost:5173`.

---

## 3. Core Features & Demo Flow

### 3.1 Emergency Mode (Global Floating Button)

- A **pulsing Emergency button** is fixed at the bottom-right of the app.
- Clicking it opens **Emergency Mode**, which immediately surfaces:
  - **Emergency First-Aid Guides** – navigates to the First-Aid module.
  - **Call 108 – Ambulance** – dials `108`.
  - **Call 112 – Emergency** – dials `112`.
  - **AI First-Aid Assistant** – opens the chatbot for guided first-aid.
  - **Start Online Consultation** – opens the consultation flow.
- No login or signup is ever required.

### 3.2 Emergency First-Aid Guides (with Diagrams)

Pages: `First-Aid` list + `First-Aid Detail`.

For emergencies like:

- CPR / Heart Attack
- Severe Bleeding
- Burns
- Fractures
- Choking
- Cuts & Wounds
- Fainting / Unconscious patient

Each detailed page includes:

- **Step-by-step instructions**
- Clear **“What NOT to do”** list
- **“Call 108 when…”** indicators
- **Visual diagrams (SVGs)** stored in `client/src/assets/firstaid-*.svg`:
  - CPR chest compression diagram
  - CPR hand placement diagram
  - CPR compression rate (100–120/min)
  - Bleeding: direct pressure
  - Burns: cool under running water
  - Fractures: splint immobilisation
  - Unconscious patient: recovery position
  - Choking: Heimlich/abdominal thrusts

All diagrams are responsive and integrated into the UI for both the guides and the AI assistant.

### 3.3 AI First-Aid Assistant (Rule-Based + Visual)

- Floating chatbot component available across the app.
- **Strictly first-aid only**:
  - No diagnosis
  - No prescriptions
  - Only basic, verified first-aid steps
- Uses **keyword / rule-based logic** (no remote AI dependency) via the backend `firstAidAI` service.
- For CPR, bleeding, burns, fractures, choking, fainting:
  - Shows structured, step-by-step text.
  - Renders relevant **diagrams inline** (CPR, bleeding, burns, fractures, unconscious, choking).
- **Every response**:
  - Mentions **Indian emergency numbers** `108` and `112`.
  - Ends with a strong **safety disclaimer** (first-aid only, not a diagnosis).

### 3.4 Live Nearby Help (Location-Based)

Page: `Nearby Help`.

- Uses the **browser Geolocation API** to request the user’s location.
- Calls the backend endpoint:

```text
GET /api/hospitals/nearby?lat={lat}&lng={lng}
```

- Backend computes distances from seeded `HospitalResource` entries and returns sorted nearby:
  - Hospitals
  - Clinics
  - Pharmacies
- UI shows:
  - Name
  - Type (with icon and color)
  - Address
  - Approximate distance
  - Hours and simple “Open/Closed” indicator
  - Call button for each facility
- **Robust fallbacks**:
  - If geolocation is denied or fails, or the API errors, it falls back gracefully to static sample data.
  - The page always renders (no crashes), and shows subtle messaging when fallback data is used.

> Note: You can replace the seeded hospital resources with your own real-world data for your region.

### 3.5 Consultation System (Text + Audio/Video Signaling)

Pages: `Consultation` and `ConsultationChat`.

#### Patient Intake

On the `Consultation` page, the patient can:

- Enter **name (optional)**.
- Enter **phone number (required)** for follow-up / emergency contact.
- Select primary **symptom** and add free-text symptom details.
- Choose **consultation mode**: Chat, Audio, or Video.

Doctor list:

- Loaded from backend via:

```text
GET /api/doctors
```

- Each doctor card shows:
  - Name
  - Specialisation
  - Experience (years)
  - Rating
  - Availability per mode (chat/audio/video)
  - **Real phone number** (from seed data) with a “Call” button.

#### Creating a Consultation

When the patient selects a doctor & mode:

- Frontend calls:

```text
POST /api/consultations
{
  doctorId,
  mode: "chat" | "audio" | "video",
  symptoms,
  patientName,
  patientPhone
}
```

- Backend:
  - Uses a **demo “patient” identity** (no auth required).
  - Persists a `Consultation` document with:
    - Patient id
    - Doctor id
    - Mode
    - Symptoms
    - Messages (empty initially)
    - Status and timestamps
  - Responds with the created consultation, including `_id`.

- The frontend then navigates to:

```text
/consultation/chat/:id?doctor={name}&mode={chat|audio|video}
```

#### Real-Time Text Chat (Socket.IO)

- The chat page:
  - Loads historical messages via:

    ```text
    GET /api/consultations/:id
    ```

  - Connects to Socket.IO at the backend (`/server`) and joins a room:

    - Event: `joinConsultation` with the consultation id.

  - Sending a message:

    - Emits `message:send` with `{ consultationId, sender: "patient", text }`.
    - Backend:
      - Validates consultation is active.
      - Appends the message to the consultation’s `messages` array.
      - Emits `message:new` to other participants in the room.

  - The UI shows messages in a modern chat layout with timestamps and status badges.

This chat flow is stable for demos and ready to be extended with a real doctor UI.

#### Audio + Video (WebRTC Signaling)

- **Socket.IO is used only for signaling** – WebRTC handles the actual media.
- Backend Socket.IO events:
  - `webrtc:offer`
  - `webrtc:answer`
  - `webrtc:ice-candidate`
  - `consultation:end`
- The patient chat view:
  - Detects the consultation mode via the `mode` query param.
  - Enables the audio/video controls accordingly.
  - Sets up signaling hooks to send/receive WebRTC offers/answers/ICE candidates via Socket.IO.
- With a corresponding doctor-side WebRTC client, you can plug directly into these events for real audio/video calls.
- All signaling events are wrapped with strong null checks so the patient UI **never crashes**, even if the remote side is not connected yet.

> Out of the box, this repo gives you a fully wired **patient side** with stable signaling channels; you can add a doctor UI using the same Socket.IO events.

---

## 4. Backend Notes

- **No authentication required**:
  - The `authMiddleware` is a safe no-op that always attaches a demo patient user.
  - All patient endpoints work without tokens.
- **CORS**:
  - Configured to allow the configured `CLIENT_ORIGIN` (defaults to `http://localhost:5173`).
- **Error handling**:
  - Centralised Express error handler.
  - Defensive checks in all consultation and Socket.IO handlers to avoid runtime crashes.

---

## 5. Safety Disclaimer (Very Important)

MediConnect is designed as an **emergency-first, patient-support tool** and **NOT** a replacement for professional medical care.

- All content (first-aid guides, AI assistant responses, and consultation features) provides **basic first-aid guidance only**.
- It does **not** provide medical diagnosis or prescriptions.
- Algorithmic decisions are intentionally conservative and always encourage contacting emergency services and qualified healthcare professionals.

For India:

- **108 – Ambulance**
- **112 – National Emergency**
- **104 – Health Helpline**
- **181 – Women Helpline**

> **Always call 108 or 112 immediately in any life-threatening emergency and follow the guidance of trained medical professionals.**

---

## 6. Demo Checklist

To demo the platform end-to-end:

1. **Start backend** (`server/`) and **seed** data.
2. **Start frontend** (`client/`).
3. Walk through:
   - Emergency button → Emergency Mode options.
   - First-Aid → pick “Heart Attack / CPR” → see steps + diagrams.
   - Open AI Assistant → ask about “CPR”, “bleeding”, “burns”, etc. → see diagrams + Indian emergency numbers + disclaimer.
   - Nearby Help → allow location → see nearby medical facilities with distances (or fallback data if denied).
   - Consultation:
     - Enter phone + symptoms.
     - Select a seeded doctor and start a chat/audio/video consultation.
     - Observe real-time text chat via Socket.IO.
   - Use “Call” buttons to dial:
     - 108 / 112
     - Doctor numbers: `6396634403`, `8534062358`.

Everything is built to be **simple, reliable, and demo-ready** with no fake UI wiring or unfinished flows.


