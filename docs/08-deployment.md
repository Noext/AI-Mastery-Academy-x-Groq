# Module 8: Deployment to Production

## Overview

This module explains how to deploy the AI Mastery Academy x Groq application to production. We'll focus on deploying to Vercel, the recommended platform for Next.js applications.

## Deployment Options

### Recommended: Vercel

- **Optimized for Next.js**: Built by Next.js creators
- **Automatic Deployments**: Deploys on every Git push
- **Edge Network**: Global CDN for fast performance
- **Free Tier**: Generous free tier for personal projects
- **Environment Variables**: Easy configuration
- **Preview Deployments**: Test before production

### Alternative Options

- **Netlify**: Similar to Vercel, good Next.js support
- **Railway**: Simple deployment platform
- **AWS Amplify**: AWS integration
- **Self-hosted**: VPS, Docker, etc.

## Prerequisites

Before deploying:

1. **GitHub Account**: For hosting code
2. **Vercel Account**: Sign up at vercel.com
3. **Groq API Key**: Get from console.groq.com
4. **Code Ready**: Application working locally

## Deployment Steps

### Step 1: Prepare Repository

#### Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
```

#### Create GitHub Repository

1. Go to github.com
2. Click "New repository"
3. Name: `AI-Mastery-Academy-x-Groq`
4. Don't initialize with README (we have one)
5. Click "Create repository"

#### Push to GitHub

```bash
git remote add origin https://github.com/yourusername/AI-Mastery-Academy-x-Groq.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Method 1: GitHub Integration (Recommended)

1. **Go to Vercel**: vercel.com
2. **Sign in**: Use GitHub account
3. **Import Project**: Click "Add New Project"
4. **Select Repository**: Choose your GitHub repo
5. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
6. **Environment Variables**:
   - Click "Environment Variables"
   - Add: `GROQ_API_KEY` = `your_actual_api_key`
   - Select: Production, Preview, Development
7. **Deploy**: Click "Deploy"

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? ai-mastery-academy-x-groq
# - Directory? ./
# - Override settings? No
```

### Step 3: Configure Environment Variables

#### In Vercel Dashboard

1. Go to project settings
2. Click "Environment Variables"
3. Add variables:
   - **Name**: `GROQ_API_KEY`
   - **Value**: Your actual API key
   - **Environment**: Production, Preview, Development
4. Save

#### Verify

After deployment, check:
- Application loads correctly
- Chat functionality works
- API calls succeed

## Post-Deployment

### Custom Domain (Optional)

1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS configuration instructions

### Monitoring

#### Vercel Analytics

- Built-in analytics
- Page views, performance metrics
- Enable in project settings

#### Error Tracking

- Check Vercel logs
- Use services like Sentry for detailed tracking

## Environment-Specific Configuration

### Production

- **URL**: `https://your-project.vercel.app`
- **Environment**: Production
- **Variables**: Use production API keys

### Preview

- **URL**: `https://your-project-git-branch.vercel.app`
- **Environment**: Preview (for pull requests)
- **Variables**: Can use test API keys

### Development

- **Local**: `http://localhost:3000`
- **Environment**: Development
- **Variables**: From `.env.local`

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:

- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches
- **Pull Requests**: Creates preview deployment

### Deployment Workflow

```
Developer pushes to GitHub
    ↓
Vercel detects push
    ↓
Runs build command
    ↓
Deploys to Edge Network
    ↓
Application live
```

## Build Process

### What Happens During Build

1. **Install Dependencies**: `npm install`
2. **Type Check**: TypeScript compilation
3. **Build**: `next build`
   - Compiles pages
   - Optimizes code
   - Generates static pages
   - Creates API routes
4. **Deploy**: Uploads to Vercel Edge Network

### Build Output

```
.next/
├── server/          # Server-side code
├── static/          # Static assets
└── .next/           # Build cache
```

## Troubleshooting Deployment

### Issue: Build Fails

**Common Causes:**

1. **TypeScript Errors**
   - Fix type errors
   - Check `tsconfig.json`

2. **Missing Dependencies**
   - Check `package.json`
   - Ensure all deps listed

3. **Environment Variables**
   - Verify variables set in Vercel
   - Check variable names match

**Solution:**
- Check build logs in Vercel dashboard
- Fix errors locally first
- Push fixes

### Issue: API Routes Not Working

**Causes:**
- Missing environment variables
- API key invalid
- CORS issues

**Solution:**
- Verify `GROQ_API_KEY` in Vercel
- Check API route logs
- Test API endpoint directly

### Issue: Application Slow

**Causes:**
- Large bundle size
- Unoptimized images
- Too many API calls

**Solution:**
- Check bundle analyzer
- Optimize images
- Implement caching

## Performance Optimization

### Next.js Optimizations

- **Automatic Code Splitting**: Each page loads only needed code
- **Image Optimization**: Automatic image optimization
- **Static Generation**: Pre-renders pages when possible
- **Edge Runtime**: Fast API routes

### Additional Optimizations

#### Enable Compression

```javascript
// next.config.mjs
const nextConfig = {
  compress: true,
};
```

#### Add Caching Headers

```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  // ... existing code
  return result.toDataStreamResponse();
}
```

## Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env.local`
- ✅ Use different keys for dev/prod
- ✅ Rotate keys regularly
- ✅ Use Vercel's environment variable UI

### 2. API Security

- ✅ Validate all inputs
- ✅ Rate limiting (consider)
- ✅ Error handling (don't expose internals)

### 3. Dependencies

- ✅ Keep dependencies updated
- ✅ Use `npm audit` regularly
- ✅ Remove unused dependencies

## Monitoring and Maintenance

### Regular Tasks

1. **Update Dependencies**: Monthly
   ```bash
   npm update
   ```

2. **Check Logs**: Weekly
   - Vercel dashboard
   - Error tracking

3. **Monitor Usage**: 
   - API usage (Groq dashboard)
   - Vercel usage

4. **Test Deployments**: Before major changes

### Health Checks

Create a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok' });
}
```

## Rollback Strategy

### If Deployment Fails

1. **Vercel Dashboard**:
   - Go to "Deployments"
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Git**:
   ```bash
   git revert HEAD
   git push
   ```

## Cost Considerations

### Vercel Pricing

- **Hobby (Free)**: 
  - 100GB bandwidth/month
  - Unlimited deployments
  - Good for personal projects

- **Pro ($20/month)**:
   - More bandwidth
   - Team features
   - Better support

### Groq Pricing

- **Pay per use**: Based on tokens
- **Check pricing**: console.groq.com/pricing
- **Monitor usage**: Dashboard shows usage

## Best Practices

1. **Test Locally First**: Always test before deploying
2. **Use Preview Deployments**: Test in preview before production
3. **Monitor Logs**: Check logs regularly
4. **Set Up Alerts**: Get notified of errors
5. **Document Changes**: Keep changelog
6. **Backup**: Keep code in Git
7. **Environment Parity**: Keep dev/prod similar

## Next Steps

Congratulations! You've completed the course. You now understand:

- ✅ Next.js App Router architecture
- ✅ Groq model configuration
- ✅ API route implementation
- ✅ Chat interface development
- ✅ TypeScript type safety
- ✅ Streaming implementation
- ✅ Project configuration
- ✅ Production deployment

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Groq Documentation](https://console.groq.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

## Course Completion

You've learned how to build a complete AI chat application! Use this knowledge to:

- Build your own AI applications
- Customize this template
- Explore other AI providers
- Add new features
- Deploy to production

Happy coding! 🚀

