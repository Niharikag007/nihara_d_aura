import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export default function VerifyOTP() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);

  return <Navigate to="/login" replace />;
}
