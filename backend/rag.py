"""
MaitriMed — RAG Chain (LCEL style, Python 3.14 compatible)
"""

import os
from functools import lru_cache
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

INDEX_DIR = "./faiss_index"
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

PROMPT_TEMPLATE = """You are MaitriMed, a compassionate and knowledgeable public health assistant
for the people of Odisha, India. Your role is to provide clear, accurate health information
and raise disease awareness.

STRICT RULES:
- Always answer in simple, easy-to-understand language. Avoid medical jargon.
- CRITICAL: Detect the language of the user's question carefully.
- If the question is written in English (Latin script), you MUST respond ENTIRELY in English. No Hindi words at all.
- If the question is written in Hindi (Devanagari script like यह), you MUST respond ENTIRELY in Hindi.
- If mixed, respond in English.
- Default language is English unless the user clearly writes in Hindi script.
- Always end responses with: which doctor or health facility to visit if needed.
- NEVER diagnose a disease. Say "this could be related to..." instead.
- NEVER recommend specific prescription medicines by name.
- If symptoms sound like a medical emergency, clearly say: "Please call 108 (free ambulance) immediately."
- If you don't know the answer from the context, say so honestly.
- Keep responses concise — 150 to 250 words maximum.

Context from health documents:
{context}

User question: {question}

Your helpful, compassionate response:"""


@lru_cache(maxsize=1)
def get_embeddings():
    return HuggingFaceEmbeddings(
        model_name=EMBED_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )


@lru_cache(maxsize=1)
def get_vectorstore():
    if not os.path.exists(INDEX_DIR):
        raise FileNotFoundError(
            f"FAISS index not found at {INDEX_DIR}. Run: python ingest.py"
        )
    return FAISS.load_local(
        INDEX_DIR,
        get_embeddings(),
        allow_dangerous_deserialization=True,
    )



def get_llm():
    return ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0.3,
        max_tokens=512,
        groq_api_key=os.getenv("GROQ_API_KEY"),
    )


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


def get_chain():
    vectorstore = get_vectorstore()
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4},
    )
    prompt = PromptTemplate.from_template(PROMPT_TEMPLATE)
    llm = get_llm()

    chain = (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain, retriever


def query_rag(question: str) -> dict:
    chain, retriever = get_chain()

    response = chain.invoke(question)

    # Force clean string
    if isinstance(response, dict):
       answer = str(response.get("answer", ""))
    else:
       answer = str(response)

    docs = retriever.invoke(question)

# Ensure docs are safe
    clean_docs = []
    for d in docs:
        try:
           clean_docs.append({
            "content": str(d.page_content),
            "source": str(d.metadata.get("source", "Health Guidelines")),
            "topic": str(d.metadata.get("topic", "general"))
        })
        except:
          continue

    sources = []
    seen = set()

    for doc in clean_docs:
        src = doc["source"]
        topic = doc["topic"]

        if src not in seen:
            seen.add(src)
            sources.append({"name": src, "topic": topic})

    return {
        "answer": answer,
        "sources": sources,
    }


if __name__ == "__main__":
    print("Testing RAG chain...")
    result = query_rag("What are the symptoms of dengue?")
    print("Answer:", result["answer"])
    print("Sources:", result["sources"])