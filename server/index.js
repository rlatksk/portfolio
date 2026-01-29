const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const ENV_FILE = path.join(__dirname, '.env');
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Auto-generate JWT secret if not set
const getOrCreateJwtSecret = () => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET !== 'your-super-secret-jwt-key-change-this') {
    return process.env.JWT_SECRET;
  }
  
  // Generate a secure random secret
  const newSecret = crypto.randomBytes(64).toString('hex');
  
  // Try to save it to .env file
  try {
    let envContent = '';
    if (fs.existsSync(ENV_FILE)) {
      envContent = fs.readFileSync(ENV_FILE, 'utf8');
      // Replace existing JWT_SECRET line or add new one
      if (envContent.includes('JWT_SECRET=')) {
        envContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${newSecret}`);
      } else {
        envContent += `\nJWT_SECRET=${newSecret}`;
      }
    } else {
      envContent = `JWT_SECRET=${newSecret}\n`;
    }
    fs.writeFileSync(ENV_FILE, envContent);
    console.log('✅ JWT secret auto-generated and saved to .env');
  } catch (err) {
    console.log('⚠️ Could not save JWT secret to .env, using in-memory secret');
  }
  
  return newSecret;
};

const JWT_SECRET = getOrCreateJwtSecret();

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'headline-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '1d',
  etag: true
}));

// Helper functions to read/write data
const readData = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Initialize admin password on first run
const initializeAdmin = async () => {
  const data = readData();
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  // Check if password needs to be hashed (if it's not already a bcrypt hash)
  if (!data.admin.password.startsWith('$2a$') || data.admin.password.length < 50) {
    data.admin.username = adminUsername;
    data.admin.password = await bcrypt.hash(adminPassword, 10);
    writeData(data);
    console.log('Admin credentials initialized');
  }
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ==================== PUBLIC ROUTES ====================

// Get all public data (for the frontend)
app.get('/api/data', (req, res) => {
  try {
    const data = readData();
    // Don't send admin credentials
    const { admin, ...publicData } = data;
    res.json(publicData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Get profile
app.get('/api/profile', (req, res) => {
  try {
    const data = readData();
    res.json(data.profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read profile' });
  }
});

// Get latest project
app.get('/api/latest-project', (req, res) => {
  try {
    const data = readData();
    res.json(data.latestProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read latest project' });
  }
});

// Get all projects
app.get('/api/projects', (req, res) => {
  try {
    const data = readData();
    res.json(data.projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = readData();

    if (username !== data.admin.username) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, data.admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Change password
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const data = readData();

    const validPassword = await bcrypt.compare(currentPassword, data.admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    data.admin.password = await bcrypt.hash(newPassword, 10);
    writeData(data);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ==================== PROTECTED ROUTES ====================

// Update profile
app.put('/api/profile', authenticateToken, (req, res) => {
  try {
    const data = readData();
    data.profile = { ...data.profile, ...req.body };
    writeData(data);
    res.json({ message: 'Profile updated', profile: data.profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update latest project
app.put('/api/latest-project', authenticateToken, (req, res) => {
  try {
    const data = readData();
    data.latestProject = { ...data.latestProject, ...req.body };
    writeData(data);
    res.json({ message: 'Latest project updated', latestProject: data.latestProject });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update latest project' });
  }
});

// Update all projects
app.put('/api/projects', authenticateToken, (req, res) => {
  try {
    const data = readData();
    data.projects = req.body;
    writeData(data);
    res.json({ message: 'Projects updated', projects: data.projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update projects' });
  }
});

// Add a project
app.post('/api/projects', authenticateToken, (req, res) => {
  try {
    const data = readData();
    const newProject = {
      id: Date.now(),
      ...req.body
    };
    data.projects.push(newProject);
    writeData(data);
    res.json({ message: 'Project added', project: newProject });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// Update a single project
app.put('/api/projects/:id', authenticateToken, (req, res) => {
  try {
    const data = readData();
    const projectId = parseInt(req.params.id);
    const index = data.projects.findIndex(p => p.id === projectId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    data.projects[index] = { ...data.projects[index], ...req.body };
    writeData(data);
    res.json({ message: 'Project updated', project: data.projects[index] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  try {
    const data = readData();
    const projectId = parseInt(req.params.id);
    data.projects = data.projects.filter(p => p.id !== projectId);
    writeData(data);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Upload headline image
app.post('/api/upload/headline', authenticateToken, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Max size is 5MB' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ message: 'Image uploaded', imageUrl });
  });
});

// Start server
app.listen(PORT, async () => {
  await initializeAdmin();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Admin panel: http://localhost:5173/admin (or your Vite port)`);
});
