# MediConnect - Frontend Only Guide

This application now runs **entirely in the browser** with no backend required. All data is stored in `localStorage` and all features work offline.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:5173
   ```

That's it! No backend, no database, no API keys needed.

---

## 📋 Features

### ✅ Patient Features (No Login Required)

1. **Emergency First-Aid Guides**
   - 6 comprehensive guides with step-by-step instructions
   - Visual diagrams for CPR, bleeding control, burns, fractures, etc.
   - Indian emergency numbers (108, 112)

2. **AI First-Aid Assistant**
   - Rule-based chatbot (no external AI API)
   - Provides first-aid guidance with diagrams
   - Works completely offline

3. **Nearby Medical Help**
   - Static list of 6 medical facilities in Crossing Republik, Ghaziabad
   - Hospitals, clinics, and pharmacies with contact info
   - Google Maps integration for directions

4. **Online Consultation**
   - Book consultations with 6 mock doctors
   - Choose between chat, audio, or video modes
   - Real-time chat simulation with automatic doctor responses
   - All data persists in localStorage

### ✅ Doctor Features (Login Required)

1. **Doctor Login**
   - **Email:** Any doctor email from the list below
   - **Password:** `doctor123`
   
   **Available Doctor Emails:**
   - `amit.sharma@mediconnect.in`
   - `priya.verma@mediconnect.in`
   - `rajesh.mehta@mediconnect.in`
   - `sneha.kapoor@mediconnect.in`
   - `vikram.singh@mediconnect.in`
   - `anjali.reddy@mediconnect.in`

2. **Doctor Dashboard**
   - View pending consultation requests
   - Accept/reject consultations
   - See active consultations
   - Real-time stats (active, today's count, emergency cases)
   - Change availability status (online/busy/offline)

3. **Doctor Consultation Interface**
   - Real-time chat with patients
   - Add doctor notes
   - Write prescriptions
   - Add follow-up instructions
   - Mark consultations as emergency
   - End consultations

---

## 🎯 Mock Data

### Doctors (6 Available)

1. **Dr. Amit Sharma** - General Physician (12 years exp, Rating: 4.8)
2. **Dr. Priya Verma** - Emergency Medicine (10 years exp, Rating: 4.9)
3. **Dr. Rajesh Mehta** - Orthopedic Surgeon (15 years exp, Rating: 4.7)
4. **Dr. Sneha Kapoor** - Cardiologist (14 years exp, Rating: 4.9)
5. **Dr. Vikram Singh** - Pediatrician (8 years exp, Rating: 4.6)
6. **Dr. Anjali Reddy** - Dermatologist (9 years exp, Rating: 4.7)

### Medical Facilities (6 Locations)

All facilities are in **Crossing Republik, Ghaziabad**:
- 2 Hospitals (24×7 emergency)
- 2 Clinics (general practice)
- 2 Pharmacies (one 24×7)

### Initial Consultations

The app comes with 2 pre-loaded consultations:
1. **Active consultation** - Rahul Kumar with fever symptoms
2. **Pending consultation** - Priya Sharma with chest pain (emergency)

---

## 💾 Data Storage

All data is stored in browser `localStorage`:

- **Consultations:** `mediconnect_consultations`
- **Doctor Auth:** `mediconnect_doctor_auth`

### Clear All Data

To reset the app to initial state:
```javascript
// Open browser console and run:
localStorage.clear();
location.reload();
```

---

## 🔄 Real-Time Simulation

### Patient Chat
- Messages are stored in localStorage
- Polling every 2 seconds simulates real-time updates
- Doctor responses are automatically generated after 2-5 seconds
- 5 different response templates for variety

### Doctor Dashboard
- Auto-refreshes every 3 seconds
- Shows real-time stats and consultation updates
- Pending consultations auto-accept after 2 seconds (simulates doctor accepting)

### Doctor Consultation
- Polls for new messages every 2 seconds
- All notes and prescriptions save to localStorage
- Changes reflect immediately across all views

---

## 🎨 UI Features

- **Responsive Design** - Works on mobile, tablet, and desktop
- **Dark Mode Ready** - Uses Tailwind CSS with shadcn/ui components
- **Modern UI** - Clean, professional healthcare interface
- **Accessibility** - Proper ARIA labels and keyboard navigation

---

## 📱 Testing the App

### Test Patient Flow

1. Go to homepage
2. Click "Book Consultation"
3. Fill in symptoms and phone number
4. Select a doctor and consultation mode
5. Start chatting - doctor will auto-respond
6. Messages persist even after page refresh

### Test Doctor Flow

1. Go to `/doctor/login`
2. Login with any doctor email + password `doctor123`
3. View dashboard with pending consultations
4. Accept a consultation
5. Open the consultation and chat with patient
6. Add notes, prescription, and follow-up instructions
7. End consultation

### Test Emergency Features

1. Click the red emergency button (bottom-right)
2. Try the AI First-Aid Assistant
3. Browse first-aid guides with diagrams
4. View nearby medical facilities

---

## 🛠️ Technical Details

### Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** + shadcn/ui for styling
- **React Router** for navigation
- **localStorage** for data persistence
- **Lucide React** for icons

### No Backend Dependencies

- ❌ No Socket.IO (removed)
- ❌ No API calls to external servers
- ❌ No database connections
- ✅ Pure frontend with mock data
- ✅ All features work offline
- ✅ Data persists in browser

### File Structure

```
client/src/
├── lib/
│   └── mockData.ts          # All mock data and localStorage logic
├── pages/
│   ├── Consultation.tsx      # Patient consultation booking
│   ├── ConsultationChat.tsx  # Patient chat interface
│   ├── DoctorDashboard.tsx   # Doctor dashboard
│   ├── DoctorConsultation.tsx # Doctor chat interface
│   ├── FirstAid.tsx          # First-aid guides list
│   ├── FirstAidDetail.tsx    # Individual guide details
│   ├── NearbyHelp.tsx        # Medical facilities
│   └── ...
├── components/
│   ├── AIFirstAidChatbot.tsx # AI assistant
│   ├── EmergencyButton.tsx   # Emergency floating button
│   └── ...
└── context/
    └── DoctorAuthContext.tsx # Doctor authentication
```

---

## 🐛 Troubleshooting

### Data Not Persisting
- Check browser localStorage is enabled
- Try clearing cache and reloading
- Check browser console for errors

### Consultations Not Appearing
- Run `localStorage.clear()` and reload
- Mock data will reinitialize automatically

### Doctor Login Not Working
- Use password: `doctor123` (case-sensitive)
- Use exact email from the list above
- Check browser console for errors

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output will be in `dist/` folder. Deploy to any static hosting:

- **Netlify:** Drag and drop `dist` folder
- **Vercel:** Connect GitHub repo
- **GitHub Pages:** Push `dist` to gh-pages branch
- **Any static host:** Upload `dist` folder contents

### Environment Variables

No environment variables needed! Everything works out of the box.

---

## 📝 Customization

### Add More Doctors

Edit `client/src/lib/mockData.ts`:

```typescript
export const MOCK_DOCTORS: Doctor[] = [
  // Add your doctors here
  {
    _id: "doc-007",
    name: "Dr. Your Name",
    email: "your.email@mediconnect.in",
    phone: "9876543210",
    specialization: "Your Specialty",
    experienceYears: 10,
    rating: 4.8,
    availability: "online",
    // ... more fields
  },
];
```

### Add More Facilities

Edit `client/src/pages/NearbyHelp.tsx` - update the `facilities` array.

### Customize Doctor Responses

Edit `client/src/pages/ConsultationChat.tsx` - update the `doctorResponses` array in `handleSend()`.

---

## ⚠️ Important Notes

1. **This is a demo application** - Not for production medical use
2. **Data is stored locally** - Clearing browser data will reset everything
3. **No real authentication** - Doctor login is for demo purposes only
4. **No real-time sync** - Uses polling to simulate real-time updates
5. **Indian context** - Emergency numbers and locations are India-specific

---

## 📞 Emergency Numbers (India)

- **108** - Ambulance
- **112** - National Emergency
- **104** - Health Helpline
- **181** - Women Helpline

---

## ✨ What's Working

✅ Patient consultation booking
✅ Real-time chat simulation
✅ Doctor dashboard with stats
✅ Doctor consultation interface
✅ First-aid guides with diagrams
✅ AI chatbot assistant
✅ Nearby medical facilities
✅ Doctor authentication
✅ Data persistence
✅ Responsive design
✅ Emergency features
✅ All features work offline

---

## 🎉 Enjoy Your Frontend-Only MediConnect!

No backend setup, no API keys, no database - just pure frontend magic! 🚀
