# Use NVIDIA CUDA base image with Ubuntu 22.04
FROM nvidia/cuda:12.0.0-base-ubuntu22.04

# Set working directory
WORKDIR /app

# Install Python 3.10, pip, and dependencies
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    python3.10-venv \
    && rm -rf /var/lib/apt/lists/*

# Set python3 as default
RUN ln -s /usr/bin/python3.10 /usr/bin/python
RUN python -m ensurepip --upgrade

# Install pip dependencies from requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application (ML models, etc.)
COPY . .

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
