import os
from rembg import remove
from PIL import Image

input_path = r"C:\Users\advai\.gemini\antigravity-ide\brain\d97a8b30-90c3-4d53-a1e5-875571a31d4a\.user_uploaded\media_1788062644115.jpg"
output_path = r"d:\Website\advaita-website\public\pfp.png"

input_image = Image.open(input_path)
output_image = remove(input_image)
output_image.save(output_path)
print("Successfully generated background-free image.")
