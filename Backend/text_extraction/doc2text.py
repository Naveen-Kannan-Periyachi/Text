from docx import Document
import os

def extract_text_from_docx(docx_path):
    if not os.path.exists(docx_path):
        return "Error: File not found."

    try:
        document = Document(docx_path)
    except Exception as e:
        return f"Error: Unable to open Word document - {e}"

    extracted_text = []
    for paragraph in document.paragraphs:
        text = paragraph.text.strip()
        if text:
            extracted_text.append(text)

    return "\n".join(extracted_text)

if __name__ == "__main__":
    # Get the Word document file path from the user at runtime
    docx_path = input("Enter the path to the Word document (.docx): ").strip()
    extract_text_from_docx(docx_path)
