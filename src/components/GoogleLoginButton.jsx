import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import { signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuth, googleProvider } from '../services/firebase';
import { auth as apiAuth } from '../utils/api';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = ({ variant = 'light', className = '', ...props }) => {
    const { fetchUserData } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const result = await signInWithPopup(firebaseAuth, googleProvider);
            const user = result.user;
            const token = await user.getIdToken();

            await apiAuth.loginGoogle(token);
            await fetchUserData(); // Update global user state
            navigate('/'); // Redirect to dashboard/home after login
        } catch (error) {
            console.error('Erro ao fazer login com Google:', error);
            alert('Falha ao fazer login com Google. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant={variant}
            className={`d-flex align-items-center justify-content-center gap-2 ${className}`}
            onClick={handleGoogleLogin}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
                <FaGoogle />
            )}
            {loading ? 'Entrando...' : 'Entrar com Google'}
        </Button>
    );
};

export default GoogleLoginButton;
