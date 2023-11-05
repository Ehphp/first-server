import express, { Router } from 'express';
import commentRouter from './comment';
const app = express();
app.use(express.json());
app.use('/com', commentRouter); // Utilizza il router dei commenti

const InputValidationMiddelware: express.RequestHandler = 
(req, res, next) => 
{   
    const postData: Pick<BlogData, 'body' | 'title'> = req.body;
    if(!postData.title) {
       return res.status(400).send('Missing title');
    }
    if(!postData.body) {
       return res.status(400).send('Missing bosy');
    }
    next()
}


interface BlogPost {
    title: string;
    author: string;
    date: Date;
    body: string;
    id: number;
    draft: boolean;
}
type BlogData = Pick<BlogPost, 'title' |  'body'>;

let posts: BlogPost[] =
    [{
        title: 'First Post',
        author: '<Emilio>',
        date: new Date(),
        body: 'This is the first post',
        id: 1,
        draft: false

    },
    {
        title: 'Second Post',
        author: '<Emilio>',
        date: new Date(),
        body: 'This is the second post',
        id: 2,
        draft: false
    }];

app.get('/posts', (req, res) => {
    return res.send(posts);
});
app.get('/posts/:id', (req, res) => {

    const id = Number(req.params.id);
    const post = posts.find((p) => p.id === id);

    if (!post) {
        res.status(404).send('<h1>404</h1><h1>Hello World!</h1>');
    }
    return res.send(post);
});

app.post('/posts',InputValidationMiddelware, (req, res) => {

    const data = req.body;

    const lastPost = posts[posts.length - 1];

    const newPost = {
        id: lastPost.id + 1,
        date: new Date(),
        title: data.title,
        author: data.author,
        body: data.body,
        draft: false,
    };
    posts.push(newPost);
    return res.status(201).send(newPost);
})



app.delete('/posts/:id/', (req, res) => {
    const id = Number(req.params.id);
    const postToDelete = posts.find((p) => p.id === id);
    if (!postToDelete) {
        res.status(404).send('<h1>404</h1><h1>Nessun post con tale id</h1>');
    }
    posts = posts.filter((p) => p.id !== id);
    return res.send(postToDelete);

});

app.put('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const updatedTitle = req.body.title;
    const updatedBody = req.body.body;

    const postToUpdate = posts.find((p) => p.id === id);

    if (!postToUpdate) {
        return res.status(404).send("Post non trovato");
    }

    postToUpdate.title = updatedTitle;
    postToUpdate.body = updatedBody;

    return res.status(200).send(postToUpdate);
});


app.post('/posts/:id/public', (req, res) => {

    const id = Number(req.params.id);
    const postPublicIndex = posts.findIndex((p) => p.id === id);

    if (!posts[postPublicIndex]) {
        res.status(404).send('<h1>404</h1><h1>Hello World!</h1>');
    }
    posts[postPublicIndex].draft = true;
    return res.send(posts[postPublicIndex]);
});





app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});

