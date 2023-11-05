import { Router } from "express";
import express from 'express';


const router: Router = express();

interface Comment {
    text: string;
    author: string;
    date: Date;
    postId: number;
    id: number;
  }
  

  let comments: Comment[] = [];


  router.get('/posts/:id/comments', (req, res) => {
    const postId = Number(req.params.id);
    const postComments = comments.filter((comment) => comment.postId === postId);
    return res.send(postComments);
  });
  

  router.post('/posts/:id/comments', (req, res) => {
    const postId = Number(req.params.id);
    const data = req.body;
  
    const newComment: Comment = {
      id: comments.length + 1,
      text: data.text,
      author: data.author,
      date: new Date(),
      postId,
    };
  
    comments.push(newComment);
    return res.status(201).send(newComment);
  });
  

  export default router;