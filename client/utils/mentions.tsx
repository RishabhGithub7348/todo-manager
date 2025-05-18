import { User } from "@/types/api";


// Extract mentions from text
export function extractMentions(text: string): string[] {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

// Filter users for mention suggestions based on input
export function filterUsersForMentions(
  users: User[], 
  input: string, 
  alreadyMentioned: string[] = []
): User[] {
  if (!input.startsWith('@')) return [];
  
  const searchTerm = input.substring(1).toLowerCase();
  
  return users
    .filter(user => 
      !alreadyMentioned.includes(user.username) && 
      user.username.toLowerCase().includes(searchTerm)
    )
    .slice(0, 5); // Limit to 5 results for performance
}

// Replace mentions in text with styled versions
export function highlightMentions(text: string): React.ReactNode[] {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const parts: React.ReactNode[] = [];
  
  let lastIndex = 0;
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    // Add text before the mention
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    const username = match[1];
    
    // Add the mention with styling
    parts.push(
      <span key={match.index} className="text-primary font-medium">
        @{username}
      </span>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts;
}
