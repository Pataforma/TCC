import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // 1) Garante que a sessão foi criada a partir do fragment/hash do OAuth
                // (Supabase v2 trata automaticamente, mas aguardamos a hidratação da sessão)
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session || !session.user) {
                    // Se ainda não há sessão, tenta forçar atualização a partir da URL
                    const { error: refreshError } = await supabase.auth.refreshSession();
                    if (refreshError) {
                        console.error("Erro ao hidratar sessão após OAuth:", refreshError);
                        navigate("/telalogin", { replace: true });
                        return;
                    }
                }

                const { data: afterRefresh } = await supabase.auth.getSession();
                const activeSession = afterRefresh?.session;

                if (!activeSession || !activeSession.user) {
                    navigate("/telalogin", { replace: true });
                    return;
                }

                const userId = activeSession.user.id;
                const userEmail = activeSession.user.email;

                // 2) Garante que existe registro na tabela usuario
                const { data: existingUser, error: selectError } = await supabase
                    .from("usuario")
                    .select("id_usuario, tipo_usuario, perfil_completo")
                    .eq("email", userEmail)
                    .maybeSingle();

                if (selectError) {
                    console.error("Erro ao buscar usuário:", selectError);
                }

                if (!existingUser) {
                    const { error: insertError } = await supabase
                        .from("usuario")
                        .insert([{ id_usuario: userId, email: userEmail, tipo_usuario: "pendente", perfil_completo: false }]);
                    if (insertError) {
                        console.error("Erro ao criar usuário:", insertError);
                    }
                    navigate("/tipo-usuario", { replace: true });
                    return;
                }

                // 3) Redireciona conforme estado do perfil/tipo
                if (
                  existingUser.perfil_completo === true &&
                  existingUser.tipo_usuario &&
                  existingUser.tipo_usuario !== "pendente"
                ) {
                  navigate(`/dashboard/${existingUser.tipo_usuario}`, { replace: true });
                } else if (
                  existingUser.tipo_usuario &&
                  existingUser.tipo_usuario !== "pendente"
                ) {
                  navigate(`/onboarding/${existingUser.tipo_usuario}`, { replace: true });
                } else {
                  navigate("/tipo-usuario", { replace: true });
                }
            } catch (err) {
                console.error("Erro no callback OAuth:", err);
                navigate("/telalogin", { replace: true });
            }
        };

        handleCallback();
    }, [navigate]);

    return <p>Redirecionando...</p>;
};

export default AuthCallback;
