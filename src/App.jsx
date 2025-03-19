import { useEffect, useState } from "react";
import Title from "./components/Title/Title"
import PostsList from "./components/PostsList/PostsList"
import { useForm } from "react-hook-form";
import axios from "axios";

const URL = "https://67cb831e3395520e6af58918.mockapi.io/"

function App() {

  const [posts,setPosts] = useState([]);
  const[editProduct, setEditProduct] = useState(null);
  const{register, handleSubmit, setValue, reset, formState:{errors, isValid}} = useForm();

  //El hook useEffect se ejecuta cuando el componente se monta y se me permite ejecutar el código que defino dentro de el de manera controlada y en el momento que yo quiera en base a las dependencias que le paso como segundo argumento
  useEffect(() => {
    getPosts()
  }, []);

  useEffect(() => {
      //Actualizar el formulario ya sea llenando los cambios o borrandolos
      // Tareas que quiero realizar
      if(editProduct){
      setValue(`title`, editProduct ?. title)
      setValue(`user`, editProduct ?. user)
      setValue(`description`, editProduct ?. description)
      } else {
        reset()
      }
      
    }, [editProduct]);

  async function updateProduct(posteo){
    setEditProduct(posteo)
  }

  async function getPosts(){
    try{
      const {data} = await axios.get(`${URL}/posts`)
      // Vamos a colocar en el bloque try el código que queremos que se ejecute
      console.log(data)
      setPosts(data)
    } catch (error){
      console.log(error);
      //manejar el error
      // Informar al usuario que hubo un error y no se pudieron cargar los posts
    }
  }

  function markAsRead(id){
    //Buscariamos en posts el post con el id que nos pasan
    const post = posts.find(post => post.id === id);
    //Cambiariamos el valor de alreadyRead a true  
    post.alreadyRead = true;
    //Actualizariamos el estado de posts
    setPosts([...posts]);

  }

  //Función para agregar posts
  async function addPost(data){
    try {
      if(editProduct){
        //logica para editar el post
        const id = editProduct.id;

        const postToUpdate = {
          title: data.title,
          user: data.user,
          description: data.description,
        }

          const response = await axios.put(`${URL}/posts/${id}`, postToUpdate)

          console.log(response.data)

          // Actualizamos el estado de posts
          // getPosts()

          //#Forma 2
          const postCopy = [...posts];
          const index = postCopy.findIndex(post => post.id === id)
          postCopy[index] = response.data;
          setPosts(postCopy);
          setEditProduct(null) // Seteamos nulo el estado de post que estabamos editando
          
      } else{
        // #Creamos el nuevo post en base a la data del formulario
        const newPost ={
          title: data.title,
          user: data.user,
          description: data.description,
          alreadyRead: editProduct?.alreadyRead,
          active: true,
          createdAt: new Date().toISOString
          }
  
          await axios.post(`${URL}/posts`, newPost)
  
          // getPosts()
          setPosts([...posts, newPost])
          reset()
      }

      // Hacer foco en el input title
      document.getElementById(`title`).focus();

    } catch (error) {
          console.log(error);
          alert(`No se pudo crear el post`)
    }

    // // #Hacemos una copia del array del post
    // const postCopy = [...posts];

    // //#Agregamos a la copia el nuevo post
    // postCopy.push(post);

    // //#Actualizamos el estado del post
    // setPosts(postCopy)
  }

  async function deletePost(id){
    console.log(`Borrar post con id`, id);
    try {
      const confirmDelete = confirm(`¿Estás seguro de borrar este post?`)
      if(confirmDelete){
        await axios.delete(`${URL}/posts/${id}`)
        getPosts()
      }
      
    } catch (error) {
      console.log(error);
      alert(`No se pudo borrar el post`)
      
    }

    // //Buscamos la psoición de este elemento en el array post
    // const indice = posts.findIndex(post => post.id === id);
    // //Generar una copia del array de posts (Estado)
    // const postCopy = [...posts];
    // postCopy.splice(indice,1) // Eliminamos el elemento en la posición indice
    // setPosts(postCopy) // Actualizamos el estado de posts
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
          {editProduct ? `Actualizar Post` : `Crear Post`}
        </button>

      </form>

      <Title titulo="Post creados"/>

      <PostsList  posteos={posts} 
                  markAsRead={markAsRead} 
                  deletePost={deletePost}
                  updateProduct={updateProduct}/>
    </>
  )
}

export default App