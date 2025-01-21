
# services/ai_suggester.py
from typing import List
from transformers import pipeline
from models.schemas import Suggestion, AnalysisResult, VulnerabilityReport

class AISuggester:
    def __init__(self):
        self.model = pipeline("text2text-generation", model="facebook/bart-large")
    
    def generate_suggestions(
        self,
        code: str,
        analysis_results: List[AnalysisResult],
        vulnerabilities: List[VulnerabilityReport]
    ) -> List[Suggestion]:
        suggestions = []
        
        # Generate suggestions based on analysis results
        for result in analysis_results:
            if result.score < 0.6:  # Threshold for generating suggestions
                suggestion = self._generate_improvement_suggestion(
                    code, result.metric_name
                )
                suggestions.append(suggestion)
        
        # Generate suggestions for vulnerabilities
        for vuln in vulnerabilities:
            suggestion = self._generate_security_suggestion(vuln)
            suggestions.append(suggestion)
        
        return suggestions
    
    def _generate_improvement_suggestion(self, code: str, metric: str) -> Suggestion:
        # Generate context-aware suggestions using the AI model
        prompt = f"Suggest improvements for the following code regarding {metric}:\n{code}"
        
        response = self.model(prompt, max_length=100)[0]['generated_text']
        
        return Suggestion(
            line_number=1,  # Would need more sophisticated analysis for exact line numbers
            suggestion=response,
            improvement_type=metric,
            confidence=0.85
        )
    
    def _generate_security_suggestion(self, vulnerability: VulnerabilityReport) -> Suggestion:
        return Suggestion(
            line_number=vulnerability.line_number,
            suggestion=vulnerability.recommendation,
            improvement_type="security",
            confidence=0.9
        )