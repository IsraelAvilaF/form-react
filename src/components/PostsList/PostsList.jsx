import './PostList.css'
import Post from "../Post/Post"

export default function PostsList({posteos, markAsRead, deletePost}) {
    return (
            // #Devuelve un componente con la informacion de cada post
        <div className="post-list">
            {posteos.map((post)=>
                (<Post  key={post.id} 
                        post={post} 
                        markAsRead={markAsRead} 
                        deletePost={deletePost}/>
                )
                )
            }
        </div>
    );
}