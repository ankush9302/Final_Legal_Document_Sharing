import os
from PyPDF2 import PdfReader, PdfWriter

def extract_pdf_pages(input_pdf, output_folder):
    
    os.makedirs(output_folder, exist_ok=True)

    with open(input_pdf, 'rb') as file:
        pdf = PdfReader(file)
        total_pages = len(pdf.pages)

        for page_num in range(total_pages):
            pdf_writer = PdfWriter()
            pdf_writer.add_page(pdf.pages[page_num])

            output_filename = f"{page_num + 1}.pdf"
            output_path = os.path.join(output_folder, output_filename)

            with open(output_path, 'wb') as output_file:
                pdf_writer.write(output_file)

    print(f"Extracted {total_pages} pages to {output_folder}")

input_pdf = r"D:\Legal_Doc_Sharing\extracted\Legal_Document_Sharing-main\Legal_Document_Sharing-main\python_run_script\Notice.pdf"
output_folder = "D:\Legal_Doc_Sharing\extracted\Legal_Document_Sharing-main\Legal_Document_Sharing-main\python_run_script\python_run_script\Images"

extract_pdf_pages(input_pdf, output_folder)
