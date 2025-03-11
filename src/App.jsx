import { useEffect, useState } from "react";
import Title from "./components/Title/Title"
import PostsList from "./components/PostsList/PostsList"
import { useForm } from "react-hook-form";
import axios from "axios";

const URL = "https://67cb831e3395520e6af58918.mockapi.io/"

function App() {

  const [posts,setPosts] = useState([]);

  //El hook useEffect se ejecuta cuando el componente se monta y se me permite ejecutar el código que defino dentro de el de manera controlada y en el momento que yo quiera en base a las dependencias que le paso como segundo argumento
  useEffect(() => {
    getPosts()
  }, []);

  function getPosts(){
    console.log(`Obteniendo posts...`)
    axios.get(`${URL}/posts`)
    .then(response =>{
      const postsMockapi = response.data;
      setPosts(postsMockapi);
    })
    .catch(error=>{
      console.error(error);
    })
  }

  function markAsRead(id){
    //Buscariamos en posts el post con el id que nos pasan
    const post = posts.find(post => post.id === id);
    //Cambiariamos el valor de alreadyRead a true  
    post.alreadyRead = true;
    //Actualizariamos el estado de posts
    setPosts([...posts]);

  }

  const{register, handleSubmit, formState:{errors, isValid}} = useForm();

  //Función para agregar posts
  function addPost(data){
    console.log(data)

    // #Creamos el nuevo post en base a la data del formulario
    const post ={
      title: data.title,
      user: data.user,
      description: data.description,
      id: posts.length + 1
    }

    // #Hacemos una copia del array del post
    const postCopy = [...posts];

    //#Agregamos a la copia el nuevo post
    postCopy.push(post);

    //#Actualizamos el estado del post
    setPosts(postCopy)
  }

  return(
    <>
      <Title 
        titulo="Blog App" 
        subtitle="Un blog para estar comunicados todos"
      />
      <Title titulo="Crea tu primer post"/>
      <form className="post-form" onSubmit={handleSubmit(addPost)}>

        <div className="input-group">
          <label htmlFor="email">Titulo del post</label>
          <input 
            type="text"
            {...register("title",{
              required: "El titulo es requerido",
              minLength:{value:6, message:"El titulo debe tener al menos 6 caracteres"},
              maxLength:{value:30, message: "El titulo debe tener maximo 30 caracteres"}
            })}
            id="title" 
            placeholder="Escribe el titlo del post" 
            />
            {errors.title && <span className="error">{errors.title.message}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input 
            type="email"
            {...register("user")}
            id="email"
            required 
            minLength={6} 
            maxLength={30}/>
        </div>

        <div className="input-group">
          <label htmlFor="description">Post</label>
          <textarea 
              {...register("description")} 
              rows={8} required id="description">
          </textarea>
        </div>

        <button className="button" type="submit" disabled={!isValid}>
          Crear
        </button>

      </form>

      <Title titulo="Post creados"/>

      <PostsList posteos={posts} markAsRead={markAsRead}/>
    </>
  )
}

export default App