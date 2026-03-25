# CodeClash Deployment Guide

## Architecture

| Service    | Platform           | URL Pattern                          |
|------------|--------------------|--------------------------------------|
| Frontend   | Vercel             | `https://codeclash-xyz.vercel.app`   |
| Backend    | Render.com         | `https://codeclash-backend.onrender.com` |
| Compiler   | AWS ECR + EC2      | `http://<EC2-PUBLIC-IP>:8000`        |

---

## Prerequisites

- **MongoDB Atlas** account with a cluster (free M0 tier works)
- **Vercel** account (free)
- **Render.com** account (free)
- **AWS** account with ECR & EC2 access
- **Groq API Key** (for AI Genie)
- **Google Generative AI Key** (for AI code review)

---

## Step 1: Deploy Compiler to AWS ECR + EC2

### 1a. Create ECR Repository

```bash
# Install AWS CLI if not already installed
# Configure AWS CLI
aws configure

# Create ECR repository
aws ecr create-repository --repository-name codeclash-compiler --region us-east-1
```

Save the repository URI (looks like: `123456789.dkr.ecr.us-east-1.amazonaws.com/codeclash-compiler`)

### 1b. Build & Push Docker Image

```bash
# Navigate to compiler directory
cd compiler

# Authenticate Docker with ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build the Docker image
docker build -t codeclash-compiler .

# Tag the image
docker tag codeclash-compiler:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/codeclash-compiler:latest

# Push to ECR
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/codeclash-compiler:latest
```

### 1c. Launch EC2 Instance

1. Go to **AWS Console > EC2 > Launch Instance**
2. Choose **Amazon Linux 2023** AMI
3. Instance type: **t3.small** (minimum recommended — needs RAM for compilers)
4. **Security Group** — open these ports:
   - Port 22 (SSH)
   - Port 8000 (Compiler API)
5. Create/select a key pair for SSH
6. Launch the instance

### 1d. Setup EC2 & Run Container

```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@<EC2-PUBLIC-IP>

# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Log out and back in for group change
exit
ssh -i your-key.pem ec2-user@<EC2-PUBLIC-IP>

# Authenticate with ECR
aws configure
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Pull and run the compiler
docker pull <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/codeclash-compiler:latest

docker run -d \
  --name codeclash-compiler \
  --restart always \
  -p 8000:8000 \
  -e PORT=8000 \
  -e FRONTEND_URL="https://your-frontend.vercel.app" \
  -e GROQ_API_KEY="your_groq_key" \
  -e GOOGLE_API_KEY="your_google_key" \
  <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/codeclash-compiler:latest
```

### 1e. Verify Compiler

```bash
curl http://<EC2-PUBLIC-IP>:8000/run -X POST \
  -H "Content-Type: application/json" \
  -d '{"code":"print(42)","language":"py","input":""}'
```

Expected: `{"output":"42\n"}`

---

## Step 2: Deploy Backend to Render.com

1. Go to [render.com](https://render.com) and sign up / log in
2. Click **New > Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name:** `codeclash-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
5. Add **Environment Variables:**
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a strong random secret
   - `ADMIN_SECRET_KEY` = your admin registration key
   - `FRONTEND_URL` = `https://your-frontend.vercel.app` (set after Step 3)
6. Click **Deploy**

Note your Render URL (e.g., `https://codeclash-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up / log in
2. Click **Add New > Project**
3. Import your GitHub repo
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
5. Add **Environment Variables:**
   - `VITE_BACKEND_URL` = `https://codeclash-backend.onrender.com`
   - `VITE_COMPILER_URL` = `http://<EC2-PUBLIC-IP>:8000`
6. Click **Deploy**

---

## Step 4: Update CORS Origins

After all three services are deployed, update the allowed origins:

### Backend (Render)
Add/update the `FRONTEND_URL` env var to your Vercel frontend URL.

### Compiler (EC2)
Stop and rerun the container with the correct `FRONTEND_URL`:

```bash
docker stop codeclash-compiler
docker rm codeclash-compiler

docker run -d \
  --name codeclash-compiler \
  --restart always \
  -p 8000:8000 \
  -e PORT=8000 \
  -e FRONTEND_URL="https://your-frontend.vercel.app" \
  -e GROQ_API_KEY="your_groq_key" \
  -e GOOGLE_API_KEY="your_google_key" \
  <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/codeclash-compiler:latest
```

---

## Step 5: MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Under **Network Access**, add:
   - `0.0.0.0/0` (allow from anywhere) — or add specific Render/EC2 IPs
4. Under **Database Access**, create a user with read/write permissions
5. Get the connection string and use it as `MONGO_URI`

---

## Updating the Compiler (Future Deploys)

```bash
# On your local machine
cd compiler
docker build -t codeclash-compiler .
docker tag codeclash-compiler:latest <ECR_URI>:latest
docker push <ECR_URI>:latest

# On EC2
docker pull <ECR_URI>:latest
docker stop codeclash-compiler
docker rm codeclash-compiler
docker run -d --name codeclash-compiler --restart always \
  -p 8000:8000 \
  -e PORT=8000 \
  -e FRONTEND_URL="https://your-frontend.vercel.app" \
  -e GROQ_API_KEY="your_key" \
  -e GOOGLE_API_KEY="your_key" \
  <ECR_URI>:latest
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors in browser | Check `FRONTEND_URL` env var matches your Vercel URL exactly (no trailing slash) |
| Compiler timeout on EC2 | Ensure security group allows port 8000 inbound |
| Backend can't connect to MongoDB | Check `MONGO_URI` and Atlas network access whitelist |
| Frontend shows blank page | Check Vercel env vars `VITE_BACKEND_URL` and `VITE_COMPILER_URL` are set |
| Render free tier sleeps | First request after inactivity takes ~30s (upgrade to paid to fix) |
