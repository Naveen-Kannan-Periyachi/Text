import fitz  # PyMuPDF
import os

def extract_text_from_pdf(pdf_path):
    # Check if the file exists
    if not os.path.exists(pdf_path):
        print(f"Error: File '{pdf_path}' not found.")
        return
    
    try:
        # Open the PDF file
        pdf_document = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error: Unable to open PDF file - {e}")
        return

    # Extract text from each page
    extracted_text = []
    for page_num in range(len(pdf_document)):
        try:
            page = pdf_document[page_num]
            text = page.get_text()
            print(f"\n--- Text from Page {page_num + 1} ---")
            print(text.strip())
            extracted_text.append(text)
        except Exception as e:
            print(f"Error extracting text from page {page_num + 1}: {e}")

    # Close the PDF file
    pdf_document.close()

    # Save the extracted text to a file (optional)
    output_file = "extracted_text_from_pdf.txt"
    try:
        with open(output_file, "w", encoding="utf-8") as file:
            file.write("\n".join(extracted_text))
        print(f"\nAll text extracted and saved to '{output_file}'.")
    except Exception as e:
        print(f"Error saving extracted text: {e}")

    # Return the extracted text as a single string for API use
    return "\n".join(extracted_text)

if __name__ == "__main__":
    # Get the PDF file path from the user at runtime
    pdf_path = input("Enter the path to the PDF file: ").strip()
    extract_text_from_pdf(pdf_path)
