# Use an official Python runtime as a parent image
FROM python:3.8

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install R and required packages
RUN apt-get update && \
    apt-get install -y r-base && \
    R -e "install.packages(c('survival', 'survminer', 'ggplot2', 'dplyr', 'tidyr', 'readr', 'pacman', 'broom'), repos='https://cran.rstudio.com/')"

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt



# Make port 5000 available to the world outside this container
# EXPOSE 5000

# Define environment variable
# ENV NAME World

# "--chdir", "/app/HNC-PREDICTOR/api"

# Run app.py when the container launches
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "backend:app"]