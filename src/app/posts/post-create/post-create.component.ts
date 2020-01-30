import { Component, OnInit } from '@angular/core';
import { Post } from '../models';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mimeType } from './mime-type.validator';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  form: FormGroup;
  post: Post;
  isLoading = false;
  private mode = 'create';
  private postId: string;
  imagePreview: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: Validators.required,
        asyncValidators: mimeType})
    });

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(post => {
          this.isLoading = false;
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content};
        });
        this.form.setValue({
          title: this.post.title,
          content: this.post.content});
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    const postFromForm = {title: this.form.value.title, content: this.form.value.content};
    this.isLoading = true;

    if (this.mode === 'create') {
      this.postsService.addPost(postFromForm);
    } else if (this.mode === 'edit') {
      this.postsService.updatePost(this.postId, postFromForm);
    }
    this.form.reset();
    this.router.navigate(['/']);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
