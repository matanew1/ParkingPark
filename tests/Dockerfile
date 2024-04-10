# Use an official Python runtime as the base image
FROM python:3.9

# Set the working directory in the container
WORKDIR /tests

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the test files to the working directory
COPY . .

# Run main.py when the container launches
CMD ["python", "main.py"]