// AI First-Aid assistant (rule-based).
// System prompt (for reference, enforced by logic here):
// You are a first-aid emergency assistant.
// You only provide basic, verified first-aid steps.
// You do not diagnose diseases.
// You do not prescribe medicines.
// You always recommend contacting emergency services.
// Keep responses short, clear, and step-by-step.

const DISCLAIMER =
  "This is basic first-aid guidance. Please contact emergency services or a doctor immediately.";

const normalize = (text: string): string => text.toLowerCase();

export const generateFirstAidResponse = (message: string): string => {
  const text = normalize(message);

  let response: string | null = null;

  if (text.includes("heart") || text.includes("chest pain")) {
    response =
      "Heart attack first-aid:\n" +
      "1. Call emergency services immediately.\n" +
      "2. Make the person sit comfortably and stay calm.\n" +
      "3. Loosen tight clothing and reassure them.\n" +
      "4. If they become unresponsive and not breathing normally, start CPR if you are trained.";
  } else if (text.includes("cpr")) {
    response =
      "CPR basic steps for adults:\n" +
      "1. Check responsiveness and breathing.\n" +
      "2. Call emergency services or ask someone else to call.\n" +
      "3. Place the heel of your hand in the center of the chest and lock your hands.\n" +
      "4. Give hard, fast chest compressions at about 100–120 per minute.\n" +
      "5. Continue until help arrives or the person starts breathing normally.";
  } else if (text.includes("bleed") || text.includes("bleeding")) {
    response =
      "Bleeding control steps:\n" +
      "1. Apply firm, direct pressure on the wound with a clean cloth.\n" +
      "2. Keep the injured area raised if possible.\n" +
      "3. Do not remove objects stuck in the wound; apply pressure around them.\n" +
      "4. If bleeding soaks through, add more cloth on top and keep pressing.";
  } else if (text.includes("burn")) {
    response =
      "Burns first-aid:\n" +
      "1. Cool the burn under cool running water for at least 10–20 minutes.\n" +
      "2. Remove tight items like rings or watches near the area, if not stuck.\n" +
      "3. Cover with a clean, non-fluffy cloth or sterile dressing.\n" +
      "4. Do not apply ice, creams, or home remedies directly on the burn.";
  } else if (text.includes("fracture") || text.includes("broken")) {
    response =
      "Fracture precautions:\n" +
      "1. Keep the injured limb still and supported.\n" +
      "2. Do not try to straighten or push back any bones.\n" +
      "3. Immobilize the area with a splint or padding if you can do it safely.\n" +
      "4. Apply a cold pack wrapped in cloth to reduce swelling.";
  } else if (text.includes("choking")) {
    response =
      "Choking response for adults:\n" +
      "1. Ask if the person is choking and encourage them to cough.\n" +
      "2. If they cannot cough, speak, or breathe, stand behind and give up to 5 back blows between the shoulder blades.\n" +
      "3. If still blocked, give up to 5 abdominal thrusts (Heimlich maneuver) if you are trained.\n" +
      "4. Alternate back blows and thrusts until the object is cleared or help arrives.";
  } else if (text.includes("faint") || text.includes("unconscious") || text.includes("dizzy")) {
    response =
      "Fainting first-aid:\n" +
      "1. Lay the person flat on their back.\n" +
      "2. Raise their legs slightly to improve blood flow.\n" +
      "3. Loosen tight clothing around the neck.\n" +
      "4. If they do not wake up quickly, check breathing and seek emergency help.";
  }

  if (!response) {
    response =
      "I can only provide basic first-aid guidance for emergencies like CPR, heart attack, bleeding, burns, fractures, choking, or fainting.\n" +
      "If this is a medical emergency, contact your local emergency number immediately.";
  }

  return `${response}\n\n${DISCLAIMER}`;
};

