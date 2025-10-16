# GymAI
AI-powered Gym &amp; Fitness Assistant — a chatbot that provides personalized workout advice, exercise explanations, and nutrition guidance using NLP and LLMs.

# 🔧 Setup Instructions
### Steps : 

First clone the repository 

```bash
git clone https://github.com/AmerKone/GymAI.git
```

### Step 1 : create a venv environment

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



### Step 3 : Create a `.env` File

In the root directory, create a `.env` file and add your **Pinecone** and **OpenAI** credentials:


### Step 4 : Store Embeddings in Pinecone

Run the following command to generate and store vector embeddings:
```bash
python store_index.py
```
### 3Step 5 : Launch the Flask Application

Start the application by running:
```bash
python app.py
```

Then open your browser and go to:

http://localhost:8080

### 🧠 Tech Stack

Python

LangChain

Flask

OpenAI GPT

Pinecone

AWS (ECR, EC2)

GitHub Actions