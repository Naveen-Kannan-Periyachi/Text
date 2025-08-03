from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os

from text_extraction.pdf2text import extract_text_from_pdf
from text_extraction.image2text import extract_text as extract_text_from_image
from text_extraction.excel2text import extract_text_from_excel
from text_extraction.doc2text import extract_text_from_docx
from DocAnaly.docanalyze import detect_and_extract, analyze_text
from Summarization import summarize as summarization_module
from translation.translation import main as translate_document
from translation.translation import translate_file_api

app = FastAPI()

# Allow CORS for frontend (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/extract-text/")
async def extract_text(file: UploadFile = File(...), file_type: str = Form(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        if file_type == "pdf":
            result = extract_text_from_pdf(temp_path)
        elif file_type == "image":
            result = extract_text_from_image(temp_path)
        elif file_type == "excel":
            result = extract_text_from_excel(temp_path)
        elif file_type == "docx":
            result = extract_text_from_docx(temp_path)
        else:
            return JSONResponse(status_code=400, content={"error": "Unsupported file type"})
        return {"text": result}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        os.remove(temp_path)


@app.post("/analyze-document/")
async def analyze_document_api(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        text = detect_and_extract(temp_path)
        if not text.strip():
            return JSONResponse(status_code=400, content={"error": "No text found in the file."})
        analysis = analyze_text(text)
        return {"analysis": analysis}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        os.remove(temp_path)

@app.post("/summarize/")
async def summarize(file: UploadFile = File(...), summary_type: str = Form(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        extracted_text_by_page = summarization_module.detect_and_extract(temp_path)
        if not any(text.strip() for text in extracted_text_by_page.values()):
            return JSONResponse(status_code=400, content={"error": "No text found in the file."})
        summaries = {}
        for page, text in extracted_text_by_page.items():
            if not text.strip():
                continue
            if summary_type == "abstractive":
                summaries[page] = summarization_module.summarize_abstractive(text)
            elif summary_type == "extractive":
                summaries[page] = summarization_module.summarize_extractive(text)
            else:
                return JSONResponse(status_code=400, content={"error": "Invalid summary type."})
        return {"summaries": summaries}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        os.remove(temp_path)

@app.post("/translate/")
async def translate(file: UploadFile = File(...), language_codes: str = Form(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        codes = [code.strip() for code in language_codes.split(',') if code.strip()]
        result = translate_file_api(temp_path, codes)
        if "error" in result:
            return JSONResponse(status_code=400, content={"error": result["error"]})
        return {"translations": result}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        os.remove(temp_path)