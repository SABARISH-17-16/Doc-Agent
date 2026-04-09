from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import generate_documentation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DocRequest(BaseModel):
    code: str
    doc_type: str

@app.get("/")
def root():
    return {"status": "DocuAgent API is running!"}

@app.post("/generate")
def generate(request: DocRequest):
    result = generate_documentation(request.code, request.doc_type)
    return {"documentation": result}