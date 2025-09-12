FROM tensorflow/serving:2.14.0

# Create model directory structure
RUN mkdir -p /models/ndvi_model/1
RUN mkdir -p /models/buffer_model/1
RUN mkdir -p /models/change_detection_model/1

# Copy model files (these would be actual trained models in production)
# COPY models/ndvi/1/ /models/ndvi_model/1/
# COPY models/buffer/1/ /models/buffer_model/1/
# COPY models/change_detection/1/ /models/change_detection_model/1/

# Create model config
COPY models.config /models/

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8501/v1/models/ndvi_model || exit 1

# Expose ports
EXPOSE 8500 8501

# Set environment variables
ENV MODEL_BASE_PATH=/models
ENV MODEL_CONFIG_FILE=/models/models.config

# Start serving
CMD ["tensorflow_model_server", \
     "--port=8500", \
     "--rest_api_port=8501", \
     "--model_config_file=/models/models.config", \
     "--monitoring_config_file=/models/monitoring.config", \
     "--allow_version_labels=true"]