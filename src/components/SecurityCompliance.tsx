import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Database,
  Globe,
  Users,
  Code,
  Search,
  Fingerprint,
  Clock,
  Bug,
  GitBranch,
  Zap,
  Building,
  Scale,
  Crown,
  UserCheck,
  Server,
  Network,
  Laptop
} from "lucide-react";

const SecurityCompliance = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Security & Compliance Framework
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive security checklist and compliance guidelines for the GeoAI platform
          </p>
        </div>

        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="architecture">Security Architecture</TabsTrigger>
            <TabsTrigger value="api">API Security</TabsTrigger>
            <TabsTrigger value="rbac">RBAC</TabsTrigger>
            <TabsTrigger value="encryption">Encryption</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="threats">Threat Model</TabsTrigger>
            <TabsTrigger value="tools">Security Tools</TabsTrigger>
            <TabsTrigger value="opensource">Open Source Security</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Architecture Overview
                  </CardTitle>
                  <CardDescription>
                    Multi-layered security approach for the GeoAI platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Defense in Depth Layers</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`┌─────────────────────────────────────┐
│           User Interface            │
├─────────────────────────────────────┤
│        Application Layer            │
│  • Input validation                 │
│  • Authentication & Authorization   │
│  • Session management               │
├─────────────────────────────────────┤
│          API Gateway                │
│  • Rate limiting                    │
│  • Request validation               │
│  • Security headers                 │
├─────────────────────────────────────┤
│        Business Logic              │
│  • RBAC enforcement                 │
│  • Data validation                  │
│  • Audit logging                    │
├─────────────────────────────────────┤
│         Data Layer                  │
│  • Encryption at rest              │
│  • RLS policies                     │
│  • Data anonymization              │
├─────────────────────────────────────┤
│       Infrastructure               │
│  • Network security                │
│  • Container security              │
│  • Secrets management              │
└─────────────────────────────────────┘`}
                    </pre>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Security Principles</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Principle of least privilege</li>
                        <li>• Zero trust architecture</li>
                        <li>• Defense in depth</li>
                        <li>• Fail securely</li>
                        <li>• Privacy by design</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Security Checklist
                  </CardTitle>
                  <CardDescription>
                    Essential security controls implementation status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Authentication & Authorization</Badge>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Multi-factor authentication</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>JWT token validation</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Role-based access control</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>OAuth provider integration</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">Data Protection</Badge>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Encryption in transit (TLS 1.3)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Database encryption at rest</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>PII data anonymization</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>Data retention policies</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">Monitoring & Logging</Badge>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Security event logging</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>SIEM integration</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>Incident response plan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Network Security
                  </CardTitle>
                  <CardDescription>
                    Network-level security controls and configurations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Infrastructure Security</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• VPC with private subnets</li>
                        <li>• Web Application Firewall (WAF)</li>
                        <li>• DDoS protection</li>
                        <li>• Load balancer SSL termination</li>
                        <li>• Container network policies</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Security Headers</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Security headers configuration
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};`}
                    </pre>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Rate Limiting</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// API rate limiting configuration
const rateLimits = {
  '/api/auth/login': '5 requests per 15 minutes',
  '/api/data/upload': '10 requests per hour',
  '/api/ml/process': '100 requests per day',
  '/api/tiles/*': '1000 requests per minute'
};`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Container Security
                  </CardTitle>
                  <CardDescription>
                    Docker and Kubernetes security best practices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Container Hardening</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Non-root user containers</li>
                        <li>• Minimal base images (distroless)</li>
                        <li>• Image vulnerability scanning</li>
                        <li>• Read-only root filesystems</li>
                        <li>• Resource limits and quotas</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Dockerfile Security</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`FROM node:18-alpine AS builder
RUN addgroup -g 1001 -S nodejs
RUN adduser -S geoai -u 1001

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM gcr.io/distroless/nodejs18-debian11
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /app /app
USER geoai
EXPOSE 3000
CMD ["index.js"]`}
                    </pre>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Kubernetes Security Policy</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: geoai-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    API Security Framework
                  </CardTitle>
                  <CardDescription>
                    Comprehensive API security implementation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Authentication Methods</Badge>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 border rounded">
                          <h5 className="font-medium">JWT Tokens</h5>
                          <p className="text-muted-foreground text-xs">Stateless authentication</p>
                        </div>
                        <div className="p-2 border rounded">
                          <h5 className="font-medium">API Keys</h5>
                          <p className="text-muted-foreground text-xs">Service-to-service</p>
                        </div>
                        <div className="p-2 border rounded">
                          <h5 className="font-medium">OAuth 2.0</h5>
                          <p className="text-muted-foreground text-xs">Third-party access</p>
                        </div>
                        <div className="p-2 border rounded">
                          <h5 className="font-medium">mTLS</h5>
                          <p className="text-muted-foreground text-xs">Machine-to-machine</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">JWT Implementation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// JWT middleware for API protection
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Usage in Express routes
app.get('/api/secure-data', authenticateJWT, (req, res) => {
  // Protected endpoint logic
});`}
                    </pre>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Input Validation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Input validation with Joi
const Joi = require('joi');

const geoDataSchema = Joi.object({
  coordinates: Joi.array()
    .items(Joi.number().min(-180).max(180))
    .length(2)
    .required(),
  properties: Joi.object().pattern(
    Joi.string(),
    Joi.alternatives().try(Joi.string(), Joi.number())
  ),
  type: Joi.string().valid('Point', 'LineString', 'Polygon')
});

// Middleware for validation
const validateGeoData = (req, res, next) => {
  const { error } = geoDataSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    API Threat Protection
                  </CardTitle>
                  <CardDescription>
                    Protection against common API attacks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">OWASP API Top 10</Badge>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Broken Object Level Authorization</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Protected</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Broken User Authentication</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Protected</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Excessive Data Exposure</span>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Partial</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Lack of Resources & Rate Limiting</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Protected</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Broken Function Level Authorization</span>
                          <Badge variant="outline" className="bg-red-50 text-red-700">Review Needed</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Rate Limiting Implementation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Express rate limiting
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const client = redis.createClient();

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => client.sendCommand(args),
    }),
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different limits for different endpoints
app.use('/api/auth', createRateLimit(15 * 60 * 1000, 5, 'Too many auth attempts'));
app.use('/api/upload', createRateLimit(60 * 60 * 1000, 10, 'Upload limit exceeded'));
app.use('/api/', createRateLimit(15 * 60 * 1000, 100, 'Rate limit exceeded'));`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5" />
                    API Security Testing
                  </CardTitle>
                  <CardDescription>
                    Automated security testing for APIs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Security Testing Tools</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• OWASP ZAP for dynamic scanning</li>
                        <li>• Burp Suite for manual testing</li>
                        <li>• Postman for automated testing</li>
                        <li>• Newman for CI/CD integration</li>
                        <li>• Nuclei for vulnerability scanning</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Automated Security Tests</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Jest security test examples
describe('API Security Tests', () => {
  test('should reject requests without authentication', async () => {
    const response = await request(app)
      .get('/api/protected')
      .expect(401);
  });

  test('should prevent SQL injection', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    const response = await request(app)
      .post('/api/search')
      .send({ query: maliciousInput })
      .expect(400);
  });

  test('should enforce rate limiting', async () => {
    const requests = Array(10).fill().map(() => 
      request(app).get('/api/data')
    );
    
    const responses = await Promise.all(requests);
    expect(responses.some(r => r.status === 429)).toBeTruthy();
  });

  test('should sanitize output data', async () => {
    const response = await request(app)
      .get('/api/user/profile')
      .set('Authorization', \`Bearer \${validToken}\`)
      .expect(200);
    
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('internalId');
  });
});`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    API Documentation Security
                  </CardTitle>
                  <CardDescription>
                    Secure API documentation and schema management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Documentation Security</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• No sensitive data in examples</li>
                        <li>• Authentication requirements clearly marked</li>
                        <li>• Rate limiting information included</li>
                        <li>• Security headers documented</li>
                        <li>• Error responses don't leak information</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">OpenAPI Security Schema</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`# OpenAPI 3.0 security definition
openapi: 3.0.0
info:
  title: GeoAI Platform API
  version: 1.0.0

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key

security:
  - BearerAuth: []

paths:
  /api/data:
    get:
      summary: Get geospatial data
      security:
        - BearerAuth: []
      parameters:
        - name: bbox
          in: query
          schema:
            type: string
            pattern: '^-?\\d+\\.\\d+,-?\\d+\\.\\d+,-?\\d+\\.\\d+,-?\\d+\\.\\d+$'
      responses:
        '401':
          description: Unauthorized
        '403':
          description: Forbidden
        '429':
          description: Rate limit exceeded`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rbac">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    RBAC Architecture
                  </CardTitle>
                  <CardDescription>
                    Role-based access control implementation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Role Hierarchy</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`Super Admin
├── Organization Admin
│   ├── Data Manager
│   │   ├── Data Analyst
│   │   └── Data Viewer
│   └── ML Engineer
│       ├── Model Developer
│       └── Model Viewer
└── System Admin
    ├── Security Admin
    └── Audit Admin

Permissions inherit from parent roles
Custom permissions can be granted per user`}
                    </pre>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Core Roles</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Super Admin</span>
                          <Badge variant="outline">All permissions</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Organization Admin</span>
                          <Badge variant="outline">Org management</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Data Manager</span>
                          <Badge variant="outline">Data operations</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">ML Engineer</span>
                          <Badge variant="outline">Model operations</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Viewer</span>
                          <Badge variant="outline">Read-only access</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Permission Types</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <div className="font-semibold">Resource Permissions</div>
                        <div>data:read, data:write</div>
                        <div>model:read, model:write</div>
                        <div>dashboard:read, dashboard:write</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold">Action Permissions</div>
                        <div>user:invite, user:delete</div>
                        <div>org:create, org:delete</div>
                        <div>system:configure</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database-Level Security
                  </CardTitle>
                  <CardDescription>
                    Row-level security and data access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Supabase RLS Policies</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`-- Create user roles table
CREATE TYPE public.app_role AS ENUM (
  'super_admin', 'org_admin', 'data_manager', 
  'ml_engineer', 'analyst', 'viewer'
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  organization_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(
  _user_id UUID, 
  _role app_role
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- RLS policy for geospatial data
CREATE POLICY "Users can read data based on role"
ON public.geospatial_data
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'viewer') OR
  public.has_role(auth.uid(), 'analyst') OR
  public.has_role(auth.uid(), 'data_manager') OR
  public.has_role(auth.uid(), 'org_admin') OR
  public.has_role(auth.uid(), 'super_admin')
);

-- Policy for data modification
CREATE POLICY "Data managers can modify data"
ON public.geospatial_data
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'data_manager') OR
  public.has_role(auth.uid(), 'org_admin') OR
  public.has_role(auth.uid(), 'super_admin')
);`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Application-Level RBAC
                  </CardTitle>
                  <CardDescription>
                    Frontend and backend permission enforcement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">React Permission Hook</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Custom hook for permission checking
import { useAuth } from '@/hooks/use-auth';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasRole = (role: string) => {
    return user?.roles?.includes(role) || false;
  };

  const hasAnyRole = (roles: string[]) => {
    return roles.some(role => hasRole(role));
  };

  const canAccessResource = (resource: string, action: string) => {
    const permission = \`\${resource}:\${action}\`;
    return hasPermission(permission);
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    canAccessResource,
    isAdmin: hasRole('org_admin') || hasRole('super_admin'),
    isDataManager: hasRole('data_manager'),
    isMLEngineer: hasRole('ml_engineer')
  };
};

// Usage in components
const DataUploadButton = () => {
  const { canAccessResource } = usePermissions();

  if (!canAccessResource('data', 'write')) {
    return null;
  }

  return (
    <Button onClick={handleUpload}>
      Upload Data
    </Button>
  );
};`}
                    </pre>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Protected Routes</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Protected route component
import { usePermissions } from '@/hooks/use-permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback = <UnauthorizedPage />
}) => {
  const { hasPermission, hasRole } = usePermissions();

  const hasAccess = 
    (!requiredPermission || hasPermission(requiredPermission)) &&
    (!requiredRole || hasRole(requiredRole));

  return hasAccess ? <>{children}</> : fallback;
};

// Usage in routing
<Routes>
  <Route
    path="/admin"
    element={
      <ProtectedRoute requiredRole="org_admin">
        <AdminDashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/data/upload"
    element={
      <ProtectedRoute requiredPermission="data:write">
        <DataUploadPage />
      </ProtectedRoute>
    }
  />
</Routes>`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Multi-Tenancy Security
                  </CardTitle>
                  <CardDescription>
                    Organization-based data isolation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Tenant Isolation Strategies</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Database-level tenant separation</li>
                        <li>• Row-level security by organization</li>
                        <li>• API-level tenant validation</li>
                        <li>• UI-level data filtering</li>
                        <li>• Storage bucket isolation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Tenant RLS Policy</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`-- Function to get user's organization
CREATE OR REPLACE FUNCTION public.get_user_organization()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

-- Multi-tenant RLS policy
CREATE POLICY "Users can only access their organization's data"
ON public.geospatial_data
FOR ALL
TO authenticated
USING (organization_id = public.get_user_organization())
WITH CHECK (organization_id = public.get_user_organization());

-- Cross-organization access for super admins
CREATE POLICY "Super admins can access all data"
ON public.geospatial_data
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));`}
                    </pre>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">API Tenant Validation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Middleware to validate tenant access
const validateTenantAccess = async (req, res, next) => {
  const userId = req.user.id;
  const requestedOrgId = req.params.orgId || req.body.organizationId;

  if (!requestedOrgId) {
    return res.status(400).json({ error: 'Organization ID required' });
  }

  // Check if user belongs to the organization
  const userOrg = await getUserOrganization(userId);
  
  // Super admins can access any organization
  const isSuperAdmin = await hasRole(userId, 'super_admin');
  
  if (!isSuperAdmin && userOrg !== requestedOrgId) {
    return res.status(403).json({ 
      error: 'Access denied to this organization' 
    });
  }

  req.organization = requestedOrgId;
  next();
};`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="encryption">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Encryption Architecture
                  </CardTitle>
                  <CardDescription>
                    End-to-end encryption strategy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Encryption Layers</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`┌─────────────────────────────────────┐
│        Application Layer            │
│  • Field-level encryption           │
│  • Client-side encryption           │
│  • Key derivation functions         │
├─────────────────────────────────────┤
│        Transport Layer              │
│  • TLS 1.3 encryption              │
│  • Certificate pinning             │
│  • Perfect forward secrecy         │
├─────────────────────────────────────┤
│         Storage Layer               │
│  • Database encryption at rest     │
│  • File system encryption          │
│  • Backup encryption               │
├─────────────────────────────────────┤
│      Infrastructure Layer          │
│  • Disk encryption (LUKS/BitLocker)│
│  • Network encryption (IPSec)      │
│  • Hardware security modules       │
└─────────────────────────────────────┘`}
                    </pre>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Encryption Standards</Badge>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between p-2 border rounded">
                          <span>Symmetric</span>
                          <Badge variant="outline">AES-256-GCM</Badge>
                        </div>
                        <div className="flex justify-between p-2 border rounded">
                          <span>Asymmetric</span>
                          <Badge variant="outline">RSA-4096 / ECC-P384</Badge>
                        </div>
                        <div className="flex justify-between p-2 border rounded">
                          <span>Hashing</span>
                          <Badge variant="outline">SHA-256 / SHA-3</Badge>
                        </div>
                        <div className="flex justify-between p-2 border rounded">
                          <span>Key Derivation</span>
                          <Badge variant="outline">PBKDF2 / Argon2</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data at Rest Encryption
                  </CardTitle>
                  <CardDescription>
                    Database and file storage encryption
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Database Encryption</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Transparent data encryption (TDE)</li>
                        <li>• Column-level encryption for PII</li>
                        <li>• Encrypted backups</li>
                        <li>• Key rotation policies</li>
                        <li>• HSM integration for key storage</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Field-Level Encryption</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`-- Supabase encryption extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_pii(data TEXT)
RETURNS BYTEA AS $$
BEGIN
  RETURN pgp_sym_encrypt(data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_pii(encrypted_data BYTEA)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example table with encrypted columns
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email_encrypted BYTEA, -- Encrypted email
  phone_encrypted BYTEA, -- Encrypted phone
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to automatically encrypt data
CREATE OR REPLACE FUNCTION encrypt_user_data()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IS NOT NULL THEN
    NEW.email_encrypted = encrypt_pii(NEW.email);
    NEW.email = NULL; -- Clear plaintext
  END IF;
  
  IF NEW.phone IS NOT NULL THEN
    NEW.phone_encrypted = encrypt_pii(NEW.phone);
    NEW.phone = NULL; -- Clear plaintext
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Data in Transit Protection
                  </CardTitle>
                  <CardDescription>
                    Network communication security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">TLS Configuration</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• TLS 1.3 minimum version</li>
                        <li>• Perfect forward secrecy (PFS)</li>
                        <li>• HTTP Strict Transport Security</li>
                        <li>• Certificate transparency monitoring</li>
                        <li>• Certificate pinning for mobile apps</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Nginx TLS Configuration</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`# Nginx TLS configuration
server {
    listen 443 ssl http2;
    server_name api.geoai-platform.com;

    # TLS certificates
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # TLS protocol and ciphers
    ssl_protocols TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'" always;

    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /path/to/ca-chain.pem;
    
    # Perfect forward secrecy
    ssl_dhparam /path/to/dhparam.pem;
    ssl_ecdh_curve secp384r1;

    location / {
        proxy_pass http://backend;
        proxy_ssl_verify on;
        proxy_ssl_trusted_certificate /path/to/ca.pem;
    }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Data Anonymization
                  </CardTitle>
                  <CardDescription>
                    Privacy-preserving data processing for crowdsourced data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Anonymization Techniques</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• K-anonymity for demographic data</li>
                        <li>• Differential privacy for aggregations</li>
                        <li>• Geospatial data obfuscation</li>
                        <li>• Temporal data generalization</li>
                        <li>• Synthetic data generation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Geospatial Anonymization</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Geospatial data anonymization functions
const anonymizeLocation = (lat, lng, precision = 3) => {
  // Reduce coordinate precision to anonymize location
  const factor = Math.pow(10, precision);
  return {
    lat: Math.round(lat * factor) / factor,
    lng: Math.round(lng * factor) / factor
  };
};

const addGeoNoise = (lat, lng, radiusMeters = 100) => {
  // Add random noise within specified radius
  const earthRadius = 6371000; // Earth radius in meters
  const latDelta = (radiusMeters / earthRadius) * (180 / Math.PI);
  const lngDelta = (radiusMeters / earthRadius) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
  
  const randomLat = lat + (Math.random() - 0.5) * 2 * latDelta;
  const randomLng = lng + (Math.random() - 0.5) * 2 * lngDelta;
  
  return { lat: randomLat, lng: randomLng };
};

const spatialGeneralization = (coordinates, gridSize = 1000) => {
  // Snap coordinates to grid for k-anonymity
  const [lng, lat] = coordinates;
  const gridLat = Math.floor(lat * gridSize) / gridSize;
  const gridLng = Math.floor(lng * gridSize) / gridSize;
  
  return [gridLng, gridLat];
};

// Differential privacy for aggregated data
const addDifferentialPrivacy = (value, epsilon = 1.0) => {
  // Laplace mechanism for differential privacy
  const sensitivity = 1; // Adjust based on query sensitivity
  const noise = laplacianNoise(0, sensitivity / epsilon);
  return Math.max(0, value + noise);
};

const laplacianNoise = (mean, scale) => {
  const u = Math.random() - 0.5;
  return mean - scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
};`}
                    </pre>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Data Masking Pipeline</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`-- SQL functions for data anonymization
CREATE OR REPLACE FUNCTION anonymize_crowdsourced_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove or hash identifiable information
  NEW.user_agent = NULL;
  NEW.ip_address = NULL;
  NEW.session_id = NULL;
  
  -- Anonymize location data
  IF NEW.location IS NOT NULL THEN
    -- Add spatial noise (100m radius)
    NEW.location = ST_Point(
      ST_X(NEW.location) + (random() - 0.5) * 0.001,
      ST_Y(NEW.location) + (random() - 0.5) * 0.001
    );
  END IF;
  
  -- Generalize timestamp to hour
  NEW.created_at = date_trunc('hour', NEW.created_at);
  
  -- Remove metadata that could identify users
  NEW.device_info = NULL;
  NEW.browser_fingerprint = NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply anonymization trigger
CREATE TRIGGER anonymize_before_insert
  BEFORE INSERT ON public.crowdsourced_data
  FOR EACH ROW
  EXECUTE FUNCTION anonymize_crowdsourced_data();`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Key Management
                  </CardTitle>
                  <CardDescription>
                    Secure key generation, storage, and rotation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Key Management Strategy</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Hardware Security Modules (HSM)</li>
                        <li>• Key derivation functions</li>
                        <li>• Automated key rotation</li>
                        <li>• Multi-party key generation</li>
                        <li>• Key escrow and recovery</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Key Rotation Implementation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Automated key rotation service
class KeyRotationService {
  constructor(keyStore, encryptionService) {
    this.keyStore = keyStore;
    this.encryptionService = encryptionService;
  }

  async rotateKeys() {
    try {
      // Generate new encryption key
      const newKey = await this.generateEncryptionKey();
      const keyId = await this.keyStore.storeKey(newKey);
      
      // Re-encrypt sensitive data with new key
      await this.reEncryptData(keyId);
      
      // Update key reference in configuration
      await this.updateActiveKey(keyId);
      
      // Schedule old key for deletion after grace period
      await this.scheduleKeyDeletion(this.currentKeyId, '30 days');
      
      console.log(\`Key rotation completed. New key ID: \${keyId}\`);
    } catch (error) {
      console.error('Key rotation failed:', error);
      await this.alertSecurityTeam(error);
    }
  }

  async generateEncryptionKey() {
    return crypto.randomBytes(32); // 256-bit key
  }

  async reEncryptData(newKeyId) {
    // Batch re-encryption to avoid overwhelming the database
    const batchSize = 1000;
    let offset = 0;
    
    while (true) {
      const records = await this.getEncryptedRecords(offset, batchSize);
      if (records.length === 0) break;
      
      for (const record of records) {
        const decrypted = await this.decrypt(record.data, record.keyId);
        const reEncrypted = await this.encrypt(decrypted, newKeyId);
        await this.updateRecord(record.id, reEncrypted, newKeyId);
      }
      
      offset += batchSize;
    }
  }
}

// Schedule automatic key rotation
const keyRotation = new KeyRotationService(keyStore, encryptionService);
cron.schedule('0 0 1 * *', () => keyRotation.rotateKeys()); // Monthly`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    GDPR Compliance
                  </CardTitle>
                  <CardDescription>
                    General Data Protection Regulation compliance framework
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">GDPR Requirements</Badge>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Lawful basis for processing</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Implemented</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Data subject rights</span>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Partial</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Privacy by design</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Implemented</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Data breach notification</span>
                          <Badge variant="outline" className="bg-red-50 text-red-700">Pending</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>DPO appointment</span>
                          <Badge variant="outline" className="bg-red-50 text-red-700">Required</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Data Subject Rights Implementation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// GDPR data subject rights API
class GDPRController {
  // Right to access (Article 15)
  async getPersonalData(req, res) {
    const userId = req.user.id;
    
    const personalData = {
      profile: await this.getUserProfile(userId),
      activities: await this.getUserActivities(userId),
      preferences: await this.getUserPreferences(userId),
      dataProcessing: await this.getProcessingActivities(userId)
    };
    
    res.json({
      data: personalData,
      exportedAt: new Date().toISOString(),
      format: 'JSON'
    });
  }

  // Right to rectification (Article 16)
  async updatePersonalData(req, res) {
    const userId = req.user.id;
    const updates = req.body;
    
    await this.auditDataChange(userId, 'rectification', updates);
    const result = await this.updateUserData(userId, updates);
    
    res.json({ message: 'Data updated successfully', result });
  }

  // Right to erasure (Article 17)
  async deletePersonalData(req, res) {
    const userId = req.user.id;
    
    // Check if deletion is legally required
    const canDelete = await this.checkDeletionConstraints(userId);
    if (!canDelete.allowed) {
      return res.status(400).json({ 
        error: 'Data deletion not permitted', 
        reason: canDelete.reason 
      });
    }
    
    await this.auditDataChange(userId, 'erasure');
    await this.pseudonymizeUserData(userId);
    
    res.json({ message: 'Data deletion completed' });
  }

  // Right to data portability (Article 20)
  async exportPersonalData(req, res) {
    const userId = req.user.id;
    const format = req.query.format || 'json';
    
    const data = await this.getPortableData(userId);
    const exported = await this.formatForExport(data, format);
    
    res.attachment(\`personal-data.\${format}\`);
    res.send(exported);
  }

  // Right to object (Article 21)
  async objectToProcessing(req, res) {
    const userId = req.user.id;
    const processingType = req.body.processingType;
    
    await this.recordObjection(userId, processingType);
    await this.stopProcessing(userId, processingType);
    
    res.json({ message: 'Objection recorded and processing stopped' });
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    OGC Standards Compliance
                  </CardTitle>
                  <CardDescription>
                    Open Geospatial Consortium standards implementation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Supported OGC Standards</Badge>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 border rounded">
                          <h5 className="font-medium">WMS 1.3.0</h5>
                          <p className="text-muted-foreground text-xs">Web Map Service</p>
                        </div>
                        <div className="p-2 border rounded">
                          <h5 className="font-medium">WFS 2.0</h5>
                          <p className="text-muted-foreground text-xs">Web Feature Service</p>
                        </div>
                        <div className="p-2 border rounded">
                          <h5 className="font-medium">WMTS 1.0</h5>
                          <p className="text-muted-foreground text-xs">Web Map Tile Service</p>
                        </div>
                        <div className="p-2 border rounded">
                          <h5 className="font-medium">CSW 3.0</h5>
                          <p className="text-muted-foreground text-xs">Catalogue Service</p>
                        </div>
                        <div className="p-2 border rounded">
                          <h5 className="font-medium">WPS 2.0</h5>
                          <p className="text-muted-foreground text-xs">Web Processing Service</p>
                        </div>
                        <div className="p-2 border rounded">
                          <h5 className="font-medium">SensorThings</h5>
                          <p className="text-muted-foreground text-xs">IoT data standard</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">OGC Security Considerations</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Authentication for OGC services</li>
                      <li>• Access control for spatial data</li>
                      <li>• Secure service metadata</li>
                      <li>• Encrypted data transmission</li>
                      <li>• Audit logging for service access</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">WMS Security Implementation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Secure WMS service implementation
class SecureWMSService {
  async getMap(req, res) {
    // Validate authentication
    const user = await this.authenticateRequest(req);
    if (!user) {
      return this.sendException(res, 'Authentication required');
    }

    // Check authorization for requested layers
    const layers = req.query.LAYERS.split(',');
    const authorizedLayers = await this.filterAuthorizedLayers(
      layers, 
      user.permissions
    );

    if (authorizedLayers.length === 0) {
      return this.sendException(res, 'No authorized layers');
    }

    // Apply data filtering based on user context
    const bbox = this.parseBBox(req.query.BBOX);
    const filteredData = await this.applyDataFilters(
      authorizedLayers, 
      bbox, 
      user.organization
    );

    // Log access for audit
    await this.logAccess(user.id, 'WMS:GetMap', {
      layers: authorizedLayers,
      bbox: bbox
    });

    // Generate and return map
    const mapImage = await this.renderMap(filteredData, req.query);
    res.setHeader('Content-Type', 'image/png');
    res.send(mapImage);
  }

  sendException(res, message) {
    const exception = \`<?xml version="1.0"?>
      <ServiceExceptionReport>
        <ServiceException>\${message}</ServiceException>
      </ServiceExceptionReport>\`;
    
    res.status(400)
       .setHeader('Content-Type', 'application/vnd.ogc.se_xml')
       .send(exception);
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Industry Compliance
                  </CardTitle>
                  <CardDescription>
                    Additional regulatory and industry standards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Security Frameworks</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">ISO 27001</span>
                          <Badge variant="outline">In Progress</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">SOC 2 Type II</span>
                          <Badge variant="outline">Planned</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">NIST Cybersecurity Framework</span>
                          <Badge variant="outline">Implemented</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">FedRAMP (for gov clients)</span>
                          <Badge variant="outline">Future</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">Data Protection Laws</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• CCPA (California Consumer Privacy Act)</li>
                        <li>• PIPEDA (Canada)</li>
                        <li>• LGPD (Brazil)</li>
                        <li>• Privacy Act 1988 (Australia)</li>
                        <li>• PDPA (Singapore)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Compliance Automation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Automated compliance checking
class ComplianceMonitor {
  constructor() {
    this.checks = [
      new GDPRComplianceCheck(),
      new SOCComplianceCheck(),
      new OGCComplianceCheck()
    ];
  }

  async runComplianceChecks() {
    const results = [];
    
    for (const check of this.checks) {
      try {
        const result = await check.execute();
        results.push({
          framework: check.name,
          status: result.status,
          issues: result.issues,
          recommendations: result.recommendations
        });
      } catch (error) {
        results.push({
          framework: check.name,
          status: 'error',
          error: error.message
        });
      }
    }

    await this.generateComplianceReport(results);
    return results;
  }

  async generateComplianceReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      overallStatus: this.calculateOverallStatus(results),
      frameworks: results,
      actionItems: this.extractActionItems(results)
    };

    await this.saveReport(report);
    await this.notifyStakeholders(report);
  }
}

// Schedule regular compliance checks
cron.schedule('0 9 * * 1', () => {
  complianceMonitor.runComplianceChecks();
}); // Weekly on Mondays`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Data Retention Policies
                  </CardTitle>
                  <CardDescription>
                    Automated data lifecycle management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Retention Schedules</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">User activity logs</span>
                          <Badge variant="outline">1 year</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Security audit logs</span>
                          <Badge variant="outline">7 years</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Personal data</span>
                          <Badge variant="outline">On request</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Anonymized analytics</span>
                          <Badge variant="outline">Indefinite</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Temporary uploads</span>
                          <Badge variant="outline">30 days</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Automated Data Cleanup</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`-- Automated data retention SQL functions
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
  -- Delete old activity logs (1 year retention)
  DELETE FROM public.activity_logs 
  WHERE created_at < NOW() - INTERVAL '1 year';

  -- Delete temporary uploads (30 days retention)  
  DELETE FROM public.temporary_uploads 
  WHERE created_at < NOW() - INTERVAL '30 days';

  -- Anonymize old crowdsourced data (6 months)
  UPDATE public.crowdsourced_data 
  SET 
    ip_address = NULL,
    user_agent = NULL,
    session_id = NULL
  WHERE created_at < NOW() - INTERVAL '6 months'
    AND ip_address IS NOT NULL;

  -- Archive old audit logs to cold storage
  INSERT INTO public.audit_logs_archive 
  SELECT * FROM public.audit_logs 
  WHERE created_at < NOW() - INTERVAL '2 years';

  DELETE FROM public.audit_logs 
  WHERE created_at < NOW() - INTERVAL '2 years';

  -- Log cleanup activity
  INSERT INTO public.system_logs (event, details)
  VALUES ('data_cleanup', 'Automated data retention cleanup completed');
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup to run daily
SELECT cron.schedule('data-cleanup', '0 2 * * *', 'SELECT cleanup_expired_data();');`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="threats">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Threat Model Overview
                  </CardTitle>
                  <CardDescription>
                    Systematic threat analysis for the GeoAI platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">STRIDE Threat Categories</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700">S</Badge>
                        <span><strong>Spoofing</strong> - Identity impersonation attacks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-orange-50 text-orange-700">T</Badge>
                        <span><strong>Tampering</strong> - Data integrity attacks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">R</Badge>
                        <span><strong>Repudiation</strong> - Action denial attacks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">I</Badge>
                        <span><strong>Information Disclosure</strong> - Data leakage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">D</Badge>
                        <span><strong>Denial of Service</strong> - Availability attacks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">E</Badge>
                        <span><strong>Elevation of Privilege</strong> - Authorization bypass</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">High-Risk Threats</Badge>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>ML model poisoning</span>
                          <Badge variant="outline" className="bg-red-50 text-red-700">Critical</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Geospatial data tampering</span>
                          <Badge variant="outline" className="bg-red-50 text-red-700">High</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>API abuse and DDoS</span>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">High</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Insider data theft</span>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">Medium</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Supply chain attacks</span>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Medium</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5" />
                    Attack Vectors
                  </CardTitle>
                  <CardDescription>
                    Common attack scenarios and mitigation strategies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Web Application Attacks</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• SQL injection in spatial queries</li>
                        <li>• Cross-site scripting (XSS)</li>
                        <li>• Cross-site request forgery (CSRF)</li>
                        <li>• Server-side request forgery (SSRF)</li>
                        <li>• File upload vulnerabilities</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">API-Specific Attacks</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Rate limiting bypass</li>
                        <li>• Authorization bypass</li>
                        <li>• Parameter pollution</li>
                        <li>• Business logic flaws</li>
                        <li>• Excessive data exposure</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">ML-Specific Attacks</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Training data poisoning</li>
                        <li>• Model inversion attacks</li>
                        <li>• Adversarial examples</li>
                        <li>• Model extraction</li>
                        <li>• Membership inference</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Risk Assessment Matrix</h4>
                    <div className="grid grid-cols-4 gap-1 text-xs">
                      <div className="font-semibold p-2">Risk</div>
                      <div className="font-semibold p-2">Probability</div>
                      <div className="font-semibold p-2">Impact</div>
                      <div className="font-semibold p-2">Mitigation</div>
                      
                      <div className="p-2 border">Data breach</div>
                      <div className="p-2 border bg-orange-50">Medium</div>
                      <div className="p-2 border bg-red-50">High</div>
                      <div className="p-2 border bg-green-50">Encryption</div>
                      
                      <div className="p-2 border">API abuse</div>
                      <div className="p-2 border bg-red-50">High</div>
                      <div className="p-2 border bg-orange-50">Medium</div>
                      <div className="p-2 border bg-green-50">Rate limiting</div>
                      
                      <div className="p-2 border">Model theft</div>
                      <div className="p-2 border bg-yellow-50">Low</div>
                      <div className="p-2 border bg-red-50">High</div>
                      <div className="p-2 border bg-green-50">Access control</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Security Monitoring
                  </CardTitle>
                  <CardDescription>
                    Continuous monitoring and threat detection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Detection Methods</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Anomaly detection in API usage</li>
                        <li>• ML model drift monitoring</li>
                        <li>• Network traffic analysis</li>
                        <li>• User behavior analytics</li>
                        <li>• File integrity monitoring</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Security Event Detection</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Security monitoring rules
const securityRules = [
  {
    name: 'Brute force login attempts',
    condition: 'failed_login_count > 5 in 15_minutes',
    action: 'block_ip_temporarily',
    severity: 'HIGH'
  },
  {
    name: 'Unusual data access pattern',
    condition: 'data_access_volume > normal_baseline * 10',
    action: 'alert_security_team',
    severity: 'MEDIUM'
  },
  {
    name: 'Privileged account usage',
    condition: 'admin_action AND unusual_time',
    action: 'require_additional_auth',
    severity: 'HIGH'
  },
  {
    name: 'Model inference anomaly',
    condition: 'prediction_confidence < 0.1 AND volume > threshold',
    action: 'investigate_model_poisoning',
    severity: 'CRITICAL'
  }
];

// Real-time monitoring implementation
class SecurityMonitor {
  constructor() {
    this.eventStream = new EventEmitter();
    this.ruleEngine = new RuleEngine(securityRules);
  }

  async processSecurityEvent(event) {
    const matches = await this.ruleEngine.evaluate(event);
    
    for (const match of matches) {
      await this.executeAction(match.action, event);
      await this.logSecurityIncident(match, event);
      
      if (match.severity === 'CRITICAL') {
        await this.alertIncidentResponse(match, event);
      }
    }
  }

  async executeAction(action, event) {
    switch (action) {
      case 'block_ip_temporarily':
        await this.blockIP(event.ip, '1 hour');
        break;
      case 'alert_security_team':
        await this.sendAlert(event);
        break;
      case 'require_additional_auth':
        await this.escalateAuthRequirements(event.userId);
        break;
    }
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Incident Response
                  </CardTitle>
                  <CardDescription>
                    Security incident response procedures
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Response Phases</Badge>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-semibold">1</div>
                          <span><strong>Identification</strong> - Detect and classify incident</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold">2</div>
                          <span><strong>Containment</strong> - Limit impact and spread</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-semibold">3</div>
                          <span><strong>Eradication</strong> - Remove threat from systems</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">4</div>
                          <span><strong>Recovery</strong> - Restore normal operations</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold">5</div>
                          <span><strong>Lessons Learned</strong> - Post-incident analysis</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Automated Response Actions</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`// Incident response automation
class IncidentResponse {
  async handleSecurityIncident(incident) {
    const playbook = this.getPlaybook(incident.type);
    
    try {
      // Immediate containment
      await this.executeContainment(incident, playbook);
      
      // Notify stakeholders
      await this.notifyStakeholders(incident);
      
      // Collect evidence
      await this.collectForensicData(incident);
      
      // Start investigation
      await this.initiateInvestigation(incident);
      
    } catch (error) {
      await this.escalateToHuman(incident, error);
    }
  }

  async executeContainment(incident, playbook) {
    for (const action of playbook.containmentActions) {
      switch (action.type) {
        case 'isolate_host':
          await this.isolateHost(action.hostId);
          break;
        case 'revoke_credentials':
          await this.revokeUserCredentials(action.userId);
          break;
        case 'block_ip_range':
          await this.blockIPRange(action.ipRange);
          break;
        case 'disable_api_key':
          await this.disableAPIKey(action.keyId);
          break;
      }
    }
  }

  async collectForensicData(incident) {
    const evidence = {
      logs: await this.collectLogs(incident.timeframe),
      networkTraffic: await this.captureNetworkData(incident),
      systemState: await this.captureSystemSnapshot(),
      userActivity: await this.getUserActivityLogs(incident.affectedUsers)
    };

    await this.storeEvidence(incident.id, evidence);
    return evidence;
  }
}

// Integration with ticketing system
const incidentResponse = new IncidentResponse();
securityMonitor.on('critical-alert', (alert) => {
  incidentResponse.handleSecurityIncident(alert);
});`}
                    </pre>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Communication Plan</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="font-semibold">Severity</div>
                      <div className="font-semibold">Notification Time</div>
                      <div className="font-semibold">Recipients</div>
                      
                      <div className="p-2 border bg-red-50">Critical</div>
                      <div className="p-2 border">Immediate</div>
                      <div className="p-2 border">CEO, CISO, Legal</div>
                      
                      <div className="p-2 border bg-orange-50">High</div>
                      <div className="p-2 border">15 minutes</div>
                      <div className="p-2 border">Security team, CTO</div>
                      
                      <div className="p-2 border bg-yellow-50">Medium</div>
                      <div className="p-2 border">1 hour</div>
                      <div className="p-2 border">Security team</div>
                      
                      <div className="p-2 border bg-green-50">Low</div>
                      <div className="p-2 border">24 hours</div>
                      <div className="p-2 border">Daily report</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Security Libraries
                  </CardTitle>
                  <CardDescription>
                    Recommended security libraries and frameworks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Authentication & Authorization</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Supabase Auth</span>
                          <Badge variant="outline">Primary</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">jsonwebtoken</span>
                          <Badge variant="outline">JWT handling</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">passport.js</span>
                          <Badge variant="outline">OAuth</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">bcryptjs</span>
                          <Badge variant="outline">Password hashing</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">Input Validation</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">joi</span>
                          <Badge variant="outline">Schema validation</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">express-validator</span>
                          <Badge variant="outline">Express middleware</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">dompurify</span>
                          <Badge variant="outline">XSS prevention</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">validator.js</span>
                          <Badge variant="outline">String validation</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">Cryptography</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">crypto (Node.js)</span>
                          <Badge variant="outline">Built-in</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">argon2</span>
                          <Badge variant="outline">Key derivation</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">tweetnacl</span>
                          <Badge variant="outline">Lightweight crypto</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">node-forge</span>
                          <Badge variant="outline">PKI operations</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5" />
                    Security Testing Tools
                  </CardTitle>
                  <CardDescription>
                    Automated security testing and vulnerability scanning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Static Analysis</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">ESLint Security Plugin</span>
                          <Badge variant="outline">JavaScript</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Semgrep</span>
                          <Badge variant="outline">Multi-language</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">CodeQL</span>
                          <Badge variant="outline">GitHub Security</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Bandit</span>
                          <Badge variant="outline">Python</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">Dynamic Analysis</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">OWASP ZAP</span>
                          <Badge variant="outline">Web app scanning</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Burp Suite</span>
                          <Badge variant="outline">Manual testing</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Nuclei</span>
                          <Badge variant="outline">Fast scanner</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">w3af</span>
                          <Badge variant="outline">Framework</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">Dependency Scanning</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">npm audit</span>
                          <Badge variant="outline">Node.js</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Snyk</span>
                          <Badge variant="outline">Multi-language</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Dependabot</span>
                          <Badge variant="outline">GitHub</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">OWASP Dependency Check</span>
                          <Badge variant="outline">Open source</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Security Test Automation</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`# GitHub Actions security pipeline
name: Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/secrets
            p/owasp-top-ten
      
      - name: Run CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          languages: javascript,typescript
      
      - name: Run OWASP ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'http://localhost:3000'
          
      - name: Container Security Scan
        uses: anchore/scan-action@v3
        with:
          image: "geoai/platform:latest"
          severity-cutoff: medium`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Monitoring & Logging Tools
                  </CardTitle>
                  <CardDescription>
                    Security monitoring and incident response tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Log Management</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Winston</span>
                          <Badge variant="outline">Node.js logging</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Elasticsearch</span>
                          <Badge variant="outline">Log storage</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Logstash</span>
                          <Badge variant="outline">Log processing</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Fluentd</span>
                          <Badge variant="outline">Data collector</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">SIEM Solutions</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Supabase Analytics</span>
                          <Badge variant="outline">Built-in</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Wazuh</span>
                          <Badge variant="outline">Open source</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Splunk</span>
                          <Badge variant="outline">Enterprise</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Elastic Security</span>
                          <Badge variant="outline">ELK based</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">Application Monitoring</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Sentry</span>
                          <Badge variant="outline">Error tracking</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">New Relic</span>
                          <Badge variant="outline">APM</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Datadog</span>
                          <Badge variant="outline">Infrastructure</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Prometheus</span>
                          <Badge variant="outline">Metrics</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Laptop className="h-5 w-5" />
                    Development Security Tools
                  </CardTitle>
                  <CardDescription>
                    Tools for secure development practices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">IDE Security Extensions</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">SonarLint</span>
                          <Badge variant="outline">VS Code</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Snyk Security</span>
                          <Badge variant="outline">VS Code</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">GitLens</span>
                          <Badge variant="outline">Git security</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">ESLint</span>
                          <Badge variant="outline">Code quality</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">Secret Management</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Supabase Secrets</span>
                          <Badge variant="outline">Built-in</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">HashiCorp Vault</span>
                          <Badge variant="outline">Enterprise</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">AWS Secrets Manager</span>
                          <Badge variant="outline">Cloud</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Azure Key Vault</span>
                          <Badge variant="outline">Cloud</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline">Container Security</Badge>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Docker Bench</span>
                          <Badge variant="outline">Security audit</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Trivy</span>
                          <Badge variant="outline">Vulnerability scanner</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Falco</span>
                          <Badge variant="outline">Runtime security</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">OPA Gatekeeper</span>
                          <Badge variant="outline">Policy enforcement</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Pre-commit Security Hooks</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: check-added-large-files
      - id: check-merge-conflict
      - id: detect-private-key
      
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
        
  - repo: https://github.com/trufflesecurity/trufflehog
    rev: v3.63.2
    hooks:
      - id: trufflehog
        
  - repo: https://github.com/returntocorp/semgrep
    rev: v1.45.0
    hooks:
      - id: semgrep
        args: ['--config=p/security-audit']

# Install hooks
# npm install -g pre-commit
# pre-commit install`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="opensource">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Secure Git Practices
                  </CardTitle>
                  <CardDescription>
                    Git security and signed commits implementation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Commit Signing Requirements</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• GPG signed commits mandatory</li>
                        <li>• Verified contributor identities</li>
                        <li>• Branch protection rules</li>
                        <li>• No force pushes to main</li>
                        <li>• Squash merge only</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">GPG Setup Guide</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`# Generate GPG key
gpg --full-generate-key

# List GPG keys
gpg --list-secret-keys --keyid-format=long

# Export public key
gpg --armor --export <KEY_ID>

# Configure Git to sign commits
git config --global user.signingkey <KEY_ID>
git config --global commit.gpgsign true
git config --global tag.gpgsign true

# Verify signed commit
git log --show-signature

# Example signed commit
git commit -S -m "feat: add secure authentication module

- Implement JWT token validation
- Add rate limiting middleware
- Update security headers

Signed-off-by: Developer Name <email@example.com>"`}
                    </pre>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">GitHub Branch Protection</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "ci/security-scan",
      "ci/tests",
      "ci/linting"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 2,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "require_last_push_approval": true
  },
  "restrictions": {
    "users": [],
    "teams": ["security-team", "core-maintainers"]
  },
  "required_signatures": true,
  "required_linear_history": true,
  "allow_deletions": false,
  "allow_force_pushes": false
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    CI/CD Security Scanning
                  </CardTitle>
                  <CardDescription>
                    Automated security checks in the development pipeline
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Security Gates</Badge>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Secret detection</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Required</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Dependency vulnerabilities</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Required</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Static code analysis</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Required</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>Container scanning</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Required</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span>License compliance</span>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Warning</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Security Pipeline</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`name: Security Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run secret detection
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
      
      - name: Run dependency audit
        run: |
          npm audit --audit-level moderate
          npm run audit:licenses
      
      - name: Run SAST with Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/owasp-top-ten
            p/javascript
      
      - name: Build Docker image
        run: docker build -t geoai/platform:latest .
      
      - name: Run container security scan
        uses: anchore/scan-action@v3
        with:
          image: "geoai/platform:latest"
          severity-cutoff: medium
          fail-build: true
      
      - name: Upload SARIF results
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: results.sarif`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Contributor Security
                  </CardTitle>
                  <CardDescription>
                    Security guidelines for open-source contributors
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Contributor Requirements</Badge>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• GitHub 2FA enabled</li>
                        <li>• Verified email address</li>
                        <li>• GPG signed commits</li>
                        <li>• DCO sign-off required</li>
                        <li>• Security training completion</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Developer Certificate of Origin</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`Developer Certificate of Origin
Version 1.1

By making a contribution to the GeoAI Platform project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.

# Add DCO sign-off to commits
git commit -s -m "Your commit message"

# Or add manually
Signed-off-by: Your Name <your.email@example.com>`}
                    </pre>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Security-First Development</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Threat modeling for new features</li>
                      <li>• Security review for all PRs</li>
                      <li>• Regular security training sessions</li>
                      <li>• Responsible disclosure guidelines</li>
                      <li>• Security champion program</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5" />
                    Vulnerability Disclosure
                  </CardTitle>
                  <CardDescription>
                    Process for handling security vulnerabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="outline">Disclosure Timeline</Badge>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-semibold">1</div>
                          <span><strong>Day 0:</strong> Vulnerability reported</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold">2</div>
                          <span><strong>Day 1:</strong> Acknowledgment sent</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-semibold">3</div>
                          <span><strong>Day 7:</strong> Initial assessment</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">4</div>
                          <span><strong>Day 30:</strong> Fix development</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold">5</div>
                          <span><strong>Day 90:</strong> Public disclosure</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">SECURITY.md Template</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`# Security Policy

## Reporting Security Vulnerabilities

We take security vulnerabilities seriously. Please do NOT create 
public GitHub issues for security vulnerabilities.

### Reporting Process

1. **Email**: Send details to security@geoai-platform.org
2. **PGP**: Use our public key (ID: 0x1234567890ABCDEF)
3. **Include**: 
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if any)

### Response Timeline

- **24 hours**: Acknowledgment of report
- **7 days**: Initial assessment and severity rating
- **30 days**: Fix development and testing
- **90 days**: Public disclosure (coordinated)

### Scope

This security policy applies to:
- Main application (geoai-platform/platform)
- Official Docker images
- Production infrastructure
- Dependencies with known vulnerabilities

### Bug Bounty

We offer recognition and rewards for valid security reports:
- Critical: $500-$2000
- High: $200-$500  
- Medium: $50-$200
- Low: Recognition in hall of fame

### Hall of Fame

We recognize security researchers who help improve our security:
- [Security Researcher Name] - [Vulnerability Type] - [Date]`}
                    </pre>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Security Advisory Template</h4>
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`# Security Advisory: [CVE-YYYY-NNNN]

## Summary
Brief description of the vulnerability and its impact.

## Affected Versions
- geoai-platform < 1.2.3
- geoai-connectors < 0.8.1

## Severity
**High** (CVSS Score: 7.5)

## Description
Detailed description of the vulnerability, including:
- Technical details
- Attack scenarios
- Potential impact

## Mitigation
Immediate steps users can take:
1. Upgrade to version 1.2.3 or later
2. Apply security patch manually
3. Implement workaround if upgrade not possible

## Timeline
- 2024-01-15: Vulnerability reported
- 2024-01-16: Confirmed and classified
- 2024-01-30: Fix developed and tested
- 2024-02-01: Security release published
- 2024-02-15: Public disclosure

## Credits
Thanks to [Researcher Name] for responsible disclosure.`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            Implement Security Framework
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SecurityCompliance;