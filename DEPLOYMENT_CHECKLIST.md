# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Environment Setup
- [ ] All environment variables configured in hosting provider
- [ ] MongoDB Atlas cluster created and configured
- [ ] MongoDB connection string tested
- [ ] EmailJS account set up and templates created
- [ ] EmailJS credentials verified
- [ ] OpenAI API key added (if using AI features)
- [ ] Site URL set correctly for production

### Database
- [ ] MongoDB indexes created (run `npm run seed`)
- [ ] Database backup strategy in place
- [ ] Connection pooling configured
- [ ] Database user has correct permissions

### Code
- [ ] All tests passing (if applicable)
- [ ] No console errors
- [ ] Linter passes
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors (if using TS)

### Security
- [ ] All secrets in environment variables (not in code)
- [ ] `.env.local` in `.gitignore`
- [ ] Rate limiting configured
- [ ] CORS configured (if needed)
- [ ] HTTPS enabled
- [ ] Security headers configured

### Performance
- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] Lighthouse score 90+
- [ ] CDN configured (if applicable)
- [ ] Caching strategy in place

## Deployment Steps

### Vercel (Recommended)
1. [ ] Push code to GitHub
2. [ ] Import project in Vercel
3. [ ] Add all environment variables
4. [ ] Configure build settings
5. [ ] Deploy
6. [ ] Verify deployment

### Other Platforms
1. [ ] Follow platform-specific deployment guide
2. [ ] Configure environment variables
3. [ ] Set up database connection
4. [ ] Configure domain/DNS
5. [ ] Deploy
6. [ ] Verify deployment

## Post-Deployment

### Functionality Testing
- [ ] Home page loads correctly
- [ ] Navigation works
- [ ] Contact form submits successfully
- [ ] Emails are received (check inbox)
- [ ] Newsletter subscription works
- [ ] Project estimator functions
- [ ] AI chat works (if API key provided)
- [ ] All pages accessible
- [ ] 404 page works
- [ ] Error handling works

### Database Verification
- [ ] Contact form submissions stored in MongoDB
- [ ] Newsletter subscriptions stored
- [ ] Project estimates stored
- [ ] Chat conversations stored (if applicable)
- [ ] Analytics events being logged

### Email Verification
- [ ] Contact form emails received
- [ ] Confirmation emails sent to users
- [ ] Newsletter confirmation emails work
- [ ] Email templates render correctly

### Performance
- [ ] Page load times acceptable
- [ ] Images load correctly
- [ ] 3D animations work
- [ ] Mobile responsive
- [ ] Cross-browser tested

### SEO
- [ ] Meta tags correct
- [ ] Open Graph tags working
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] Robots.txt accessible: `/robots.txt`
- [ ] Structured data valid

### Monitoring
- [ ] Health check endpoint working: `/api/health`
- [ ] Error tracking set up (if applicable)
- [ ] Analytics configured
- [ ] Uptime monitoring set up

## Production Checklist

### Ongoing Maintenance
- [ ] Regular database backups
- [ ] Monitor error logs
- [ ] Review analytics regularly
- [ ] Update dependencies monthly
- [ ] Security updates applied
- [ ] Performance monitoring active

### Documentation
- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] API documentation up to date
- [ ] Troubleshooting guide available

## Rollback Plan

If deployment fails:
1. [ ] Revert to previous deployment
2. [ ] Check error logs
3. [ ] Verify environment variables
4. [ ] Test locally
5. [ ] Redeploy after fixes

## Support

For deployment issues:
- Check [DEPLOYMENT.md](docs/DEPLOYMENT.md)
- Review [ENVIRONMENT.md](docs/ENVIRONMENT.md)
- Contact: support@devanddone.com

