const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Store demo data in memory (for demo)
let demoData = {
  visitors: 0,
  messages: [],
  deployments: 0,
  lastUpdated: new Date()
}

// Routes
app.get('/', (req, res) => {
  demoData.visitors++
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Coolify Demo</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; color: white; }
            .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
            .header { text-align: center; margin-bottom: 3rem; }
            .header h1 { font-size: 3rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
            .header p { font-size: 1.2rem; opacity: 0.9; }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin: 3rem 0; }
            .stat-card { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 15px; text-align: center; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); }
            .stat-number { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
            .stat-label { opacity: 0.8; }
            .demo-section { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 15px; margin: 2rem 0; backdrop-filter: blur(10px); }
            .demo-section h2 { margin-bottom: 1rem; }
            .message-form { display: flex; gap: 1rem; margin: 1rem 0; }
            .message-form input { flex: 1; padding: 0.8rem; border: none; border-radius: 8px; font-size: 1rem; }
            .message-form button { padding: 0.8rem 1.5rem; background: #ff6b6b; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }
            .message-form button:hover { background: #ff5252; }
            .messages { max-height: 300px; overflow-y: auto; }
            .message { background: rgba(255,255,255,0.1); padding: 1rem; margin: 0.5rem 0; border-radius: 8px; }
            .footer { text-align: center; margin: 3rem 0 1rem; opacity: 0.8; }
            .api-endpoints { background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; margin: 1rem 0; }
            .api-endpoints code { color: #ffd700; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Coolify Demo</h1>
                <p>Deployed via Coolify • Auto SSL • CI/CD Pipeline</p>
                <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
            </div>

            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">${demoData.visitors}</div>
                    <div class="stat-label">Page Views</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${demoData.messages.length}</div>
                    <div class="stat-label">Messages</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${demoData.deployments}</div>
                    <div class="stat-label">Deployments</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, '0')}</div>
                    <div class="stat-label">Current Time</div>
                </div>
            </div>

            <div class="demo-section">
                <h2>📝 Live Demo Features</h2>
                <form class="message-form" action="/api/message" method="POST">
                    <input type="text" name="message" placeholder="Enter a message..." required>
                    <button type="submit">Send Message</button>
                </form>
                <div class="messages">
                    ${demoData.messages.map(msg => `
                        <div class="message">
                            <strong>${msg.timestamp}:</strong> ${msg.text}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="demo-section">
                <h2>🔗 API Endpoints</h2>
                <div class="api-endpoints">
                    <p><code>GET /health</code> - Health check</p>
                    <p><code>GET /api/stats</code> - Get application statistics</p>
                    <p><code>POST /api/message</code> - Send a message</p>
                    <p><code>GET /api/info</code> - Get deployment info</p>
                </div>
            </div>

            <div class="footer">
                <p>⚡ Powered by Coolify • 🌐 Deployed on Vultr</p>
                <p>Last Updated: ${demoData.lastUpdated.toLocaleString()}</p>
            </div>
        </div>

        <script>
            // Auto-refresh every 30 seconds to show live updates
            setTimeout(() => window.location.reload(), 30000);
        </script>
    </body>
    </html>
  `)
})

// API Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  })
})

app.get('/api/stats', (req, res) => {
  res.json(demoData)
})

app.get('/api/info', (req, res) => {
  res.json({
    app: 'Coolify Demo',
    version: '1.0.0',
    deployed_via: 'Coolify',
    platform: 'Vultr',
    node_version: process.version,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  })
})

app.post('/api/message', (req, res) => {
  const message = {
    text: req.body.message,
    timestamp: new Date().toLocaleTimeString()
  }
  demoData.messages.unshift(message)
  // Keep only last 10 messages
  if (demoData.messages.length > 10) {
    demoData.messages = demoData.messages.slice(0, 10)
  }
  demoData.lastUpdated = new Date()
  res.redirect('/')
})

// Webhook endpoint for Coolify deployments
app.post('/webhook/deploy', (req, res) => {
  demoData.deployments++
  demoData.lastUpdated = new Date()
  console.log('Deployment webhook received:', req.body)
  res.json({ status: 'deployment recorded' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/">Go Home</a>
  `)
})

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Coolify Demo running on port ${port}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  demoData.lastUpdated = new Date()
})