import { useCallback, useEffect, useMemo, useState } from "react"

import { LikeDislike } from "./components/like-dislike/LikeDislike";
import { PhotoCard } from "./components/photo-card/PhotoCard";
import './Home.css';


interface ICardsList {
  url: string;
  decision: undefined | 'like' | 'dislike'; 
}
  

export const Home = () => {
  const [images, setImages] = useState<ICardsList[]>([]);

  // Development starts here: (6:55)
  useEffect(() => {
    if (images.length >= 7) 
    return;

    fetch ('https://dog.ceo/api/breeds/image/random', { method: 'get'})
      .then (response => response.json())
      .then ((value) => { 
        setImages(oldImages => [
          { url: value.message, decision: undefined },
          ...oldImages, 
        ])
      })
      .catch( (error) => {
        alert(error.message)
       });
    },[images]);

    const imagesToRender = useMemo(() => {
      return images.slice(2);
    },[images]);

    const backgroundImage = useMemo(() => {
      if (imagesToRender.length < 2)
      return undefined;
      if (imagesToRender.some(image => image.decision !== undefined)) {
        return imagesToRender[imagesToRender.length - 2].url;
      } else {
        return imagesToRender[imagesToRender.length - 1].url;
      }
    },[imagesToRender]);

    const handleLikeDislike = useCallback((decision: 'like' | 'dislike') => {
      const filteredImages = images.filter(image => image.decision === undefined);

      filteredImages.forEach((image, index, array) => {
        if (array.length - 1 === index) {
          image.decision = decision;
        }
      });

      setImages ([...filteredImages]);
    }, [images])

  return (

    <div className='main'>
      {backgroundImage && (
        <img 
        className='main-background-image' 
        src={backgroundImage} 
        draggable={false} 
      />
      )}

      <div className="content">
        
        <div className="list-photo-cards">

          {imagesToRender.map((image, index) => (
            <PhotoCard
            key={image.url}
            imageUrl={image.url}
            shadowForFirstCard={index === 0}
            stackingTop={(index + 1)*2}
            move={image.decision ? image.decision === 'like' ? 'right': 'left': undefined}
          />
          ))}
          
          </div>

          {imagesToRender.length > 0 && (
            <LikeDislike 
            like={() => handleLikeDislike('like')}
            dislike={() => handleLikeDislike('dislike')}
          />
          )}
      </div>
      
      
    </div >
  );
}


// Comments as I go through creating the code (in portuguese language )
// Temos que que usear O useEffect para connectar com a API 
// useEffect(() => usamos então o fetch 
// o Fetch também permite receber o parametro que é um objeto {}
//  - que podemos informar diversas propriedades 
//  - vamos efetuar uma chamada do tipo get (learn more API restful e chamada rest 9:00)
// O tipo ou metodo de chamada é do tipo get {method: 'get'
// Essa função do fetch retorna uma promessa  - o JS promete devolver algo depois
// como saber se a PROMESSA foi cumprida? Depois do método do fech colocar ponto (11:10)

// Qdo o fetch terminar a consulta pode se vazer 1,2,3 e ou, como qts vezes quiser
// 1 - then - sucesso, promessa cumprida (tratando se dos dados e da resposta)
// 2 - catch - promessa foi cumprida mas deu erro
// 3 - finally - ele sempre executa. Vc determina q vai ser executado 
//               tanto em caso de erro como de sucesso
// o then da promessa também é uma função e vc executa a função eg:
//      .then() - onde vai receber em caso de sucesso - exp (13:29) tipo <Response>
//          e ele tem uma tipagem (onfulfilled)? ((value: Response)) => Response
//          uma arrow function/ eg: .then (value => value.json())


//      .catch() - pode ser adicionado  se deu erro


//      .finally() - pode ser adionado pra sempre executar
//      ESSE ENCADEAMENTO PODE SER REPETIR INFINITAMENTE - aqui vamos usar o then 2X
//      O Value ou response. pode usar um atributo eg: status... response.status
//      Pega o response.json pra retornar ... mas o json tbem retorna uma promessa!!!

//      O json pode receber uma resposta rápida ou não com muitos dados.
//       .then (response => response.json())
//      Então a dica é adcionar outro then para o json. (16:22) 
//      (color mais um return) Assim: value =>
//      o próximo then é a respeito do json.  
//      dentro do then() pode colocar uma response que deve retornar any
//      then (value => console.log(value)) vai uma imagem da API.
//      Agente já tem o resultado - mas é preciso ver que carregamos na verdade
//        - uma lista de imagens da API - COMO fazer isso? (18:07)
// Precisamos reliazar varias consultas ao backend pra pegar uma lista de imagens
// Precisamos armazenar essas imagens dentro de um useState (19)
// O useState começa com um array vazio: const [images, setImages] = useState([]);
// o primeiro array que é o images, vamos fazer um map depois, ele retorna never


// Vamos então criar uma interface chamada ICardsList (o contrato) lista de imagens
//    - pra tratar isso, como o objeto vai se comportar (19:30)
//        url: string;
//        decision: undefined | 'like' | 'dislike';
// Copiando o nome da Interface, vamos passar um parâmeto de tipagem p/ useState
// dizendo que temos uma lista de imagens:  useState<ICardsList[]>
// agora o images (1 parameto do useState ) é uma lista do ICardsList images (22:08)
// Vamos passar o array com objeto vazio 
//    - onde vemos que o console nos retorna uma image apenas (22:39)
//      .then (response => { 
//      return response.json()

// precisamos agora informar os atributos para o setImages([{ }]); (23)
// Vamos agora renderizar a lista de imagens pra mostrar algo na tela eg: 
// adcionando JS dentro do JSX {images.map()} (24:27) 
// e return p/ o browser: setImages([{url: value.message, decision: undefined}])
// pronto no broser: eg: https://images.dog.ceo/breeds/havanese/00100trPORTRAIT_00100_BURST20191030212452971_COVER.jpg
// Vamos tratar do catch se acontecer algum tipo de erro (26:18) com => function
// dentro dela vc pode receber um error


// Próximo - se quisessemos mostrar mais de umaq imagem?
// lá no API dá pra fazer isso
// https://dog.ceo/api/breeds/image/random/3
// mas precisamos de ele ir passando mais imagens pra nós
// é só passar o images para o array de dependencies do .catch
// isso vai dar um loop infinito (29:45)
// o array sendo alterado ela faz essa consulta
// Vamos alterar o useState para parar o loop infinito (30)
// O state precisa substituir o state anterior
// Para isso Precisamos pegar o OldImages no "SetImages"
//  - essa função do then (do 2nd fetch) ele aceita 2 valores que pode pegar 
//   ela pode pegar o valor anterior (state anterior) e retornar o novo valor (30:30)
//   e o valor direto que era uma array com uma única posição
//   o state anterior ...oldImages 
// (o componente sempre mostra última imagen na lista, as primeiras q entram aparecem depois)
// vai receber o state anterior mais a nova imagem (na verdade vamos inverter.)
// A posição (url) dessa imagem sempre no começo. Fica assim então (31:50)

// .then ((value) => { 
//   setImages(oldImages => [
//     { url: value.message, decision: undefined },
//     ...oldImages, 
//   ])

// Renderizando os links
// A lista de URL está carregando de cima pra baixo (32.39), 
// Vamos criar as regras para a exibição dos cards dentro do useEffect
// Se eu tenho 7 imagens eu não preciso carregar mais do que 7
//  - então eu dou um return para as linhas debaixo não serem mais executadas
//    useEffect(() => {
//      if (images.length >= 7) return;
// agora se eu remover uma imagen, então eu posso executar a consulta de baixo novamente.
// removendo a images do useState pela extensão so Chrome dá p/ver bem o que acontence
//    se a última imagem for retirada (35:45)


// Trabalhando com useMemo - (36:13)
// a imagem precisa ser carregada para o usuário
// o navegador precisa carregar a imagem da tag image, demora um pouquinho
// A tática seria carregaqr varios cards na tela e já deixar carregado
// o useMemo() permite agente transformar os dados da aplicação conforme os states vão mudando
// criando o const -  (37:08)     const imagesToRender = useMemo(() => {},[]);
// ele vai ter dentro só um return com image.slice(2)

// const imagesToRender = useMemo(() => {
//   return images.slice(2);
// },[]);

// Isso significa que das 7 imagens eu vou pegar apartir da imagen número 2
// como se tivesse removendo 2 imagens do array
// lembra que precisamos passar images para o array de dependência p/ funcionar
// agora ao inves de images.map agente faz imagesToRender.map
// Dessa maneira as 2 primeiras images do img.map (useState) são diferentes
//    das images do imagesToRender.map (do useMemo) 
//    o resto (5 imagens) são iguais!!!
//    vai pegar as images de 2 ao 6 e vai jogar para o useMemo
// não vai precisar fazer o navegador renderizar 7 images ao mesmo tempo (39:20)


// última coisa pra fazer é carregar a imagem que vai ser mostrada no background (39:39)
// Essa imagens é a última no array do useMemo
// vamos duplicar o useMemo com const backgroundImage
// Essa função vai depender do imagesToRender
// o tratamento dentro da função é se ... if () alguma coisa return undefined;
// se imagesToRender.lengh < 2 return undefined; - (40:55)

// const backgroundImage = useMemo(() => {
//   if (imagesToRender.length < 2)
//   return undefined;
// },[imagesToRender]);

// isso é pra evitar a aplicação quebrar caso images tá vazio ou poucas images,
//    não vai ter o que renderizar
// vamos colocar o background image no código (inves de image.url) 
//    dentro do return pra enterder qdo aparece (41:22)

// return (
//   <div>
//     <p>{backgroundImage}</p>
//     <hr />
//     {imagesToRender.map(image => (
//        <p>{image.url}</p> ))}
//   </div >
// );

// Continuando com a lógica do background image (41:40)
// if if else (pra saber qual imagem precisa renderizar), Vamos usar o
// imagesToRender.some()
// se o "decision" dela for diferente de undefined então agente pode decidir o que fazer.
// Codigo da lógica abaixo : (42:50) se for diferente de undefined então o
//  length de imagesToRender é -2 ou -1  - Código fica assim:

// const backgroundImage = useMemo(() => {
//   if (imagesToRender.length < 2)
//   return undefined;
//   if (imagesToRender.some(image => image.decision !== undefined)) {
//     return imagesToRender[imagesToRender.length - 2].url;
//   } else {
//     return imagesToRender[imagesToRender.length - 1].url;
//   }
// },[imagesToRender]);


// Explicação da lógica (43:30) 
// para agente mover a imagem p/ esquerda ou direita precisamos modificar o state
//   a imagem na verdade não é apagada, ela é so movida p/ o lado e fica invisível
//   ou seja, pra saber se pegamos a última ou penúltima posição do array
//   se o state for undefined, background pega a última do array, senão,  
//      se for diferente (like/dislike) pega o penultimo link do array

// Código do final da página

// return (

//   <div>
//     <p>{backgroundImage}</p>
//     <hr />
//     {imagesToRender.map(image => (
//        <p>{image.url}</p> ))}
//   </div >