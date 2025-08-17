import { supabase } from './supabase';

/**
 * Utilitários para gerenciar relacionamentos entre veterinários e tutores
 */

/**
 * Cria um relacionamento entre veterinário e tutor
 * @param {string} veterinarioId - ID do veterinário
 * @param {string} tutorId - ID do tutor
 * @param {string} observacoes - Observações sobre o relacionamento
 * @returns {Promise<Object>} Resultado da operação
 */
export const criarRelacionamentoVeterinarioTutor = async (veterinarioId, tutorId, observacoes = '') => {
  try {
    const { data, error } = await supabase
      .from('veterinario_tutor')
      .insert([
        {
          veterinario_id: veterinarioId,
          tutor_id: tutorId,
          status: 'ativo',
          observacoes: observacoes || 'Relacionamento criado automaticamente'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao criar relacionamento veterinário-tutor:', error);
    return { success: false, error };
  }
};

/**
 * Busca todos os tutores relacionados a um veterinário
 * @param {string} veterinarioId - ID do veterinário
 * @param {string} status - Status do relacionamento (opcional)
 * @returns {Promise<Array>} Lista de tutores relacionados
 */
export const buscarTutoresRelacionados = async (veterinarioId, status = 'ativo') => {
  try {
    const { data, error } = await supabase
      .from('veterinario_tutor')
      .select(`
        id,
        status,
        data_inicio,
        observacoes,
        tutor: tutor_id (
          id,
          nome,
          telefone,
          email,
          cidade,
          estado
        )
      `)
      .eq('veterinario_id', veterinarioId)
      .eq('status', status)
      .order('tutor.nome');

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erro ao buscar tutores relacionados:', error);
    return { success: false, error, data: [] };
  }
};

/**
 * Busca todos os veterinários relacionados a um tutor
 * @param {string} tutorId - ID do tutor
 * @param {string} status - Status do relacionamento (opcional)
 * @returns {Promise<Array>} Lista de veterinários relacionados
 */
export const buscarVeterinariosRelacionados = async (tutorId, status = 'ativo') => {
  try {
    const { data, error } = await supabase
      .from('veterinario_tutor')
      .select(`
        id,
        status,
        data_inicio,
        observacoes,
        veterinario: veterinario_id (
          id_usuario,
          nome,
          crmv,
          especialidade,
          telefone,
          email
        )
      `)
      .eq('tutor_id', tutorId)
      .eq('status', status)
      .order('veterinario.nome');

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erro ao buscar veterinários relacionados:', error);
    return { success: false, error, data: [] };
  }
};

/**
 * Atualiza o status de um relacionamento
 * @param {string} relacionamentoId - ID do relacionamento
 * @param {string} novoStatus - Novo status
 * @param {string} observacoes - Observações adicionais
 * @returns {Promise<Object>} Resultado da operação
 */
export const atualizarStatusRelacionamento = async (relacionamentoId, novoStatus, observacoes = '') => {
  try {
    const { data, error } = await supabase
      .from('veterinario_tutor')
      .update({
        status: novoStatus,
        observacoes: observacoes || `Status alterado para: ${novoStatus}`
      })
      .eq('id', relacionamentoId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao atualizar status do relacionamento:', error);
    return { success: false, error };
  }
};

/**
 * Verifica se existe relacionamento entre veterinário e tutor
 * @param {string} veterinarioId - ID do veterinário
 * @param {string} tutorId - ID do tutor
 * @returns {Promise<boolean>} True se existe relacionamento
 */
export const verificarRelacionamentoExistente = async (veterinarioId, tutorId) => {
  try {
    const { data, error } = await supabase
      .from('veterinario_tutor')
      .select('id, status')
      .eq('veterinario_id', veterinarioId)
      .eq('tutor_id', tutorId)
      .maybeSingle();

    if (error) throw error;
    return { success: true, existe: !!data, relacionamento: data };
  } catch (error) {
    console.error('Erro ao verificar relacionamento:', error);
    return { success: false, error, existe: false };
  }
};

/**
 * Busca estatísticas de relacionamentos para um veterinário
 * @param {string} veterinarioId - ID do veterinário
 * @returns {Promise<Object>} Estatísticas dos relacionamentos
 */
export const buscarEstatisticasRelacionamentos = async (veterinarioId) => {
  try {
    const { data, error } = await supabase
      .from('veterinario_tutor')
      .select('status')
      .eq('veterinario_id', veterinarioId);

    if (error) throw error;

    const estatisticas = {
      total: data?.length || 0,
      ativos: data?.filter(r => r.status === 'ativo').length || 0,
      inativos: data?.filter(r => r.status === 'inativo').length || 0,
      pendentes: data?.filter(r => r.status === 'pendente').length || 0
    };

    return { success: true, data: estatisticas };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return { success: false, error, data: {} };
  }
};
