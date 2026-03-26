import os

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document


def run_ingest():    
    INDEX_DIR = "./faiss_index"
    EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

    print("=== MaitriMed Ingestion Pipeline ===")

docs = [
    Document(page_content="""Dengue Fever symptoms include sudden high fever, severe headache,
pain behind the eyes, muscle and joint pains, nausea, vomiting, and rash.
Warning signs: bleeding gums, blood in vomit, severe stomach pain.
Prevention: use mosquito repellent, wear full-sleeved clothes, use mosquito nets, eliminate standing water.
Treatment: Rest, hydration, paracetamol for fever. Avoid aspirin and ibuprofen.
Visit nearest PHC or government hospital for blood test. Free treatment under NHM.""",
    metadata={"source": "WHO Dengue Guidelines", "topic": "dengue"}),

    Document(page_content="""Malaria is caused by Plasmodium parasites via Anopheles mosquito bites.
Symptoms: fever with chills, headache, muscle aches, nausea, vomiting, sweating.
Severe malaria: confusion, seizures, dark urine, jaundice.
Prevention: sleep under insecticide-treated bed nets, use indoor residual spraying.
Treatment: artemisinin-based combination therapies prescribed by doctor.
Free Rapid Diagnostic Test and medicines available at PHC under NVBDCP.""",
    metadata={"source": "NVBDCP Malaria Guidelines", "topic": "malaria"}),

    Document(page_content="""Cholera is caused by contaminated water or food.
Symptoms: watery diarrhoea (rice-water stools), vomiting, leg cramps, rapid dehydration.
Treatment: ORS immediately — 1 litre safe water + 6 teaspoons sugar + half teaspoon salt.
Give a glass of ORS after every loose stool.
Prevention: drink boiled or treated water, wash hands with soap, use sanitary latrines.
Go to PHC immediately if dehydration signs appear such as dry mouth, no tears, sunken eyes.""",
    metadata={"source": "MoH Cholera Guidelines", "topic": "cholera"}),

    Document(page_content="""Tuberculosis TB is caused by Mycobacterium tuberculosis bacteria.
Symptoms: persistent cough lasting more than 2 weeks, coughing blood, chest pain, weakness, weight loss, fever, night sweats.
Transmission: spreads through air when infected person coughs or sneezes.
Prevention: BCG vaccine for children, good ventilation, cover mouth when coughing.
Treatment: DOTS Directly Observed Treatment Short-course — free 6-month antibiotic course under Nikshay Poshan Yojana.
Never stop treatment early. Testing and treatment completely FREE at government hospitals.
Call TB helpline: 1800-11-6666.""",
    metadata={"source": "RNTCP TB Guidelines", "topic": "tuberculosis"}),

    Document(page_content="""Typhoid is caused by Salmonella typhi bacteria through contaminated food and water.
Symptoms: prolonged high fever 103 to 104 degrees F, weakness, stomach pain, headache, loss of appetite.
Complications: intestinal bleeding if untreated.
Prevention: drink safe water, eat hygienically cooked food, wash hands, typhoid vaccine available.
Treatment: antibiotics prescribed by doctor. Complete the full course always.
Get Widal test or blood culture at nearest PHC or government hospital.""",
    metadata={"source": "IDSP Typhoid Guidelines", "topic": "typhoid"}),

    Document(page_content="""Diarrhoea is a leading cause of child mortality in India.
Causes: contaminated water and food, poor sanitation, rotavirus, E. coli.
Symptoms: loose watery stools 3 or more times a day, stomach cramps, nausea, fever.
Danger signs in children: sunken eyes, no tears when crying, dry mouth, lethargic.
Treatment: ORS Oral Rehydration Solution after every loose stool, zinc tablets for 14 days for children under 5.
Continue breastfeeding in infants. ORS packets are free at all government health centres and ASHA workers.""",
    metadata={"source": "IMNCI Diarrhoea Guidelines", "topic": "diarrhoea"}),

    Document(page_content="""Pneumonia is the leading cause of death in children under 5 worldwide.
Caused by bacteria, viruses, or fungi infecting the lungs.
Symptoms: cough, difficulty breathing, fast breathing, fever, chest pain.
Danger signs in children: grunting, nasal flaring, chest in-drawing, blue lips — seek care immediately.
Prevention: pneumococcal vaccine, Hib vaccine, handwashing, exclusive breastfeeding for 6 months.
Treatment: antibiotics for bacterial pneumonia. Free chest X-ray and antibiotics at government hospitals under NHM.""",
    metadata={"source": "WHO Pneumonia Factsheet", "topic": "pneumonia"}),

    Document(page_content="""Hepatitis B is a viral infection attacking the liver.
Transmitted through infected blood, sexual contact, or from mother to baby at birth.
Symptoms: yellowing of skin and eyes jaundice, dark urine, fatigue, nausea, abdominal pain.
Many people show no symptoms for years. Chronic hepatitis B can cause liver cancer.
Prevention: Hepatitis B vaccine 3 doses — free for all children under India Universal Immunisation Programme.
Treatment: antiviral drugs control the virus. Free testing and treatment under NVHCP at government hospitals.""",
    metadata={"source": "NVHCP Hepatitis Guidelines", "topic": "hepatitis"}),

    Document(page_content="""COVID-19 is caused by SARS-CoV-2 coronavirus spreading through respiratory droplets.
Symptoms: fever, cough, shortness of breath, loss of taste or smell, fatigue, body aches, sore throat.
Severe symptoms: difficulty breathing, persistent chest pain, confusion — go to hospital immediately.
Prevention: vaccination free under National Programme at all government health centres.
Wear mask in crowded places, wash hands frequently, ensure good ventilation.
Treatment: most recover at home with rest and fluids. Call 104 health helpline or 1075 COWIN helpline.""",
    metadata={"source": "MoHFW COVID Guidelines", "topic": "covid"}),

    Document(page_content="""Leptospirosis spreads through water or soil contaminated with urine of infected animals like rats and cattle.
Very common during floods and monsoon season in Odisha.
Symptoms: sudden fever, headache, severe muscle pain especially in calves, red eyes, jaundice.
Severe cases: kidney failure, meningitis known as Weils disease.
Prevention: avoid wading in floodwater, wear rubber boots in waterlogged areas, do not drink floodwater.
Treatment: doxycycline or penicillin antibiotics. Seek medical attention immediately after flood exposure.""",
    metadata={"source": "IDSP Leptospirosis Alert", "topic": "leptospirosis"}),

    Document(page_content="""Government Health Services in Odisha available free for all citizens:
Biju Swasthya Kalyan Yojana BSKY: free treatment up to Rs 5 lakh per family per year at empanelled hospitals.
108 Ambulance: free emergency ambulance available 24 hours 7 days a week.
Mo Swasthya: mobile health units reaching remote and rural areas.
Nikshay Poshan Yojana: free TB testing and complete 6-month medicine course.
National Health Mission NHM: free medicines at all government health facilities.
National Health Helpline 104: free teleconsultation available 24 hours.
ASHA workers available in every village for health guidance and support.""",
    metadata={"source": "Odisha Health Department", "topic": "government_services"}),
]

def run_ingest():
    print(f"[+] Loaded {len(docs)} health documents")

    print("[*] Splitting into chunks...")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=512,
        chunk_overlap=64,
        separators=["\n\n", "\n", ".", " "],
    )

    chunks = splitter.split_documents(docs)

    print(f"[+] Created {len(chunks)} chunks")

    print("[*] Loading embedding model...")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBED_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )

    print("[*] Building FAISS index...")
    vectorstore = FAISS.from_documents(chunks, embeddings)
    vectorstore.save_local(INDEX_DIR)

    print(f"[✓] Index saved to {INDEX_DIR}/")

    if __name__ == "__main__":   
      run_ingest()