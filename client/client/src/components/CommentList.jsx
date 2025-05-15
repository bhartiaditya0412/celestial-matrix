import Comment from "./Comment"


export function CommentList({comments}){
    return (
        comments.map((element)=>{
            return ( <div key={element.id} className="comment-stack" >
                <Comment {...element}/>

            </div>)
        })
    )

}