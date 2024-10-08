from minio import Minio
from minio.error import S3Error
from io import BytesIO
from PIL import Image
from datetime import timedelta

# MinIO client setup
minio_client = Minio(
    "play.min.io",
    access_key="Q3AM3UQ867SPQQA43P2F",
    secret_key="zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",
    secure=True
)

# Create a bucket (if it doesn't exist)
bucket_name = "unhappy-bucket"
try:
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)
except S3Error as e:
    print(f"Error creating bucket: {e}")

def upload_image(image, object_name):
    img_byte_arr = BytesIO()
    image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    try:
        minio_client.put_object(
            bucket_name, object_name, img_byte_arr, length=img_byte_arr.getbuffer().nbytes,
            content_type="image/png"
        )
        print(f"Uploaded {object_name}")
        
        # Generate a presigned URL for the object (valid for 7 days)
        url = minio_client.presigned_get_object(bucket_name, object_name, expires=timedelta(days=7))
        return url
    except S3Error as e:
        print(f"Error uploading {object_name}: {e}")
        return None
