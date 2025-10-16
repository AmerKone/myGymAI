from langchain.document_loaders import PyPDFLoader
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List 
from langchain.schema import Document  
from langchain.embeddings import HuggingFaceEmbeddings

# Extract text from PDF
def load_pdf(data):
    loader = DirectoryLoader(
        data,
        glob="*.pdf",
        loader_cls=PyPDFLoader,
    )
    documents = loader.load()
    return documents

def filter_short_docs(docs: List[Document]) -> List[Document]:
    short_docs: List[Document] = []
    for doc in docs:
        src = doc.metadata.get("source")
        short_docs.append(Document(page_content=doc.page_content, metadata={"source": src}))
    return short_docs

# Split text into chunks
def split_docs(docs):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=20,
    )
    texts_chunked = text_splitter.split_documents(docs)
    return texts_chunked

def download_embeddings():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        )
    return embeddings