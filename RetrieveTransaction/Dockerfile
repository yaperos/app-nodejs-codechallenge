FROM node:14

LABEL maintainer="Super Admin"
LABEL description="Servicio que se encarga de recuperar las transacciones"
LABEL version="v1.0.0"

EXPOSE 9002

# Install dependencias globales
RUN yarn global add nodemon

# Crea un directorio y ademas se posiciona en dicha ruta.
ENV HOME=/usr/src/app
WORKDIR $HOME

# Mejora de cache por un tema de orden es mejor copiar el package.json ejecutar las dependencias y luego copiar el codigo
COPY package.json ./
RUN yarn install
COPY . .

# Mostrar la listar de archivos del directorio actual del container.
RUN ls -lha

# Especificar el comando a ejecutar. Siendo este el primer proceso inicializado, determinando el UP o Down del container.
CMD [ "yarn", "run", "dev" ]

