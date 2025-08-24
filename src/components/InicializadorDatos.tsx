'use client';

import { useEffect } from 'react';
import { inicializarDatosEjemplo } from '@/lib/datosEjemplo';

export default function InicializadorDatos() {
    useEffect(() => {
        inicializarDatosEjemplo();
    }, []);

    return null; // Este componente no renderiza nada
}
