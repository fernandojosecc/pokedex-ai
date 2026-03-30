import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { question, pokemonName, pokemonData } = await request.json();

    if (!question || !pokemonName || !pokemonData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a comprehensive Pokémon data summary
    const pokemonSummary = {
      name: pokemonData.name,
      id: pokemonData.id,
      types: pokemonData.types.map(t => t.type.name).join(', '),
      abilities: pokemonData.abilities.map(a => a.ability.name).join(', '),
      stats: pokemonData.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join(', '),
      height: `${pokemonData.height / 10}m`,
      weight: `${pokemonData.weight / 10}kg`,
      baseExperience: pokemonData.base_experience || 'Unknown'
    };

    const systemPrompt = `You are a Pokémon expert assistant built into a Pokédex.
Answer questions about Pokémon in a fun, knowledgeable way.
Keep answers concise — 2-4 sentences max.
You have been given data about ${pokemonName}: ${JSON.stringify(pokemonSummary)}
Use this data to give accurate answers.
Be enthusiastic and educational, like a real Pokédex would be!`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: question
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Claude API error:', response.status, response.statusText);
      // Fallback response if Claude API fails
      const fallbackResponse = generateFallbackResponse(question, pokemonName, pokemonData);
      return NextResponse.json({ response: fallbackResponse });
    }

    const data = await response.json();
    return NextResponse.json({ response: data.content[0].text });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateFallbackResponse(question, pokemonName, pokemonData) {
  const questionLower = question.toLowerCase();
  
  if (questionLower.includes('type') || questionLower.includes('types')) {
    const types = pokemonData.types.map(t => t.type.name).join(' and ');
    return `${pokemonName} is a ${types} type Pokémon!`;
  }
  
  if (questionLower.includes('height') || questionLower.includes('tall')) {
    const height = pokemonData.height / 10;
    return `${pokemonName} stands ${height} meters tall!`;
  }
  
  if (questionLower.includes('weight') || questionLower.includes('heavy')) {
    const weight = pokemonData.weight / 10;
    return `${pokemonName} weighs ${weight} kilograms!`;
  }
  
  if (questionLower.includes('strong') || questionLower.includes('attack')) {
    const attackStat = pokemonData.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
    return `${pokemonName} has an Attack stat of ${attackStat}, making it quite powerful!`;
  }
  
  if (questionLower.includes('fast') || questionLower.includes('speed')) {
    const speedStat = pokemonData.stats.find(s => s.stat.name === 'speed')?.base_stat || 0;
    return `${pokemonName} has a Speed stat of ${speedStat}!`;
  }
  
  return `${pokemonName} is an amazing Pokémon! It has some great abilities and stats that make it unique.`;
}
