# Use a imagem oficial do Node.js como base
FROM node:20-alpine

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o package.json e package-lock.json para o container
COPY package*.json ./

# Instale as dependências de produção
RUN npm install --production

# Copie o restante do código para o container
COPY . .

# Construa o aplicativo Next.js
RUN npm run build

# Exponha a porta que o seu aplicativo irá utilizar
EXPOSE 3000

# Comando para iniciar o aplicativo
CMD ["npm", "run", "start"]
