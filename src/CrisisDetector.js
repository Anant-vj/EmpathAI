const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
  'hurt myself', 'self harm', 'cut myself', 'overdose', 'hopeless',
  'no reason to live', 'give up', 'can\'t go on', 'worthless', 'burden'
];

const EMERGENCY_CONTACTS = {
  india: { number: '9152987821', name: 'Vandrevala Foundation (India)' },
  us: { number: '988', name: 'Suicide & Crisis Lifeline (US)' },
  uk: { number: '116123', name: 'Samaritans (UK)' },
  international: { number: '+1-800-273-8255', name: 'International Suicide Hotline' }
};

export function detectCrisis(message) {
  const lowerMessage = message.toLowerCase();
  const hasCrisisKeyword = CRISIS_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  return hasCrisisKeyword;
}

export function getCrisisResponse(region = 'india') {
  const contact = EMERGENCY_CONTACTS[region] || EMERGENCY_CONTACTS.india;
  
  return {
    isCrisis: true,
    message: `I'm really concerned about what you just shared. Your life matters deeply, and there are people who want to help you through this difficult time.

Please reach out to a professional who can provide immediate support:

📞 ${contact.name}: ${contact.number}

You don't have to face this alone. These trained counselors are available 24/7 and truly care about your wellbeing. 

Would you like to talk about what's troubling you? I'm here to listen, but please also consider calling the helpline above.`,
    emergencyContact: contact
  };
}

export { EMERGENCY_CONTACTS };
