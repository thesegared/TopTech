const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // Asegúrate de tener el modelo de Producto

// Configurar variables de entorno
dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Definir algunos productos de ejemplo
const products = [
    {
        name: 'Roku Express HD',
        description: 'Convierte tu Tv en Smart Tv y disfruta de apps como youtube, netflix, entre otras...',
        price: 140000,
        category: 'Tecnología',
        image: 'https://cigars.roku.com/v1/http%3A%2F%2Fimage.roku.com%2Fw%2Frapid%2Fimages%2Fpdp-carousel-items%2F53e763e1-d982-4340-9ea0-cd0ae88d192d.png', 
    },
    {
        name: 'Mouse Vertical Inalámbrico HP S6000',
        description: 'Diseño Ergonómico Vertical: El HP-S6000 presenta un diseño ergonómico vertical que se adapta cómodamente a la forma natural de la mano. Esta disposición vertical reduce la tensión en la muñeca y el antebrazo, previniendo el síndrome del túnel carpiano y brindando una experiencia de uso más cómoda.',
        price: 90000,
        category: 'Perifericos',
        image: 'https://http2.mlstatic.com/D_NQ_NP_669827-MCO72876611052_112023-O.webp',
    },
    {
        name: 'Teclado Gamer USB GK1012',
        description: 'Teclado con conexión usb y con iluminación RGB. Ideal para videojuegos y usos generales. Ref. 11385',
        price: 150000,
        category: 'Gamer',
        image: 'https://jaltechsas.com/wp-content/uploads/2023/12/TECLADO-USB-GAMER-GK1012_11385_GK1012_1.png',
    },
    {
        name: 'Diadema Genius HS-M200C 1 Plug 3.5MM',
        description: 'Audífono Diadema Genius conexion 3.5mm, Genius presenta su modelo más reciente de auriculares livianos, los HS-200C, que hacen muy fácil la comunicación a través de Internet. El micrófono ajustable produce un sonido de extrema claridad. Los HS-200C incluyen auriculares y micrófono, y son ideales para chatear en MSN, Skype y otras aplicaciones similares de Internet. Si desea más información sobre los HS-200C, consulte con su representante de ventas.',
        price: 45000,
        category: 'Audifonos',
        image: 'https://http2.mlstatic.com/D_NQ_NP_861110-MCO75982587016_052024-O.webp',
    },
    {
        name: 'Combo Teclado y Mouse Inalámbrico Genius KM-8101',
        description: 'Combo teclado + mouse Genius KM-8101 inalambrico Negro/Frecuencia RF 2,4 GHz/Tipo de tecla Cóncava/Teclas de función Sí, 12 (8 de audio, 4 de Internet)/Teclas multimedia Sí/Motor de sensor de ratón Óptico/Resolución del ratón (DPI) 1000/Ratón número de botones3 (izquierda, derecha, botón central con desplazamiento)/Requisitos del sistema Windows® 8, 10, 11 o posterior / Mac OS X 10.8 o posterior / Puerto USB disponible',
        price: 130000,
        category: 'Perifericos',
        image: 'https://carulla.vtexassets.com/arquivos/ids/10075871/combo-teclado-mouse-genius-km-8101-inalambrico-neg.jpg?v=638067582398130000',
    },
    {
        name: 'Combo Gamer Teclado, Mouse y Diadema CTMGJR-012',
        description: 'Combo Gamer multimedia 3 en 1: Teclado, Mouse y Diademas. Todo en uno, ideal para gamers y adictos a la tecnología.',
        price: 260000,
        category: 'Perifericos',
        image: 'https://jyrtechnology.com.co/wp-content/uploads/2020/05/CTMGJR-012-1-1.jpg',
    },
    
];

// Función para insertar los productos en la base de datos
const seedDatabase = async () => {
    try {
        // Eliminar todos los productos existentes (opcional)
        await Product.deleteMany();

        // Insertar los nuevos productos
        await Product.insertMany(products);
        console.log('Productos agregados correctamente');
        mongoose.connection.close(); // Cerrar la conexión después de la inserción
    } catch (error) {
        console.error('Error al insertar productos:', error);
    }
};

seedDatabase();
