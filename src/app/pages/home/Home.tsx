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
// useEffect(() => usamos ent??o o fetch 
// o Fetch tamb??m permite receber o parametro que ?? um objeto {}
//  - que podemos informar diversas propriedades 
//  - vamos efetuar uma chamada do tipo get (learn more API restful e chamada rest 9:00)
// O tipo ou metodo de chamada ?? do tipo get {method: 'get'
// Essa fun????o do fetch retorna uma promessa  - o JS promete devolver algo depois
// como saber se a PROMESSA foi cumprida? Depois do m??todo do fech colocar ponto (11:10)

// Qdo o fetch terminar a consulta pode se vazer 1,2,3 e ou, como qts vezes quiser
// 1 - then - sucesso, promessa cumprida (tratando se dos dados e da resposta)
// 2 - catch - promessa foi cumprida mas deu erro
// 3 - finally - ele sempre executa. Vc determina q vai ser executado 
//               tanto em caso de erro como de sucesso
// o then da promessa tamb??m ?? uma fun????o e vc executa a fun????o eg:
//      .then() - onde vai receber em caso de sucesso - exp (13:29) tipo <Response>
//          e ele tem uma tipagem (onfulfilled)? ((value: Response)) => Response
//          uma arrow function/ eg: .then (value => value.json())


//      .catch() - pode ser adicionado  se deu erro


//      .finally() - pode ser adionado pra sempre executar
//      ESSE ENCADEAMENTO PODE SER REPETIR INFINITAMENTE - aqui vamos usar o then 2X
//      O Value ou response. pode usar um atributo eg: status... response.status
//      Pega o response.json pra retornar ... mas o json tbem retorna uma promessa!!!

//      O json pode receber uma resposta r??pida ou n??o com muitos dados.
//       .then (response => response.json())
//      Ent??o a dica ?? adcionar outro then para o json. (16:22) 
//      (color mais um return) Assim: value =>
//      o pr??ximo then ?? a respeito do json.  
//      dentro do then() pode colocar uma response que deve retornar any
//      then (value => console.log(value)) vai uma imagem da API.
//      Agente j?? tem o resultado - mas ?? preciso ver que carregamos na verdade
//        - uma lista de imagens da API - COMO fazer isso? (18:07)
// Precisamos reliazar varias consultas ao backend pra pegar uma lista de imagens
// Precisamos armazenar essas imagens dentro de um useState (19)
// O useState come??a com um array vazio: const [images, setImages] = useState([]);
// o primeiro array que ?? o images, vamos fazer um map depois, ele retorna never


// Vamos ent??o criar uma interface chamada ICardsList (o contrato) lista de imagens
//    - pra tratar isso, como o objeto vai se comportar (19:30)
//        url: string;
//        decision: undefined | 'like' | 'dislike';
// Copiando o nome da Interface, vamos passar um par??meto de tipagem p/ useState
// dizendo que temos uma lista de imagens:  useState<ICardsList[]>
// agora o images (1 parameto do useState ) ?? uma lista do ICardsList images (22:08)
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


// Pr??ximo - se quisessemos mostrar mais de umaq imagem?
// l?? no API d?? pra fazer isso
// https://dog.ceo/api/breeds/image/random/3
// mas precisamos de ele ir passando mais imagens pra n??s
// ?? s?? passar o images para o array de dependencies do .catch
// isso vai dar um loop infinito (29:45)
// o array sendo alterado ela faz essa consulta
// Vamos alterar o useState para parar o loop infinito (30)
// O state precisa substituir o state anterior
// Para isso Precisamos pegar o OldImages no "SetImages"
//  - essa fun????o do then (do 2nd fetch) ele aceita 2 valores que pode pegar 
//   ela pode pegar o valor anterior (state anterior) e retornar o novo valor (30:30)
//   e o valor direto que era uma array com uma ??nica posi????o
//   o state anterior ...oldImages 
// (o componente sempre mostra ??ltima imagen na lista, as primeiras q entram aparecem depois)
// vai receber o state anterior mais a nova imagem (na verdade vamos inverter.)
// A posi????o (url) dessa imagem sempre no come??o. Fica assim ent??o (31:50)

// .then ((value) => { 
//   setImages(oldImages => [
//     { url: value.message, decision: undefined },
//     ...oldImages, 
//   ])

// Renderizando os links
// A lista de URL est?? carregando de cima pra baixo (32.39), 
// Vamos criar as regras para a exibi????o dos cards dentro do useEffect
// Se eu tenho 7 imagens eu n??o preciso carregar mais do que 7
//  - ent??o eu dou um return para as linhas debaixo n??o serem mais executadas
//    useEffect(() => {
//      if (images.length >= 7) return;
// agora se eu remover uma imagen, ent??o eu posso executar a consulta de baixo novamente.
// removendo a images do useState pela extens??o so Chrome d?? p/ver bem o que acontence
//    se a ??ltima imagem for retirada (35:45)


// Trabalhando com useMemo - (36:13)
// a imagem precisa ser carregada para o usu??rio
// o navegador precisa carregar a imagem da tag image, demora um pouquinho
// A t??tica seria carregaqr varios cards na tela e j?? deixar carregado
// o useMemo() permite agente transformar os dados da aplica????o conforme os states v??o mudando
// criando o const -  (37:08)     const imagesToRender = useMemo(() => {},[]);
// ele vai ter dentro s?? um return com image.slice(2)

// const imagesToRender = useMemo(() => {
//   return images.slice(2);
// },[]);

// Isso significa que das 7 imagens eu vou pegar apartir da imagen n??mero 2
// como se tivesse removendo 2 imagens do array
// lembra que precisamos passar images para o array de depend??ncia p/ funcionar
// agora ao inves de images.map agente faz imagesToRender.map
// Dessa maneira as 2 primeiras images do img.map (useState) s??o diferentes
//    das images do imagesToRender.map (do useMemo) 
//    o resto (5 imagens) s??o iguais!!!
//    vai pegar as images de 2 ao 6 e vai jogar para o useMemo
// n??o vai precisar fazer o navegador renderizar 7 images ao mesmo tempo (39:20)


// ??ltima coisa pra fazer ?? carregar a imagem que vai ser mostrada no background (39:39)
// Essa imagens ?? a ??ltima no array do useMemo
// vamos duplicar o useMemo com const backgroundImage
// Essa fun????o vai depender do imagesToRender
// o tratamento dentro da fun????o ?? se ... if () alguma coisa return undefined;
// se imagesToRender.lengh < 2 return undefined; - (40:55)

// const backgroundImage = useMemo(() => {
//   if (imagesToRender.length < 2)
//   return undefined;
// },[imagesToRender]);

// isso ?? pra evitar a aplica????o quebrar caso images t?? vazio ou poucas images,
//    n??o vai ter o que renderizar
// vamos colocar o background image no c??digo (inves de image.url) 
//    dentro do return pra enterder qdo aparece (41:22)

// return (
//   <div>
//     <p>{backgroundImage}</p>
//     <hr />
//     {imagesToRender.map(image => (
//        <p>{image.url}</p> ))}
//   </div >
// );

// Continuando com a l??gica do background image (41:40)
// if if else (pra saber qual imagem precisa renderizar), Vamos usar o
// imagesToRender.some()
// se o "decision" dela for diferente de undefined ent??o agente pode decidir o que fazer.
// Codigo da l??gica abaixo : (42:50) se for diferente de undefined ent??o o
//  length de imagesToRender ?? -2 ou -1  - C??digo fica assim:

// const backgroundImage = useMemo(() => {
//   if (imagesToRender.length < 2)
//   return undefined;
//   if (imagesToRender.some(image => image.decision !== undefined)) {
//     return imagesToRender[imagesToRender.length - 2].url;
//   } else {
//     return imagesToRender[imagesToRender.length - 1].url;
//   }
// },[imagesToRender]);


// Explica????o da l??gica (43:30) 
// para agente mover a imagem p/ esquerda ou direita precisamos modificar o state
//   a imagem na verdade n??o ?? apagada, ela ?? so movida p/ o lado e fica invis??vel
//   ou seja, pra saber se pegamos a ??ltima ou pen??ltima posi????o do array
//   se o state for undefined, background pega a ??ltima do array, sen??o,  
//      se for diferente (like/dislike) pega o penultimo link do array

// C??digo do final da p??gina

// return (

//   <div>
//     <p>{backgroundImage}</p>
//     <hr />
//     {imagesToRender.map(image => (
//        <p>{image.url}</p> ))}
//   </div >