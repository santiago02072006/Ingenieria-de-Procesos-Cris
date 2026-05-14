# 🚀 DevSolve MVP - Especificaciones del Sistema

Este documento detalla los requerimientos técnicos y funcionales de **DevSolve**, una plataforma diseñada para la creación, gestión y reutilización de activos de software empresarial.

---

## 1. Requisitos Funcionales (RF)

Los Requisitos Funcionales definen las capacidades operativas que el sistema debe poseer para satisfacer las necesidades de Clientes y Desarrolladores.

### 👤 A. Gestión de Usuarios y Perfiles
*   **[RF-01] Registro Multitipo:** El sistema permite el registro de perfiles diferenciados para **Cliente/Empresa** y **Desarrollador**, incluyendo validación obligatoria por correo electrónico.
*   **[RF-02] Perfil de Reputación Dinámico:** Cálculo automatizado de scoring basado en:
    *   Porcentaje de proyectos completados.
    *   Cumplimiento de hitos (Milestones).
    *   Valoraciones de clientes y métricas de reutilización en el Marketplace.
*   **[RF-03] Portafolio Automático de Activos:** Listado automático de todas las herramientas creadas por el desarrollador. Al finalizar cada proyecto, el software se integra a la biblioteca pública como un activo del perfil.

### 📋 B. Tablón de Desafíos (Procesos de Negocio)
*   **[RF-04] Postulación de Problemas:** Formulario estructurado con campos obligatorios: Título, Categoría de industria, Descripción de flujo de trabajo, Resultado esperado y Presupuesto.
*   **[RF-05] Mensajería Interna:** Chat privado entre cliente y postulantes para aclaraciones técnicas pre-adjudicación.
*   **[RF-06] Gestión de Hitos (Milestones):** Sistema de pagos parciales. El desembolso final queda condicionado a la carga exitosa del software en la biblioteca pública.
*   **[RF-07] Gestión de Disputas:** Sistema de tickets para resolver conflictos funcionales o de publicación, permitiendo adjuntar evidencia y seguimiento administrativo.

### 🛒 C. Biblioteca de Soluciones (Marketplace)
*   **[RF-08] Categorización por "Dolor de Negocio":** Clasificación semántica mediante etiquetas operativas (Ahorro de tiempo, Optimización logística, Gestión de stock, etc.).
*   **[RF-09] Demo Obligatoria:** Requisito de entrega que incluye video o capturas de pantalla para validar el funcionamiento ante futuros compradores.
*   **[RF-10] Publicación Obligatoria de Activos:** Todo software finalizado se registra automáticamente en el Marketplace. El desarrollador controla precios y licencias, pero la solución permanece visible y disponible para el ecosistema.

### 💳 D. Gestión Financiera
*   **[RF-11] Pasarela de Pagos:** Integración con API externa para procesar pagos de proyectos y compras de licencias.
*   **[RF-12] Wallet del Desarrollador:** Panel de control para visualizar ingresos directos, regalías por reutilización y estados de cuenta.
*   **[RF-13] Facturación Automática:** Generación de recibos digitales detallando pagos, comisiones de plataforma y datos de transacción.

---

## 2. Lógica de Reutilización (Diferencial)

El núcleo estratégico de DevSolve se basa en evitar la duplicación de esfuerzos y maximizar el valor de cada línea de código.

*   **[RF-14] Notificación de Soluciones Similares:** Análisis automático durante la publicación de desafíos para sugerir software existente en el marketplace que resuelva necesidades similares.
*   **[RF-15] Solicitud de Derivación (Fork):** Capacidad de contratar adaptaciones o extensiones de soluciones existentes, generando nuevas versiones que también se integran al catálogo.

---

## 3. Requisitos No Funcionales (RNF)

| ID | Categoría | Requisito | Descripción |
| :--- | :--- | :--- | :--- |
| **RNF-01** | Seguridad | **Cifrado HTTPS/TLS** | Cifrado obligatorio en todas las transmisiones de datos. |
| **RNF-02** | Seguridad | **Gestión de Acceso** | Acceso a ejecutables y descargas restringido estrictamente a poseedores de licencia. |
| **RNF-03** | Seguridad | **Protección Inyecciones** | Implementación de sanitización contra SQL Injection y ataques XSS. |
| **RNF-04** | Desempeño | **Carga de Archivos** | Soporte para archivos de hasta 50MB (ejecutables, docs, imágenes). |
| **RNF-05** | Desempeño | **Concurrencia** | Soporte para 100+ usuarios simultáneos sin degradación de velocidad. |
| **RNF-06** | Calidad | **Logs de Auditoría** | Registro histórico de cambios de estado, pagos y disputas. |
| **RNF-07** | Calidad | **Diseño Responsivo** | Interfaz adaptable a móviles, tablets y desktops. |
| **RNF-08** | Calidad | **Arquitectura Modular** | Separación de módulos (Auth, Pagos, Proyectos) para facilitar mantenimiento. |