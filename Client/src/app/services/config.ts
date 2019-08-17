const server = 'http://localhost:3000';
const phpServer = 'http://localhost:8000';
const pyServer = 'http://localhost:8888';
const urlApi = `${server}/api`;
export const Config = {
    server,
    url: urlApi,
    avatar: `${urlApi}/avatar/`,
    publication: `${urlApi}/publication/image/`, // imágenes de las publicación
    php: `${phpServer}/api`,
    py: `${pyServer}`,
    market: `${phpServer}/` // imágenes de la marketPlace
};
