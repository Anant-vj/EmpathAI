const negativeKeywords = [
  'sad', 'unhappy', 'depressed', 'lonely', 'anxious', 'worried', 'stressed',
  'scared', 'afraid', 'hurt', 'pain', 'angry', 'frustrated', 'upset',
  'tired', 'exhausted', 'hopeless', 'helpless', 'overwhelmed', 'lost',
  'alone', 'empty', 'broken', 'struggling', 'suffering', 'cry', 'crying',
  'miserable', 'terrible', 'awful', 'bad', 'difficult', 'hard', 'tough',
  'desperate', 'weak', 'sick', 'ill', 'unwell'
];

export const detectSentiment = (text) => {
  if (!text || typeof text !== 'string') return { isNegative: false };
  
  const lowerText = text.toLowerCase();
  
  for (const keyword of negativeKeywords) {
    if (lowerText.includes(keyword)) {
      return {
        isNegative: true,
        detectedKeyword: keyword,
        originalText: text
      };
    }
  }
  
  return { isNegative: false };
};
