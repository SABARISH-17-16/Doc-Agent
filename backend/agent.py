from google import genai
import os
import time
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_documentation(code: str, doc_type: str) -> str:
    prompts = {
        "readme": f"""You are a technical documentation expert.
Generate a professional README.md for the following code.
Include: Project Title, Description, Installation, Usage, and Examples.
Code:
{code}""",
        "api": f"""You are a technical documentation expert.
Generate detailed API documentation for the following code.
Include: Endpoints/Functions, Parameters, Return values, and Examples.
Code:
{code}""",
        "reference": f"""You are a technical documentation expert.
Generate a complete function reference documentation for the following code.
Include: Function names, Parameters, Return types, and Description for each.
Code:
{code}"""
    }

    prompt = prompts.get(doc_type, prompts["readme"])
    
    models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"]
    
    for model in models:
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                return response.text
            except Exception as e:
                error_str = str(e)
                if "503" in error_str:
                    time.sleep(2)
                    continue
                elif "429" in error_str:
                    break
                else:
                    raise e
    
    return "❌ All models are currently busy. Please try again in a moment."