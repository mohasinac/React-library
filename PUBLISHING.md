# Publishing to GitHub Packages

## Setup

1. **Create GitHub Personal Access Token**

   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `write:packages` and `read:packages` permissions
   - Copy the token

2. **Configure npm authentication**

   ```powershell
   npm login --registry=https://npm.pkg.github.com
   ```

   - Username: Your GitHub username (mohasinac)
   - Password: Your personal access token
   - Email: Your GitHub email

   Or set environment variable:

   ```powershell
   $env:NODE_AUTH_TOKEN="your_github_token"
   ```

## Publishing

```powershell
cd react-library
npm publish
```

## Installing in Projects

1. **Create .npmrc in your project root:**

   ```
   @mohasinac:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```

2. **Install the package:**

   ```powershell
   npm install @mohasinac/react-library
   ```

3. **Update main project package.json:**
   ```json
   {
     "dependencies": {
       "@mohasinac/react-library": "^1.0.1"
     }
   }
   ```

## Notes

- Package is private by default on GitHub Packages
- Free for public repositories
- Requires authentication to install
- Version bumps: `npm version patch|minor|major`
