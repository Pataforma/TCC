// src/utils/supabase.js
// DEPRECATED: Este arquivo não é mais usado
// Use src/utils/api.js para chamadas à API do backend

// Mantido apenas para compatibilidade com código legado
// TODO: Remover todas as referências a este arquivo

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    signInWithPassword: () => Promise.reject(new Error("Use auth.login() da API")),
    signUp: () => Promise.reject(new Error("Use auth.signup() da API")),
    signInWithOAuth: () => Promise.reject(new Error("OAuth não implementado")),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.reject(new Error("Use api.get() da API")),
        maybeSingle: () => Promise.reject(new Error("Use api.get() da API")),
      }),
      order: () => Promise.reject(new Error("Use api.get() da API")),
    }),
    insert: () => Promise.reject(new Error("Use api.post() da API")),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => Promise.reject(new Error("Use api.put() da API")),
        }),
      }),
    }),
    delete: () => ({
      eq: () => Promise.reject(new Error("Use api.delete() da API")),
    }),
  }),
};