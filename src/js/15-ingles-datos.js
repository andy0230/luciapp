/* English World — Mi mundo en inglés
   Contenido curricular para niña de 3 años (hispanohablante).
   ES5 puro, sin módulos. Emoji <= Unicode 13, sin secuencias ZWJ.
   nivel 1 = primeras palabras (3 por categoría); nivel 2 = después. */
var ENGLISH = {
  version: 1,

  metodologia: [
    'Escuchar: la niña oye la palabra en español y luego en inglés, dos veces, con voz lenta ("Perro… dog. Dog!").',
    'Observar: cada palabra aparece con un emoji grande; tocarlo repite la palabra y la frase corta.',
    'Asociar: emparejar la palabra oída con su imagen (2 opciones al inicio, 3 después).',
    'Reconocer: "Touch the dog!" entre 2–3 imágenes ya conocidas; sin penalizar el error, se nombra lo que tocó.',
    'Repetir voluntariamente: "¿Lo dices conmigo? Dog!" con pausa de 2 s; nunca se exige ni se evalúa la pronunciación.',
    'Reforzar: repasar en la sesión siguiente, a los 3 días y a los 7 días (repetición espaciada 1-3-7).',
    'Regla: máximo 3 palabras nuevas por sesión; el resto del tiempo es repaso de palabras conocidas.',
    'Sesión de inglés corta: 5 a 7 minutos, siempre empezando por palabras de nivel 1.',
    'El español es el ancla: primero la palabra en español, después en inglés; nunca solo inglés en lo nuevo.',
    'Celebrar el esfuerzo: "¡Escuchaste muy bien!", "Great listening!"; sin vidas ni puntajes.'
  ],

  categorias: [
    { id: 'animals', es: 'Animales', en: 'Animals', ico: '🐶', color: 'pasto', palabras: [
      { id: 'dog', e: '🐶', es: 'perro', en: 'dog', ej: 'The dog says woof!', ejEs: '¡El perro dice guau!', nivel: 1 },
      { id: 'cat', e: '🐱', es: 'gato', en: 'cat', ej: 'The cat says meow!', ejEs: '¡El gato dice miau!', nivel: 1 },
      { id: 'duck', e: '🦆', es: 'pato', en: 'duck', ej: 'Quack, quack, duck!', ejEs: '¡Cuac, cuac, pato!', nivel: 1 },
      { id: 'cow', e: '🐮', es: 'vaca', en: 'cow', ej: 'The cow says moo!', ejEs: '¡La vaca dice muu!', nivel: 2 },
      { id: 'fish', e: '🐟', es: 'pez', en: 'fish', ej: 'The fish swims.', ejEs: 'El pez nada.', nivel: 2 },
      { id: 'bird', e: '🐦', es: 'pájaro', en: 'bird', ej: 'The bird flies!', ejEs: '¡El pájaro vuela!', nivel: 2 },
      { id: 'horse', e: '🐴', es: 'caballo', en: 'horse', ej: 'Run, horse, run!', ejEs: '¡Corre, caballo, corre!', nivel: 2 },
      { id: 'pig', e: '🐷', es: 'cerdito', en: 'pig', ej: 'The pig says oink!', ejEs: '¡El cerdito dice oinc!', nivel: 2 }
    ]},
    { id: 'colors', es: 'Colores', en: 'Colors', ico: '🎨', color: 'chicle', palabras: [
      { id: 'red', e: '🍎', hex: '#E53935', es: 'rojo', en: 'red', ej: 'A red apple!', ejEs: '¡Una manzana roja!', nivel: 1 },
      { id: 'blue', e: '🐳', hex: '#1E88E5', es: 'azul', en: 'blue', ej: 'A blue whale!', ejEs: '¡Una ballena azul!', nivel: 1 },
      { id: 'yellow', e: '🐥', hex: '#FDD835', es: 'amarillo', en: 'yellow', ej: 'A yellow chick!', ejEs: '¡Un pollito amarillo!', nivel: 1 },
      { id: 'green', e: '🐸', hex: '#43A047', es: 'verde', en: 'green', ej: 'A green frog!', ejEs: '¡Una rana verde!', nivel: 2 },
      { id: 'orange_color', e: '🥕', hex: '#FB8C00', es: 'naranja', en: 'orange', ej: 'An orange carrot!', ejEs: '¡Una zanahoria naranja!', nivel: 2 },
      { id: 'purple', e: '💜', hex: '#8E24AA', es: 'morado', en: 'purple', ej: 'A purple heart!', ejEs: '¡Un corazón morado!', nivel: 2 },
      { id: 'pink', e: '🌸', hex: '#F06292', es: 'rosado', en: 'pink', ej: 'A pink flower!', ejEs: '¡Una flor rosada!', nivel: 2 }
    ]},
    { id: 'fruits', es: 'Frutas', en: 'Fruits', ico: '🍓', color: 'coral', palabras: [
      { id: 'apple', e: '🍎', es: 'manzana', en: 'apple', ej: 'One red apple!', ejEs: '¡Una manzana roja!', nivel: 1 },
      { id: 'banana', e: '🍌', es: 'banano', en: 'banana', ej: 'Yummy banana!', ejEs: '¡Rico banano!', nivel: 1 },
      { id: 'strawberry', e: '🍓', es: 'fresa', en: 'strawberry', ej: 'A red strawberry!', ejEs: '¡Una fresa roja!', nivel: 1 },
      { id: 'orange_fruit', e: '🍊', es: 'naranja', en: 'orange', ej: 'Orange juice, please!', ejEs: '¡Jugo de naranja, por favor!', nivel: 2 },
      { id: 'grapes', e: '🍇', es: 'uvas', en: 'grapes', ej: 'Purple grapes!', ejEs: '¡Uvas moradas!', nivel: 2 },
      { id: 'watermelon', e: '🍉', es: 'sandía', en: 'watermelon', ej: 'Big watermelon!', ejEs: '¡Sandía grande!', nivel: 2 },
      { id: 'pineapple', e: '🍍', es: 'piña', en: 'pineapple', ej: 'Sweet pineapple!', ejEs: '¡Piña dulce!', nivel: 2 },
      { id: 'pear', e: '🍐', es: 'pera', en: 'pear', ej: 'A green pear!', ejEs: '¡Una pera verde!', nivel: 2 }
    ]},
    { id: 'numbers', es: 'Números', en: 'Numbers', ico: '🔢', color: 'sol', palabras: [
      { id: 'one', e: '1️⃣', n: 1, es: 'uno', en: 'one', ej: 'One apple!', ejEs: '¡Una manzana!', nivel: 1 },
      { id: 'two', e: '2️⃣', n: 2, es: 'dos', en: 'two', ej: 'Two eyes!', ejEs: '¡Dos ojos!', nivel: 1 },
      { id: 'three', e: '3️⃣', n: 3, es: 'tres', en: 'three', ej: 'Three ducks!', ejEs: '¡Tres patos!', nivel: 1 },
      { id: 'four', e: '4️⃣', n: 4, es: 'cuatro', en: 'four', ej: 'Four little cats!', ejEs: '¡Cuatro gatitos!', nivel: 2 },
      { id: 'five', e: '5️⃣', n: 5, es: 'cinco', en: 'five', ej: 'Five fingers!', ejEs: '¡Cinco dedos!', nivel: 2 },
      { id: 'six', e: '6️⃣', n: 6, es: 'seis', en: 'six', ej: 'Six stars!', ejEs: '¡Seis estrellas!', nivel: 2 }
    ]},
    { id: 'family', es: 'Familia', en: 'Family', ico: '👪', color: 'chicle', palabras: [
      { id: 'mom', e: '👩', es: 'mamá', en: 'mom', ej: 'I love you, Mom!', ejEs: '¡Te quiero, mamá!', nivel: 1 },
      { id: 'dad', e: '👨', es: 'papá', en: 'dad', ej: 'Hi, Dad!', ejEs: '¡Hola, papá!', nivel: 1 },
      { id: 'baby', e: '👶', es: 'bebé', en: 'baby', ej: 'The baby sleeps.', ejEs: 'El bebé duerme.', nivel: 1 },
      { id: 'sister', e: '👧', es: 'hermana', en: 'sister', ej: 'My big sister!', ejEs: '¡Mi hermana mayor!', nivel: 2 },
      { id: 'brother', e: '👦', es: 'hermano', en: 'brother', ej: 'My little brother!', ejEs: '¡Mi hermanito!', nivel: 2 },
      { id: 'grandma', e: '👵', es: 'abuela', en: 'grandma', ej: 'Hug Grandma!', ejEs: '¡Abraza a la abuela!', nivel: 2 },
      { id: 'grandpa', e: '👴', es: 'abuelo', en: 'grandpa', ej: 'Hello, Grandpa!', ejEs: '¡Hola, abuelo!', nivel: 2 }
    ]},
    { id: 'body', es: 'Mi cuerpo', en: 'My body', ico: '🙋', color: 'cielo', palabras: [
      { id: 'nose', e: '👃', es: 'nariz', en: 'nose', ej: 'Touch your nose!', ejEs: '¡Toca tu nariz!', nivel: 1 },
      { id: 'eyes', e: '👀', es: 'ojos', en: 'eyes', ej: 'Open your eyes!', ejEs: '¡Abre los ojos!', nivel: 1 },
      { id: 'mouth', e: '👄', es: 'boca', en: 'mouth', ej: 'Open your mouth!', ejEs: '¡Abre la boca!', nivel: 1 },
      { id: 'ears', e: '👂', es: 'orejas', en: 'ears', ej: 'Touch your ears!', ejEs: '¡Toca tus orejas!', nivel: 2 },
      { id: 'hands', e: '👐', es: 'manos', en: 'hands', ej: 'Clap your hands!', ejEs: '¡Aplaude con las manos!', nivel: 2 },
      { id: 'feet', e: '🦶', es: 'pies', en: 'feet', ej: 'Stamp your feet!', ejEs: '¡Zapatea con los pies!', nivel: 2 },
      { id: 'teeth', e: '🦷', es: 'dientes', en: 'teeth', ej: 'Brush your teeth!', ejEs: '¡Cepilla tus dientes!', nivel: 2 }
    ]},
    { id: 'toys', es: 'Juguetes', en: 'Toys', ico: '🧸', color: 'uva', palabras: [
      { id: 'ball', e: '⚽', es: 'pelota', en: 'ball', ej: 'Kick the ball!', ejEs: '¡Patea la pelota!', nivel: 1 },
      { id: 'teddy', e: '🧸', es: 'osito', en: 'teddy bear', ej: 'Hug your teddy!', ejEs: '¡Abraza tu osito!', nivel: 1 },
      { id: 'car', e: '🚗', es: 'carro', en: 'car', ej: 'Beep beep, car!', ejEs: '¡Pi pi, carro!', nivel: 1 },
      { id: 'balloon', e: '🎈', es: 'globo', en: 'balloon', ej: 'A big balloon!', ejEs: '¡Un globo grande!', nivel: 2 },
      { id: 'train', e: '🚂', es: 'tren', en: 'train', ej: 'Choo choo, train!', ejEs: '¡Chu chu, tren!', nivel: 2 },
      { id: 'drum', e: '🥁', es: 'tambor', en: 'drum', ej: 'Boom boom, drum!', ejEs: '¡Bum bum, tambor!', nivel: 2 },
      { id: 'kite', e: '🪁', es: 'cometa', en: 'kite', ej: 'Fly, kite, fly!', ejEs: '¡Vuela, cometa, vuela!', nivel: 2 },
      { id: 'puzzle', e: '🧩', es: 'rompecabezas', en: 'puzzle', ej: 'Let\'s do a puzzle!', ejEs: '¡Armemos un rompecabezas!', nivel: 2 }
    ]},
    { id: 'food', es: 'Comida', en: 'Food', ico: '🍞', color: 'sol', palabras: [
      { id: 'milk', e: '🥛', es: 'leche', en: 'milk', ej: 'Milk, please!', ejEs: '¡Leche, por favor!', nivel: 1 },
      { id: 'water', e: '💧', es: 'agua', en: 'water', ej: 'Water, please!', ejEs: '¡Agua, por favor!', nivel: 1 },
      { id: 'bread', e: '🍞', es: 'pan', en: 'bread', ej: 'Yummy bread!', ejEs: '¡Rico pan!', nivel: 1 },
      { id: 'egg', e: '🥚', es: 'huevo', en: 'egg', ej: 'An egg for breakfast!', ejEs: '¡Un huevo de desayuno!', nivel: 2 },
      { id: 'cheese', e: '🧀', es: 'queso', en: 'cheese', ej: 'Say cheese!', ejEs: '¡Di queso!', nivel: 2 },
      { id: 'rice', e: '🍚', es: 'arroz', en: 'rice', ej: 'Rice, please!', ejEs: '¡Arroz, por favor!', nivel: 2 },
      { id: 'cookie', e: '🍪', es: 'galleta', en: 'cookie', ej: 'One cookie!', ejEs: '¡Una galleta!', nivel: 2 },
      { id: 'icecream', e: '🍦', es: 'helado', en: 'ice cream', ej: 'Cold ice cream!', ejEs: '¡Helado frío!', nivel: 2 }
    ]},
    { id: 'nature', es: 'Naturaleza', en: 'Nature', ico: '🌳', color: 'pasto', palabras: [
      { id: 'sun', e: '☀️', es: 'sol', en: 'sun', ej: 'Hello, sun!', ejEs: '¡Hola, sol!', nivel: 1 },
      { id: 'moon', e: '🌙', es: 'luna', en: 'moon', ej: 'Good night, moon!', ejEs: '¡Buenas noches, luna!', nivel: 1 },
      { id: 'tree', e: '🌳', es: 'árbol', en: 'tree', ej: 'A big tree!', ejEs: '¡Un árbol grande!', nivel: 1 },
      { id: 'flower', e: '🌷', es: 'flor', en: 'flower', ej: 'Smell the flower!', ejEs: '¡Huele la flor!', nivel: 2 },
      { id: 'star', e: '⭐', es: 'estrella', en: 'star', ej: 'A little star!', ejEs: '¡Una estrellita!', nivel: 2 },
      { id: 'rain', e: '🌧️', es: 'lluvia', en: 'rain', ej: 'Rain, rain!', ejEs: '¡Lluvia, lluvia!', nivel: 2 },
      { id: 'cloud', e: '☁️', es: 'nube', en: 'cloud', ej: 'A white cloud!', ejEs: '¡Una nube blanca!', nivel: 2 },
      { id: 'rainbow', e: '🌈', es: 'arcoíris', en: 'rainbow', ej: 'Look, a rainbow!', ejEs: '¡Mira, un arcoíris!', nivel: 2 }
    ]},
    { id: 'objects', es: 'Cosas de casa', en: 'Things at home', ico: '🏠', color: 'cielo', palabras: [
      { id: 'bed', e: '🛏️', es: 'cama', en: 'bed', ej: 'Time for bed!', ejEs: '¡Hora de la cama!', nivel: 1 },
      { id: 'book', e: '📖', es: 'libro', en: 'book', ej: 'Read a book!', ejEs: '¡Lee un libro!', nivel: 1 },
      { id: 'shoe', e: '👟', es: 'zapato', en: 'shoe', ej: 'My little shoe!', ejEs: '¡Mi zapatito!', nivel: 1 },
      { id: 'chair', e: '🪑', es: 'silla', en: 'chair', ej: 'Sit on the chair.', ejEs: 'Siéntate en la silla.', nivel: 2 },
      { id: 'spoon', e: '🥄', es: 'cuchara', en: 'spoon', ej: 'A big spoon!', ejEs: '¡Una cuchara grande!', nivel: 2 },
      { id: 'hat', e: '🧢', es: 'gorra', en: 'hat', ej: 'Put on your hat!', ejEs: '¡Ponte la gorra!', nivel: 2 },
      { id: 'door', e: '🚪', es: 'puerta', en: 'door', ej: 'Open the door!', ejEs: '¡Abre la puerta!', nivel: 2 },
      { id: 'toothbrush', e: '🪥', es: 'cepillo de dientes', en: 'toothbrush', ej: 'My toothbrush!', ejEs: '¡Mi cepillo de dientes!', nivel: 2 }
    ]}
  ],

  historias: [
    { id: 'h_redball', titulo: 'La pelota roja de Perrito', tituloEn: 'Dog and the red ball', ico: '🐶', paginas: [
      { e: '🐶', en: 'This is Dog.', es: 'Este es Perrito.' },
      { e: '🐶❓🔴', en: 'Where is the red ball?', es: '¿Dónde está la pelota roja?' },
      { e: '🛏️', en: 'Under the bed? No!', es: '¿Debajo de la cama? ¡No!' },
      { e: '🪑', en: 'Under the chair? No!', es: '¿Debajo de la silla? ¡No!' },
      { e: '🐶🔴🎉', en: 'Here it is! Woof woof!', es: '¡Aquí está! ¡Guau guau!' }
    ]},
    { id: 'h_goodnight', titulo: 'Buenas noches', tituloEn: 'Good night', ico: '🌙', paginas: [
      { e: '🌙⭐', en: 'The moon is up.', es: 'Salió la luna.' },
      { e: '🪥🦷', en: 'Brush your teeth.', es: 'Cepilla tus dientes.' },
      { e: '👩👶', en: 'Mom hugs the baby.', es: 'Mamá abraza al bebé.' },
      { e: '🧸🛏️', en: 'Teddy goes to bed.', es: 'El osito se va a la cama.' },
      { e: '😴🌙', en: 'Good night, moon!', es: '¡Buenas noches, luna!' }
    ]},
    { id: 'h_fruitcolors', titulo: 'Frutas de colores', tituloEn: 'Fruit colors', ico: '🍎', paginas: [
      { e: '🍎', en: 'A red apple.', es: 'Una manzana roja.' },
      { e: '🍌', en: 'A yellow banana.', es: 'Un banano amarillo.' },
      { e: '🍐', en: 'A green pear.', es: 'Una pera verde.' },
      { e: '🍇', en: 'Purple grapes.', es: 'Uvas moradas.' },
      { e: '🍎🍌🍇', en: 'Yummy, yummy fruit!', es: '¡Qué rica fruta!' }
    ]},
    { id: 'h_ducks', titulo: 'Cuenta los patitos', tituloEn: 'Counting ducks', ico: '🦆', paginas: [
      { e: '🦆', en: 'One duck.', es: 'Un pato.' },
      { e: '🦆🦆', en: 'Two ducks.', es: 'Dos patos.' },
      { e: '🦆🦆🦆', en: 'Three ducks!', es: '¡Tres patos!' },
      { e: '💧🦆', en: 'Splash! The ducks swim.', es: '¡Splash! Los patos nadan.' },
      { e: '🦆🦆🦆', en: 'Quack, quack, quack!', es: '¡Cuac, cuac, cuac!' }
    ]}
  ],

  cancionesEco: [
    { id: 'c_hello', titulo: 'Hola, hola', ico: '👋', lineas: [
      { en: 'Hello, hello!', es: '¡Hola, hola!' },
      { en: 'Hello, Mom!', es: '¡Hola, mamá!' },
      { en: 'Hello, Dad!', es: '¡Hola, papá!' },
      { en: 'Hello, friends!', es: '¡Hola, amigos!' }
    ]},
    { id: 'c_body', titulo: 'Mi cuerpo se mueve', ico: '👐', lineas: [
      { en: 'Clap your hands!', es: '¡Aplaude!' },
      { en: 'Stamp your feet!', es: '¡Zapatea!' },
      { en: 'Touch your nose!', es: '¡Toca tu nariz!' },
      { en: 'Yay, yay, yay!', es: '¡Bien, bien, bien!' }
    ]},
    { id: 'c_count', titulo: 'Uno, dos, tres', ico: '3️⃣', lineas: [
      { en: 'One, two, three!', es: '¡Uno, dos, tres!' },
      { en: 'Look at me!', es: '¡Mírame!' },
      { en: 'Four, five!', es: '¡Cuatro, cinco!' },
      { en: 'Jump and dive!', es: '¡Salta y zambúllete!' }
    ]}
  ]
};
