// Custom Supabase REST client using fetch (bypasses SDK issues)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

const headers = {
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
};

// Generic REST API call
async function restCall<T>(
    table: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    query: string = '',
    body?: object
): Promise<{ data: T | null; error: any }> {
    try {
        const url = `${supabaseUrl}/rest/v1/${table}${query ? `?${query}` : ''}`;
        const options: RequestInit = {
            method,
            headers,
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            return { data: null, error: data };
        }

        return { data, error: null };
    } catch (error: any) {
        return { data: null, error: { message: error.message } };
    }
}

// Query builder for simple REST calls
export const supabaseRest = {
    from: (table: string) => ({
        select: (columns: string = '*') => ({
            query: `select=${encodeURIComponent(columns)}`,
            table,

            eq: function (column: string, value: string) {
                this.query += `&${column}=eq.${encodeURIComponent(value)}`;
                return this;
            },

            or: function (conditions: string) {
                this.query += `&or=(${encodeURIComponent(conditions)})`;
                return this;
            },

            order: function (column: string, options?: { ascending?: boolean }) {
                const dir = options?.ascending === false ? 'desc' : 'asc';
                this.query += `&order=${column}.${dir}`;
                return this;
            },

            limit: function (count: number) {
                this.query += `&limit=${count}`;
                return this;
            },

            single: async function () {
                this.query += '&limit=1';
                const result = await restCall<any[]>(this.table, 'GET', this.query);
                if (result.error) return { data: null, error: result.error };
                return { data: result.data?.[0] || null, error: null };
            },

            then: async function (resolve: (result: { data: any; error: any }) => void) {
                const result = await restCall<any[]>(this.table, 'GET', this.query);
                resolve(result);
            },
        }),

        insert: (data: object | object[]) => ({
            table,
            body: data,

            then: async function (resolve: (result: { data: any; error: any }) => void) {
                const result = await restCall<any>(this.table, 'POST', '', this.body);
                resolve(result);
            },
        }),

        delete: () => ({
            table,
            query: '',

            eq: function (column: string, value: string) {
                this.query += `${this.query ? '&' : ''}${column}=eq.${encodeURIComponent(value)}`;
                return this;
            },

            then: async function (resolve: (result: { data: any; error: any }) => void) {
                const result = await restCall<any>(this.table, 'DELETE', this.query);
                resolve(result);
            },
        }),
    }),
};

// Auth functions using REST API
export const supabaseAuth = {
    session: null as any,
    user: null as any,

    async signUp(email: string, password: string) {
        const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'apikey': supabaseAnonKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error_description || data.msg || 'Signup failed');
        }

        return { data, error: null };
    },

    async signInWithPassword(email: string, password: string) {
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'apikey': supabaseAnonKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error_description || data.msg || 'Login failed');
        }

        // Store session
        this.session = data;
        this.user = data.user;
        localStorage.setItem('supabase_session', JSON.stringify(data));

        // Update headers with user token
        headers['Authorization'] = `Bearer ${data.access_token}`;

        return { data, error: null };
    },

    async signOut() {
        this.session = null;
        this.user = null;
        localStorage.removeItem('supabase_session');
        headers['Authorization'] = `Bearer ${supabaseAnonKey}`;
        return { error: null };
    },

    async getSession() {
        const stored = localStorage.getItem('supabase_session');
        if (stored) {
            try {
                const session = JSON.parse(stored);
                // Check if token is expired
                const expiresAt = session.expires_at * 1000;
                if (Date.now() < expiresAt) {
                    this.session = session;
                    this.user = session.user;
                    headers['Authorization'] = `Bearer ${session.access_token}`;
                    return { data: { session }, error: null };
                }
            } catch (e) {
                console.error('Failed to parse session:', e);
            }
        }
        return { data: { session: null }, error: null };
    },

    async getUser() {
        if (this.user) {
            return { data: { user: this.user }, error: null };
        }
        const sessionResult = await this.getSession();
        return { data: { user: sessionResult.data?.session?.user || null }, error: null };
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
        // Check initial state
        this.getSession().then(result => {
            if (result.data?.session) {
                callback('INITIAL_SESSION', result.data.session);
            }
        });

        // Return dummy subscription for compatibility
        return {
            data: {
                subscription: {
                    unsubscribe: () => { },
                },
            },
        };
    },
};

// Initialize session on load
supabaseAuth.getSession();

export default { rest: supabaseRest, auth: supabaseAuth };
