import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const processRedirect = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session || !session.user) {
                    console.error("Erro ao obter sessão:", sessionError);
                    navigate("/telalogin"); 
                    return;
                }

                const user = session.user;

                const { data: userData, error } = await supabase
                    .from("usuario")
                    .select("tipo_usuario")
                    .eq("email", user.email)
                    .maybeSingle();

                if (error || !userData) {
                    console.error("Erro ao buscar dados do usuário:", error);
                    navigate("/tipo-usuario"); 
                } else if (userData.tipo_usuario && userData.tipo_usuario !== "pendente") {
                    navigate(`/dashboard/${userData.tipo_usuario}`); 
                } else {
                    navigate("/tipo-usuario"); 
                }
            } catch (error) {
                console.error("Erro no callback:", error);
                navigate("/telalogin"); 
            }
        };

        processRedirect();
    }, [navigate]);


    return <p>Redirecionando...</p>;
};

export default AuthCallback;
