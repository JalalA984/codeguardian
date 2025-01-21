# services/code_analyzer.py
import torch
from transformers import AutoTokenizer, AutoModel
from typing import List
from models.schemas import AnalysisResult

class CodeAnalyzer:
    def __init__(self):
        self.model_name = "microsoft/codebert-base"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModel.from_pretrained(self.model_name)
        
    def analyze(self, code: str, language: str) -> List[AnalysisResult]:
        # Tokenize and encode the code
        inputs = self.tokenizer(code, return_tensors="pt", truncation=True, max_length=512)
        
        # Get embeddings
        with torch.no_grad():
            outputs = self.model(**inputs)
            embeddings = outputs.last_hidden_state.mean(dim=1)
        
        # Calculate metrics based on embeddings
        results = []
        
        # Code complexity score
        complexity_score = self._calculate_complexity_score(code)
        results.append(AnalysisResult(
            metric_name="complexity",
            score=complexity_score,
            details="Code complexity based on cyclomatic complexity"
        ))
        
        # Maintainability index
        maintainability_score = self._calculate_maintainability(code)
        results.append(AnalysisResult(
            metric_name="maintainability",
            score=maintainability_score,
            details="Code maintainability index"
        ))
        
        return results
    
    def _calculate_complexity_score(self, code: str) -> float:
        # Implement cyclomatic complexity calculation
        control_structures = ['if', 'for', 'while', 'case', 'catch', 'and', 'or']
        score = 1  # Base complexity
        
        for structure in control_structures:
            score += code.count(structure)
        
        # Normalize score to 0-1 range
        return min(1.0, score / 10)
    
    def _calculate_maintainability(self, code: str) -> float:
        # Calculate maintainability index
        loc = len(code.splitlines())
        comment_lines = sum(1 for line in code.splitlines() if line.strip().startswith('#'))
        
        # Simple maintainability calculation
        comment_ratio = comment_lines / max(loc, 1)
        avg_line_length = sum(len(line.strip()) for line in code.splitlines()) / max(loc, 1)
        
        # Normalize scores
        maintainability = (0.7 * (1 - min(avg_line_length / 100, 1)) + 
                         0.3 * comment_ratio)
        
        return maintainability

