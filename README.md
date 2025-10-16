# GymAI
AI-powered Gym &amp; Fitness Assistant — a chatbot that provides personalized workout advice, exercise explanations, and nutrition guidance using NLP and LLMs.

# How to run ? 
### Steps : 

First clone the repository 

```bash
git clone https://github.com/AmerKone/GymAI.git
```

### Step 1 : creat a venv environment

```bash
conda create -n aienv python=3.11.3
```

### Activate the environment :

```bash
conda activate aienv
```

### Step 2 : Install the requirements 

```bash
pip install -r requirements.txt
```

## 🔧 Setup Instructions

### 1️⃣ Create a `.env` File

In the root directory, create a `.env` file and add your **Pinecone** and **OpenAI** credentials:

```ini
PINECONE_API_KEY = "your_pinecone_api_key_here"
OPENAI_API_KEY = "your_openai_api_key_here"

🔧 Setup Instructions
1️⃣ Create a .env File

In the root directory, create a .env file and add your Pinecone and OpenAI credentials:

PINECONE_API_KEY = "your_pinecone_api_key_here"
OPENAI_API_KEY = "your_openai_api_key_here"

2️⃣ Store Embeddings in Pinecone

Run the following command to generate and store vector embeddings:

python store_index.py

3️⃣ Launch the Flask Application

Start the application by running:

python app.py


Then open your browser and go to:

http://localhost:5000

🧠 Tech Stack

Python

LangChain

Flask

OpenAI GPT

Pinecone

AWS (ECR, EC2)

GitHub Actions