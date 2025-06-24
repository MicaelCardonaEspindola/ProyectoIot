# Guía de Pagos con Stripe - Integrado en Cliente

## Configuración

### 1. Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
STRIPE_SECRET_KEY=sk_test_... # Tu clave secreta de Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_... # Tu clave pública de Stripe
```

### 2. Instalar Dependencias

```bash
npm install stripe
```

### 3. Actualizar Base de Datos

```bash
npm run build
```

### 4. Insertar Suscripciones con Precios

```bash
node scripts/insertar-suscripciones.js
```

## Endpoints Disponibles

### 1. Obtener Precios de Suscripciones

**GET** `/api/cliente/precios/suscripciones`

**Response:**
```json
{
  "success": true,
  "suscripciones": [
    {
      "id": 1,
      "nombre_plan": "Básico",
      "precio": 29.00,
      "limite_edificios": 5,
      "limite_usuarios": 10,
      "descripcion": "Plan básico para pequeñas empresas"
    },
    {
      "id": 2,
      "nombre_plan": "Profesional",
      "precio": 59.00,
      "limite_edificios": 20,
      "limite_usuarios": 50,
      "descripcion": "Plan profesional para empresas medianas"
    },
    {
      "id": 3,
      "nombre_plan": "Empresarial",
      "precio": 99.00,
      "limite_edificios": 100,
      "limite_usuarios": 200,
      "descripcion": "Plan empresarial para grandes organizaciones"
    }
  ]
}
```

### 2. Crear Intent de Pago

**POST** `/api/cliente/comprar-suscripcion`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "cliente_id": 1,
  "suscripcion_id": 2,
  "metodo_pago": "card"
}
```

**Response:**
```json
{
  "success": true,
  "client_secret": "pi_..._secret_...",
  "payment_intent_id": "pi_...",
  "monto": 59.00,
  "plan": "Profesional"
}
```

### 3. Confirmar Pago

**POST** `/api/cliente/confirmar-pago`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "payment_intent_id": "pi_..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pago confirmado y suscripción activada exitosamente",
  "cliente_id": 1,
  "suscripcion_id": 2,
  "plan": "Profesional"
}
```

## Precios de Suscripciones

- **Básico**: $29.00 USD (5 edificios, 10 usuarios)
- **Profesional**: $59.00 USD (20 edificios, 50 usuarios)
- **Empresarial**: $99.00 USD (100 edificios, 200 usuarios)

## Flujo de Pago Completo

### 1. Frontend (Ejemplo con JavaScript)

```javascript
// 1. Obtener precios de suscripciones
const preciosResponse = await fetch('/api/cliente/precios/suscripciones');
const { suscripciones } = await preciosResponse.json();

// 2. Crear intent de pago
const response = await fetch('/api/cliente/comprar-suscripcion', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    cliente_id: 1,
    suscripcion_id: 2
  })
});

const { client_secret, payment_intent_id } = await response.json();

// 3. Confirmar pago con Stripe
const { error } = await stripe.confirmCardPayment(client_secret, {
  payment_method: {
    card: elements.getElement('card'),
    billing_details: {
      name: 'Nombre del Cliente'
    }
  }
});

if (error) {
  console.error('Error:', error);
} else {
  // 4. Confirmar pago en el backend
  const confirmResponse = await fetch('/api/cliente/confirmar-pago', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      payment_intent_id: payment_intent_id
    })
  });

  const result = await confirmResponse.json();
  console.log('Pago confirmado:', result);
}
```

## Funcionalidades

### ✅ Completadas

1. **Sistema de Precios**: Cada suscripción tiene un precio configurado
2. **Integración con Stripe**: Pagos seguros con tarjeta de crédito
3. **Validación de Datos**: DTOs para validar entradas
4. **Actualización Automática**: La suscripción del cliente se actualiza automáticamente
5. **Manejo de Errores**: Validación de cliente y suscripción existentes

### 🔄 Flujo de Trabajo

1. Cliente selecciona una suscripción
2. Se crea un intent de pago en Stripe
3. Cliente ingresa datos de tarjeta
4. Stripe procesa el pago
5. Se confirma el pago en el backend
6. Se actualiza la suscripción del cliente automáticamente

## Seguridad

- Todas las rutas requieren autenticación (excepto obtener precios)
- Validación de datos con Zod
- Verificación de existencia de cliente y suscripción
- Manejo seguro de datos de pago a través de Stripe

## Base de Datos

### Cambios en el Esquema

- **Suscripcion**: Agregado campo `precio` (Float)
- **Cliente**: Mantiene relación con suscripción

### Migración

El comando `npm run build` aplicará automáticamente los cambios al esquema.

## Scripts Útiles

### Insertar Suscripciones por Defecto

```bash
node scripts/insertar-suscripciones.js
```

Este script creará las tres suscripciones con sus precios correspondientes si no existen. 