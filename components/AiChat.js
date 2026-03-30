'use client';

import { useState } from 'react';

export default function AiChat({ pokemon, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          pokemonName: pokemon?.name,
          pokemonData: pokemon
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>
          Ask about {pokemon?.name || 'this Pokémon'}
        </h3>
        <button
          onClick={onBack}
          style={{
            background: '#880000',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ← BACK
        </button>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '15px',
        padding: '10px',
        background: '#f9f9f9',
        borderRadius: '8px',
        minHeight: '200px'
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            Ask me anything about {pokemon?.name || 'this Pokémon'}!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: '10px',
                textAlign: message.role === 'user' ? 'right' : 'left'
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  background: message.role === 'user' ? '#4A90E2' : '#e0e0e0',
                  color: message.role === 'user' ? 'white' : '#333',
                  fontSize: '12px',
                  lineHeight: '1.4'
                }}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '12px',
                background: '#e0e0e0',
                color: '#666',
                fontSize: '12px'
              }}
            >
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this Pokémon..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '8px',
            border: '2px solid #880000',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'Courier New, monospace'
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            padding: '8px 15px',
            background: '#880000',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontFamily: 'Courier New, monospace',
            fontWeight: 'bold',
            opacity: isLoading || !input.trim() ? 0.5 : 1
          }}
        >
          SEND
        </button>
      </form>
    </div>
  );
}
