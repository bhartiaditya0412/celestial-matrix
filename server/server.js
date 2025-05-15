import fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";   
import sensible from "@fastify/sensible";
import { PrismaClient } from '@prisma/client';
import fastifyCookie from "@fastify/cookie";
import bcrypt from "bcrypt";

dotenv.config();
const app = fastify();
const prisma = new PrismaClient();

app.register(fastifyCookie, { secret: process.env.COOKIE_SECRET });
app.register(cors, {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
});

app.register(sensible);

app.addHook("onRequest", async (req, res) => {
  const { userId } = req.cookies;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: String(userId) } });
    if (user) req.user = user;
  }
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.code(400).send({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.setCookie("userId", user.id, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: false,
    });

    return res.send({ message: "User created", user: { id: user.id, name: user.name } });
  } catch (err) {
    return res.code(500).send({ error: "Signup failed", detail: err.message });
  }
});
// console.log("HERE")
// const hashedPassword = await bcrypt.hash("mypassword1", 10);
// console.log(hashedPassword)
app.post("/login", async (req, res) => {
  console.log("INSIDE THE LOGIN")
  const { email, password } = req.body;
  if (!email || !password) {
    return res.code(400).send({ error: "Email and password required" });
  }
  console.log("AAAAAAAAAA")

  try {
    const user = await prisma.user.findUnique({ where: { "email":email } });
    if (!user) return res.code(401).send({ error: "Invalid email or password" });
    console.log("user-->>",user)
    console.log(password,user.password)
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch-->",isMatch)
    if (!isMatch) return res.code(401).send({ error: "Invalid email or password" });
    console.log(user)
    res.setCookie("userId", String(user.id), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: false,
    });
    console.log("cookie -->",res.cookie)

    return res.send({ message: "Login successful", user: { id: user.id, name: user.name } });
  } catch (err) {
    return res.code(500).send({ error: "Login failed", detail: err.message });
  }
});
app.get("/posts",async (req,res)=>{

    const posted = await prisma.post.findMany({select:{
        id:true,
        title:true,
        // body:true
    }})
    
    console.log(posted)
    return res.code(200).send(posted)

    
})

const COMMENT_SELECT_FEILDS = {
    id:true,
    message:true,
    parentId:true,
    createdAt:true,
    user:{
        select:{
            id:true,
            name:true

        }
    }
}

app.get("/posts/:id",async (req,res)=>{
    return await prisma.post.findUnique(
        {
            where:{id:req.params.id}
        ,select:{
            body:true,
            title:true,
            Comment:{
                orderBy:{
                    createdAt:"desc"

                },
                select:{
                    id:true,
                    message:true,
                    parentId:true,
                    createdAt:true,
                    user:{
                        select:{
                            id:true,
                            name:true 
                        }
                    }
                }

            }

        }
    })
    
})

app.post("/posts/:id/comments",async (req, res)=>{
    if(req.body.message===""||req.body.message==null){
        return res.send(app.httpErrors.badRequest("Message is required"))
    }
    return await commitToDb(
        prisma.comment.create({
            data:{
                message:req.body.message,
                userId:req.cookies.userId,
                parentId:req.body.parentId,
                postId:req.params.id
                
            },
            select:COMMENT_SELECT_FEILDS
        }),
        res  
    )
})

app.delete("/posts/:id/comments/:commentId", async (request, reply) => {
  try {
    const { commentId } = request.params;

    // Fetch the comment from the database to verify user ownership
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) {
      return reply.status(404).send({ error: "Comment not found." });
    }

    // Check if the user making the request is the one who created the comment
    if (comment.userId !== request.cookies.userId) {
      return reply.status(403).send({ error: "You do not have permission to delete this comment." });
    }

    // Delete the comment from the database
    const deleted = await prisma.comment.delete({
      where: { id: commentId },
      select: { id: true },
    });

    // Send a success response with the deleted comment ID
    return reply.send(deleted);

  } catch (err) {
    console.error("Error in DELETE /comments:", err);
    return reply.status(500).send({ error: "Internal Server Error", detail: err.message });
  }
});





app.put("/posts/:id/comments/:commentId", async (request, reply) => {
  try {
    const { message } = request.body;
    const { commentId } = request.params;

    if (!message) {
      return reply.status(400).send({ error: "Message is required." });
    }

    const oldComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!oldComment) {      
      return reply.status(404).send({ error: "Comment not found." });
    }

    if (oldComment.userId !== request.cookies.userId) {
      return reply.status(403).send({ error: "You do not have permission to edit this comment." });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { message },
      select: { message: true },
    });

    return reply.send(updatedComment);
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Internal server error." });
  }
});



async function commitToDb(promise,res){
const [error,data]=await app.to(promise)
if(error)return  app.httpErrors.internalServerError(error.message) // this internalserverError is something 500 error which is ////showing that there is something wrong with the server 
return res.send(data)
}


app.listen({port:process.env.PORT},()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})