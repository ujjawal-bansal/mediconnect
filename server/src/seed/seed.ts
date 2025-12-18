import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { Doctor } from "../models/Doctor";
import { FirstAid } from "../models/FirstAid";
import { HospitalResource } from "../models/HospitalResource";
import { User } from "../models/User";

const run = async () => {
  await mongoose.connect(env.MONGO_URI);

  console.log("Clearing existing seed collections...");
  await Promise.all([
    Doctor.deleteMany({}),
    FirstAid.deleteMany({}),
    HospitalResource.deleteMany({}),
    User.deleteMany({ email: "demo@mediconnect.com" }),
  ]);

  console.log("Seeding doctors...");
  const doctorPasswordHash = await bcrypt.hash("Doctor@1234", 10);
  
  await Doctor.insertMany([
    {
      name: "Dr. Aman Sharma",
      specialization: "General Physician",
      experienceYears: 10,
      phone: "6396634403",
      languages: ["English", "Hindi"],
      modeAvailability: { chat: true, audio: true, video: true },
      rating: 4.8,
      profileImageUrl:
        "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&auto=format&fit=crop",
    },
    {
      name: "Dr. Neha Verma",
      email: "neha.verma@mediconnect.in",
      passwordHash: doctorPasswordHash,
      specialization: "Emergency Medicine",
      experienceYears: 8,
      phone: "8534062358",
      languages: ["English", "Hindi"],
      hospital: "Arogya Emergency Hospital",
      modeAvailability: { chat: true, audio: true, video: true },
      availability: "offline",
      rating: 4.9,
      profileImageUrl:
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&auto=format&fit=crop",
    },
    {
      name: "Dr. Rohit Gupta",
      email: "rohit.gupta@mediconnect.in",
      passwordHash: doctorPasswordHash,
      specialization: "Orthopedic",
      experienceYears: 9,
      phone: "8534062358",
      languages: ["English", "Hindi"],
      clinic: "Ortho Care Clinic",
      modeAvailability: { chat: true, audio: true, video: true },
      availability: "offline",
      rating: 4.7,
      profileImageUrl:
        "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&auto=format&fit=crop",
    },
  ]);

  console.log("Seeding first-aid content...");
  const disclaimer =
    "These are basic first-aid steps and not a diagnosis. Always contact emergency services or a doctor immediately.";

  await FirstAid.insertMany([
    {
      category: "burns",
      title: "Burns",
      icon: "🔥",
      summary: "Cool the burn and protect the skin.",
      steps: [
        "Move the person away from the source of the burn.",
        "Cool the burn under cool running water for at least 10–20 minutes.",
        "Remove tight items like rings or watches near the area, if not stuck.",
        "Cover the burn with a clean, non-fluffy cloth or sterile dressing.",
        "Do not apply ice, creams, or home remedies directly on the burn.",
      ],
      disclaimer,
    },
    {
      category: "heart_attack",
      title: "Heart Attack",
      icon: "❤️",
      summary: "Call emergency services and keep the person calm.",
      steps: [
        "Call emergency services immediately.",
        "Make the person sit in a comfortable position with back supported.",
        "Loosen tight clothing around the neck and chest.",
        "Reassure the person and keep them calm.",
        "If they become unresponsive and not breathing normally, start CPR if trained.",
      ],
      disclaimer,
    },
    {
      category: "bleeding",
      title: "Severe Bleeding",
      icon: "🩹",
      summary: "Apply firm pressure and keep the area elevated.",
      steps: [
        "Wear disposable gloves if available.",
        "Apply firm, direct pressure to the wound with a clean cloth or bandage.",
        "Raise the injured area above heart level if possible.",
        "Do not remove objects stuck in the wound; apply pressure around them.",
        "If blood soaks through, add more cloth on top and keep pressing.",
      ],
      disclaimer,
    },
    {
      category: "fracture",
      title: "Fracture",
      icon: "🦴",
      summary: "Keep the limb still and supported.",
      steps: [
        "Ask the person not to move the injured part.",
        "Support the limb with cushions, folded cloth, or a temporary splint.",
        "Do not try to straighten or push back any bone.",
        "Apply a cold pack wrapped in cloth to reduce swelling.",
        "Seek medical attention as soon as possible.",
      ],
      disclaimer,
    },
    {
      category: "choking",
      title: "Choking (Adult)",
      icon: "😮",
      summary: "Encourage coughing, then back blows and thrusts if needed.",
      steps: [
        "Ask the person if they are choking and encourage them to cough.",
        "If they cannot cough, speak, or breathe, stand behind them.",
        "Give up to 5 firm back blows between the shoulder blades with the heel of your hand.",
        "If still blocked and you are trained, give up to 5 abdominal thrusts.",
        "Alternate back blows and thrusts until the object is cleared or help arrives.",
      ],
      disclaimer,
    },
    {
      category: "fainting",
      title: "Fainting",
      icon: "💫",
      summary: "Lay the person down and raise their legs.",
      steps: [
        "Lay the person flat on their back.",
        "Raise their legs slightly to improve blood flow to the brain.",
        "Loosen tight clothing around the neck and waist.",
        "If they do not wake up quickly, check breathing and call emergency services.",
      ],
      disclaimer,
    },
  ]);

  console.log("Seeding hospital resources...");
  await HospitalResource.insertMany([
    {
      name: "Eyecure Hospital",
      type: "hospital",
      address: "Near Orbit Plaza, Crossing Republik, Ghaziabad, Uttar Pradesh 201016",
      latitude: 28.6262,
      longitude: 77.4342,
      openHours: "24×7",
    },
    {
      name: "Vrindavan Hospital",
      type: "hospital",
      address: "Near Gaur City, Ghaziabad, Uttar Pradesh 201009",
      latitude: 28.6178,
      longitude: 77.4305,
      openHours: "24×7",
    },
    {
      name: "Davaindia Generic Pharmacy",
      type: "pharmacy",
      address: "Galleria Market, Crossings Republik, Ghaziabad, Uttar Pradesh 201016",
      latitude: 28.6254,
      longitude: 77.4362,
      openHours: "9 AM – 11 PM",
    },
    {
      name: "Apollo Pharmacy Crossings Republik",
      type: "pharmacy",
      address: "Paramount Symphony, Crossings Republik, Ghaziabad, Uttar Pradesh 201016",
      latitude: 28.6249,
      longitude: 77.4328,
      openHours: "24×7",
    },
    {
      name: "Dr. A.K. Anuragi's Care Clinic",
      type: "clinic",
      address: "Panchsheel Square, Crossings Republik, Ghaziabad, Uttar Pradesh 201016",
      latitude: 28.626,
      longitude: 77.4375,
      openHours: "10 AM – 2 PM, 6 PM – 9 PM",
    },
  ]);

  console.log("Seeding demo patient user...");
  const passwordHash = await bcrypt.hash("Demo@1234", 10);
  await User.create({
    name: "Demo Patient",
    email: "demo@mediconnect.com",
    passwordHash,
    role: "patient",
  });

  console.log("Seeding completed.");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

