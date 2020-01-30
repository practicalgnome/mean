import { Component, OnDestroy, OnInit } from '@angular/core';
import {Post} from '../models';
import {PostsService} from '../posts.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { isArray } from 'util';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postUpdateSub: Subscription;
  isLoading = false;
  constructor(private postsService: PostsService, private router: Router) { }

  ngOnInit() {
    // this.postsService.getPostsWoSub()
    //   .pipe(
    //     map(data => {
    //       return data.posts;
    //     })
    // ).subscribe(data => {
    //   console.log(data);
    // }, err => { console.error('Error: ' + err); });
    this.isLoading = true;
    this.postsService.getPosts();
    this.postUpdateSub = this.postsService.getPostUpdateListener()
      .subscribe(posts => {
        this.posts = posts;
        this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.postUpdateSub.unsubscribe();
  }

  onPostDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  onPostEdit(id: string) {
    this.router.navigate(['/edit/', id]);
  }
}
