# CROMA Mobile

Aplicativo mobile do sistema CROMA - Plataforma interna de controle de Ordens de Serviço e Manutenções, desenvolvido para otimizar o trabalho dos técnicos em campo.

## Sobre o projeto

O CROMA Mobile é a versão mobile do sistema web CROMA, focado nas funcionalidades que os técnicos utilizam em campo, permitindo acesso e gerenciamento de Ordens de Serviço sem a necessidade de um computador desktop.

## Tecnologias utilizadas

- **React Native** com Expo (Managed Workflow)
- **Expo Go** para testes em dispositivos físicos
- **React Navigation** para navegação entre telas
- **AsyncStorage** para persistência local de dados
- **Expo SecureStore** para armazenamento seguro do token JWT
- **React Native Chart Kit** para gráficos
- **Django REST Framework** como backend (API)
- **PostgreSQL** como banco de dados (Railway)

## Funcionalidades

- Splash screen animada
- Login com usuário e senha via JWT
- Dashboard com gráfico de OS por status e KPIs:
  - Finalizadas no mês
  - Em atraso
  - Em execução
  - Abertas
  - MTTR (tempo médio de resolução)
- CRUD completo de Ordens de Serviço:
  - Listar OS
  - Visualizar detalhes
  - Criar nova OS
  - Editar e atualizar status
  - Excluir OS (somente admin)
- Cache offline com AsyncStorage
- Atualização em tempo real com o backend

## Como rodar o projeto

### Pré-requisitos

- Node.js instalado
- Expo Go instalado no celular
- Expo CLI

### Instalação

```bash
# Clone o repositório
git clone https://github.com/BrunoDonato/croma-mobile.git

# Entre na pasta
cd croma-mobile

# Instale as dependências
npm install

# Inicie o projeto
npx expo start --go
```

Escanei o QR Code com o Expo Go para abrir o app.

## Backend

O backend Django está hospedado no Railway:

```
https://croma-production.up.railway.app
```

## Estrutura do projeto

```
croma-mobile/
├── src/
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── OSListScreen.js
│   │   ├── OSDetalheScreen.js
│   │   ├── OSCriarScreen.js
│   │   └── OSEditarScreen.js
│   ├── services/
│   │   ├── api.js
│   │   ├── ordens.js
│   │   └── googleAuth.js
│   └── context/
│       └── AuthContext.js
├── App.js
├── app.json
└── package.json
```

## Autor

Bruno Amaral Carvalho Donato — Projeto acadêmico de Desenvolvimento Mobile
