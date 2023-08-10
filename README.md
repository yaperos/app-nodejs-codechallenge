<h2>🚀 Configuración Inicial</h2>
<p>En el directorio principal, encontrarás un archivo llamado <code>docker-compose.yml</code>. Simplemente ejecuta <code>docker-compose up</code> para iniciar los contenedores Docker necesarios. 🐳</p>
<p>Luego, ve a la carpeta <code>antifraud</code> y ejecuta <code>yarn install</code> para instalar las dependencias necesarias. ⚙️</p>
<p>En la misma carpeta, usa <code>yarn start:dev</code> para iniciar el servidor. Esto hará que tu aplicación esté lista para funcionar. 🚀</p>
<p>Haz lo mismo en el directorio <code>transaction</code> (ejecuta <code>yarn install</code> y <code>yarn start:dev</code>) para el otro componente de la aplicación. 🔄</p>
<p>Si deseas personalizar las variables de entorno, ve al directorio <code>ms-transaction</code> y modifica el archivo <code>.env.stage.dev</code>. 🔧</p>

<h2>📖 Documentación de la API</h2>
<p>Abre tu navegador y dirígete a <a href="http://localhost:3000/docs" target="_blank">http://localhost:3000/docs</a>. Aquí encontrarás la documentación completa de la API. Esta es una guía que te muestra cómo interactuar con la aplicación. 📚</p>
<p>Para crear una transacción, utiliza <strong>POST /transactions</strong> y proporciona los detalles requeridos. 📝</p>
<p>Si deseas obtener detalles de una transacción específica, utiliza <strong>GET /transactions/{transactionExternalId}</strong>. Esto te dará información detallada sobre la transacción. 📄</p>
