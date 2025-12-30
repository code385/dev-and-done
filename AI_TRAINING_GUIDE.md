# AI Model Training Guide for DevAndDone

This guide provides detailed instructions for training a custom AI model on DevAndDone's dataset.

---

## Overview

This guide covers:
1. Data extraction from MongoDB
2. Data preprocessing and formatting
3. Model training options
4. Model deployment and integration
5. Evaluation and improvement

---

## Prerequisites

- MongoDB access (read permissions)
- Python 3.8+ with ML libraries
- GPU access (recommended for training)
- Understanding of machine learning concepts

---

## Step 1: Data Extraction

### 1.1 Export Chat Conversations

**MongoDB Export:**
```bash
mongoexport \
  --uri="mongodb+srv://username:password@cluster.mongodb.net/devanddone" \
  --collection=chat_conversations \
  --out=chat_conversations.json \
  --jsonArray
```

**Python Export Script:**
```python
from pymongo import MongoClient
import json
from datetime import datetime

# Connect to MongoDB
client = MongoClient("mongodb+srv://username:password@cluster.mongodb.net/")
db = client.devanddone

# Export chat conversations
conversations = list(db.chat_conversations.find({}))
with open('chat_conversations.json', 'w') as f:
    json.dump(conversations, f, indent=2, default=str)

print(f"Exported {len(conversations)} conversations")
```

### 1.2 Export Project Estimates

```python
estimates = list(db.project_estimates.find({}))
with open('project_estimates.json', 'w') as f:
    json.dump(estimates, f, indent=2, default=str)

print(f"Exported {len(estimates)} estimates")
```

### 1.3 Export Blogs

```python
blogs = list(db.blogs.find({'isPublished': True}))
with open('blogs.json', 'w') as f:
    json.dump(blogs, f, indent=2, default=str)

print(f"Exported {len(blogs)} published blogs")
```

### 1.4 Export Contacts

```python
contacts = list(db.contacts.find({}))
with open('contacts.json', 'w') as f:
    json.dump(contacts, f, indent=2, default=str)

print(f"Exported {len(contacts)} contacts")
```

---

## Step 2: Data Preprocessing

### 2.1 Chat Conversation Formatting

**Format for Conversational AI Training:**

```python
import json

def format_chat_for_training(input_file, output_file):
    with open(input_file, 'r') as f:
        conversations = json.load(f)
    
    training_examples = []
    
    for conv in conversations:
        messages = conv.get('messages', [])
        
        # Create conversation pairs
        for i in range(0, len(messages) - 1):
            if messages[i]['role'] == 'user' and messages[i+1]['role'] == 'assistant':
                training_examples.append({
                    'instruction': 'You are a helpful AI assistant for DevAndDone, a premium development agency. Answer questions about services, processes, and expertise.',
                    'input': messages[i]['content'],
                    'output': messages[i+1]['content'],
                    'context': {
                        'sessionId': conv.get('sessionId'),
                        'source': conv.get('source', 'ai_chat')
                    }
                })
    
    # Save in JSONL format (one example per line)
    with open(output_file, 'w') as f:
        for example in training_examples:
            f.write(json.dumps(example) + '\n')
    
    print(f"Created {len(training_examples)} training examples")
    return training_examples

# Run
format_chat_for_training('chat_conversations.json', 'chat_training.jsonl')
```

### 2.2 Project Estimation Formatting

**Format for Estimation Model Training:**

```python
def format_estimates_for_training(input_file, output_file):
    with open(input_file, 'r') as f:
        estimates = json.load(f)
    
    training_examples = []
    
    for est in estimates:
        answers = est.get('answers', {})
        estimate = est.get('estimate', {})
        
        # Create prompt
        prompt = f"""Estimate the following project:
Type: {answers.get('projectType', 'N/A')}
Complexity: {answers.get('complexity', 'N/A')}
Features: {', '.join(answers.get('features', []))}
Timeline: {answers.get('timeline', 'N/A')}
Budget: {answers.get('budget', 'N/A')}
Additional Info: {answers.get('additionalInfo', 'None')}"""
        
        # Create output
        output = json.dumps({
            'priceRange': estimate.get('priceRange', {}),
            'timeline': estimate.get('timeline', {}),
            'suggestedTechStack': estimate.get('suggestedTechStack', []),
            'confidence': estimate.get('confidence', 'medium'),
            'insights': estimate.get('aiInsights', '')
        })
        
        training_examples.append({
            'instruction': 'You are an expert project estimator. Analyze project requirements and provide detailed estimates.',
            'input': prompt,
            'output': output
        })
    
    with open(output_file, 'w') as f:
        for example in training_examples:
            f.write(json.dumps(example) + '\n')
    
    print(f"Created {len(training_examples)} estimation training examples")
    return training_examples

format_estimates_for_training('project_estimates.json', 'estimates_training.jsonl')
```

### 2.3 Knowledge Base Creation

**Create RAG (Retrieval-Augmented Generation) Knowledge Base:**

```python
def create_knowledge_base(blogs_file, services_file, output_file):
    knowledge_base = []
    
    # Add blogs
    with open(blogs_file, 'r') as f:
        blogs = json.load(f)
        for blog in blogs:
            knowledge_base.append({
                'id': str(blog.get('_id')),
                'type': 'blog',
                'title': blog.get('title'),
                'content': blog.get('content'),
                'category': blog.get('category'),
                'excerpt': blog.get('excerpt')
            })
    
    # Add services (from services.js)
    # You'll need to export this separately or include in MongoDB
    services_data = [
        {
            'id': 'web-development',
            'type': 'service',
            'title': 'Web Development',
            'description': '...',
            'process': [...],
            'techStack': [...]
        },
        # ... other services
    ]
    
    for service in services_data:
        knowledge_base.append({
            'id': service['id'],
            'type': 'service',
            'title': service['title'],
            'content': service.get('detailedContent', service.get('description')),
            'process': service.get('process', []),
            'techStack': service.get('techStack', [])
        })
    
    with open(output_file, 'w') as f:
        json.dump(knowledge_base, f, indent=2)
    
    print(f"Created knowledge base with {len(knowledge_base)} entries")
    return knowledge_base

create_knowledge_base('blogs.json', 'services.json', 'knowledge_base.json')
```

---

## Step 3: Model Training Options

### Option 1: Fine-tune OpenAI GPT Models

**Advantages:**
- High quality results
- Easy to implement
- Good documentation

**Steps:**

1. **Prepare Data:**
   ```bash
   openai tools fine_tunes.prepare_data -f chat_training.jsonl
   ```

2. **Create Fine-tune Job:**
   ```python
   import openai
   
   openai.api_key = "your-api-key"
   
   # Upload training file
   training_file = openai.File.create(
       file=open("chat_training_prepared.jsonl", "rb"),
       purpose='fine-tune'
   )
   
   # Create fine-tune job
   fine_tune_job = openai.FineTuningJob.create(
       training_file=training_file.id,
       model="gpt-3.5-turbo",
       hyperparameters={
           "n_epochs": 3,
           "batch_size": 4,
           "learning_rate_multiplier": 0.1
       }
   )
   
   print(f"Fine-tune job created: {fine_tune_job.id}")
   ```

3. **Monitor Training:**
   ```python
   # Check status
   status = openai.FineTuningJob.retrieve(fine_tune_job.id)
   print(status)
   
   # List events
   events = openai.FineTuningJob.list_events(id=fine_tune_job.id)
   for event in events:
       print(event)
   ```

4. **Use Fine-tuned Model:**
   ```python
   # After training completes
   model_name = fine_tune_job.fine_tuned_model
   
   response = openai.ChatCompletion.create(
       model=model_name,
       messages=[
           {"role": "system", "content": "You are a helpful assistant..."},
           {"role": "user", "content": "What services do you offer?"}
       ]
   )
   ```

---

### Option 2: Fine-tune Anthropic Claude

**Steps:**

1. **Prepare Data in Claude Format:**
   ```python
   def convert_to_claude_format(input_file, output_file):
       with open(input_file, 'r') as f:
           examples = [json.loads(line) for line in f]
       
       claude_examples = []
       for ex in examples:
           claude_examples.append({
               "input": ex['input'],
               "output": ex['output']
           })
       
       with open(output_file, 'w') as f:
           json.dump(claude_examples, f, indent=2)
   ```

2. **Use Claude API with Custom Instructions:**
   ```python
   import anthropic
   
   client = anthropic.Anthropic(api_key="your-api-key")
   
   # Use system prompt with knowledge base
   response = client.messages.create(
       model="claude-3-opus-20240229",
       max_tokens=1024,
       system="You are a helpful AI assistant for DevAndDone...",
       messages=[
           {"role": "user", "content": "What services do you offer?"}
       ]
   )
   ```

---

### Option 3: Train Custom Model with Hugging Face

**Full Custom Training:**

```python
from transformers import (
    GPT2LMHeadModel,
    GPT2Tokenizer,
    Trainer,
    TrainingArguments,
    DataCollatorForLanguageModeling
)
from datasets import load_dataset
import torch

# Load model and tokenizer
model_name = "gpt2"  # or "microsoft/DialoGPT-medium" for conversational
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

# Add special tokens
tokenizer.pad_token = tokenizer.eos_token

# Load and prepare dataset
dataset = load_dataset('json', data_files='chat_training.jsonl')

def tokenize_function(examples):
    # Combine instruction, input, and output
    texts = []
    for i in range(len(examples['instruction'])):
        text = f"{examples['instruction'][i]}\n\nUser: {examples['input'][i]}\nAssistant: {examples['output'][i]}"
        texts.append(text)
    
    return tokenizer(texts, truncation=True, max_length=512, padding='max_length')

tokenized_dataset = dataset.map(tokenize_function, batched=True)

# Training arguments
training_args = TrainingArguments(
    output_dir='./devanddone-ai-model',
    overwrite_output_dir=True,
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    warmup_steps=100,
    logging_steps=10,
    save_steps=500,
    evaluation_strategy="steps",
    eval_steps=500,
    save_total_limit=3,
    load_best_model_at_end=True,
    learning_rate=5e-5,
    fp16=True,  # Use if GPU supports it
)

# Data collator
data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer,
    mlm=False
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset['train'],
    data_collator=data_collator,
)

# Train
trainer.train()

# Save model
trainer.save_model('./devanddone-ai-model-final')
tokenizer.save_pretrained('./devanddone-ai-model-final')
```

---

### Option 4: RAG (Retrieval-Augmented Generation)

**Best for:**
- Large knowledge base
- Frequently updated content
- Cost-effective

**Implementation:**

```python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA

# Load knowledge base
with open('knowledge_base.json', 'r') as f:
    knowledge_base = json.load(f)

# Split documents
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
documents = []
for item in knowledge_base:
    text = f"Title: {item['title']}\n\n{item['content']}"
    chunks = text_splitter.split_text(text)
    documents.extend(chunks)

# Create embeddings and vector store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_texts(documents, embeddings)

# Create QA chain
llm = OpenAI(temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(),
    return_source_documents=True
)

# Query
response = qa_chain({"query": "What services do you offer?"})
print(response['result'])
```

---

## Step 4: Model Deployment

### 4.1 Deploy as API Endpoint

**Create Custom API Route:**

```javascript
// src/app/api/ai/custom-chat/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    // Option 1: Call fine-tuned OpenAI model
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'ft:gpt-3.5-turbo:devanddone:custom-model-id',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant for DevAndDone...'
          },
          ...messages
        ]
      })
    });
    
    const data = await response.json();
    
    return NextResponse.json({
      message: data.choices[0].message.content,
      requiresApiKey: false
    });
  } catch (error) {
    console.error('Custom AI error:', error);
    return NextResponse.json(
      { error: 'AI service unavailable' },
      { status: 500 }
    );
  }
}
```

### 4.2 Deploy Custom Model (Hugging Face)

**Option A: Hugging Face Inference API**

```python
# Push model to Hugging Face
from huggingface_hub import HfApi

api = HfApi()
api.upload_folder(
    folder_path="./devanddone-ai-model-final",
    repo_id="devanddone/custom-ai-model",
    repo_type="model"
)
```

**Use in Next.js:**
```javascript
const response = await fetch(
  'https://api-inference.huggingface.co/models/devanddone/custom-ai-model',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 512,
        temperature: 0.7
      }
    })
  }
);
```

**Option B: Self-hosted with Docker**

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .
COPY model/ ./model/

EXPOSE 8000
CMD ["python", "app.py"]
```

```python
# app.py (FastAPI)
from fastapi import FastAPI
from transformers import pipeline

app = FastAPI()
model = pipeline("text-generation", model="./model")

@app.post("/generate")
async def generate(prompt: str):
    result = model(prompt, max_length=512, temperature=0.7)
    return {"response": result[0]["generated_text"]}
```

---

## Step 5: Evaluation & Improvement

### 5.1 Create Evaluation Dataset

```python
def create_evaluation_set(conversations_file, output_file):
    with open(conversations_file, 'r') as f:
        conversations = json.load(f)
    
    # Use 20% for evaluation
    eval_size = int(len(conversations) * 0.2)
    eval_conversations = conversations[:eval_size]
    
    eval_examples = []
    for conv in eval_conversations:
        messages = conv.get('messages', [])
        if len(messages) >= 2:
            eval_examples.append({
                'input': messages[-2]['content'],
                'expected_output': messages[-1]['content'],
                'context': {
                    'sessionId': conv.get('sessionId'),
                    'previous_messages': messages[:-2]
                }
            })
    
    with open(output_file, 'w') as f:
        json.dump(eval_examples, f, indent=2)
    
    return eval_examples
```

### 5.2 Evaluation Metrics

```python
from rouge_score import rouge_scorer
import json

def evaluate_model(predictions_file, ground_truth_file):
    with open(predictions_file, 'r') as f:
        predictions = json.load(f)
    
    with open(ground_truth_file, 'r') as f:
        ground_truth = json.load(f)
    
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
    
    scores = []
    for pred, truth in zip(predictions, ground_truth):
        scores.append(scorer.score(truth['expected_output'], pred['output']))
    
    # Calculate averages
    avg_rouge1 = sum(s['rouge1'].fmeasure for s in scores) / len(scores)
    avg_rouge2 = sum(s['rouge2'].fmeasure for s in scores) / len(scores)
    avg_rougeL = sum(s['rougeL'].fmeasure for s in scores) / len(scores)
    
    print(f"ROUGE-1: {avg_rouge1:.3f}")
    print(f"ROUGE-2: {avg_rouge2:.3f}")
    print(f"ROUGE-L: {avg_rougeL:.3f}")
    
    return {
        'rouge1': avg_rouge1,
        'rouge2': avg_rouge2,
        'rougeL': avg_rougeL
    }
```

---

## Step 6: Continuous Improvement

### 6.1 Feedback Loop

1. **Collect User Feedback:**
   ```javascript
   // Add feedback collection
   await fetch('/api/ai/feedback', {
     method: 'POST',
     body: JSON.stringify({
       messageId: messageId,
       helpful: true/false,
       feedback: "User feedback text"
     })
   });
   ```

2. **Retrain Periodically:**
   - Monthly retraining with new data
   - A/B testing different models
   - Monitoring performance metrics

### 6.2 Monitoring

```python
# Track model performance
def log_prediction(input_text, output_text, user_feedback):
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'input': input_text,
        'output': output_text,
        'user_feedback': user_feedback,
        'model_version': 'v1.0'
    }
    
    # Store in MongoDB or logging service
    db.ai_logs.insert_one(log_entry)
```

---

## Recommended Training Pipeline

### Phase 1: Data Collection (Week 1)
- Export all relevant data
- Clean and validate data
- Create training/validation splits

### Phase 2: Baseline Model (Week 2)
- Fine-tune GPT-3.5-turbo
- Evaluate on validation set
- Deploy to staging

### Phase 3: Custom Model (Week 3-4)
- Train custom model if needed
- Compare with baseline
- Optimize hyperparameters

### Phase 4: Production Deployment (Week 5)
- Deploy best model
- Set up monitoring
- Collect user feedback

### Phase 5: Iteration (Ongoing)
- Monthly retraining
- Continuous improvement
- A/B testing

---

## Resources

- **OpenAI Fine-tuning:** https://platform.openai.com/docs/guides/fine-tuning
- **Hugging Face:** https://huggingface.co/docs/transformers
- **LangChain RAG:** https://python.langchain.com/docs/use_cases/question_answering
- **Anthropic Claude:** https://docs.anthropic.com/claude/docs

---

## Support

For questions about AI training:
- Email: ai@devanddone.com
- Documentation: See PROJECT_DOCUMENTATION.md

---

**Last Updated:** 2024


