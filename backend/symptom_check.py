from typing import Optional

DISEASE_RULES = [
    {"id":"dengue","name":"Dengue Fever","keywords":["high fever","fever","rash","joint pain","eye pain","headache","dengue"],"severity_escalators":["bleeding","blood in vomit","severe stomach pain"],"advice":"Rest completely. Drink lots of fluids. Take paracetamol for fever — do NOT take aspirin or ibuprofen.","visit":"Visit nearest government hospital for blood test. Free treatment under NHM.","emergency_keywords":["bleeding gums","vomiting blood","unconscious"]},
    {"id":"malaria","name":"Malaria","keywords":["chills","shivering","fever with chills","sweating","malaria","periodic fever"],"severity_escalators":["confusion","seizure","jaundice","dark urine"],"advice":"Seek medical care immediately for blood smear test. Use mosquito nets. Complete full course of antimalarials.","visit":"Go to PHC for free Rapid Diagnostic Test. Medicines free under NVBDCP.","emergency_keywords":["unconscious","seizure","convulsion"]},
    {"id":"cholera","name":"Cholera","keywords":["watery diarrhoea","rice water stool","vomiting","diarrhoea","loose motion","dehydration"],"severity_escalators":["no urine","sunken eyes","very weak","muscle cramps"],"advice":"Start ORS immediately — 1 litre water + 6 teaspoons sugar + half teaspoon salt.","visit":"If dehydration signs appear go to nearest PHC immediately.","emergency_keywords":["unconscious","no urine for 6 hours","cannot drink"]},
    {"id":"tuberculosis","name":"Tuberculosis (TB)","keywords":["cough","coughing blood","night sweats","weight loss","tb","tuberculosis","long cough"],"severity_escalators":["coughing blood","difficulty breathing"],"advice":"If cough lasts more than 2 weeks get tested for TB. Free 6-month treatment under Nikshay.","visit":"Go to nearest DOTS centre. Free testing and treatment. Call 1800-11-6666.","emergency_keywords":["coughing blood heavily","cannot breathe"]},
    {"id":"typhoid","name":"Typhoid Fever","keywords":["prolonged fever","stomach pain","loss of appetite","weakness","typhoid","continuous fever"],"severity_escalators":["blood in stool","severe stomach pain","confused"],"advice":"Drink only boiled water. Eat freshly cooked food. Complete full antibiotic course.","visit":"Get Widal test at nearest PHC or government hospital.","emergency_keywords":["blood in stool","severe pain abdomen","unconscious"]},
    {"id":"pneumonia","name":"Pneumonia","keywords":["fast breathing","chest pain","difficulty breathing","pneumonia","breathless","breathing problem"],"severity_escalators":["blue lips","cannot speak","very fast breathing"],"advice":"Pneumonia requires medical treatment immediately. Keep patient sitting upright.","visit":"Go to PHC or District Hospital. Free chest X-ray and antibiotics under NHM.","emergency_keywords":["blue lips","cannot breathe"]},
    {"id":"covid","name":"COVID-19","keywords":["loss of smell","loss of taste","covid","corona","sore throat","body ache"],"severity_escalators":["cannot breathe","chest pain","confusion"],"advice":"Isolate at home. Rest and stay hydrated. Monitor oxygen level. Get vaccinated — free at government centres.","visit":"For breathing difficulty go to District Hospital. Call 104 health helpline.","emergency_keywords":["oxygen below 90","cannot breathe","chest pain"]},
    {"id":"hepatitis","name":"Hepatitis","keywords":["jaundice","yellow eyes","yellow skin","dark urine","hepatitis","liver"],"severity_escalators":["vomiting blood","very confused","cannot wake up"],"advice":"Rest completely. Avoid alcohol. Eat small frequent meals. Drink safe water.","visit":"Get liver function test at nearest government hospital. Free treatment under NVHCP.","emergency_keywords":["vomiting blood","unconscious"]},
    {"id":"leptospirosis","name":"Leptospirosis","keywords":["flood","floodwater","calf pain","leg pain","red eyes","leptospirosis","after flood fever"],"severity_escalators":["jaundice","kidney failure","bleeding"],"advice":"If fever develops after floodwater contact seek care immediately. Wear boots in waterlogged areas.","visit":"Go to nearest PHC or District Hospital. Mention flood exposure.","emergency_keywords":["jaundice after flood","no urine","unconscious"]},
    {"id":"diarrhoea","name":"Diarrhoea","keywords":["loose stool","loose motion","stomach upset","diarrhoea","dehydrated","ors"],"severity_escalators":["blood in stool","very dehydrated","child not drinking"],"advice":"Start ORS immediately. Zinc tablets for children under 5 for 14 days. Wash hands with soap.","visit":"If child has sunken eyes or not drinking go to PHC. Free ORS at government centres.","emergency_keywords":["blood in stool","unconscious","child not drinking"]},
]


def check_symptoms(
    primary_symptom: str,
    duration_days: int,
    severity: str,
    extra_symptoms: Optional[str] = None,
) -> dict:
    combined = f"{primary_symptom} {extra_symptoms or ''}".lower()

    matched = []
    for disease in DISEASE_RULES:
        score = sum(1 for kw in disease["keywords"] if kw in combined)
        if score > 0:
            matched.append((score, disease))
    matched.sort(key=lambda x: x[0], reverse=True)

    is_emergency = False
    if matched:
        top = matched[0][1]
        for phrase in top["emergency_keywords"]:
            if phrase in combined:
                is_emergency = True
    if severity == "severe":
        is_emergency = True

    if is_emergency:
        urgency = "emergency"
    elif severity == "severe" or duration_days >= 7:
        urgency = "high"
    elif severity == "moderate" or duration_days >= 3:
        urgency = "medium"
    else:
        urgency = "low"

    results = []
    for score, disease in matched[:2]:
        escalator_match = any(e in combined for e in disease["severity_escalators"])
        results.append({
            "condition": disease["name"],
            "condition_id": disease["id"],
            "confidence": "high" if score >= 3 else "medium" if score >= 2 else "low",
            "advice": disease["advice"],
            "visit": disease["visit"],
            "has_danger_signs": escalator_match,
        })

    if not results:
        results.append({
            "condition": "Unknown — needs assessment",
            "condition_id": "unknown",
            "confidence": "low",
            "advice": "Your symptoms don't match a specific condition. Please consult a doctor.",
            "visit": "Visit your nearest PHC or call 104 for guidance.",
            "has_danger_signs": False,
        })

    return {
        "urgency": urgency,
        "is_emergency": is_emergency,
        "emergency_message": "Please call 108 (free ambulance) immediately!" if is_emergency else None,
        "results": results,
        "duration_note": f"Symptoms lasting {duration_days} day(s).",
        "general_advice": "This is for awareness only. Always consult a qualified doctor for diagnosis.",
    }