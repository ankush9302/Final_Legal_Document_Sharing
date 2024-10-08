import fitz  # PyMuPDF
import os
from PIL import Image
from cloud_storage import upload_image

def pdf_to_images_and_upload(pdf_path, zoom_x=2.0, zoom_y=2.0):
    pdf = fitz.open(pdf_path)
    links = []

    for page_num in range(len(pdf)):
        page = pdf[page_num]
        mat = fitz.Matrix(zoom_x, zoom_y)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        object_name = f"page_{page_num + 1}.png"
        url = upload_image(img, object_name)
        
        if url:
            links.append(url)

    print(f"Extracted and uploaded {len(pdf)} pages from the PDF.")
    pdf.close()
    return links

pdf_path = r"D:\Legal_Doc_Sharing\extracted\Legal_Document_Sharing-main\Legal_Document_Sharing-main\python_run_script\Notice.pdf"

# Call the function and get the links
links = pdf_to_images_and_upload(pdf_path, zoom_x=3.0, zoom_y=3.0)

# Print or store the links as needed
for i, link in enumerate(links, 1):
    print(f"Page {i}: {link}")

# Optionally, save links to a file
with open('page_links.txt', 'w') as f:
    for i, link in enumerate(links, 1):
        f.write(f"Page {i}: {link}\n")