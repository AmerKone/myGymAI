from dotenv import load_dotenv
import os 
from src.helpers import load_pdf, split_docs, download_embeddings, filter_short_docs
from pinecone import Pinecone
from pinecone import ServerlessSpec
from langchain_pinecone import PineconeVectorStore

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["OPENAI_API_KEY"] = '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'

extracted_docs = load_pdf("data")
short_docs = filter_short_docs(extracted_docs)
text_chunked = split_docs(short_docs)

embedding = download_embeddings()

pinecone_api = PINECONE_API_KEY
pc = Pinecone(api_key=pinecone_api)

index_name = "gym-chatbot"
if not pc.has_index(index_name):
    pc.create_index(
        name=index_name,
        dimension=384,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    ) 

    index = pc.Index(index_name)

docsearch = PineconeVectorStore.from_documents(documents=text_chunked, embedding=embedding, index_name=index_name)  
