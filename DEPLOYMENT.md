# Messenger App - Environment Configuration Guide

This guide explains how to configure environment variables for different deployment environments.

## 📋 Overview

The application uses environment variables to configure API endpoints, database connections, and other settings. This makes it easy to deploy to different environments (development, staging, production) without code changes.

## 🖥️ Client Configuration

### Development Setup

1. Copy the example file:
   ```bash
   cd client
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your local development settings:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
   ```

### Production Setup

For production deployment, set these environment variables in your hosting platform (Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SOCKET_URL=https://your-api-domain.com
```

**Important Notes:**
- `NEXT_PUBLIC_` prefix is required for Next.js client-side environment variables
- These URLs should point to your deployed backend server
- No trailing slashes on URLs
- For Socket.IO, use the same URL as your API unless you have a separate WebSocket server

## 🔧 Server Configuration

### Development Setup

1. Copy the example file:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Edit `.env` with your local development settings:
   ```env
   # Server Configuration
   PORT=8080

   # PostgreSQL Database
   USERNAME=postgres
   PGHOST=localhost
   DATABASE=mydb
   PASSWORD=your_database_password
   PGPORT=5432

   # Session Secret (generate a random string)
   SESSION_SECRET=your_random_secret_key_here

   # SendGrid for email verification
   SENDGRID_API_KEY=your_sendgrid_api_key

   # Client URL for CORS
   CLIENT_URL=http://localhost:3000
   ```

### Production Setup

For production deployment, configure these environment variables in your hosting platform:

```env
PORT=8080
USERNAME=your_production_db_user
PGHOST=your_production_db_host
DATABASE=your_production_db_name
PASSWORD=your_production_db_password
PGPORT=5432
SESSION_SECRET=your_strong_random_secret
SENDGRID_API_KEY=your_sendgrid_api_key
CLIENT_URL=https://your-frontend-domain.com
```

**Security Best Practices:**
- Never commit `.env` or `.env.local` files to git
- Use strong, random values for `SESSION_SECRET` (generate with `openssl rand -base64 32`)
- Use managed PostgreSQL services for production (AWS RDS, DigitalOcean, etc.)
- Rotate secrets regularly

## 🚀 Deployment Checklist

### Before Deploying

- [ ] Set all environment variables in your hosting platform
- [ ] Update `CLIENT_URL` in server config to match your frontend domain
- [ ] Update `NEXT_PUBLIC_API_URL` to match your backend domain
- [ ] Ensure database is accessible from your server
- [ ] Test all authentication flows in staging environment
- [ ] Verify Socket.IO connections work across domains

### Common Deployment Platforms

#### Vercel (Frontend)
1. Connect your GitHub repository
2. Go to Project Settings → Environment Variables
3. Add `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL`
4. Deploy

#### Heroku (Backend)
```bash
heroku config:set PORT=8080
heroku config:set USERNAME=your_db_user
heroku config:set PGHOST=your_db_host
heroku config:set DATABASE=your_db_name
heroku config:set PASSWORD=your_db_password
heroku config:set SESSION_SECRET=your_secret
heroku config:set SENDGRID_API_KEY=your_key
heroku config:set CLIENT_URL=https://your-frontend.vercel.app
```

#### Railway (Backend)
1. Connect your GitHub repository
2. Add environment variables in the Railway dashboard
3. Railway will automatically deploy on push

#### DigitalOcean App Platform
1. Create a new app from your repository
2. Configure environment variables in the dashboard
3. Set up managed PostgreSQL database
4. Deploy

## 🔍 Troubleshooting

### "Failed to fetch" errors
- Check that `NEXT_PUBLIC_API_URL` matches your backend URL
- Ensure CORS is properly configured on the server
- Verify backend is running and accessible

### Socket.IO connection failures
- Confirm `NEXT_PUBLIC_SOCKET_URL` is correct
- Check that WebSocket connections are allowed by your hosting provider
- Verify `CLIENT_URL` is set correctly on the server

### Database connection errors
- Verify all PostgreSQL environment variables are correct
- Check that database is accessible from your server
- Ensure firewall rules allow connections
- Confirm database user has proper permissions

### Session/Authentication issues
- Ensure `SESSION_SECRET` is set to a strong random value
- Check that cookies are enabled and working across domains
- Verify CORS credentials are properly configured

## 📝 Environment Variable Reference

### Client Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL | `https://api.example.com` |
| `NEXT_PUBLIC_SOCKET_URL` | Yes | Socket.IO server URL | `https://api.example.com` |

### Server Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | Yes | Server port | `8080` |
| `USERNAME` | Yes | PostgreSQL username | `postgres` |
| `PGHOST` | Yes | PostgreSQL host | `localhost` |
| `DATABASE` | Yes | PostgreSQL database name | `mydb` |
| `PASSWORD` | Yes | PostgreSQL password | `your_password` |
| `PGPORT` | Yes | PostgreSQL port | `5432` |
| `SESSION_SECRET` | Yes | Express session secret | `random_string` |
| `SENDGRID_API_KEY` | Yes | SendGrid API key for emails | `SG.xxx` |
| `CLIENT_URL` | Yes | Frontend URL for CORS | `https://example.com` |

## 🔐 Security Notes

1. **Never commit environment files**: `.env*` files are in `.gitignore`
2. **Use different secrets per environment**: Don't reuse secrets across dev/staging/prod
3. **Rotate secrets regularly**: Especially after team member changes
4. **Use managed services**: For databases and email in production
5. **Enable HTTPS**: Always use HTTPS in production
6. **Monitor environment variables**: Use secret scanning tools

## 📚 Additional Resources

- [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [SendGrid API Documentation](https://docs.sendgrid.com/)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html)
