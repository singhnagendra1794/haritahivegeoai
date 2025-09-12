import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const GeospatialMLFramework = () => {
  const mlTasks = [
    {
      task: "Land-Use Classification",
      icon: "🌍",
      type: "Supervised Classification",
      libraries: ["TensorFlow", "PyTorch", "Rasterio", "GDAL"],
      metrics: ["Overall Accuracy", "Kappa Coefficient", "Per-class F1", "IoU"],
      datasets: "Landsat, Sentinel-2, NAIP, Custom annotations",
      approach: "CNN-based pixel classification with spatial context"
    },
    {
      task: "Object Detection",
      icon: "🛰️",
      type: "Computer Vision",
      libraries: ["Detectron2", "YOLO", "TorchVision", "OpenCV"],
      metrics: ["mAP@0.5", "mAP@0.75", "Precision/Recall", "Detection Rate"],
      datasets: "xView, DOTA, Custom labeled imagery",
      approach: "Region-based CNN with geospatial context awareness"
    },
    {
      task: "Change Detection",
      icon: "📊",
      type: "Temporal Analysis",
      libraries: ["TensorFlow", "Scikit-learn", "OpenCV", "Rasterio"],
      metrics: ["Change Detection Rate", "False Alarm Rate", "Overall Accuracy"],
      datasets: "Multi-temporal satellite imagery, Historical datasets",
      approach: "Siamese networks and difference analysis"
    },
    {
      task: "Spatial Clustering",
      icon: "🔍",
      type: "Unsupervised Learning",
      libraries: ["Scikit-learn", "DBSCAN", "GeoPandas", "PySAL"],
      metrics: ["Silhouette Score", "Calinski-Harabasz Index", "Spatial Autocorrelation"],
      datasets: "Point patterns, Polygon features, Spatial networks",
      approach: "Density-based clustering with spatial constraints"
    },
    {
      task: "Spatiotemporal Forecasting",
      icon: "📈",
      type: "Time Series + Spatial",
      libraries: ["PyTorch", "Prophet", "GeoStats", "NetworkX"],
      metrics: ["RMSE", "MAE", "Spatial Cross-correlation", "Temporal R²"],
      datasets: "IoT sensors, Environmental monitoring, Traffic data",
      approach: "Graph neural networks with temporal embeddings"
    }
  ];

  const deploymentStrategies = [
    {
      type: "Batch Inference",
      icon: "⚡",
      use_cases: ["Large-scale land cover mapping", "Historical analysis", "Periodic reports"],
      infrastructure: ["Apache Spark", "Kubernetes Jobs", "Distributed computing"],
      characteristics: ["High throughput", "Scheduled execution", "Cost-effective"]
    },
    {
      type: "Streaming Inference",
      icon: "🌊",
      use_cases: ["Real-time change detection", "Emergency response", "IoT processing"],
      infrastructure: ["Apache Kafka", "Apache Flink", "Edge computing"],
      characteristics: ["Low latency", "Continuous processing", "Event-driven"]
    },
    {
      type: "Online Inference",
      icon: "🚀",
      use_cases: ["Interactive web apps", "Mobile applications", "API services"],
      infrastructure: ["Model serving (TensorFlow Serving)", "REST APIs", "Load balancers"],
      characteristics: ["Real-time response", "Scalable", "User-facing"]
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold">Geospatial ML Framework</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              End-to-end machine learning pipeline for geospatial analytics, from data preprocessing to model deployment
            </p>
          </div>

          {/* Framework Architecture Overview */}
          <Card className="p-8 mb-12">
            <h3 className="mb-8 text-2xl font-semibold text-center">ML Framework Architecture</h3>
            <div className="bg-muted/20 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
                <div className="space-y-2">
                  <div className="bg-geo-primary/20 p-3 rounded border border-geo-primary/30">
                    <h4 className="font-semibold text-sm text-geo-primary mb-1">Data Ingestion</h4>
                    <div className="text-xs space-y-1">
                      <div>📡 Satellite APIs</div>
                      <div>🗄️ Data Lakes</div>
                      <div>📊 Feature Stores</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-lg text-geo-primary">→</div>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-geo-secondary/20 p-3 rounded border border-geo-secondary/30">
                    <h4 className="font-semibold text-sm text-geo-secondary mb-1">Preprocessing</h4>
                    <div className="text-xs space-y-1">
                      <div>🔄 Georeferencing</div>
                      <div>✂️ Tiling</div>
                      <div>🎯 Augmentation</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-lg text-geo-secondary">→</div>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-geo-accent/20 p-3 rounded border border-geo-accent/30">
                    <h4 className="font-semibold text-sm text-geo-accent mb-1">Training</h4>
                    <div className="text-xs space-y-1">
                      <div>🧠 Model Training</div>
                      <div>📈 Hyperparameter Tuning</div>
                      <div>✅ Validation</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-lg text-geo-accent">→</div>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-primary/20 p-3 rounded border border-primary/30">
                    <h4 className="font-semibold text-sm text-primary mb-1">Deployment</h4>
                    <div className="text-xs space-y-1">
                      <div>🚀 Model Serving</div>
                      <div>📊 Monitoring</div>
                      <div>🔄 A/B Testing</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ML Tasks Details */}
          <div className="mb-12">
            <h3 className="mb-8 text-2xl font-semibold text-center">Geospatial ML Tasks & Approaches</h3>
            <div className="grid gap-6">
              {mlTasks.map((task, index) => (
                <Card key={index} className="p-6">
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{task.icon}</span>
                        <div>
                          <h4 className="font-semibold">{task.task}</h4>
                          <Badge variant="outline" className="text-xs mt-1">{task.type}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.approach}</p>
                    </div>
                    
                    <div className="text-sm">
                      <h5 className="font-medium mb-2">Libraries</h5>
                      <div className="space-y-1">
                        {task.libraries.map((lib, i) => (
                          <Badge key={i} variant="secondary" className="text-xs mr-1 mb-1">{lib}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <h5 className="font-medium mb-2">Evaluation Metrics</h5>
                      <div className="space-y-1">
                        {task.metrics.map((metric, i) => (
                          <div key={i} className="text-xs">• {metric}</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <h5 className="font-medium mb-2">Data Sources</h5>
                      <p className="text-xs text-muted-foreground">{task.datasets}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Technology Stack & Libraries */}
          <Card className="p-8 mb-12">
            <h3 className="mb-6 text-2xl font-semibold text-center">ML Technology Stack</h3>
            <Tabs defaultValue="frameworks" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="frameworks">ML Frameworks</TabsTrigger>
                <TabsTrigger value="geospatial">Geospatial Tools</TabsTrigger>
                <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
                <TabsTrigger value="monitoring">MLOps & Monitoring</TabsTrigger>
              </TabsList>
              
              <TabsContent value="frameworks" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">TensorFlow/Keras</h4>
                    <p className="text-sm text-muted-foreground mb-2">Deep learning for image classification and object detection</p>
                    <Badge variant="secondary" className="text-xs">Primary Framework</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">PyTorch</h4>
                    <p className="text-sm text-muted-foreground mb-2">Research-oriented deep learning with dynamic graphs</p>
                    <Badge variant="secondary" className="text-xs">Research & Development</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Detectron2</h4>
                    <p className="text-sm text-muted-foreground mb-2">State-of-the-art object detection and segmentation</p>
                    <Badge variant="secondary" className="text-xs">Object Detection</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Scikit-learn</h4>
                    <p className="text-sm text-muted-foreground mb-2">Traditional ML algorithms and preprocessing</p>
                    <Badge variant="secondary" className="text-xs">Classical ML</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">XGBoost/LightGBM</h4>
                    <p className="text-sm text-muted-foreground mb-2">Gradient boosting for tabular geospatial features</p>
                    <Badge variant="secondary" className="text-xs">Ensemble Methods</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Optuna/Ray Tune</h4>
                    <p className="text-sm text-muted-foreground mb-2">Hyperparameter optimization frameworks</p>
                    <Badge variant="secondary" className="text-xs">Optimization</Badge>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="geospatial" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">GDAL/OGR</h4>
                    <p className="text-sm text-muted-foreground mb-2">Geospatial data abstraction library</p>
                    <Badge variant="secondary" className="text-xs">Core Library</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Rasterio</h4>
                    <p className="text-sm text-muted-foreground mb-2">Raster data I/O and processing</p>
                    <Badge variant="secondary" className="text-xs">Raster Processing</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">GeoPandas</h4>
                    <p className="text-sm text-muted-foreground mb-2">Vector data manipulation and analysis</p>
                    <Badge variant="secondary" className="text-xs">Vector Processing</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Satpy</h4>
                    <p className="text-sm text-muted-foreground mb-2">Satellite data processing and visualization</p>
                    <Badge variant="secondary" className="text-xs">Satellite Data</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">PySAL</h4>
                    <p className="text-sm text-muted-foreground mb-2">Spatial analysis and econometrics</p>
                    <Badge variant="secondary" className="text-xs">Spatial Analysis</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">EarthPy</h4>
                    <p className="text-sm text-muted-foreground mb-2">Earth science data processing utilities</p>
                    <Badge variant="secondary" className="text-xs">Earth Science</Badge>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="infrastructure" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Apache Spark</h4>
                    <p className="text-sm text-muted-foreground mb-2">Distributed data processing for large datasets</p>
                    <Badge variant="secondary" className="text-xs">Big Data</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Dask</h4>
                    <p className="text-sm text-muted-foreground mb-2">Parallel computing in Python</p>
                    <Badge variant="secondary" className="text-xs">Parallel Processing</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Kubernetes</h4>
                    <p className="text-sm text-muted-foreground mb-2">Container orchestration for ML workloads</p>
                    <Badge variant="secondary" className="text-xs">Orchestration</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">TensorFlow Serving</h4>
                    <p className="text-sm text-muted-foreground mb-2">High-performance model serving system</p>
                    <Badge variant="secondary" className="text-xs">Model Serving</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Apache Airflow</h4>
                    <p className="text-sm text-muted-foreground mb-2">Workflow orchestration for ML pipelines</p>
                    <Badge variant="secondary" className="text-xs">Pipeline Management</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Docker</h4>
                    <p className="text-sm text-muted-foreground mb-2">Containerization for reproducible environments</p>
                    <Badge variant="secondary" className="text-xs">Containerization</Badge>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="monitoring" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">MLflow</h4>
                    <p className="text-sm text-muted-foreground mb-2">Experiment tracking and model lifecycle management</p>
                    <Badge variant="secondary" className="text-xs">MLOps Platform</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Weights & Biases</h4>
                    <p className="text-sm text-muted-foreground mb-2">Advanced experiment tracking and collaboration</p>
                    <Badge variant="secondary" className="text-xs">Experiment Tracking</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Prometheus</h4>
                    <p className="text-sm text-muted-foreground mb-2">Model performance and system metrics monitoring</p>
                    <Badge variant="secondary" className="text-xs">Monitoring</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Grafana</h4>
                    <p className="text-sm text-muted-foreground mb-2">Visualization and alerting for ML metrics</p>
                    <Badge variant="secondary" className="text-xs">Visualization</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Great Expectations</h4>
                    <p className="text-sm text-muted-foreground mb-2">Data quality and validation framework</p>
                    <Badge variant="secondary" className="text-xs">Data Quality</Badge>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Evidently</h4>
                    <p className="text-sm text-muted-foreground mb-2">Model monitoring and drift detection</p>
                    <Badge variant="secondary" className="text-xs">Model Monitoring</Badge>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Deployment Strategies */}
          <Card className="p-8 mb-12">
            <h3 className="mb-6 text-2xl font-semibold text-center">Deployment Strategies</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {deploymentStrategies.map((strategy, index) => (
                <Card key={index} className="p-6">
                  <div className="text-center mb-4">
                    <div className="mx-auto w-16 h-16 bg-geo-primary/10 rounded-full flex items-center justify-center text-2xl mb-3">
                      {strategy.icon}
                    </div>
                    <h4 className="font-semibold text-lg">{strategy.type}</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Use Cases</h5>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {strategy.use_cases.map((use_case, i) => (
                          <li key={i}>• {use_case}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Infrastructure</h5>
                      <div className="flex flex-wrap gap-1">
                        {strategy.infrastructure.map((infra, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{infra}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Key Characteristics</h5>
                      <div className="flex flex-wrap gap-1">
                        {strategy.characteristics.map((char, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{char}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Sample Configurations */}
          <Card className="p-8 mb-12">
            <h3 className="mb-6 text-2xl font-semibold text-center">Sample Configurations & Code</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="training-config">
                <AccordionTrigger>Training Pipeline Configuration</AccordionTrigger>
                <AccordionContent>
                  <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
{`# training_config.yaml
model:
  name: "land_use_classifier"
  architecture: "ResNet50"
  input_shape: [224, 224, 3]
  num_classes: 10
  
data:
  train_path: "/data/landuse/train"
  val_path: "/data/landuse/val"
  batch_size: 32
  augmentation:
    rotation_range: 15
    horizontal_flip: true
    zoom_range: 0.1
    brightness_range: [0.8, 1.2]
    
preprocessing:
  normalize: true
  mean: [0.485, 0.456, 0.406]
  std: [0.229, 0.224, 0.225]
  tile_size: 224
  overlap: 0.1
  
training:
  epochs: 100
  learning_rate: 0.001
  optimizer: "adam"
  loss: "categorical_crossentropy"
  early_stopping:
    patience: 10
    monitor: "val_accuracy"
    
hyperparameter_tuning:
  method: "optuna"
  n_trials: 50
  search_space:
    learning_rate: [0.0001, 0.01, "log"]
    batch_size: [16, 32, 64]
    dropout_rate: [0.1, 0.5]`}
                  </pre>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="model-serving">
                <AccordionTrigger>Model Serving Configuration</AccordionTrigger>
                <AccordionContent>
                  <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
{`# model_server.py
import tensorflow as tf
from flask import Flask, request, jsonify
import rasterio
import numpy as np

app = Flask(__name__)

class GeospatialModelServer:
    def __init__(self, model_path):
        self.model = tf.saved_model.load(model_path)
        self.class_names = [
            'urban', 'agriculture', 'forest', 'water',
            'barren', 'grassland', 'shrubland', 'wetlands'
        ]
    
    def preprocess_raster(self, file_path):
        with rasterio.open(file_path) as src:
            # Read bands (assuming RGB)
            image = src.read([1, 2, 3])
            image = np.transpose(image, (1, 2, 0))
            
            # Normalize to [0, 1]
            image = image.astype(np.float32) / 255.0
            
            # Resize to model input size
            image = tf.image.resize(image, [224, 224])
            
            # Add batch dimension
            return tf.expand_dims(image, 0)
    
    def predict(self, image_tensor):
        predictions = self.model(image_tensor)
        predicted_class = tf.argmax(predictions, axis=1).numpy()[0]
        confidence = tf.reduce_max(predictions).numpy()
        
        return {
            'class': self.class_names[predicted_class],
            'confidence': float(confidence),
            'probabilities': {
                name: float(prob) for name, prob 
                in zip(self.class_names, predictions[0].numpy())
            }
        }

model_server = GeospatialModelServer('/models/landuse_classifier')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    # Save temporarily and process
    temp_path = f'/tmp/{file.filename}'
    file.save(temp_path)
    
    try:
        image_tensor = model_server.preprocess_raster(temp_path)
        result = model_server.predict(image_tensor)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        os.remove(temp_path)`}
                  </pre>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="ci-pipeline">
                <AccordionTrigger>CI/CD Pipeline (GitLab CI)</AccordionTrigger>
                <AccordionContent>
                  <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
{`# .gitlab-ci.yml
stages:
  - data-validation
  - training
  - model-validation
  - deployment
  - monitoring

variables:
  DOCKER_DRIVER: overlay2
  MLFLOW_TRACKING_URI: "http://mlflow-server:5000"

data_validation:
  stage: data-validation
  image: python:3.9
  script:
    - pip install great-expectations pandas rasterio
    - python scripts/validate_data.py
    - great_expectations checkpoint run training_data_checkpoint
  artifacts:
    reports:
      - data_validation_report.html

model_training:
  stage: training
  image: tensorflow/tensorflow:2.12.0-gpu
  script:
    - pip install -r requirements.txt
    - python train_model.py --config config/training_config.yaml
    - mlflow log-model --model-path ./models/latest
  artifacts:
    paths:
      - models/
      - metrics/
  only:
    - main
    - develop

model_validation:
  stage: model-validation
  script:
    - python scripts/validate_model.py
    - python scripts/test_model_performance.py
    - |
      if [ $ACCURACY -lt 0.85 ]; then
        echo "Model accuracy below threshold"
        exit 1
      fi
  dependencies:
    - model_training

deploy_staging:
  stage: deployment
  environment: staging
  script:
    - docker build -t geospatial-ml:$CI_COMMIT_SHA .
    - kubectl apply -f k8s/staging/
    - kubectl set image deployment/ml-service ml-service=geospatial-ml:$CI_COMMIT_SHA
  only:
    - develop

deploy_production:
  stage: deployment
  environment: production
  script:
    - docker build -t geospatial-ml:$CI_COMMIT_SHA .
    - kubectl apply -f k8s/production/
    - kubectl set image deployment/ml-service ml-service=geospatial-ml:$CI_COMMIT_SHA
  when: manual
  only:
    - main

monitor_model:
  stage: monitoring
  script:
    - python scripts/setup_monitoring.py
    - python scripts/create_alerts.py
  dependencies:
    - deploy_production
  only:
    - main`}
                  </pre>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="kubernetes-deployment">
                <AccordionTrigger>Kubernetes Deployment Manifest</AccordionTrigger>
                <AccordionContent>
                  <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
{`# k8s/production/ml-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: geospatial-ml-service
  labels:
    app: geospatial-ml
spec:
  replicas: 3
  selector:
    matchLabels:
      app: geospatial-ml
  template:
    metadata:
      labels:
        app: geospatial-ml
    spec:
      containers:
      - name: ml-service
        image: geospatial-ml:latest
        ports:
        - containerPort: 5000
        env:
        - name: MODEL_PATH
          value: "/models/landuse_classifier"
        - name: BATCH_SIZE
          value: "32"
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        volumeMounts:
        - name: model-storage
          mountPath: /models
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: model-storage
        persistentVolumeClaim:
          claimName: model-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: geospatial-ml-service
spec:
  selector:
    app: geospatial-ml
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
  type: LoadBalancer
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: geospatial-ml-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: geospatial-ml-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80`}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* Model Versioning & Experiment Tracking */}
          <Card className="p-8 mb-12">
            <h3 className="mb-6 text-2xl font-semibold text-center">Model Versioning & Experiment Tracking</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">MLflow Integration</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-geo-primary pl-4">
                    <h5 className="font-medium">Experiment Tracking</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track hyperparameters, metrics, and model artifacts across experiments
                    </p>
                  </div>
                  <div className="border-l-4 border-geo-secondary pl-4">
                    <h5 className="font-medium">Model Registry</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Version control for models with staging and production deployment
                    </p>
                  </div>
                  <div className="border-l-4 border-geo-accent pl-4">
                    <h5 className="font-medium">Artifact Store</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Store model files, datasets, and preprocessing artifacts
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Model Lifecycle Management</h4>
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Development</span>
                    <Badge variant="outline">v1.0.0-dev</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Staging</span>
                    <Badge variant="outline">v1.1.0-rc.1</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Production</span>
                    <Badge variant="default">v1.0.0</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Archive</span>
                    <Badge variant="secondary">v0.9.x</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Implementation Roadmap */}
          <Card className="p-8">
            <h3 className="mb-6 text-2xl font-semibold text-center">ML Framework Implementation Roadmap</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-geo-primary/20 rounded-full flex items-center justify-center text-lg font-semibold text-geo-primary mb-2">
                    1
                  </div>
                  <h4 className="font-semibold text-geo-primary">Foundation (Weeks 1-3)</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Core Infrastructure</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• MLflow tracking server</li>
                      <li>• Docker containerization</li>
                      <li>• Data preprocessing pipelines</li>
                      <li>• Basic training workflows</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-geo-secondary/20 rounded-full flex items-center justify-center text-lg font-semibold text-geo-secondary mb-2">
                    2
                  </div>
                  <h4 className="font-semibold text-geo-secondary">Development (Weeks 4-6)</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Model Development</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Land-use classification models</li>
                      <li>• Object detection pipelines</li>
                      <li>• Hyperparameter tuning</li>
                      <li>• Model validation frameworks</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-geo-accent/20 rounded-full flex items-center justify-center text-lg font-semibold text-geo-accent mb-2">
                    3
                  </div>
                  <h4 className="font-semibold text-geo-accent">Deployment (Weeks 7-9)</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Production Systems</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Kubernetes deployment</li>
                      <li>• Model serving infrastructure</li>
                      <li>• CI/CD pipelines</li>
                      <li>• Monitoring and alerting</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-lg font-semibold text-primary mb-2">
                    4
                  </div>
                  <h4 className="font-semibold text-primary">Advanced (Weeks 10-12)</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded border">
                    <h5 className="font-medium text-sm">Advanced Features</h5>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• A/B testing framework</li>
                      <li>• Model drift detection</li>
                      <li>• Advanced forecasting</li>
                      <li>• Multi-model ensembles</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GeospatialMLFramework;