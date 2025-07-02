# MongoDB Setup Guide for Fig.1 Blog System

## Option 1: MongoDB Atlas (Cloud - Recommended) 🌟

### Step 1: Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and sign up with your email
3. Choose "Build a database" → "M0 FREE" tier
4. Select a cloud provider and region (choose one close to you)
5. Create your cluster (this takes 1-3 minutes)

### Step 2: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Create a username and strong password (SAVE THESE!)
5. Set "Database User Privileges" to "Read and write to any database"
6. Click "Add User"

### Step 3: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, choose "Allow access from anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 4: Get Connection String
1. Go back to "Database" → "Clusters"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`)

### Step 5: Setup Environment Variables
1. In your project root, create `.env.local` file:
```bash
# Replace with your actual connection string
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/fig1-blog?retryWrites=true&w=majority
```

**Important**: Replace `your-username`, `your-password`, and add `/fig1-blog` after `.net/` to specify the database name.

---

## Option 2: Local MongoDB Installation

### For macOS (requires admin access):
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify installation
mongosh --version
```

### For Windows:
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Choose "Complete" installation
4. Install as a Windows Service
5. Start MongoDB service from Services app

### Local Environment Setup:
```bash
# Add to .env.local
MONGODB_URI=mongodb://localhost:27017/fig1-blog
```

---

## Testing Your Setup

### Step 1: Start Your Next.js App
```bash
npm run dev
```

### Step 2: Test the Blog System
1. Go to `http://localhost:3000/admin`
2. Click "Create New Post"
3. Fill out the form and create a test post
4. Check if the post appears in the admin posts list
5. Visit `http://localhost:3000/blog` to see your published posts

### Step 3: Verify Database Connection
If everything works, your MongoDB is properly connected! You can also check your Atlas dashboard to see the data.

---

## Troubleshooting

### Common Issues:

1. **"MongooseError: Operation buffering timed out"**
   - Check your MONGODB_URI is correct
   - Verify network access allows your IP
   - Ensure database user credentials are correct

2. **"Authentication failed"**
   - Double-check username/password in connection string
   - Make sure special characters in password are URL-encoded

3. **"Connection refused"** (Local MongoDB)
   - Ensure MongoDB service is running
   - Check if MongoDB is listening on port 27017

### Need Help?
- MongoDB Atlas Documentation: [https://docs.atlas.mongodb.com/](https://docs.atlas.mongodb.com/)
- MongoDB Community Forums: [https://community.mongodb.com/](https://community.mongodb.com/)

---

## Quick Start Summary

1. ✅ Sign up for MongoDB Atlas (free)
2. ✅ Create a cluster and database user
3. ✅ Get your connection string
4. ✅ Add `MONGODB_URI` to `.env.local`
5. ✅ Run `npm run dev` and test at `/admin`

**You're ready to start blogging!** 🚀