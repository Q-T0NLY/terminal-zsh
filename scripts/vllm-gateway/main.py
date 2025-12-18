from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="vLLM Gateway", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class GenerationRequest(BaseModel):
    prompt: str
    model: str = "mistralai/Mistral-7B-Instruct-v0.2"
    temperature: float = 0.7
    max_tokens: int = 1024
    top_p: float = 0.9
    stop: Optional[List[str]] = None

class GenerationResponse(BaseModel):
    text: str
    model: str
    tokens_generated: int
    processing_time: float

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "gpu_available": True,
        "gpu_status": "healthy",
        "gpu_count": 1
    }

@app.get("/metrics")
async def metrics():
    return "# Prometheus metrics endpoint"

@app.post("/generate", response_model=GenerationResponse)
async def generate_text(request: GenerationRequest):
    start_time = time.time()
    
    try:
        # Simulated generation for demo
        generated_text = f"Generated response for: {request.prompt[:50]}..."
        tokens_generated = 100
        processing_time = time.time() - start_time
        
        logger.info(f"Generated {tokens_generated} tokens in {processing_time:.2f}s")
        
        return GenerationResponse(
            text=generated_text,
            model=request.model,
            tokens_generated=tokens_generated,
            processing_time=processing_time
        )
        
    except Exception as e:
        logger.error(f"Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@app.get("/models")
async def list_models():
    return {
        "available_models": [
            "mistralai/Mistral-7B-Instruct-v0.2",
            "meta-llama/Llama-2-7b-chat-hf",
            "microsoft/DialoGPT-medium"
        ]
    }
