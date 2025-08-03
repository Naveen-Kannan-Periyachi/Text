import cv2
import easyocr
import os

def extract_text(image_path):
    # Check if the file exists
    if not os.path.exists(image_path):
        print(f"Error: File '{image_path}' not found.")
        return
    
    try:
        # Load the image using OpenCV
        image = cv2.imread(image_path)
        if image is None:
            print(f"Error: Unable to read the image. Please check the file format.")
            return
    except Exception as e:
        print(f"Error: Unable to load image - {e}")
        return

    # Convert the image to grayscale for better OCR accuracy
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Initialize EasyOCR reader with English language
    reader = easyocr.Reader(['en'])

    try:
        # Perform OCR and extract text
        results = reader.readtext(gray_image)
    except Exception as e:
        print(f"Error during OCR: {e}")
        return

    # Extract and print detected text
    extracted_text = []
    for (bbox, text, prob) in results:
        print(f"Detected text: {text} (Confidence: {prob:.2f})")
        extracted_text.append(text)

    # Display the extracted text in the terminal
    # Optionally print and save, but always return the text
    print("\nExtracted Text:")
    print("\n".join(extracted_text))

    output_file = "extracted_text.txt"
    with open(output_file, "w", encoding="utf-8") as file:
        file.write("\n".join(extracted_text))
    print(f"\nText extracted and saved to '{output_file}'.")

    return "\n".join(extracted_text)

if __name__ == "__main__":
    # Get the image file path from the user at runtime
    image_path = input("Enter the path to the image file: ").strip()
    extract_text(image_path)
