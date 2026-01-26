import { supabaseRest } from '../lib/supabaseRestClient';
import { DbConversation, DbMessage } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';

// Get or create a conversation with a shelter
export async function getOrCreateConversation(shelterId: string): Promise<DbConversation | null> {
    const user = await getCurrentUser();
    if (!user) return null;

    // First verify the shelter exists
    const { data: shelter, error: shelterError } = await supabaseRest.from('shelters')
        .select('*')
        .eq('id', shelterId)
        .single();

    if (shelterError || !shelter) {
        console.error('Shelter not found:', shelterId);
        return null;
    }

    // Try to find existing conversation
    const { data: conversations } = await supabaseRest.from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('shelter_id', shelterId);

    const existing = conversations?.[0];
    if (existing) {
        return { ...existing, shelter };
    }

    // Create new conversation
    const { data, error } = await supabaseRest.from('conversations').insert({
        user_id: user.id,
        shelter_id: shelterId,
    });

    if (error) {
        console.error('Error creating conversation:', error);
        return null;
    }

    // Fetch the created conversation
    const { data: newConvs } = await supabaseRest.from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('shelter_id', shelterId);

    const newConv = newConvs?.[0];
    return newConv ? { ...newConv, shelter } : null;
}

// Get all conversations for current user
export async function getConversations(): Promise<any[]> {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data: conversations, error } = await supabaseRest.from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }

    // Fetch shelters and messages for each conversation
    const result = await Promise.all((conversations || []).map(async (conv: any) => {
        const { data: shelter } = await supabaseRest.from('shelters')
            .select('*')
            .eq('id', conv.shelter_id)
            .single();

        const { data: messages } = await supabaseRest.from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);

        const lastMessage = messages?.[0];

        return {
            ...conv,
            shelter,
            lastMessage: lastMessage?.content || '',
            lastMessageTime: lastMessage?.created_at || conv.created_at,
        };
    }));

    return result;
}

// Get messages for a conversation
export async function getMessages(conversationId: string): Promise<DbMessage[]> {
    const { data, error } = await supabaseRest.from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }

    return data || [];
}

// Send a message
export async function sendMessage(conversationId: string, content: string): Promise<DbMessage | null> {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabaseRest.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        sender_type: 'user',
        content,
    });

    if (error) {
        console.error('Error sending message:', error);
        return null;
    }

    // Fetch the sent message
    const { data: messages } = await supabaseRest.from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(1);

    return messages?.[0] || null;
}

// Subscribe to new messages - disabled for REST client
export function subscribeToMessages(
    conversationId: string,
    callback: (message: DbMessage) => void
) {
    // Realtime not supported with REST client
    // Return a no-op unsubscribe function
    console.log('Realtime subscription not available with REST client');
    return () => { };
}

// Get conversation by pet's shelter
export async function getConversationByPetId(petId: string): Promise<DbConversation | null> {
    const user = await getCurrentUser();
    if (!user) return null;

    // First get the pet's shelter
    const { data: pet } = await supabaseRest.from('pets')
        .select('*')
        .eq('id', petId)
        .single();

    if (!pet?.shelter_id) {
        console.log('Pet has no shelter_id:', petId);
        return null;
    }

    return getOrCreateConversation(pet.shelter_id);
}
