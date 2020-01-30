import { Injectable } from '@angular/core';
import {Post} from './models';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) { }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost(postId: string) {
    return this.http
      .get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + postId);
    // return {...this.posts.find(post => post.id === postId)};
  }

  getPostsWoSub() {
    return this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts');
  }

  getPosts() {
    this.http
      .get<{message: string, posts: any}>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map(data => {
        return data.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }),
        catchError(err => {
          throw err;
        }))
      .subscribe((data) => {
        this.posts = data;
        this.postUpdated.next([...this.posts]);
      }, error => {
        console.log(error);
      });
  }

  deletePost(postId: string) {
    this.http.delete(('http://localhost:3000/api/posts/' + postId))
      .subscribe(() => {
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.postUpdated.next([...this.posts]);
      });
  }

  addPost(post: Post) {
    this.http.post<Post>('http://localhost:3000/api/posts', post)
      .subscribe((res) => {
        this.posts = [...this.posts, res];
        this.postUpdated.next([...this.posts]);
      });
  }

  updatePost(postId: string, post: Post) {
    const newPost = { id: postId, ...post };
    this.http.put('http://localhost:3000/api/posts/' + postId, newPost)
      .subscribe(res => {
        const newPosts = [...this.posts];
        newPosts[postId] = newPost;
        this.posts = newPosts;
        this.postUpdated.next([...this.posts]);
    });
  }
}
